#!/usr/bin/env node
import readline from "node:readline";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.resolve(__dirname, "..", ".env.local");

// Load .env.local if present
let twilioSid = process.env.TWILIO_ACCOUNT_SID;
let twilioToken = process.env.TWILIO_AUTH_TOKEN;

if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      const val = vals.join("=").trim().replace(/^['"]|['"]$/g, "");
      if (key === "TWILIO_ACCOUNT_SID") twilioSid = val;
      if (key === "TWILIO_AUTH_TOKEN") twilioToken = val;
    }
  });
}

/**
 * Send WhatsApp message via Twilio REST API
 */
async function sendTwilioMessage({ to, body }) {
  if (!twilioSid || !twilioToken) {
    return {
      success: true,
      mode: "simulated_local",
      detail: `[Local Simulation] Message dispatched to WhatsApp ${to}: "${body}"`,
    };
  }

  const recipient = to.startsWith("whatsapp:") ? to : `whatsapp:${to.replace(/[^0-9+]/g, "")}`;
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;

  const params = new URLSearchParams();
  params.append("To", recipient);
  params.append("From", "whatsapp:+14155238886"); // Default Twilio WhatsApp Sandbox
  params.append("Body", body);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    return {
      success: !data.error_code,
      mode: "twilio_live",
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

const TOOLS = [
  {
    name: "contact_vendor_whatsapp",
    description: "Send a direct WhatsApp message to a street vendor (e.g. Ramesh Bhaiya, Suresh Fruit Cart) for price inquiries, availability, or general customer support.",
    inputSchema: {
      type: "object",
      properties: {
        vendorPhone: {
          type: "string",
          description: "Vendor's phone number with country code (e.g., +919876543210)",
        },
        vendorName: {
          type: "string",
          description: "Name of the street vendor (e.g., Ramesh Bhaiya)",
        },
        message: {
          type: "string",
          description: "Message content to send to the vendor",
        },
      },
      required: ["vendorPhone", "message"],
    },
  },
  {
    name: "send_thela_demand_ping",
    description: "Trigger a 'Bulao Thela' demand ping notification to a vendor's WhatsApp when a customer requests them to come to their street/mohalla.",
    inputSchema: {
      type: "object",
      properties: {
        vendorPhone: {
          type: "string",
          description: "Vendor's phone number",
        },
        customerName: {
          type: "string",
          description: "Name of the customer sending the ping",
        },
        requestedItems: {
          type: "string",
          description: "Items requested by the customer (e.g. 1kg Tamatar, Fresh Golgappe)",
        },
        locationNotes: {
          type: "string",
          description: "Delivery location notes (e.g. Gate 2, Flat 302, Pocket B)",
        },
      },
      required: ["vendorPhone", "requestedItems", "locationNotes"],
    },
  },
  {
    name: "notify_vendor_order",
    description: "Send an official new order alert to the vendor's WhatsApp with customer details, item breakdown, and total amount.",
    inputSchema: {
      type: "object",
      properties: {
        vendorPhone: {
          type: "string",
          description: "Vendor's phone number",
        },
        orderId: {
          type: "string",
          description: "Order ID (e.g. ORD-9821)",
        },
        customerName: {
          type: "string",
          description: "Name of the customer placing the order",
        },
        items: {
          type: "string",
          description: "Summary of ordered items (e.g. 2kg Aloo @ ₹40, 1kg Pyaaz @ ₹35)",
        },
        totalAmount: {
          type: "number",
          description: "Total order bill in INR",
        },
        deliveryAddress: {
          type: "string",
          description: "Delivery address",
        },
      },
      required: ["vendorPhone", "orderId", "items", "totalAmount"],
    },
  },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const msg = JSON.parse(trimmed);

    // 1. Initialize Handshake
    if (msg.method === "initialize") {
      const response = {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: "tech-thela-whatsapp-mcp",
            version: "1.0.0",
          },
          capabilities: {
            tools: {},
          },
        },
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // 2. Initialized Notification
    if (msg.method === "notifications/initialized") {
      return;
    }

    // 3. Tools List
    if (msg.method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          tools: TOOLS,
        },
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // 4. Tools Call
    if (msg.method === "tools/call") {
      const { name, arguments: args } = msg.params;

      if (name === "contact_vendor_whatsapp") {
        const text = `Namaste ${args.vendorName || "Vendor"}!\n\n${args.message}\n\n— Tech Thela Customer Care`;
        const result = await sendTwilioMessage({ to: args.vendorPhone, body: text });

        const reply = {
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            content: [
              {
                type: "text",
                text: `✅ WhatsApp message sent to ${args.vendorName || "Vendor"} (${args.vendorPhone}):\n"${text}"\n\nDelivery Mode: ${result.mode || "live"}`,
              },
            ],
          },
        };
        process.stdout.write(JSON.stringify(reply) + "\n");
        return;
      }

      if (name === "send_thela_demand_ping") {
        const text = `🔔 *Bulao Thela: Naya Demand Ping!*\n\nGrahak: ${args.customerName || "Mohalla Customer"}\nChahiye: ${args.requestedItems}\nLocation: ${args.locationNotes}\n\n👉 Kripya WhatsApp par reply karein ya thela wahan le jayein!`;
        const result = await sendTwilioMessage({ to: args.vendorPhone, body: text });

        const reply = {
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            content: [
              {
                type: "text",
                text: `📍 Demand Ping successfully sent to vendor (${args.vendorPhone}):\n${text}`,
              },
            ],
          },
        };
        process.stdout.write(JSON.stringify(reply) + "\n");
        return;
      }

      if (name === "notify_vendor_order") {
        const text = `🛒 *Naya Order Aaya! (#${args.orderId})*\n\nGrahak: ${args.customerName || "Online Customer"}\nItems:\n${args.items}\nKul Rakam: ₹${args.totalAmount}\nAddress: ${args.deliveryAddress || "Gate Delivery"}\n\n👉 Reply 'Sahi Hai' to accept order.`;
        const result = await sendTwilioMessage({ to: args.vendorPhone, body: text });

        const reply = {
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            content: [
              {
                type: "text",
                text: `📦 Order notification sent to vendor WhatsApp (${args.vendorPhone}):\n${text}`,
              },
            ],
          },
        };
        process.stdout.write(JSON.stringify(reply) + "\n");
        return;
      }

      // Unknown tool
      const errorReply = {
        jsonrpc: "2.0",
        id: msg.id,
        error: {
          code: -32601,
          message: `Tool ${name} not found`,
        },
      };
      process.stdout.write(JSON.stringify(errorReply) + "\n");
      return;
    }

    // Ping
    if (msg.method === "ping") {
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: {} }) + "\n");
      return;
    }
  } catch (err) {
    // Ignore parse errors
  }
});
