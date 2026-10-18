import os
import shutil
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

TEMPLATE_PATH = r"C:\Users\HP\Downloads\Blue and Red Dynamic News Report Presentation.pptx"
BACKUP_PATH = r"C:\Users\HP\Downloads\Blue and Red Dynamic News Report Presentation_BACKUP.pptx"

def edit_template():
    source = BACKUP_PATH if os.path.exists(BACKUP_PATH) else TEMPLATE_PATH
    prs = pptx.Presentation(source)
    slides = list(prs.slides)
    print(f"Loaded template from {source} with {len(slides)} slides. Starting Napkin-style edits...")

    # Color Palette matching Dynamic Blue and Red News Report theme
    C_NAVY = RGBColor(15, 23, 42)          # #0F172A Deep News Navy
    C_RED = RGBColor(220, 38, 38)          # #DC2626 Breaking News Red
    C_BLUE = RGBColor(37, 99, 235)         # #2563EB Dynamic Blue
    C_LIGHT_BLUE = RGBColor(239, 246, 255) # #EFF6FF Ice Blue
    C_WHITE = RGBColor(255, 255, 255)      # #FFFFFF White
    C_CARD_BORDER = RGBColor(203, 213, 225)# #CBD5E1 Slate border
    C_EMERALD = RGBColor(22, 163, 74)      # #16A34A Success Green
    C_DARK_SLATE = RGBColor(51, 65, 85)    # #334155 Body text
    C_AMBER = RGBColor(217, 119, 6)        # #D97706 Amber

    def set_shape_text(shape, text, font_size=None, bold=None, color=None, align=None):
        if not shape.has_text_frame:
            return
        tf = shape.text_frame
        tf.word_wrap = True
        if tf.paragraphs:
            p = tf.paragraphs[0]
            p.text = text
            if align is not None:
                p.alignment = align
            if p.runs:
                r = p.runs[0]
                if font_size: r.font.size = Pt(font_size)
                if bold is not None: r.font.bold = bold
                if color: r.font.color.rgb = color

    # =========================================================================
    # SLIDE 1: COVER / TITLE
    # =========================================================================
    print("Editing Slide 1: Cover...")
    s1 = slides[0]
    for shape in s1.shapes:
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if "Tek Thela" in txt or "Tech Thela" in txt:
                set_shape_text(shape, "WEkreta / Tech Thela", bold=True, color=C_WHITE)
            elif "hello@" in txt:
                set_shape_text(shape, "GDG Hackathon 2026 • \"Bridge The Gap\"", font_size=18, color=C_WHITE)

    # Embed brand logo on Slide 1 top right
    if os.path.exists("public/WEkreta.png"):
        s1.shapes.add_picture("public/WEkreta.png", Inches(13.8), Inches(0.8), Inches(5.0), Inches(1.3))

    # Add Napkin-style subhead banner below main title
    subhead_card = s1.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(1.8), Inches(7.4), Inches(16.4), Inches(1.3)
    )
    subhead_card.fill.solid()
    subhead_card.fill.fore_color.rgb = C_WHITE
    subhead_card.line.color.rgb = C_RED
    subhead_card.line.width = Pt(2.5)
    tf_s1 = subhead_card.text_frame
    tf_s1.word_wrap = True
    tf_s1.vertical_anchor = MSO_ANCHOR.MIDDLE

    p1 = tf_s1.paragraphs[0]
    p1.text = "AI-POWERED PHYGITAL COMMERCE FOR INDIA'S 10 MILLION STREET PUSHCARTS"
    p1.font.size = Pt(18)
    p1.font.bold = True
    p1.font.color.rgb = C_NAVY
    p1.alignment = PP_ALIGN.CENTER

    p2 = tf_s1.add_paragraph()
    p2.text = "Voice-First WhatsApp AI (Zero Typing) • 30-Min Mohalla Batching • Real-Time OpenStreetMap Telemetry"
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = C_BLUE
    p2.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 2: THE 2 MAJOR GAPS (NAPKIN COMPARISON CARDS)
    # =========================================================================
    print("Editing Slide 2: 2 Major Gaps...")
    s2 = slides[1]
    for shape in s2.shapes:
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if "2 major gaps" in txt:
                set_shape_text(shape, "2 CRITICAL GAPS IN INDIA'S $100B STREET ECONOMY", font_size=18, bold=True, color=C_RED)
            elif "Why choose" in txt:
                shape.text_frame.word_wrap = True
                p = shape.text_frame.paragraphs[0]
                p.text = "Why choose the convenience of a click or the confidence of physical touch when shopping can offer both? In a world moving to 10-minute dark stores, 10 million street thelas shouldn't be left behind."
                if p.runs:
                    p.runs[0].font.size = Pt(14)
                    p.runs[0].font.color.rgb = C_NAVY

    # Add 2 Napkin-style visual problem cards on the right side
    card_w = Inches(9.8)
    # Gap 1 Card
    gap1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.8), card_w, Inches(3.6))
    gap1.fill.solid()
    gap1.fill.fore_color.rgb = C_WHITE
    gap1.line.color.rgb = C_RED
    gap1.line.width = Pt(2)
    tf_g1 = gap1.text_frame
    tf_g1.word_wrap = True

    p = tf_g1.paragraphs[0]
    p.text = "🛑 GAP #1: THE DIGITAL LITERACY & TYPING WALL"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_RED

    g1_points = [
        ("Zero Typing Capability: ", "80%+ street vendors have low or regional literacy; complex seller apps with forms and English SKUs cause a 100% bounce rate."),
        ("Voice-Only Communication: ", "Vendors operate exclusively through WhatsApp voice notes and phone calls."),
        ("Extortionate Take-Rates: ", "Dark-store apps (Zepto/Blinkit) charge 25-30% commissions, completely locking out small street vendors operating on 12-15% margins.")
    ]
    for h, b in g1_points:
        p = tf_g1.add_paragraph()
        p.space_before = Pt(4)
        r_h = p.add_run()
        r_h.text = f"• {h}"
        r_h.font.bold = True
        r_h.font.size = Pt(11)
        r_h.font.color.rgb = C_NAVY
        r_b = p.add_run()
        r_b.text = b
        r_b.font.size = Pt(11)
        r_b.font.color.rgb = C_DARK_SLATE

    # Gap 2 Card
    gap2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(5.7), card_w, Inches(3.6))
    gap2.fill.solid()
    gap2.fill.fore_color.rgb = C_WHITE
    gap2.line.color.rgb = C_BLUE
    gap2.line.width = Pt(2)
    tf_g2 = gap2.text_frame
    tf_g2.word_wrap = True

    p = tf_g2.paragraphs[0]
    p.text = "🛰️ GAP #2: THE TELEMETRY INVISIBILITY TRAP"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    g2_points = [
        ("Moving Carts are Invisible: ", "Customers wanting fresh vegetables have no way to know if a thela is 50 meters away or 2 kilometers away."),
        ("2.5 Hours Lost Daily: ", "Vendors waste hours aimlessly calling out in residential lanes hoping someone will buy before vegetables spoil."),
        ("Zero Demand Forecasting: ", "Vendors have no intelligence on which street or college gate has peak demand right now.")
    ]
    for h, b in g2_points:
        p = tf_g2.add_paragraph()
        p.space_before = Pt(4)
        r_h = p.add_run()
        r_h.text = f"• {h}"
        r_h.font.bold = True
        r_h.font.size = Pt(11)
        r_h.font.color.rgb = C_NAVY
        r_b = p.add_run()
        r_b.text = b
        r_b.font.size = Pt(11)
        r_b.font.color.rgb = C_DARK_SLATE

    # Bottom Napkin Solution Pill
    sol_pill = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.12), Inches(9.5), Inches(17.48), Inches(0.9))
    sol_pill.fill.solid()
    sol_pill.fill.fore_color.rgb = C_LIGHT_BLUE
    sol_pill.line.color.rgb = C_BLUE
    sol_pill.line.width = Pt(1.5)
    tf_sp = sol_pill.text_frame
    tf_sp.word_wrap = True
    tf_sp.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf_sp.paragraphs[0]
    p.text = "💡 THE WEKRETA SOLUTION: Ambient WhatsApp Voice Ingestion (Zero-Typing) + Live OpenStreetMap Telemetry + 30-Min Mohalla Batching!"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 3: KEY QUESTIONS (NAPKIN 5W1H INFOGRAPHIC)
    # =========================================================================
    print("Editing Slide 3: Key Questions...")
    s3 = slides[2]
    q_answers = {
        "The people involved": "10M Street Pushcart Vendors & Urban Mohalla Households",
        "The event itself": "Ambient WhatsApp Voice Bot (Zero-Typing) + Live Thela Map",
        "The location": "Hyperlocal Indian Mohallas (1.5 km Geofence Delivery Radius)",
        "The time it happened": "Real-Time On-Demand (sub-10m) & 1-Day Advance Orders (7% Off)",
        "The reason behind it": "0% Vendor Fee vs 25% Dark-Store Cut + 100% Farm-Fresh Vegetables",
        "The way it happened": "Spoken Voice Audio ➔ Gemini 2.5 Flash ➔ 30-Min Mohalla Batching"
    }
    for shape in s3.shapes:
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if txt in q_answers:
                set_shape_text(shape, q_answers[txt], font_size=13, bold=True, color=C_NAVY)

    # =========================================================================
    # SLIDE 4: MASTER NAPKIN FLOWCHART & SYSTEM ARCHITECTURE
    # =========================================================================
    print("Editing Slide 4: Master Napkin Flowchart & System Architecture...")
    s4 = slides[3]

    # Add Napkin-style Header Title
    header_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(0.8), Inches(17.0), Inches(1.3))
    header_box.fill.solid()
    header_box.fill.fore_color.rgb = C_WHITE
    header_box.line.color.rgb = C_BLUE
    header_box.line.width = Pt(2)
    tf_h4 = header_box.text_frame
    tf_h4.word_wrap = True
    tf_h4.vertical_anchor = MSO_ANCHOR.MIDDLE

    p = tf_h4.paragraphs[0]
    p.text = "SYSTEM ARCHITECTURE & END-TO-END NAPKIN PIPELINE"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.alignment = PP_ALIGN.CENTER

    p_sub = tf_h4.add_paragraph()
    p_sub.text = "Visual Process Blueprint: From Spoken Hindi Voice Note ➔ Gemini 2.5 AI ➔ 30-Min Mohalla Batching ➔ Doorstep Delivery"
    p_sub.font.size = Pt(12)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_RED
    p_sub.alignment = PP_ALIGN.CENTER

    # 4 Horizontal Pipeline Stages
    pipeline_steps = [
        ("STAGE 1", "🎙️ VOICE INGESTION", C_RED, [
            ("Input Method: ", "Continuous Web Speech API loop or WhatsApp Voice Note (.ogg)."),
            ("Webhook Router: ", "Meta Cloud API / Twilio with HMAC token verification."),
            ("Zero Typing: ", "Vendor simply speaks in Hindi, Hinglish, or regional dialect.")
        ]),
        ("STAGE 2", "🧠 GEMINI 2.5 FLASH AI", C_BLUE, [
            ("LLM Ingestion: ", "Gemini 2.5 Flash API parses unstructured speech in 600ms."),
            ("Structured Output: ", "Converts speech into JSON { name, price, unit }."),
            ("Vendor Safety: ", "Vendor confirms with 1-tap 'Sahi Hai?' before saving to DB.")
        ]),
        ("STAGE 3", "📦 30-MIN MOHALLA BATCH", C_EMERALD, [
            ("Spatio-Temporal: ", "Orders grouped within 1.5 km core delivery geofence."),
            ("Inventory Match: ", "Greedy allocation matches 100% single-vendor carts."),
            ("Instant WhatsApp: ", "Vendor receives interactive WhatsApp Accept/Reject buttons.")
        ]),
        ("STAGE 4", "📍 OPEN MAP & NEON DB", C_NAVY, [
            ("Zero-Cost Mapping: ", "Leaflet + OpenStreetMap ($0 vs $580/1k Google Maps)."),
            ("GPS Filtering: ", "Dead-band Kalman filter eliminates telemetry jitter."),
            ("Persistence: ", "Neon Serverless PostgreSQL (Prisma 6.4 ORM, B-Tree indexes).")
        ])
    ]

    card_w4 = Inches(3.6)
    gap4 = Inches(0.85)
    y_card = Inches(2.4)
    h_card = Inches(4.5)

    for i, (stage, title, border_col, points) in enumerate(pipeline_steps):
        x_card = Inches(1.5) + i * (card_w4 + gap4)
        c = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_card, y_card, card_w4, h_card)
        c.fill.solid()
        c.fill.fore_color.rgb = C_WHITE
        c.line.color.rgb = border_col
        c.line.width = Pt(2.5)

        tf = c.text_frame
        tf.word_wrap = True

        p_st = tf.paragraphs[0]
        p_st.text = stage
        p_st.font.size = Pt(10)
        p_st.font.bold = True
        p_st.font.color.rgb = border_col

        p_ti = tf.add_paragraph()
        p_ti.text = title
        p_ti.font.size = Pt(13)
        p_ti.font.bold = True
        p_ti.font.color.rgb = C_NAVY
        p_ti.space_before = Pt(2)

        for label, desc in points:
            p_pt = tf.add_paragraph()
            p_pt.space_before = Pt(8)
            r_l = p_pt.add_run()
            r_l.text = f"• {label}"
            r_l.font.bold = True
            r_l.font.size = Pt(10)
            r_l.font.color.rgb = C_NAVY
            r_d = p_pt.add_run()
            r_d.text = desc
            r_d.font.size = Pt(9.5)
            r_d.font.color.rgb = C_DARK_SLATE

        # Draw connecting arrow between stages
        if i < 3:
            arrow_x = x_card + card_w4 + Inches(0.12)
            arrow_y = y_card + Inches(1.9)
            arrow = s4.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, arrow_x, arrow_y, Inches(0.6), Inches(0.5))
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = C_RED
            arrow.line.fill.background()

    # Bottom 3 Napkin Metric Flashcards
    metric_cards = [
        ("⚡ 600ms AI Turnaround", "Google Gemini 2.5 Flash extracts JSON prices from voice notes in real time."),
        ("💰 ₹0.0003 API Cost", "Extremely low per-listing cost enables 100% free vendor onboarding forever."),
        ("📉 94% OPEX Reduction", "Zero paid Google Maps SDK keys. Completely powered by OpenStreetMap.")
    ]
    m_w = Inches(5.3)
    m_gap = Inches(0.55)
    for i, (m_title, m_desc) in enumerate(metric_cards):
        x_m = Inches(1.5) + i * (m_w + m_gap)
        m_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_m, Inches(7.2), m_w, Inches(1.5))
        m_box.fill.solid()
        m_box.fill.fore_color.rgb = C_LIGHT_BLUE
        m_box.line.color.rgb = C_BLUE
        m_box.line.width = Pt(1.5)

        tf_m = m_box.text_frame
        tf_m.word_wrap = True
        p = tf_m.paragraphs[0]
        p.text = m_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p_d = tf_m.add_paragraph()
        p_d.text = m_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_DARK_SLATE
        p_d.space_before = Pt(4)

    # =========================================================================
    # SLIDE 5: THE FUTURE (NAPKIN 3-PHASE ROADMAP)
    # =========================================================================
    print("Editing Slide 5: The Future Roadmap...")
    s5 = slides[4]

    # Update bottom text on slide 5
    for shape in s5.shapes:
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if "Artificial intelligence" in txt:
                shape.text_frame.word_wrap = True
                p = shape.text_frame.paragraphs[0]
                p.text = "WEkreta transforms street commerce from an analog survival struggle into an ambient, highly profitable, phygital network — empowering 10 million vendors without displacing them."
                if p.runs:
                    p.runs[0].font.size = Pt(13)
                    p.runs[0].font.color.rgb = C_NAVY

    # Add 3 Napkin-style Roadmap Cards in the open middle area
    roadmap_cards = [
        ("PHASE 1 (LIVE NOW)", "🚀 Phygital Mohalla MVP", C_BLUE, [
            ("WhatsApp Voice Ingestion: ", "Hands-free Hindi/Hinglish speech to catalog."),
            ("Live Moving Cart Map: ", "OpenStreetMap real-time GPS presence."),
            ("30-Min Mohalla Batching: ", "1.5 km core delivery clustering."),
            ("Calibrated Pricing: ", "5% flat convenience + 7% advance pre-order discount.")
        ]),
        ("PHASE 2 (COMING SOON)", "🥬 Mandi Bulk Wholesale Pooling", C_EMERALD, [
            ("Cooperative Purchasing: ", "Pushcart vendors pool orders directly from Azadpur Mandi."),
            ("Eliminate Intermediaries: ", "Saves vendors 12-15% on wholesale vegetable procurement."),
            ("Price Prediction: ", "Gemini predicts evening mandi price drops."),
            ("Quality Assurance: ", "Direct farm-to-thela verified freshness grade.")
        ]),
        ("PHASE 3 (SCALE)", "🏙️ 100,000 Pushcarts Across Bharat", C_RED, [
            ("Pan-India Expansion: ", "Tier 1 & Tier 2 cities using PostGIS GiST spatial indexing."),
            ("Multilingual AI: ", "Voice support for Bhojpuri, Tamil, Bengali, Telugu & Marathi."),
            ("Micro-Credit Scoring: ", "Verified digital order history unlocks collateral-free micro-loans."),
            ("Formal Economy Bridge: ", "Street vendors enter official banking & UPI ecosystems.")
        ])
    ]

    r_w = Inches(5.1)
    r_gap = Inches(0.85)
    y_r = Inches(2.8)
    h_r = Inches(4.8)

    for i, (tag, r_title, border_col, points) in enumerate(roadmap_cards):
        x_r = Inches(1.5) + i * (r_w + r_gap)
        c = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_r, y_r, r_w, h_r)
        c.fill.solid()
        c.fill.fore_color.rgb = C_WHITE
        c.line.color.rgb = border_col
        c.line.width = Pt(2.5)

        tf = c.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = tag
        p_t.font.size = Pt(11)
        p_t.font.bold = True
        p_t.font.color.rgb = border_col

        p_h = tf.add_paragraph()
        p_h.text = r_title
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = C_NAVY
        p_h.space_before = Pt(2)

        for label, desc in points:
            p_pt = tf.add_paragraph()
            p_pt.space_before = Pt(8)
            r_l = p_pt.add_run()
            r_l.text = f"• {label}"
            r_l.font.bold = True
            r_l.font.size = Pt(10.5)
            r_l.font.color.rgb = C_NAVY
            r_d = p_pt.add_run()
            r_d.text = desc
            r_d.font.size = Pt(10)
            r_d.font.color.rgb = C_DARK_SLATE

        # Draw connecting arrows between phases
        if i < 2:
            arrow_x = x_r + r_w + Inches(0.12)
            arrow_y = y_r + Inches(2.1)
            arrow = s5.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, arrow_x, arrow_y, Inches(0.6), Inches(0.5))
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = C_BLUE
            arrow.line.fill.background()

    # =========================================================================
    # SLIDE 6: IMPACT & UNIT ECONOMICS (NAPKIN METRICS)
    # =========================================================================
    print("Editing Slide 6: Impact & Unit Economics...")
    s6 = slides[5]

    impact_replacements = {
        "AWARENESS": "INCOME BOOST",
        "Keeps audiences informed": "+35% to 40% Daily Income jump by eliminating 2.5 hours of dead-mileage roaming",
        "DISCOUNTS": "CALIBRATED PRICING",
        "Encourages public conversations": "5% flat convenience fee + 7% early-bird discount for 1-day advance morning pre-orders",
        "Can inspire meaningful responses": "Predictable morning procurement reduces vegetable inventory spoilage to under 3%",
        "CHANGE": "ZERO PLATFORM CUT",
        "Can influence society and decisions": "₹0 daily vendor listing fee — small pushcart vendors retain 100% of their street margins",
        "ENVIRONMENT FRIENDLY": "ZERO EMISSIONS",
        "Provides context around events": "Local pushcarts & cycle-rickshaws replace polluting diesel vans for last-500m deliveries"
    }

    for shape in s6.shapes:
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if txt in impact_replacements:
                set_shape_text(shape, impact_replacements[txt], font_size=13, bold=True, color=C_NAVY)

    # Embed Indian Vendor brand image or metrics card on the left side
    left_stat_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.8), Inches(3.8), Inches(6.5))
    left_stat_card.fill.solid()
    left_stat_card.fill.fore_color.rgb = C_LIGHT_BLUE
    left_stat_card.line.color.rgb = C_BLUE
    left_stat_card.line.width = Pt(2)
    tf_ls = left_stat_card.text_frame
    tf_ls.word_wrap = True

    p = tf_ls.paragraphs[0]
    p.text = "🎯 UNIT ECONOMICS FLASH"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    stat_rows = [
        ("Avg Order Value:", "₹300 Cart"),
        ("Gross Take Rate:", "5% (₹15/Order)"),
        ("Software Tech Cost:", "₹0.0003 (Gemini)"),
        ("Software Margin:", "99.8% Gross"),
        ("Vendor Fee:", "₹0 Forever"),
        ("Delivery Radius:", "1.5 km Geofence"),
        ("Customer Saving:", "20-30% vs Zepto")
    ]
    for lbl, val in stat_rows:
        p_row = tf_ls.add_paragraph()
        p_row.space_before = Pt(8)
        r_l = p_row.add_run()
        r_l.text = f"▸ {lbl} "
        r_l.font.bold = True
        r_l.font.size = Pt(10)
        r_l.font.color.rgb = C_NAVY
        r_v = p_row.add_run()
        r_v.text = val
        r_v.font.bold = True
        r_v.font.size = Pt(11)
        r_v.font.color.rgb = C_RED

    if os.path.exists("public/WEkreta.png"):
        s6.shapes.add_picture("public/WEkreta.png", Inches(1.0), Inches(8.8), Inches(3.4), Inches(1.1))

    # =========================================================================
    # SLIDE 7: STAY INFORMED / CONCLUSION & BLOOPER REEL
    # =========================================================================
    print("Editing Slide 7: Conclusion & Pitch Reel...")
    s7 = slides[6]

    for shape in s7.shapes:
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if "STAY INFORMED" in txt:
                set_shape_text(shape, "WEKRETA: THE PHYGITAL FUTURE", font_size=52, bold=True, color=C_WHITE)
            elif "STAY CURIOUS" in txt:
                set_shape_text(shape, "PHYSICAL CONFIDENCE • DIGITAL SPEED • 10 MILLION VENDORS", font_size=18, bold=True, color=C_BLUE)
            elif "Streamline" in txt:
                set_shape_text(shape, "WEkreta", font_size=16, color=C_WHITE)
            elif "hello@" in txt:
                set_shape_text(shape, "team.wekreta@gdghack.dev | GDG Hackathon 2026", font_size=15, color=C_WHITE)

    # Add Napkin-style Blooper & Live Demo Callout Card in the center
    blooper_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.5), Inches(7.6), Inches(15.0), Inches(1.8))
    blooper_card.fill.solid()
    blooper_card.fill.fore_color.rgb = C_WHITE
    blooper_card.line.color.rgb = C_RED
    blooper_card.line.width = Pt(2.5)

    tf_b = blooper_card.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    p.text = "🐧 HACKATHON BLOOPER OF THE YEAR: \"Antarctica Me Dhaniya Bechta Thela\""
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_RED

    p_desc = tf_b.add_paragraph()
    p_desc.text = "A missing noWrap: true on Leaflet tiles caused a coordinate overflow that flung Ramesh Bhaiya's cart 12,450 km away to Antarctica (-75° S) to sell vegetables to penguins! We fixed it with noWrap: true and strict Delhi geofence locking."
    p_desc.font.size = Pt(10.5)
    p_desc.font.color.rgb = C_DARK_SLATE
    p_desc.space_before = Pt(2)

    p_demo = tf_b.add_paragraph()
    p_demo.text = "🚀 LIVE SYSTEM DEMO: http://localhost:3000 | WhatsApp Bot Simulator: /whatsapp | GitHub: anurag-maurya-ece/gdghack"
    p_demo.font.size = Pt(11)
    p_demo.font.bold = True
    p_demo.font.color.rgb = C_BLUE
    p_demo.space_before = Pt(4)

    # Save to TEMPLATE_PATH directly
    prs.save(TEMPLATE_PATH)
    print("SUCCESS: Template updated directly at:", TEMPLATE_PATH)

    # Also save a copy in ppt/ folder for easy access
    dest_ppt = r"e:\Tech thela gdg hackathon\ppt\Blue_and_Red_Dynamic_News_Report_WEkreta.pptx"
    shutil.copyfile(TEMPLATE_PATH, dest_ppt)
    print("Copy saved at:", dest_ppt)

    # Also save a copy in public/ for 1-click browser download
    dest_pub = r"e:\Tech thela gdg hackathon\public\Blue_and_Red_Dynamic_News_Report_WEkreta.pptx"
    shutil.copyfile(TEMPLATE_PATH, dest_pub)
    print("Copy saved at:", dest_pub)

if __name__ == "__main__":
    edit_template()
