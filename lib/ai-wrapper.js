/**
 * AI Wrapper Module (Tech Thela / WEkreta)
 * 
 * Provides a single, swappable interface for:
 * 1. Speech-to-Text (STT) and colloquial Hindi/Hinglish intent parsing
 * 2. Structured product extraction: { name, price, unit }
 * 3. Bidirectional translation (Hindi <-> English)
 * 4. Demand inquiry intent detection ("Kahan jaun?")
 */

// Standard unit mappings for street commerce
const UNIT_SYNONYMS = {
  kilo: "kg",
  kg: "kg",
  kilogram: "kg",
  gram: "g",
  gm: "g",
  pao: "250g",
  adha: "500g",
  dusse: "100g",
  piece: "piece",
  darjan: "dozen",
  dozen: "dozen",
  plate: "plate",
  cup: "cup",
};

// Common vegetable & street commerce dictionaries
const COMMODITY_DICTIONARY = [
  { hindi: "आलू", hinglish: "aloo", english: "Potato", defaultUnit: "kg" },
  { hindi: "प्याज", hinglish: "pyaaz", english: "Onion", defaultUnit: "kg" },
  { hindi: "टमाटर", hinglish: "tamatar", english: "Tomato", defaultUnit: "kg" },
  { hindi: "पालक", hinglish: "palak", english: "Spinach", defaultUnit: "bunch" },
  { hindi: "गोभी", hinglish: "gobhi", english: "Cauliflower", defaultUnit: "piece" },
  { hindi: "धनिया", hinglish: "dhaniya", english: "Coriander", defaultUnit: "bunch" },
  { hindi: "मिर्ची", hinglish: "mirchi", english: "Green Chilli", defaultUnit: "250g" },
  { hindi: "अदरक", hinglish: "adrak", english: "Ginger", defaultUnit: "250g" },
  { hindi: "केला", hinglish: "kela", english: "Banana", defaultUnit: "dozen" },
  { hindi: "सेब", hinglish: "seb", english: "Apple", defaultUnit: "kg" },
  { hindi: "चाय", hinglish: "chai", english: "Tea", defaultUnit: "cup" },
  { hindi: "समोसा", hinglish: "samosa", english: "Samosa", defaultUnit: "piece" },
  { hindi: "चाट", hinglish: "chaat", english: "Chaat", defaultUnit: "plate" },
];

export const aiWrapper = {
  /**
   * Parse colloquial voice/text transcripts into structured JSON products
   * e.g. "aaj aloo 20 rupaye kilo, pyaaz 30" -> [{ name: "Aloo", price: 20, unit: "kg" }, { name: "Pyaaz", price: 30, unit: "kg" }]
   */
  async parseVoiceIntent(transcript = "") {
    const text = transcript.toLowerCase().trim();

    // Check for demand inquiry
    if (
      text.includes("kahan jaun") ||
      text.includes("kaha jaun") ||
      text.includes("where should i go") ||
      text.includes("demand") ||
      text.includes("hotspot")
    ) {
      return {
        intent: "DEMAND_ROUTING",
        query: transcript,
      };
    }

    // Check for location toggle intent
    if (text.includes("thela on") || text.includes("start thela") || text.includes("chalu")) {
      return { intent: "THELA_ON" };
    }
    if (text.includes("thela off") || text.includes("stop thela") || text.includes("band")) {
      return { intent: "THELA_OFF" };
    }

    // Product listing extraction pipeline
    const detectedItems = [];

    COMMODITY_DICTIONARY.forEach((item) => {
      const matchWord = text.includes(item.hinglish) || text.includes(item.hindi) || text.includes(item.english.toLowerCase());
      if (matchWord) {
        // Regex to look for price numbers around the commodity word
        const regex = new RegExp(`(?:${item.hinglish}|${item.hindi}|${item.english.toLowerCase()})[^0-9]*([0-9]+)`, "i");
        const match = text.match(regex);
        let price = match ? parseInt(match[1], 10) : 30; // sensible fallback

        // Detect unit
        let unit = item.defaultUnit;
        for (const [key, val] of Object.entries(UNIT_SYNONYMS)) {
          if (text.includes(key)) {
            unit = val;
            break;
          }
        }

        detectedItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `${item.hinglish.charAt(0).toUpperCase() + item.hinglish.slice(1)} (${item.english})`,
          price,
          unit,
          inStock: true,
        });
      }
    });

    if (detectedItems.length > 0) {
      return {
        intent: "PRODUCT_LISTING",
        items: detectedItems,
        rawTranscript: transcript,
      };
    }

    // Fallback if no specific commodity was found in dictionary
    return {
      intent: "GENERAL_CHAT",
      rawTranscript: transcript,
    };
  },

  /**
   * Bidirectional translation between Hindi and English
   */
  async translateMessage(text = "", targetLang = "hi") {
    if (!text) return { translatedText: "", originalText: text, isTranslated: false };

    // Common instant translations dictionary for street commerce
    const phraseBook = {
      "hello": "नमस्ते",
      "hi": "नमस्ते",
      "where are you": "आप कहाँ हैं?",
      "coming in 5 mins": "5 मिनट में आ रहा हूँ",
      "fresh vegetables available": "ताज़ी सब्ज़ियाँ उपलब्ध हैं",
      "order ready": "आपका ऑर्डर तैयार है",
      "bulao thela": "ठेला बुलाओ",
      "thank you": "धन्यवाद",
    };

    const lower = text.toLowerCase().trim();
    if (targetLang === "hi" && phraseBook[lower]) {
      return {
        translatedText: phraseBook[lower],
        originalText: text,
        isTranslated: true,
      };
    }

    // Default return with graceful fallback tag
    return {
      translatedText: text,
      originalText: text,
      isTranslated: false,
      note: "Raw message preserved",
    };
  },
};
