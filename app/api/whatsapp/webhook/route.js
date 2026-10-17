import { NextResponse } from "next/server";
import { aiWrapper } from "../../../../lib/ai-wrapper";
import { DEMAND_ZONES } from "../../../../lib/mock-data";

// In-memory rate limiting map: phone -> lastMessageTimestamp
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 2000; // 2 seconds between messages

// Verification token (defaults to hackathon secret if not set in env)
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "tech_thela_webhook_secret";

/**
 * GET Handler: Meta WhatsApp Webhook Handshake
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
 * POST Handler: Process Incoming WhatsApp Messages
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Check rate limit by sender phone
    const sender = body.from || body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || "9876543210";
    const now = Date.now();
    const lastTime = rateLimitMap.get(sender) || 0;

    if (now - lastTime < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }
    rateLimitMap.set(sender, now);

    // Extract message payload
    const msgObj = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0] || body;
    const msgType = msgObj.type || (msgObj.location ? "location" : msgObj.voice ? "voice" : "text");
    const textContent = (msgObj.text?.body || msgObj.text || msgObj.interactive?.button_reply?.title || "").trim();

    let replyPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: sender,
    };

    // 1. Live Location Sharing (F3)
    if (msgType === "location" || msgObj.location) {
      const lat = msgObj.location?.latitude || 28.6315;
      const lng = msgObj.location?.longitude || 77.2185;

      return NextResponse.json({
        success: true,
        action: "LOCATION_UPDATED",
        data: { latitude: lat, longitude: lng, isOnline: true },
        botReply: {
          text: `✅ **Thela Live Location Received!**\n📍 Aapka thela nakshe par live ho gaya hai (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}).\nCustomer ab aapko live dekh sakte hain!`,
        },
      });
    }

    // 2. Interactive Button Replies (2-Tap Confirmation)
    if (textContent === "Sahi Hai" || textContent === "Yes, Save") {
      return NextResponse.json({
        success: true,
        action: "INVENTORY_SAVED",
        botReply: {
          text: "🎉 **Shabash!** Aapki inventory live update ho gayi hai.\nAas-paas ke sabhi grahako ko naya stock dikhai de raha hai.",
        },
      });
    }

    if (textContent === "Dobara Bolo" || textContent === "Cancel") {
      return NextResponse.json({
        success: true,
        action: "CANCELLED",
        botReply: {
          text: "🔄 Koi baat nahi, aap naya voice note bhej kar dobara bata sakte hain.",
        },
      });
    }

    // 3. Demand Hotspots Query (F7)
    if (
      textContent.toLowerCase().includes("kahan") ||
      textContent.toLowerCase().includes("where") ||
      textContent.toLowerCase().includes("demand")
    ) {
      const topZones = DEMAND_ZONES.slice(0, 3)
        .map((z, idx) => `${idx + 1}. **${z.locationName || z.name}** (${z.score}% Demand)\n   ⏰ Peak: *${z.peakHours}*\n   💡 *${z.reasonHinglish || z.reason}*`)
        .join("\n\n");

      return NextResponse.json({
        success: true,
        action: "DEMAND_SUGGESTION",
        botReply: {
          text: `📍 **Aaj Ke Top 3 High Demand Zones:**\n\n${topZones}\n\n💡 *Tip: Wahan pahuchein aur 'Thela ON' share karein!*`,
        },
      });
    }

    // 4. Voice Note / Speech Processing (F2)
    if (msgType === "voice" || msgObj.voice || msgObj.audio) {
      const simulatedTranscript = msgObj.transcript || "aaj aloo 20 rupaye kilo, pyaaz 35 rupaye kilo";
      const parsed = await aiWrapper.parseVoiceIntent(simulatedTranscript);

      if (parsed.intent === "PRODUCT_LISTING") {
        const itemsSummary = parsed.items.map((i) => `• ${i.name}: ₹${i.price}/${i.unit}`).join("\n");
        return NextResponse.json({
          success: true,
          action: "VOICE_CONFIRMATION_REQUIRED",
          items: parsed.items,
          botReply: {
            text: `🎙️ **Aapne Kaha:** "${simulatedTranscript}"\n\n📋 **Humne Yeh Note Kiya:**\n${itemsSummary}\n\n👉 **Kya Yeh Sahi Hai?**`,
            buttons: ["Sahi Hai", "Dobara Bolo"],
          },
        });
      }
    }

    // 5. Onboarding / Greeting (F1)
    if (textContent.toLowerCase() === "hi" || textContent.toLowerCase() === "hello") {
      return NextResponse.json({
        success: true,
        action: "ONBOARDING_GREETING",
        botReply: {
          text: "🙏 **Namaste Ramesh Bhaiya! Welcome to Tech Thela.**\n\nAap WhatsApp par bina type kiye:\n1️⃣ Voice note bhej kar **Dukaan Ka Stock** update kar sakte hain.\n2️⃣ **Location share** karke Thela Live kar sakte hain.\n3️⃣ **'Kahan jaun?'** likhkar high demand mohalla dekh sakte hain.",
          buttons: ["Suno Audio Guide", "Kahan Jaun?", "Thela ON"],
        },
      });
    }

    // Default intelligent conversational fallback
    const parsedGeneric = await aiWrapper.parseVoiceIntent(textContent);
    if (parsedGeneric.intent === "PRODUCT_LISTING") {
      const itemsSummary = parsedGeneric.items.map((i) => `• ${i.name}: ₹${i.price}/${i.unit}`).join("\n");
      return NextResponse.json({
        success: true,
        action: "VOICE_CONFIRMATION_REQUIRED",
        items: parsedGeneric.items,
        botReply: {
          text: `📋 **Humne Yeh Note Kiya:**\n${itemsSummary}\n\n👉 **Kya Yeh Sahi Hai?**`,
          buttons: ["Sahi Hai", "Dobara Bolo"],
        },
      });
    }

    return NextResponse.json({
      success: true,
      action: "REPLY_SENT",
      botReply: {
        text: `👍 Aapka sandesh mila: "${textContent}".\n\nAap voice note bhej sakte hain jaise: *"Aloo 25 rupaye kilo, tamatar 30"* ya puch sakte hain *"Kahan jaun?"*.`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
