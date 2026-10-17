# ARCHITECTURE

5. Architecture (high level)
Modules and what each owns
WhatsApp Bot service (/functions): receives webhooks, verifies them, routes voice/text to the intent parser, replies in the vendor's language.
AI wrapper (/lib/ai): one place for speech-to-text, translation and intent extraction. Swap providers here only.
Web app (/app): customer map, cart, orders, chat; vendor dashboard (orders, products, demand tab).
Firestore: source of truth and realtime layer.
Demand engine (/functions/demand): scheduled job that recomputes grid-cell scores.
Data flow
Vendor voice note -> WhatsApp -> Webhook (verify) -> Speech-to-text -> Intent parser
   -> confirm with vendor -> Firestore (products)
Vendor live location -> Firestore (locations) -> realtime -> Customer map
Customer order -> Firestore (orders) -> Cloud Function -> WhatsApp message to vendor
Vendor taps Accept -> Firestore -> realtime -> Customer sees status
Chat message -> Function -> translate -> Firestore (messages) -> both users
Orders + searches -> Demand engine -> cell scores -> Vendor asks where to go
Trust boundaries (where outside input enters): WhatsApp webhook, customer chat and order forms, voice transcripts, location updates. Always validate these.
