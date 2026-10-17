import { NextResponse } from "next/server";
import { aiWrapper } from "../../../../lib/ai-wrapper";
import { DEMAND_ZONES } from "../../../../lib/mock-data";

// In-memory rate limiting map: phone -> lastMessageTimestamp
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 1500; // 1.5 seconds between messages

// Verification token for Meta Cloud API webhook
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "tech_thela_webhook_secret";

/**
 * Helper to escape XML characters for Twilio TwiML responses
 */
function escapeXml(unsafe = "") {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

/**
 * Dispatch real outbound WhatsApp message via Meta Graph API if credentials are provided
 */
async function sendMetaWhatsAppMessage({ to, text, buttons = [] }) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId || !to) {
    return null;
  }

  const cleanRecipient = String(to).replace(/[^0-9]/g, "");
  let payload;

  if (buttons && buttons.length > 0) {
    payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanRecipient,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text },
        action: {
          buttons: buttons.slice(0, 3).map((btnTitle, index) => ({
            type: "reply",
            reply: {
              id: `btn_${index}_${btnTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
              title: btnTitle.substring(0, 20),
            },
          })),
        },
      },
    };
  } else {
    payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanRecipient,
      type: "text",
      text: { body: text },
    };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error("[Meta WhatsApp Cloud API Outbound Error]", err);
    return null;
  }
}

/**
 * Dispatch outbound WhatsApp message via Twilio REST API if credentials are provided
 */
async function sendTwilioWhatsAppMessage({ to, text }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  if (!accountSid || !authToken || !to) {
    return null;
  }

  const recipient = to.startsWith("whatsapp:") ? to : `whatsapp:${to.replace(/[^0-9+]/g, "")}`;
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const params = new URLSearchParams();
  params.append("To", recipient);
  params.append("From", twilioNumber);
  params.append("Body", text);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    return await res.json();
  } catch (err) {
    console.error("[Twilio Proactive Outbound Error]", err);
    return null;
  }
}

/**
 * GET Handler: Meta WhatsApp Webhook Handshake Verification
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST Handler: Process Incoming WhatsApp Messages (Meta Cloud API + Twilio Sandbox + Web Simulator)
 */
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const isTwilio = contentType.includes("application/x-www-form-urlencoded");

    let rawBody = {};
    if (isTwilio) {
      const formData = await request.formData();
      for (const [key, val] of formData.entries()) {
        rawBody[key] = val;
      }
    } else {
      try {
        rawBody = await request.json();
      } catch (e) {
        rawBody = {};
      }
    }

    // Determine sender identity
    let sender = "9876543210";
    if (isTwilio) {
      sender = (rawBody.From || "").replace("whatsapp:", "").trim();
    } else {
      sender = rawBody.from || rawBody.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || "9876543210";
    }

    // In-memory sender rate limiting
    const now = Date.now();
    const lastTime = rateLimitMap.get(sender) || 0;
    if (now - lastTime < RATE_LIMIT_WINDOW_MS) {
      if (isTwilio) {
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>⏳ Kripya thoda intezar karein (Rate limit).</Message>\n</Response>`,
          { status: 429, headers: { "Content-Type": "text/xml" } }
        );
      }
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }
    rateLimitMap.set(sender, now);

    // Extract message specifics
    let msgType = "text";
    let textContent = "";
    let locationData = null;

    if (isTwilio) {
      textContent = (rawBody.Body || "").trim();
      if (rawBody.Latitude && rawBody.Longitude) {
        msgType = "location";
        locationData = {
          latitude: parseFloat(rawBody.Latitude),
          longitude: parseFloat(rawBody.Longitude),
        };
      } else if (rawBody.MediaContentType0?.includes("audio") || rawBody.MediaUrl0) {
        msgType = "voice";
      }
    } else {
      const msgObj = rawBody.entry?.[0]?.changes?.[0]?.value?.messages?.[0] || rawBody;
      msgType = msgObj.type || (msgObj.location ? "location" : msgObj.voice || msgObj.audio ? "voice" : "text");
      textContent = (msgObj.text?.body || msgObj.text || msgObj.interactive?.button_reply?.title || "").trim();
      if (msgObj.location) {
        locationData = {
          latitude: msgObj.location.latitude || 28.6315,
          longitude: msgObj.location.longitude || 77.2185,
        };
      }
    }

    // Helper to send formatted response
    const buildResponse = async ({ action, text, buttons = [], data = null }) => {
      // If Meta Cloud API keys exist, send outbound WhatsApp message
      if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && !isTwilio) {
        await sendMetaWhatsAppMessage({ to: sender, text, buttons });
      }

      // If incoming from Twilio Sandbox, return TwiML XML so the user's WhatsApp receives it instantly
      if (isTwilio) {
        let twimlBody = text;
        if (buttons.length > 0) {
          twimlBody += `\n\n👉 *Reply karein:*\n` + buttons.map((b, i) => `${i + 1}️⃣ ${b}`).join("\n");
        }
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>${escapeXml(twimlBody)}</Message>\n</Response>`,
          { status: 200, headers: { "Content-Type": "text/xml" } }
        );
      }

      // Default JSON response for simulator and test suites
      return NextResponse.json({
        success: true,
        action,
        data,
        botReply: {
          text,
          buttons,
        },
      });
    };

    // 1. Live Location Sharing (F3)
    if (msgType === "location" || locationData) {
      const lat = locationData?.latitude || 28.6315;
      const lng = locationData?.longitude || 77.2185;

      return buildResponse({
        action: "LOCATION_UPDATED",
        data: { latitude: lat, longitude: lng, isOnline: true },
        text: `✅ *Thela Live Location Received!*\n📍 Aapka thela nakshe par live ho gaya hai (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}).\nAas-paas ke sabhi grahak ab aapko live dekh sakte hain!`,
      });
    }

    // 2. Interactive Button & Number Replies (2-Tap Confirmation)
    const lowerText = textContent.toLowerCase();
    if (lowerText === "sahi hai" || lowerText === "yes, save" || lowerText === "1" || lowerText === "ha") {
      return buildResponse({
        action: "INVENTORY_SAVED",
        text: "🎉 *Shabash!* Aapki inventory live update ho gayi hai.\nAas-paas ke sabhi grahako ko naya stock dikhai de raha hai.",
      });
    }

    if (lowerText === "dobara bolo" || lowerText === "cancel" || lowerText === "2" || lowerText === "nahi") {
      return buildResponse({
        action: "CANCELLED",
        text: "🔄 Koi baat nahi, aap naya voice note bhej kar ya type karke dobara bata sakte hain.",
      });
    }

    // 3. Demand Hotspots Query (F7)
    if (
      lowerText.includes("kahan") ||
      lowerText.includes("where") ||
      lowerText.includes("demand") ||
      lowerText === "3"
    ) {
      const topZones = DEMAND_ZONES.slice(0, 3)
        .map((z, idx) => `${idx + 1}. *${z.locationName || z.name}* (${z.score}% Demand)\n   ⏰ Peak: ${z.peakHours}\n   💡 ${z.reasonHinglish || z.reason}`)
        .join("\n\n");

      return buildResponse({
        action: "DEMAND_SUGGESTION",
        text: `📍 *Aaj Ke Top 3 High Demand Zones:*\n\n${topZones}\n\n💡 *Tip: Wahan pahuchein aur 'Thela ON' share karein!*`,
      });
    }

    // 4. Voice Note / Audio Processing (F2)
    if (msgType === "voice") {
      const simulatedTranscript = rawBody.transcript || "aaj aloo 20 rupaye kilo, pyaaz 35 rupaye kilo";
      const parsed = await aiWrapper.parseVoiceIntent(simulatedTranscript);

      if (parsed.intent === "PRODUCT_LISTING") {
        const itemsSummary = parsed.items.map((i) => `• ${i.name}: ₹${i.price}/${i.unit}`).join("\n");
        return buildResponse({
          action: "VOICE_CONFIRMATION_REQUIRED",
          data: { items: parsed.items },
          text: `🎙️ *Voice Note Mila!*\n"${simulatedTranscript}"\n\n📋 *Humne Yeh Note Kiya:*\n${itemsSummary}\n\n👉 *Kya Yeh Sahi Hai?*`,
          buttons: ["Sahi Hai", "Dobara Bolo"],
        });
      }
    }

    // 5. Onboarding / Greeting (F1)
    if (lowerText === "hi" || lowerText === "hello" || lowerText === "namaste") {
      return buildResponse({
        action: "ONBOARDING_GREETING",
        text: "🙏 *Namaste Ramesh Bhaiya! Welcome to Tech Thela.*\n\nAap WhatsApp par bina type kiye:\n1️⃣ Voice note bhej kar *Dukaan Ka Stock* update kar sakte hain (e.g. 'Aloo 20 kilo, tamatar 30').\n2️⃣ *Live Location share* karke Thela Live kar sakte hain.\n3️⃣ *'Kahan jaun?'* likhkar high demand mohalla dekh sakte hain.",
        buttons: ["Sahi Hai", "Kahan Jaun?"],
      });
    }

    // 6. Generic Text intent fallback
    const parsedGeneric = await aiWrapper.parseVoiceIntent(textContent);
    if (parsedGeneric.intent === "PRODUCT_LISTING") {
      const itemsSummary = parsedGeneric.items.map((i) => `• ${i.name}: ₹${i.price}/${i.unit}`).join("\n");
      return buildResponse({
        action: "VOICE_CONFIRMATION_REQUIRED",
        data: { items: parsedGeneric.items },
        text: `📋 *Humne Yeh Note Kiya:*\n${itemsSummary}\n\n👉 *Kya Yeh Sahi Hai?*`,
        buttons: ["Sahi Hai", "Dobara Bolo"],
      });
    }

    return buildResponse({
      action: "REPLY_SENT",
      text: `👍 Aapka sandesh mila: "${textContent}".\n\nAap bol kar ya likh kar bhej sakte hain jaise: *"Aloo 25 rupaye kilo, tamatar 30"* ya puch sakte hain *"Kahan jaun?"*.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

