import pptxgen from "pptxgenjs";

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Data Analytics Team";
pres.company = "ReactCampus";
pres.subject = "Data Pipeline & Analytics Overview";
pres.title = "ReactCampus: How We Built Our College Ranking System";

const colors = {
  mint: "DEFBE6", cream: "F7F3F2", yellow: "FCF4D6", blue: "E5F6FF",
  grayLight: "C6C6C6", sky: "BAE6FF", cyan: "D9FBFB", white: "FFFFFF",
  black: "000000", ibmBlue: "0f62fe", codeGray: "2D2D2D", codeBg: "F5F5F5",
  green: "24A148", orange: "FF832B", purple: "8A3FFC", red: "DA1E28"
};

// SLIDE 1: COVER
let slide1 = pres.addSlide();
slide1.background = { fill: colors.ibmBlue };
slide1.addText("ReactCampus", {
  x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 48, bold: true, color: colors.white, align: "center"
});
slide1.addText("How We Built Our College Ranking System", {
  x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 24, color: colors.white, align: "center"
});
slide1.addText("From Raw Data to Actionable Insights", {
  x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 18, color: colors.white, align: "center", italic: true
});
slide1.addText("Data Analytics Team Presentation", {
  x: 0.5, y: 5.0, w: 9, h: 0.3, fontSize: 14, color: colors.white, align: "center"
});

// SLIDE 2: THE CHALLENGE
let slide2 = pres.addSlide();
slide2.background = { fill: colors.cream };
slide2.addText("The Challenge", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 32, bold: true, color: colors.black
});
slide2.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.3, w: 8.8, h: 1.8, fill: { color: colors.yellow } });
slide2.addText("How do we help students choose the right college from 200+ options across India?", {
  x: 0.8, y: 1.6, w: 8.4, h: 1.2, fontSize: 22, color: colors.black, align: "center", valign: "middle", bold: true
});

slide2.addText("Our Solution: Data-Driven College Scoring", {
  x: 0.6, y: 3.3, w: 8.8, h: 0.4, fontSize: 20, bold: true, color: colors.ibmBlue
});

const challenges = [
  { icon: "📊", text: "Collect data on 211 colleges across 31 states" },
  { icon: "🧹", text: "Clean and standardize inconsistent data" },
  { icon: "🎯", text: "Create fair scoring system (0-100 scale)" },
  { icon: "🏆", text: "Rank colleges into 4 tiers for easy comparison" }
];

challenges.forEach((item, i) => {
  slide2.addText(item.icon, { x: 0.8, y: 3.9 + (i * 0.45), w: 0.5, h: 0.4, fontSize: 24 });
  slide2.addText(item.text, { x: 1.4, y: 3.9 + (i * 0.45), w: 7.8, h: 0.4, fontSize: 16, color: colors.black });
});

// SLIDE 3: DATA GENERATION EXPLAINED
let slide3 = pres.addSlide();
slide3.background = { fill: colors.blue };
slide3.addText("Step 1: Data Collection", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: colors.black
});

// Left side: What we did
slide3.addText("What We Did", { x: 0.6, y: 1.3, w: 4.0, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });
slide3.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.8, w: 4.0, h: 3.5, fill: { color: colors.white }, line: { color: colors.grayLight, width: 1 } });
slide3.addText("✓ Gathered data on 213 colleges\n\n✓ 27 different metrics per college:\n   • Placement rates\n   • Average packages\n   • Faculty ratios\n   • Infrastructure scores\n   • NAAC grades\n   • And 22 more...\n\n✓ Included IITs, NITs, private universities", {
  x: 0.8, y: 2.0, w: 3.6, h: 3.0, fontSize: 13, color: colors.black
});

// Right side: Code snippet with explanation
slide3.addText("Behind the Scenes", { x: 5.0, y: 1.3, w: 4.4, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });
slide3.addShape(pres.ShapeType.rect, { x: 5.0, y: 1.8, w: 4.4, h: 2.0, fill: { color: colors.codeBg }, line: { color: colors.grayLight, width: 1 } });
const code1 = `colleges = [
  ("IIT Bombay", "Mumbai", "A++"),
  ("IIT Delhi", "New Delhi", "A++"),
  ...211 more colleges
]

for each college:
  calculate placement_rate
  calculate avg_package
  ...25 more metrics`;
slide3.addText(code1, { x: 5.1, y: 1.9, w: 4.2, h: 1.8, fontSize: 11, fontFace: "Courier New", color: colors.black });

slide3.addShape(pres.ShapeType.rect, { x: 5.0, y: 4.0, w: 4.4, h: 1.3, fill: { color: colors.yellow } });
slide3.addText("💡 Why This Matters", { x: 5.2, y: 4.1, w: 4.0, h: 0.3, fontSize: 14, bold: true, color: colors.black });
slide3.addText("We created a comprehensive dataset covering every important factor students care about when choosing a college.", {
  x: 5.2, y: 4.5, w: 4.0, h: 0.7, fontSize: 12, color: colors.black
});

// Bottom: Output
slide3.addShape(pres.ShapeType.rect, { x: 0.6, y: 5.5, w: 8.8, h: 0.8, fill: { color: colors.green } });
slide3.addText("📁 Output: indian_colleges_dataset.csv → 213 colleges × 27 metrics", {
  x: 0.8, y: 5.7, w: 8.4, h: 0.4, fontSize: 16, bold: true, color: colors.white, align: "center"
});

// SLIDE 4: DATA CLEANING EXPLAINED
let slide4 = pres.addSlide();
slide4.background = { fill: colors.mint };
slide4.addText("Step 2: Data Cleaning", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: colors.black
});

// Problems found
slide4.addText("Problems We Found", { x: 0.6, y: 1.3, w: 4.0, h: 0.4, fontSize: 18, bold: true, color: colors.red });
slide4.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.8, w: 4.0, h: 2.2, fill: { color: colors.white }, line: { color: colors.red, width: 2 } });
slide4.addText("❌ 2 duplicate colleges\n\n❌ Inconsistent state names:\n   'Maharashtra' vs 'MH'\n\n❌ Missing values (~5%)\n\n❌ Outliers in salary data", {
  x: 0.8, y: 2.0, w: 3.6, h: 1.8, fontSize: 13, color: colors.black
});

// Solutions applied
slide4.addText("How We Fixed It", { x: 5.0, y: 1.3, w: 4.4, h: 0.4, fontSize: 18, bold: true, color: colors.green });
slide4.addShape(pres.ShapeType.rect, { x: 5.0, y: 1.8, w: 4.4, h: 2.2, fill: { color: colors.codeBg }, line: { color: colors.green, width: 2 } });
const code2 = `1. Remove duplicates
   213 → 211 colleges ✓

2. Standardize names
   'MH' → 'Maharashtra' ✓

3. Fill missing values
   Use median values ✓

4. Remove extreme outliers
   Keep realistic data ✓`;
slide4.addText(code2, { x: 5.2, y: 1.9, w: 4.0, h: 1.8, fontSize: 12, fontFace: "Courier New", color: colors.black });

// Visual: Before vs After
slide4.addText("Before vs After", { x: 0.6, y: 4.2, w: 8.8, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });
slide4.addShape(pres.ShapeType.rect, { x: 1.5, y: 4.8, w: 3.0, h: 0.8, fill: { color: colors.red } });
slide4.addText("BEFORE\n213 colleges\n~5% issues", { x: 1.5, y: 4.9, w: 3.0, h: 0.6, fontSize: 14, bold: true, color: colors.white, align: "center" });

slide4.addShape(pres.ShapeType.rightArrow, { x: 4.7, y: 5.0, w: 0.6, h: 0.4, fill: { color: colors.black } });

slide4.addShape(pres.ShapeType.rect, { x: 5.5, y: 4.8, w: 3.0, h: 0.8, fill: { color: colors.green } });
slide4.addText("AFTER\n211 colleges\n100% clean", { x: 5.5, y: 4.9, w: 3.0, h: 0.6, fontSize: 14, bold: true, color: colors.white, align: "center" });

// Bottom result
slide4.addShape(pres.ShapeType.rect, { x: 0.6, y: 5.8, w: 8.8, h: 0.6, fill: { color: colors.green } });
slide4.addText("✅ Result: 99.1% data retention with 100% quality", {
  x: 0.8, y: 5.9, w: 8.4, h: 0.4, fontSize: 16, bold: true, color: colors.white, align: "center"
});

// SLIDE 5: SCORING MODEL EXPLAINED
let slide5 = pres.addSlide();
slide5.background = { fill: colors.yellow };
slide5.addText("Step 3: Creating the Scoring System", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: colors.black
});

// Left: The formula
slide5.addText("Our Scoring Formula", { x: 0.6, y: 1.3, w: 4.0, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });
slide5.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.8, w: 4.0, h: 3.8, fill: { color: colors.white }, line: { color: colors.ibmBlue, width: 2 } });

const scoringComponents = [
  { label: "Placement Rate", weight: "25%", color: colors.green },
  { label: "Average Package", weight: "20%", color: colors.ibmBlue },
  { label: "NAAC Grade", weight: "15%", color: colors.purple },
  { label: "Faculty Ratio", weight: "10%", color: colors.orange },
  { label: "Infrastructure", weight: "10%", color: colors.cyan },
  { label: "Companies Visiting", weight: "10%", color: colors.mint },
  { label: "Selectivity", weight: "10%", color: colors.red }
];

let yPos = 2.0;
scoringComponents.forEach((comp, i) => {
  slide5.addShape(pres.ShapeType.rect, { x: 0.8, y: yPos, w: 0.4, h: 0.4, fill: { color: comp.color } });
  slide5.addText(comp.label, { x: 1.3, y: yPos, w: 2.2, h: 0.4, fontSize: 12, color: colors.black, valign: "middle" });
  slide5.addText(comp.weight, { x: 3.6, y: yPos, w: 0.8, h: 0.4, fontSize: 12, bold: true, color: colors.black, valign: "middle", align: "right" });
  yPos += 0.5;
});

slide5.addText("= Score (0-100)", { x: 0.8, y: yPos + 0.1, w: 3.6, h: 0.4, fontSize: 14, bold: true, color: colors.ibmBlue, align: "center" });

// Right: How it works
slide5.addText("How It Works", { x: 5.0, y: 1.3, w: 4.4, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });
slide5.addShape(pres.ShapeType.rect, { x: 5.0, y: 1.8, w: 4.4, h: 2.5, fill: { color: colors.codeBg } });

const steps = [
  "1️⃣ Normalize all metrics to 0-1 scale",
  "2️⃣ Apply weights to each component",
  "3️⃣ Sum up to get final score (0-100)",
  "4️⃣ Assign tier based on score:"
];
steps.forEach((step, i) => {
  slide5.addText(step, { x: 5.2, y: 1.9 + (i * 0.4), w: 4.0, h: 0.35, fontSize: 13, color: colors.black, bold: i === 3 });
});

// Tier breakdown
const tiers = [
  { label: "Tier 1", range: "75-100", color: colors.green },
  { label: "Tier 2", range: "55-74", color: colors.ibmBlue },
  { label: "Tier 3", range: "35-54", color: colors.orange },
  { label: "Tier 4", range: "0-34", color: colors.red }
];
tiers.forEach((tier, i) => {
  slide5.addShape(pres.ShapeType.rect, { x: 5.4, y: 3.5 + (i * 0.35), w: 1.2, h: 0.3, fill: { color: tier.color } });
  slide5.addText(tier.label, { x: 5.4, y: 3.5 + (i * 0.35), w: 1.2, h: 0.3, fontSize: 11, bold: true, color: colors.white, align: "center", valign: "middle" });
  slide5.addText(tier.range, { x: 6.7, y: 3.5 + (i * 0.35), w: 1.0, h: 0.3, fontSize: 11, color: colors.black, valign: "middle" });
});

// Why this matters
slide5.addShape(pres.ShapeType.rect, { x: 5.0, y: 4.9, w: 4.4, h: 1.3, fill: { color: colors.mint } });
slide5.addText("💡 Why This Matters", { x: 5.2, y: 5.0, w: 4.0, h: 0.3, fontSize: 14, bold: true, color: colors.black });
slide5.addText("Students can now compare colleges objectively using a single score that considers all important factors.", {
  x: 5.2, y: 5.4, w: 4.0, h: 0.7, fontSize: 12, color: colors.black
});

// SLIDE 6: RESULTS VISUALIZATION
let slide6 = pres.addSlide();
slide6.background = { fill: colors.cyan };
slide6.addText("The Results: College Distribution", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: colors.black
});

// Big numbers
const results = [
  { label: "Tier 1\nTop Performers", value: "10", color: colors.green, desc: "IITs, IISc, BITS" },
  { label: "Tier 2\nStrong Colleges", value: "85", color: colors.ibmBlue, desc: "NITs, Top Private" },
  { label: "Tier 3\nGood Options", value: "107", color: colors.orange, desc: "State Universities" },
  { label: "Tier 4\nEmerging", value: "9", color: colors.red, desc: "New Institutions" }
];

results.forEach((r, i) => {
  const x = 0.6 + (i * 2.3);
  slide6.addShape(pres.ShapeType.rect, { x: x, y: 1.5, w: 2.0, h: 2.0, fill: { color: r.color }, line: { color: colors.white, width: 3 } });
  slide6.addText(r.value, { x: x, y: 1.7, w: 2.0, h: 0.8, fontSize: 56, bold: true, color: colors.white, align: "center" });
  slide6.addText(r.label, { x: x, y: 2.6, w: 2.0, h: 0.6, fontSize: 13, bold: true, color: colors.white, align: "center" });
  slide6.addText(r.desc, { x: x, y: 3.6, w: 2.0, h: 0.4, fontSize: 11, color: colors.black, align: "center", italic: true });
});

// Key insights
slide6.addText("Key Insights", { x: 0.6, y: 4.2, w: 8.8, h: 0.4, fontSize: 20, bold: true, color: colors.ibmBlue });
slide6.addShape(pres.ShapeType.rect, { x: 0.6, y: 4.7, w: 8.8, h: 1.5, fill: { color: colors.white } });

const insights = [
  "📊 Average Score: 53.5/100 across all colleges",
  "💼 Average Placement Rate: 69% (varies by tier)",
  "💰 Average Package: ₹9.17 LPA (Tier 1: ₹18+ LPA)",
  "🏛️ Government colleges dominate Tier 1 & 2"
];
insights.forEach((insight, i) => {
  slide6.addText(insight, { x: 0.8, y: 4.8 + (i * 0.35), w: 8.4, h: 0.3, fontSize: 13, color: colors.black });
});

// SLIDE 7: REAL EXAMPLE
let slide7 = pres.addSlide();
slide7.background = { fill: colors.mint };
slide7.addText("Real Example: IIT Bombay", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: colors.black
});

// College card
slide7.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.3, w: 4.0, h: 1.5, fill: { color: colors.white }, line: { color: colors.green, width: 3 } });
slide7.addText("🏛️ IIT Bombay", { x: 0.8, y: 1.5, w: 3.6, h: 0.4, fontSize: 20, bold: true, color: colors.black });
slide7.addText("Mumbai, Maharashtra", { x: 0.8, y: 1.9, w: 3.6, h: 0.3, fontSize: 14, color: colors.black });
slide7.addShape(pres.ShapeType.rect, { x: 0.8, y: 2.3, w: 1.0, h: 0.4, fill: { color: colors.green } });
slide7.addText("Tier 1", { x: 0.8, y: 2.3, w: 1.0, h: 0.4, fontSize: 14, bold: true, color: colors.white, align: "center", valign: "middle" });
slide7.addText("Score: 97.0/100", { x: 2.0, y: 2.3, w: 2.2, h: 0.4, fontSize: 16, bold: true, color: colors.green, valign: "middle" });

// Score breakdown with visual bars
slide7.addText("Score Breakdown", { x: 5.0, y: 1.3, w: 4.4, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });

const breakdown = [
  { label: "Placement", score: 23.8, max: 25, color: colors.green },
  { label: "Package", score: 19.2, max: 20, color: colors.ibmBlue },
  { label: "NAAC Grade", score: 15.0, max: 15, color: colors.purple },
  { label: "Faculty Ratio", score: 9.5, max: 10, color: colors.orange },
  { label: "Infrastructure", score: 9.8, max: 10, color: colors.cyan },
  { label: "Companies", score: 9.7, max: 10, color: colors.mint },
  { label: "Selectivity", score: 10.0, max: 10, color: colors.red }
];

let barY = 1.8;
breakdown.forEach((item) => {
  slide7.addText(item.label, { x: 5.0, y: barY, w: 1.5, h: 0.3, fontSize: 11, color: colors.black, valign: "middle" });
  
  // Background bar
  slide7.addShape(pres.ShapeType.rect, { x: 6.6, y: barY + 0.05, w: 2.5, h: 0.2, fill: { color: colors.grayLight } });
  
  // Filled bar
  const fillWidth = (item.score / item.max) * 2.5;
  slide7.addShape(pres.ShapeType.rect, { x: 6.6, y: barY + 0.05, w: fillWidth, h: 0.2, fill: { color: item.color } });
  
  // Score text
  slide7.addText(`${item.score}/${item.max}`, { x: 9.2, y: barY, w: 0.6, h: 0.3, fontSize: 10, bold: true, color: colors.black, valign: "middle" });
  
  barY += 0.4;
});

// Why this college scored high
slide7.addText("Why IIT Bombay Scored 97/100", { x: 0.6, y: 3.0, w: 8.8, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });
slide7.addShape(pres.ShapeType.rect, { x: 0.6, y: 3.5, w: 8.8, h: 2.7, fill: { color: colors.yellow } });

const reasons = [
  "✅ 95%+ placement rate (nearly every student gets placed)",
  "✅ ₹18.5 LPA average package (among highest in India)",
  "✅ A++ NAAC grade (highest accreditation)",
  "✅ Excellent faculty ratio (1:12 - personalized attention)",
  "✅ World-class infrastructure and facilities",
  "✅ 200+ top companies visit for recruitment",
  "✅ Highly selective (only top JEE Advanced rankers)"
];

reasons.forEach((reason, i) => {
  slide7.addText(reason, { x: 0.8, y: 3.6 + (i * 0.35), w: 8.4, h: 0.3, fontSize: 12, color: colors.black });
});

// SLIDE 8: HOW WE USE THIS DATA
let slide8 = pres.addSlide();
slide8.background = { fill: colors.blue };
slide8.addText("How We Use This Data", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: colors.black
});

// Three use cases
const useCases = [
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Students can filter by:\n• Score range\n• Location\n• Tier\n• College type",
    color: colors.mint
  },
  {
    icon: "📊",
    title: "Compare Colleges",
    desc: "Side-by-side comparison:\n• Scores\n• Placement rates\n• Packages\n• Facilities",
    color: colors.yellow
  },
  {
    icon: "💡",
    title: "Recommendations",
    desc: "Personalized suggestions:\n• Based on preferences\n• Budget constraints\n• Location needs\n• Career goals",
    color: colors.cyan
  }
];

useCases.forEach((uc, i) => {
  const x = 0.6 + (i * 3.0);
  slide8.addShape(pres.ShapeType.rect, { x: x, y: 1.5, w: 2.8, h: 3.0, fill: { color: uc.color }, line: { color: colors.white, width: 2 } });
  slide8.addText(uc.icon, { x: x, y: 1.7, w: 2.8, h: 0.6, fontSize: 48, align: "center" });
  slide8.addText(uc.title, { x: x, y: 2.4, w: 2.8, h: 0.4, fontSize: 18, bold: true, color: colors.black, align: "center" });
  slide8.addText(uc.desc, { x: x + 0.2, y: 2.9, w: 2.4, h: 1.4, fontSize: 12, color: colors.black });
});

// Bottom: Business impact
slide8.addShape(pres.ShapeType.rect, { x: 0.6, y: 4.8, w: 8.8, h: 1.5, fill: { color: colors.white } });
slide8.addText("Business Impact", { x: 0.8, y: 4.9, w: 8.4, h: 0.4, fontSize: 18, bold: true, color: colors.ibmBlue });
slide8.addText("✓ Better user experience → Higher engagement\n✓ Data-driven decisions → More trust\n✓ Objective rankings → Reduced bias\n✓ Comprehensive coverage → One-stop solution", {
  x: 0.8, y: 5.4, w: 8.4, h: 0.8, fontSize: 13, color: colors.black
});

// SLIDE 9: DATA QUALITY
let slide9 = pres.addSlide();
slide9.background = { fill: colors.cream };
slide9.addText("Data Quality & Reliability", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 28, bold: true, color: colors.black
});

// Quality metrics
const qualityMetrics = [
  { label: "Data Retention", value: "99.1%", icon: "✅", color: colors.green },
  { label: "Colleges Covered", value: "211", icon: "🏛️", color: colors.ibmBlue },
  { label: "States Covered", value: "31", icon: "🗺️", color: colors.orange },
  { label: "Metrics per College", value: "27", icon: "📊", color: colors.purple }
];

qualityMetrics.forEach((m, i) => {
  const x = 0.6 + (i * 2.3);
  slide9.addShape(pres.ShapeType.rect, { x: x, y: 1.5, w: 2.0, h: 1.5, fill: { color: m.color } });
  slide9.addText(m.icon, { x: x, y: 1.6, w: 2.0, h: 0.5, fontSize: 36, align: "center" });
  slide9.addText(m.value, { x: x, y: 2.2, w: 2.0, h: 0.4, fontSize: 32, bold: true, color: colors.white, align: "center" });
  slide9.addText(m.label, { x: x, y: 2.7, w: 2.0, h: 0.3, fontSize: 12, color: colors.white, align: "center" });
});

// Strengths vs Limitations
slide9.addText("Strengths", { x: 0.6, y: 3.3, w: 4.0, h: 0.4, fontSize: 18, bold: true, color: colors.green });
slide9.addShape(pres.ShapeType.rect, { x: 0.6, y: 3.8, w: 4.0, h: 2.4, fill: { color: colors.white }, line: { color: colors.green, width: 2 } });
["✓ Comprehensive coverage", "✓ Objective scoring", "✓ Regular updates possible", "✓ Multiple data points", "✓ Transparent methodology", "✓ Easy to understand"].forEach((s, i) => {
  slide9.addText(s, { x: 0.8, y: 3.9 + (i * 0.35), w: 3.6, h: 0.3, fontSize: 12, color: colors.black });
});

slide9.addText("Areas for Improvement", { x: 5.4, y: 3.3, w: 4.0, h: 0.4, fontSize: 18, bold: true, color: colors.orange });
slide9.addShape(pres.ShapeType.rect, { x: 5.4, y: 3.8, w: 4.0, h: 2.4, fill: { color: colors.white }, line: { color: colors.orange, width: 2 } });
["⚠ Need real-time data feeds", "⚠ Add student reviews", "⚠ Include alumni success", "⚠ Track placement trends", "⚠ Add international colleges", "⚠ Integrate official APIs"].forEach((l, i) => {
  slide9.addText(l, { x: 5.6, y: 3.9 + (i * 0.35), w: 3.6, h: 0.3, fontSize: 12, color: colors.black });
});

// SLIDE 10: NEXT STEPS
let slide10 = pres.addSlide();
slide10.background = { fill: colors.ibmBlue };
slide10.addText("Next Steps & Recommendations", {
  x: 0.5, y: 1.0, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, align: "center"
});

const nextSteps = [
  { phase: "Immediate", items: ["✓ Launch with current 211 colleges", "✓ Monitor user feedback", "✓ Track search patterns"] },
  { phase: "Short-term (3 months)", items: ["✓ Add 100+ more colleges", "✓ Integrate student reviews", "✓ Add comparison tool"] },
  { phase: "Long-term (6-12 months)", items: ["✓ Real-time data updates", "✓ ML-based recommendations", "✓ Mobile app launch"] }
];

let stepY = 2.0;
nextSteps.forEach((step, i) => {
  slide10.addShape(pres.ShapeType.rect, { x: 1.5, y: stepY, w: 7, h: 1.2, fill: { color: colors.white } });
  slide10.addText(step.phase, { x: 1.7, y: stepY + 0.1, w: 6.6, h: 0.3, fontSize: 16, bold: true, color: colors.ibmBlue });
  step.items.forEach((item, j) => {
    slide10.addText(item, { x: 1.7, y: stepY + 0.5 + (j * 0.25), w: 6.6, h: 0.2, fontSize: 12, color: colors.black });
  });
  stepY += 1.4;
});

// SLIDE 11: THANK YOU
let slide11 = pres.addSlide();
slide11.background = { fill: colors.green };
slide11.addText("Thank You", {
  x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 48, bold: true, color: colors.white, align: "center"
});
slide11.addText("Questions?", {
  x: 0.5, y: 3.0, w: 9, h: 0.5, fontSize: 28, color: colors.white, align: "center"
});
slide11.addShape(pres.ShapeType.rect, { x: 2.0, y: 4.0, w: 6, h: 1.5, fill: { color: colors.white } });
slide11.addText("📊 Data Analytics Team\n📧 analytics@reactcampus.com\n🌐 www.reactcampus.com", {
  x: 2.2, y: 4.2, w: 5.6, h: 1.1, fontSize: 14, color: colors.black, align: "center"
});

pres.writeFile({ fileName: "ReactCampus-Business-Presentation.pptx" });
console.log("✅ Business-friendly PowerPoint generated: ReactCampus-Business-Presentation.pptx");
