# THREAT

9. Threat and failure map (starter)
First limit we expect to hit: WhatsApp API messaging rules and speech/translation API quota during the demo. Keep a pre-recorded fallback and cached translations.

| Who or what | Worst realistic abuse | Mitigation |
| --- | --- | --- |
| Anonymous visitor | Spam orders, scrape vendor locations | Rate limits, auth for orders, coarse location when far away |
| Fake WhatsApp webhook caller | Create fake vendors or orders | Verify token/signature on every webhook |
| Malicious customer | Abusive chat, fake orders | Report/block, rate limit, order confirmation |
| Malicious vendor | Fake listings, fake demand | Phone-verified identity, demand score weighted across many users |
| Voice parser error | Wrong price saved | Read-back plus Yes/No confirmation before saving |
| Translation API down | Chat unreadable | Show original text with a not-translated tag |
| Stale live location | Customer walks to an empty spot | Auto-offline after N minutes without an update |
| WhatsApp API limits or template rules | Bot stops replying | Fallback to website, queue and retry |
| Vendor loses network | Updates lost | Show last-known location with a timestamp |
