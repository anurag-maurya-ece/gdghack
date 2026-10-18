import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette: Clean Editorial News Style (Light Theme)
    C_BG = RGBColor(248, 250, 252)        # #F8FAFC Ultra light slate
    C_WHITE = RGBColor(255, 255, 255)     # #FFFFFF Card background
    C_RED = RGBColor(220, 38, 38)         # #DC2626 Breaking News Red
    C_DARK_RED = RGBColor(185, 28, 28)    # #B91C1C
    C_EMERALD = RGBColor(22, 163, 74)     # #16A34A Tech Thela Green
    C_NAVY = RGBColor(15, 23, 42)         # #0F172A Primary Headline Ink
    C_SLATE = RGBColor(71, 85, 105)       # #475569 Body text
    C_LIGHT_BORDER = RGBColor(226, 232, 240) # #E2E8F0
    C_AMBER = RGBColor(217, 119, 6)       # #D97706 Warning/Alert
    C_ICE_BLUE = RGBColor(239, 246, 255)  # #EFF6FF

    def add_news_masthead(slide, live_tag, section_title, page_num):
        # Background canvas
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

        # Top Red Breaking Bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.45))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = C_RED
        top_bar.line.fill.background()

        tb = top_bar.text_frame
        tb.word_wrap = True
        tb.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tb.paragraphs[0]
        p.text = f" 🔴 LIVE BROADCAST | {live_tag.upper()} • THE DAILY MOHALLA CHRONICLE • EDITION NO. {page_num}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.font.name = "Arial"

        # News Sub-banner line
        sub_banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0.45), Inches(13.333), Inches(0.35))
        sub_banner.fill.solid()
        sub_banner.fill.fore_color.rgb = C_NAVY
        sub_banner.line.fill.background()

        tb_sub = sub_banner.text_frame
        tb_sub.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_sub = tb_sub.paragraphs[0]
        p_sub.text = f" SPECIAL REPORT: {section_title.upper()} | HACKATHON PITCH SPECIAL | NEW DELHI BUREAU"
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = RGBColor(203, 213, 225)
        p_sub.font.name = "Arial"

        # Bottom News Ticker Bar
        bot_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.1), Inches(13.333), Inches(0.4))
        bot_bar.fill.solid()
        bot_bar.fill.fore_color.rgb = C_NAVY
        bot_bar.line.fill.background()

        tb_bot = bot_bar.text_frame
        tb_bot.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_bot = tb_bot.paragraphs[0]
        p_bot.text = " 🚨 TICKER: WEkreta onboarded 10M vendors with zero typing... Leaflet OSM saves 90% mapping OPEX... 30-min Mohalla batching cuts dead-mileage by 64%... Gemini 2.5 Flash voice pipeline operational..."
        p_bot.font.size = Pt(9.5)
        p_bot.font.bold = True
        p_bot.font.color.rgb = RGBColor(241, 245, 249)
        p_bot.font.name = "Arial"

    # =========================================================================
    # SLIDE 1: FRONT PAGE HEADLINE (THE ROLEPLAY HOOK)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_news_masthead(s1, "SPECIAL INVESTIGATION", "FRONT PAGE EXCLUSIVE", 1)

    # Big News Headline Box
    title_box = s1.shapes.add_textbox(Inches(0.6), Inches(0.9), Inches(12.133), Inches(1.3))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "THE DAILY THELA: Street Pushcarts Go Phygital!"
    p1.font.size = Pt(30)
    p1.font.bold = True
    p1.font.color.rgb = C_NAVY
    p1.font.name = "Georgia"

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "Anchor Intro: How AI Voice Ingestion & Open-Source Maps are Bridging India's $100B Invisible Street Economy"
    p1_sub.font.size = Pt(14)
    p1_sub.font.bold = True
    p1_sub.font.color.rgb = C_EMERALD

    # Left Column: Lead Story Card
    card_left = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(2.3), Inches(6.8), Inches(4.6))
    card_left.fill.solid()
    card_left.fill.fore_color.rgb = C_WHITE
    card_left.line.color.rgb = C_LIGHT_BORDER
    card_left.line.width = Pt(1.5)

    tf_lead = card_left.text_frame
    tf_lead.word_wrap = True
    p = tf_lead.paragraphs[0]
    p.text = "📰 LEAD STORY: The Great Mohalla Disruption"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_RED

    bullets_s1 = [
        ("The Invisible Backbone:", "India is powered by 10 Million street vendors (Thela wale) delivering 60%+ of urban perishables, yet remaining 100% digitally invisible."),
        ("The AI Intervention:", "WEkreta introduces WhatsApp-First Voice onboarding — turning spoken audio into verified structured catalogs in under 600ms."),
        ("Zero-Cost Architecture:", "Zero paid mapping API dependencies. Built with Next.js, Leaflet OpenStreetMap, Neon PostgreSQL, and Gemini 2.5 Flash."),
        ("The Anchor's Verdict:", "\"This isn't another dark-store app. This is the financial sovereignty of Bharat's street entrepreneurs.\"")
    ]
    for b_title, b_desc in bullets_s1:
        p = tf_lead.add_paragraph()
        p.space_before = Pt(8)
        run_t = p.add_run()
        run_t.text = f"• {b_title} "
        run_t.font.bold = True
        run_t.font.size = Pt(11)
        run_t.font.color.rgb = C_NAVY
        run_d = p.add_run()
        run_d.text = b_desc
        run_d.font.size = Pt(11)
        run_d.font.color.rgb = C_SLATE

    # Right Column: Visual Brand & Key Flashcards
    card_right = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), Inches(2.3), Inches(5.1), Inches(4.6))
    card_right.fill.solid()
    card_right.fill.fore_color.rgb = C_WHITE
    card_right.line.color.rgb = C_LIGHT_BORDER
    card_right.line.width = Pt(1.5)

    tf_r = card_right.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "⚡ NEWSROOM FLASH METRICS"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    # Add images inside right card
    if os.path.exists("public/WEkreta.png"):
        s1.shapes.add_picture("public/WEkreta.png", Inches(7.9), Inches(2.9), Inches(4.5), Inches(1.1))

    # Metric badges
    metrics = [
        ("₹0 Fee", "Vendor Listing", "Free daily operational listing"),
        ("1.5 km", "Geofence Core", "30-Min Mohalla batching radius"),
        ("2 Taps", "Zero Typing", "Speech recognition or 2-tap WhatsApp")
    ]
    y_m = 4.2
    for val, lbl, sub in metrics:
        box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.9), Inches(y_m), Inches(4.5), Inches(0.75))
        box.fill.solid()
        box.fill.fore_color.rgb = C_ICE_BLUE
        box.line.color.rgb = RGBColor(191, 219, 254)
        t_box = box.text_frame
        t_box.word_wrap = True
        p_m = t_box.paragraphs[0]
        p_m.text = f"{val} • {lbl.upper()}: {sub}"
        p_m.font.size = Pt(11)
        p_m.font.bold = True
        p_m.font.color.rgb = C_NAVY
        y_m += 0.85

    # =========================================================================
    # SLIDE 2: GROUND REALITY / INVESTIGATION (PROBLEM & MISSION)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_news_masthead(s2, "EXPOSÉ", "GROUND REALITY & CRISIS DESK", 2)

    title_box2 = s2.shapes.add_textbox(Inches(0.6), Inches(0.9), Inches(12.133), Inches(1.2))
    tf2 = title_box2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "SPECIAL REPORT: The $100B Invisible Street Economy"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.font.name = "Georgia"

    p_sub = tf2.add_paragraph()
    p_sub.text = "Investigative Findings: Why 10 Million Thelas Are Blocked by Digital Literacy & Dark-Store Monopolies"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_RED

    # 3 Column Cards for 3 Problems
    col_w = Inches(3.8)
    col_gap = Inches(0.35)
    left_start = Inches(0.6)

    prob_cards = [
        ("🚨 FINDING #1", "The Digital Literacy Wall", 
         "• 80%+ street vendors have low or regional literacy.\n• Complex catalog apps, forms, and English SKU typing lead to 100% bounce rate.\n• Vendors communicate exclusively via WhatsApp Voice Notes & direct phone calls."),
        ("🛰️ FINDING #2", "The Telemetry Invisibility Trap",
         "• Street vendors move continuously through mohalla lanes.\n• Customers wanting fresh vegetables have zero way to know if a vendor is 100m away or 2km away.\n• Vendors waste 2.5 hours daily aimlessly calling out on streets."),
        ("💸 FINDING #3", "Q-Commerce Commission Extortion",
         "• Dark-store giants charge 25-30% platform take-rates + ad spend.\n• Small vendors operating on 15% margins are completely locked out.\n• Result: Consumers pay higher prices for refrigerated warehouse stock.")
    ]

    for i, (tag, h, body) in enumerate(prob_cards):
        x = left_start + i * (col_w + col_gap)
        c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), col_w, Inches(4.7))
        c.fill.solid()
        c.fill.fore_color.rgb = C_WHITE
        c.line.color.rgb = C_LIGHT_BORDER
        c.line.width = Pt(1.5)

        tf = c.text_frame
        tf.word_wrap = True
        p_tag = tf.paragraphs[0]
        p_tag.text = tag
        p_tag.font.size = Pt(12)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_RED

        p_h = tf.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(15)
        p_h.font.bold = True
        p_h.font.color.rgb = C_NAVY
        p_h.space_before = Pt(4)

        p_b = tf.add_paragraph()
        p_b.text = body
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = C_SLATE
        p_b.space_before = Pt(12)

    # =========================================================================
    # SLIDE 3: SYSTEM ARCHITECTURE & TECH BLUEPRINT
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_news_masthead(s3, "TECH BLUEPRINT", "ENTERPRISE ARCHITECTURE DESK", 3)

    title_box3 = s3.shapes.add_textbox(Inches(0.6), Inches(0.9), Inches(12.133), Inches(1.2))
    tf3 = title_box3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "BLUEPRINT: Inside The 4-Layer Zero-Cost Architecture"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.font.name = "Georgia"

    p_sub = tf3.add_paragraph()
    p_sub.text = "How WEkreta Scales to 100,000 Pushcarts with ₹0 Mapping OPEX & Sub-Second Voice AI Pipeline"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_EMERALD

    # 4 Architecture Horizontal/Stacked Cards
    tiers = [
        ("LAYER 1: CLIENT & ACCESS TIER", 
         "Customer PWA (Next.js 16 + Tailwind v4 + Framer Motion) | Vendor Operations Portal (Zero-Typing UI) | WhatsApp Cloud API Bot (Meta Webhook HMAC Verified)", 
         C_NAVY),
        ("LAYER 2: VOICE & REAL-TIME INGESTION TIER", 
         "Continuous SpeechRecognition Loop (Web Speech API) with auto-restart on silence | Webhook Router with Argon2id auth & CSRF verification", 
         C_RED),
        ("LAYER 3: CORE INTELLIGENCE & PROCESSING TIER", 
         "Google Gemini 2.5 Flash Wrapper (Audio/Text -> Structured JSON {name, price, unit}) | 30-Min Mohalla Batching Engine (Haversine formula, R_core = 1.5km) | Exponential Demand Decay Hotspot Scoring", 
         C_EMERALD),
        ("LAYER 4: STORAGE & PERSISTENCE TIER", 
         "Neon Serverless PostgreSQL (Prisma 6.4 ORM, B-Tree geospatial indexes) | Cloudflare R2 / S3 Storage | Vercel Edge Global Network", 
         C_NAVY)
    ]

    y_tier = Inches(2.2)
    for title, desc, col in tiers:
        box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), y_tier, Inches(12.133), Inches(0.95))
        box.fill.solid()
        box.fill.fore_color.rgb = C_WHITE
        box.line.color.rgb = col
        box.line.width = Pt(2)

        tf = box.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        p_t.text = f"■ {title}"
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = col

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = C_SLATE
        p_d.space_before = Pt(2)

        y_tier += Inches(1.1)

    # Bottom Cost Defense Card
    cost_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.15), Inches(12.133), Inches(0.75))
    cost_box.fill.solid()
    cost_box.fill.fore_color.rgb = C_ICE_BLUE
    cost_box.line.color.rgb = RGBColor(147, 197, 253)
    tf_c = cost_box.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "💡 WHITEBOARD DEFENSE: Zero-Cost Mapping ($0 Leaflet/OSM vs $580/1000 loads on Google Maps) + Gemini Flash @ ₹0.0003/voice note saves 94% platform OPEX!"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    # =========================================================================
    # SLIDE 4: LIVE FIELD DEMO (CORE INNOVATIONS & SCREENSHOTS)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_news_masthead(s4, "FIELD DEMO", "PRODUCT INNOVATION & LIVE EVIDENCE", 4)

    title_box4 = s4.shapes.add_textbox(Inches(0.6), Inches(0.9), Inches(12.133), Inches(1.2))
    tf4 = title_box4.text_frame
    tf4.word_wrap = True
    p = tf4.paragraphs[0]
    p.text = "LIVE FROM THE FIELD: 3 Groundbreaking Innovations"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.font.name = "Georgia"

    p_sub = tf4.add_paragraph()
    p_sub.text = "Demonstrating Real Continuous Voice AI, Live Leaflet Phygital Tracking & 30-Minute Mohalla Batching"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_RED

    # 3 Columns with Live Feature Evidence
    col_w4 = Inches(3.8)
    col_gap4 = Inches(0.35)

    feat_data = [
        ("🎙️ INNOVATION 1", "Continuous Speech Loop", 
         "• Browser SpeechRecognition auto-restarts in continuous loop;\n• multi-sentence quotes accumulate without silence drop-off;\n• Gemini 2.5 Flash extracts JSON prices in real time;\n• Vendor confirms with 1-tap 'Sahi Hai'."),
        ("📍 INNOVATION 2", "Live Phygital OSM Map", 
         "• Real-time moving thela markers with category emojis;\n• Dead-band GPS filtering prevents jitter;\n• 15-minute inactivity telemetry auto-decay;\n• Complete customer discovery in sub-100m radius."),
        ("📦 INNOVATION 3", "30-Min Mohalla Batching", 
         "• Groups orders within 1.5km geofence into 30-min cycles;\n• 100% single-vendor inventory matching;\n• Stepped greedy fallback for secondary vendors;\n• WhatsApp instant Accept/Reject buttons.")
    ]

    for i, (tag, h, body) in enumerate(feat_data):
        x = Inches(0.6) + i * (col_w4 + col_gap4)
        c = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), col_w4, Inches(2.5))
        c.fill.solid()
        c.fill.fore_color.rgb = C_WHITE
        c.line.color.rgb = C_LIGHT_BORDER
        c.line.width = Pt(1.5)

        tf = c.text_frame
        tf.word_wrap = True
        p_tag = tf.paragraphs[0]
        p_tag.text = tag
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_EMERALD

        p_h = tf.add_paragraph()
        p_h.text = h
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = C_NAVY
        p_h.space_before = Pt(2)

        p_b = tf.add_paragraph()
        p_b.text = body
        p_b.font.size = Pt(10.5)
        p_b.font.color.rgb = C_SLATE
        p_b.space_before = Pt(6)

    # Embedded Map Screenshot at bottom
    if os.path.exists("docs/bloopers/delhi_debugged_screenshot.png"):
        s4.shapes.add_picture("docs/bloopers/delhi_debugged_screenshot.png", Inches(0.6), Inches(4.85), Inches(7.9), Inches(2.1))

    # Right side banner next to map
    r_banner = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.75), Inches(4.85), Inches(3.98), Inches(2.1))
    r_banner.fill.solid()
    r_banner.fill.fore_color.rgb = C_ICE_BLUE
    r_banner.line.color.rgb = RGBColor(147, 197, 253)
    tf_rb = r_banner.text_frame
    tf_rb.word_wrap = True
    p = tf_rb.paragraphs[0]
    p.text = "🎯 PRODUCTION VERIFICATION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p_b = tf_rb.add_paragraph()
    p_b.text = "• 35 Dynamic API Routes active\n• Live Neon Serverless DB Connection\n• 6/6 Batching Unit Tests Passing\n• Zero-Install PWA Mobile Friendly"
    p_b.font.size = Pt(11)
    p_b.font.color.rgb = C_SLATE
    p_b.space_before = Pt(6)

    # =========================================================================
    # SLIDE 5: FINANCIAL & ECONOMICS DESK (CALIBRATED PRICING)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_news_masthead(s5, "FINANCIAL BULLETIN", "UNIT ECONOMICS & PRICING DESK", 5)

    title_box5 = s5.shapes.add_textbox(Inches(0.6), Inches(0.9), Inches(12.133), Inches(1.2))
    tf5 = title_box5.text_frame
    tf5.word_wrap = True
    p = tf5.paragraphs[0]
    p.text = "FINANCIAL WIRE: Disruptive Street Economics"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.font.name = "Georgia"

    p_sub = tf5.add_paragraph()
    p_sub.text = "The Calibrated Revenue Model: 5% Flat + 7% Advance Pre-Order Discount vs Q-Commerce Extortion"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_EMERALD

    # Left: Pricing Table Box
    card_table = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(2.2), Inches(6.8), Inches(4.7))
    card_table.fill.solid()
    card_table.fill.fore_color.rgb = C_WHITE
    card_table.line.color.rgb = C_LIGHT_BORDER
    card_table.line.width = Pt(1.5)

    tf_pt = card_table.text_frame
    tf_pt.word_wrap = True
    p = tf_pt.paragraphs[0]
    p.text = "📊 UNIT PRICING BREAKDOWN"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    pricing_points = [
        ("Vendor Side (Zero Fee):", "100% Free daily listing & order receipt. Zero onboarding fees. Compare to 25-30% platform cuts on Swiggy/Zepto."),
        ("Consumer Flat Convenience (5%):", "Flat 5% convenience fee on on-demand delivery (e.g. ₹15 on a ₹300 cart). Transparent & far lower than dark-store packaging + surge charges."),
        ("Advance Pre-Order Incentive (7% Discount):", "Ordering fresh vegetables 1 day in advance unlocks 7% discount, stabilizing morning bulk procurement for vendors."),
        ("Phase 2 Mandi Wholesale Pooling:", "[COMING SOON] Collective wholesale purchasing power directly from Azadpur Mandi, saving vendors an additional 12-15% on procurement.")
    ]
    for h, d in pricing_points:
        p = tf_pt.add_paragraph()
        p.space_before = Pt(8)
        run_h = p.add_run()
        run_h.text = f"• {h} "
        run_h.font.bold = True
        run_h.font.size = Pt(11)
        run_h.font.color.rgb = C_NAVY
        run_d = p.add_run()
        run_d.text = d
        run_d.font.size = Pt(11)
        run_d.font.color.rgb = C_SLATE

    # Right: Unit Economics Flash Comparison
    card_comp = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), Inches(2.2), Inches(5.1), Inches(4.7))
    card_comp.fill.solid()
    card_comp.fill.fore_color.rgb = C_WHITE
    card_comp.line.color.rgb = C_LIGHT_BORDER
    card_comp.line.width = Pt(1.5)

    tf_cp = card_comp.text_frame
    tf_cp.word_wrap = True
    p = tf_cp.paragraphs[0]
    p.text = "⚔️ HEAD-TO-HEAD ECONOMICS"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_RED

    comp_items = [
        ("Average Order Value (AOV):", "₹300 Per Household"),
        ("Gross Take Rate:", "5% Convenience = ₹15"),
        ("Software Tech Cost per Order:", "₹0.0003 (Gemini 2.5 Flash)"),
        ("Platform Software Margin:", "99.8% Gross Software Margin"),
        ("Vendor Income Increase:", "+35% to 40% Daily Income"),
        ("Consumer Vegetable Freshness:", "Direct from Cart (0 Warehouse Days)")
    ]
    for lbl, val in comp_items:
        p = tf_cp.add_paragraph()
        p.space_before = Pt(10)
        run_l = p.add_run()
        run_l.text = f"▸ {lbl} "
        run_l.font.bold = True
        run_l.font.size = Pt(11)
        run_l.font.color.rgb = C_NAVY
        run_v = p.add_run()
        run_v.text = val
        run_v.font.bold = True
        run_v.font.size = Pt(11.5)
        run_v.font.color.rgb = C_EMERALD

    # =========================================================================
    # SLIDE 6: EDITORIAL BOARD, BLOOPER REEL & CONCLUSION
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_news_masthead(s6, "SPECIAL REEL", "EDITORIAL BOARD & BLOOPER DESK", 6)

    title_box6 = s6.shapes.add_textbox(Inches(0.6), Inches(0.9), Inches(12.133), Inches(1.2))
    tf6 = title_box6.text_frame
    tf6.word_wrap = True
    p = tf6.paragraphs[0]
    p.text = "THE FINAL EDITORIAL: From Antarctica To 10M Thelas"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.font.name = "Georgia"

    p_sub = tf6.add_paragraph()
    p_sub.text = "The Legendary Hackathon Blooper, Engineering Resilience & The Road to National Scale"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_RED

    # Left: The Famous Blooper Story Card
    card_blooper = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(2.2), Inches(6.8), Inches(4.7))
    card_blooper.fill.solid()
    card_blooper.fill.fore_color.rgb = C_ICE_BLUE
    card_blooper.line.color.rgb = RGBColor(147, 197, 253)
    card_blooper.line.width = Pt(2)

    tf_bl = card_blooper.text_frame
    tf_bl.word_wrap = True
    p = tf_bl.paragraphs[0]
    p.text = "🐧 THE HACKATHON BLOOPER OF THE YEAR!"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_RED

    p_bl_desc = tf_bl.add_paragraph()
    p_bl_desc.text = "\"Antarctica Me Dhaniya Bechta Thela (Leaflet World Wrap Bug)\""
    p_bl_desc.font.size = Pt(12)
    p_bl_desc.font.bold = True
    p_bl_desc.font.color.rgb = C_NAVY
    p_bl_desc.space_before = Pt(2)

    blooper_bullets = [
        ("The Incident:", "A missing `noWrap: true` on Leaflet tiles caused a coordinate float overflow during pan testing. Ramesh Bhaiya's cart teleported 12,450 km to the South Pole (-75.25° S)!"),
        ("The Punchline:", "\"Bhaiya penguins ko Dhaniya-Mirchi free doge ya delivery charge lagega?\" 🧊"),
        ("The Engineering Fix:", "Enforced `noWrap: true` on OpenStreetMap tile layers + strict Delhi NCR bounding box geofencing.")
    ]
    for h, d in blooper_bullets:
        p = tf_bl.add_paragraph()
        p.space_before = Pt(6)
        r_h = p.add_run()
        r_h.text = f"• {h} "
        r_h.font.bold = True
        r_h.font.size = Pt(10.5)
        r_h.font.color.rgb = C_NAVY
        r_d = p.add_run()
        r_d.text = d
        r_d.font.size = Pt(10.5)
        r_d.font.color.rgb = C_SLATE

    # Embed Blooper Screenshot inside left card if present
    if os.path.exists("docs/bloopers/antarctica_bug_screenshot.png"):
        s6.shapes.add_picture("docs/bloopers/antarctica_bug_screenshot.png", Inches(0.9), Inches(5.1), Inches(6.2), Inches(1.6))

    # Right: Conclusion & Roleplay Sign-off Card
    card_end = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), Inches(2.2), Inches(5.1), Inches(4.7))
    card_end.fill.solid()
    card_end.fill.fore_color.rgb = C_WHITE
    card_end.line.color.rgb = C_LIGHT_BORDER
    card_end.line.width = Pt(1.5)

    tf_end = card_end.text_frame
    tf_end.word_wrap = True
    p = tf_end.paragraphs[0]
    p.text = "🎙️ FINAL BROADCAST SIGN-OFF"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    concl_points = [
        ("Scalability Beyond Delhi:", "PostGIS GiST spatial indexing + Redis GEO RAM buffers tested to handle 100,000 concurrent pushcarts across Tier 1 & 2 cities."),
        ("Real Impact on Bharat:", "Empowering the unorganized workforce with cutting-edge AI — without forcing them to change how they talk or work."),
        ("The Whiteboard Summary:", "Zero paid API locks, zero typing barriers, and mathematically optimal 30-min Mohalla batching."),
        ("Anchor Sign-Off:", "\"This is WEkreta News, reporting live from the street lanes of New Delhi. Bridging the gap, one thela at a time. Back to the judges!\"")
    ]
    for h, d in concl_points:
        p = tf_end.add_paragraph()
        p.space_before = Pt(8)
        r_h = p.add_run()
        r_h.text = f"✔ {h} "
        r_h.font.bold = True
        r_h.font.size = Pt(11)
        r_h.font.color.rgb = C_EMERALD if "Anchor" not in h else C_RED
        r_d = p.add_run()
        r_d.text = d
        r_d.font.size = Pt(10.5)
        r_d.font.color.rgb = C_SLATE

    output_path = "WEkreta_Tech_Thela_Newsroom_Pitch.pptx"
    prs.save(output_path)
    print(f"SUCCESS: Presentation saved at {output_path}")

if __name__ == "__main__":
    create_presentation()
