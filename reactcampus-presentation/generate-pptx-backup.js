import pptxgen from "pptxgenjs";

// Create presentation
let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Senior Data Analyst & Engineer";
pres.company = "ReactCampus";
pres.subject = "Technical Deep Dive - Data Pipeline & Architecture";
pres.title = "ReactCampus: Technical Implementation Analysis";

// Define color palette (IBM PPT Pastel Colors + Code colors)
const colors = {
  mint: "DEFBE6",
  cream: "F7F3F2",
  yellow: "FCF4D6",
  blue: "E5F6FF",
  grayLight: "C6C6C6",
  grayVLight: "F4F4F4",
  sky: "BAE6FF",
  cyan: "D9FBFB",
  white: "FFFFFF",
  black: "000000",
  ibmBlue: "0f62fe",
  ibmBlueDark: "0043ce",
  codeGray: "2D2D2D",
  green: "24A148",
  orange: "FF832B"
};

// Define text styles
const styles = {
  coverTitle: { fontSize: 42, bold: true, color: colors.white },
  coverSubtitle: { fontSize: 18, color: colors.white },
  coverMeta: { fontSize: 14, color: colors.white },
  contentTitle: { fontSize: 24, bold: true, color: colors.black },
  bodyText: { fontSize: 16, color: colors.black },
  largeNumber: { fontSize: 56, bold: true, color: colors.black },
  caption: { fontSize: 14, color: colors.black }
};

// ===== SLIDE 1: TECHNICAL COVER =====
let slide1 = pres.addSlide();
slide1.background = { fill: colors.ibmBlue };
slide1.addText("TECHNICAL DEEP DIVE", {
  x: 0.5, y: 1.8, w: 9, h: 0.4,
  fontSize: 14, color: colors.white, align: "center", bold: true
});
slide1.addText("ReactCampus Data Pipeline", {
  x: 0.5, y: 2.3, w: 9, h: 0.8,
  fontSize: 42, bold: true, color: colors.white, align: "center"
});
slide1.addText("From Synthetic Data Generation to Production API", {
  x: 0.5, y: 3.2, w: 9, h: 0.4,
  fontSize: 18, color: colors.white, align: "center"
});
slide1.addText("Python • Pandas • Scikit-learn • MongoDB • Node.js • React", {
  x: 0.5, y: 4.2, w: 9, h: 0.3,
  fontSize: 14, color: colors.white, align: "center"
});

// ===== SLIDE 2: PROBLEM & ARCHITECTURE =====
let slide2 = pres.addSlide();
slide2.background = { fill: colors.white };
slide2.addText("Problem Statement & System Architecture", {
  x: 0.6, y: 0.4, w: 8.8, h: 0.5,
  fontSize: 32, bold: true, color: colors.black
});

slide2.addText("Challenge", { x: 0.6, y: 1.1, w: 4.2, h: 0.3, fontSize: 16, bold: true, color: colors.black });
slide2.addText("Build a data-driven college discovery platform with intelligent scoring and recommendations", {
  x: 0.6, y: 1.5, w: 4.2, h: 0.8, fontSize: 14, color: colors.black
});

slide2.addText("Solution Architecture", { x: 5.2, y: 1.1, w: 4.2, h: 0.3, fontSize: 16, bold: true, color: colors.black });
const archItems = [
  "1. Data Generation (Python)",
  "2. ETL Pipeline (Pandas)",
  "3. ML Scoring (Scikit-learn)",
  "4. Database (MongoDB)",
  "5. REST API (Express)",
  "6. Frontend (React + TypeScript)"
];
archItems.forEach((item, i) => {
  slide2.addText(item, {
    x: 5.2, y: 1.5 + (i * 0.3), w: 4.2, h: 0.25,
    fontSize: 13, color: colors.black
  });
});

slide2.addShape(pres.ShapeType.rect, {
  x: 0.6, y: 3.0, w: 8.8, h: 2.0,
  fill: { color: colors.grayVLight }
});
slide2.addText("Tech Stack", { x: 0.8, y: 3.2, w: 8.4, h: 0.3, fontSize: 14, bold: true });
slide2.addText("Data Layer: Python 3.11, Pandas 2.0, NumPy, Scikit-learn, Matplotlib, Seaborn", {
  x: 0.8, y: 3.6, w: 8.4, h: 0.3, fontSize: 12
});
slide2.addText("Backend: Node.js 18, Express 4.18, Mongoose 8.0, JWT, Bcrypt", {
  x: 0.8, y: 4.0, w: 8.4, h: 0.3, fontSize: 12
});
slide2.addText("Frontend: React 18, TypeScript, Vite, TanStack Query, Zustand", {
  x: 0.8, y: 4.4, w: 8.4, h: 0.3, fontSize: 12
});
slide2.addText("Database: MongoDB 7.0 with geospatial indexing, text search, aggregation pipelines", {
  x: 0.8, y: 4.8, w: 8.4, h: 0.3, fontSize: 12
});

// ===== SLIDE 3: DATA GENERATION CODE =====
let slide3 = pres.addSlide();
slide3.background = { fill: colors.cream };
slide3.addText("Step 1: Synthetic Data Generation", {
  x: 0.6, y: 0.4, w: 8.8, h: 0.5,
  fontSize: 32, bold: true, color: colors.black
});
slide3.addText("File: data-analysis/scripts/create_dataset.py", {
  x: 0.6, y: 0.95, w: 8.8, h: 0.25,
  fontSize: 12, color: colors.black, italic: true
});

// Code block
slide3.addShape(pres.ShapeType.rect, {
  x: 0.6, y: 1.3, w: 8.8, h: 3.5,
  fill: { color: colors.codeGray }
});

const codeLines = [
  "# Generate realistic college data with intentional quality issues",
  "import random",
  "random.seed(42)  # Reproducibility",
  "",
  "def generate_row(idx, college):",
  "    name, city, state, type_val, estd, naac, exam, intake = college",
  "    tier = get_tier(name, type_val, naac, intake)",
  "    ",
  "    # Fee ranges by type and prestige",
  "    fee_range = FEE_RANGES.get(f'{type_val}_{tier}')",
  "    avg_fee = random.randint(*fee_range)",
  "    ",
  "    # Deliberately introduce missing values (~5% missing)",
  "    if random.random() < 0.05:",
  "        avg_fee = None",
  "    ",
  "    # State name inconsistencies (~3%)",
  "    if random.random() < 0.03:",
  "        state_val = {'Delhi': 'New Delhi', 'Tamil Nadu': 'Tamilnadu'}",
  "    ",
  "    return {...}  # 27 features total"
];

codeLines.forEach((line, i) => {
  const isComment = line.trim().startsWith('#');
  slide3.addText(line, {
    x: 0.8, y: 1.45 + (i * 0.17), w: 8.4, h: 0.15,
    fontSize: 10, fontFace: "Courier New",
    color: isComment ? colors.green : colors.white
  });
});

slide3.addText("Output: 213 rows × 27 columns (includes 2 intentional duplicates)", {
  x: 0.6, y: 5.0, w: 8.8, h: 0.25, fontSize: 13, bold: true, color: colors.ibmBlue
});

// ===== SLIDE 4: KEY METRICS =====
let slide4 = pres.addSlide();
slide6.background = { fill: colors.white };
slide6.addText("Dataset Overview", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  fontSize: 24, bold: true, color: colors.black
});

const metrics = [
  { value: "211", label: "Colleges Analyzed" },
  { value: "31", label: "States Covered" },
  { value: "27", label: "Data Features" },
  { value: "99.1%", label: "Data Retention Rate" }
];

metrics.forEach((metric, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.6 + (col * 4.7);
  const y = 1.5 + (row * 1.8);
  
  slide6.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 4.4, h: 1.5,
    fill: { color: colors.sky }
  });
  slide6.addText(metric.value, {
    x: x, y: y + 0.2, w: 4.4, h: 0.8,
    fontSize: 56, bold: true, color: colors.black, align: "center"
  });
  slide6.addText(metric.label, {
    x: x, y: y + 1.0, w: 4.4, h: 0.3,
    fontSize: 18, color: colors.black, align: "center"
  });
});

// ===== SLIDE 5: DATA SOURCES =====
let slide6 = pres.addSlide();
slide6.background = { fill: colors.blue };
slide6.addText("Data Sources & Architecture", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  fontSize: 24, bold: true, color: colors.black
});

slide6.addText("Primary Sources", {
  x: 0.6, y: 1.3, w: 4.2, h: 0.4,
  fontSize: 20, bold: true, color: colors.black
});
const sources = [
  "Synthetic college dataset (CSV)",
  "Python analysis outputs (JSON)",
  "MongoDB collections (14+)",
  "User-generated content"
];
sources.forEach((source, i) => {
  slide6.addText(`• ${source}`, {
    x: 0.6, y: 1.8 + (i * 0.4), w: 4.2, h: 0.3,
    fontSize: 16, color: colors.black
  });
});

slide6.addText("Tech Stack", {
  x: 5.2, y: 1.3, w: 4.2, h: 0.4,
  fontSize: 20, bold: true, color: colors.black
});
const techStack = [
  "Python: Pandas, Scikit-learn",
  "MongoDB with geospatial indexing",
  "Node.js + Express REST API",
  "React frontend with TypeScript"
];
techStack.forEach((tech, i) => {
  slide6.addText(`• ${tech}`, {
    x: 5.2, y: 1.8 + (i * 0.4), w: 4.2, h: 0.3,
    fontSize: 16, color: colors.black
  });
});

// ===== SLIDE 5: SECTION DIVIDER =====
let slide6 = pres.addSlide();
slide6.background = { fill: colors.cyan };
slide6.addText("01", {
  x: 0.5, y: 1.5, w: 9, h: 1.0,
  fontSize: 72, bold: true, color: colors.ibmBlue, align: "center", transparency: 70
});
slide6.addText("Data Flow Architecture", {
  x: 0.5, y: 2.5, w: 9, h: 0.8,
  fontSize: 42, bold: true, color: colors.black, align: "center"
});
slide6.addText("From raw data to actionable insights", {
  x: 0.5, y: 3.5, w: 9, h: 0.4,
  fontSize: 18, color: colors.black, align: "center"
});

// ===== SLIDE 6: DATA PIPELINE =====
let slide6 = pres.addSlide();
slide6.background = { fill: colors.yellow };
slide6.addText("7-Stage Data Pipeline", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

const pipeline = [
  { title: "Data Generation", desc: "Create synthetic dataset" },
  { title: "Data Cleaning", desc: "Remove duplicates" },
  { title: "EDA & Analysis", desc: "Statistical analysis" },
  { title: "Scoring Model", desc: "7-component algorithm" },
  { title: "JSON Export", desc: "Export scores" },
  { title: "Database Seeding", desc: "Import to MongoDB" },
  { title: "API & Frontend", desc: "Serve via REST API" }
];

pipeline.forEach((stage, i) => {
  const x = 0.3 + (i * 1.35);
  
  // Circle
  slide6.addShape(pres.ShapeType.ellipse, {
    x: x, y: 1.5, w: 0.6, h: 0.6,
    fill: { color: colors.white },
    line: { color: colors.ibmBlue, width: 3 }
  });
  slide6.addText((i + 1).toString(), {
    x: x, y: 1.5, w: 0.6, h: 0.6,
    fontSize: 24, bold: true, color: colors.ibmBlue, align: "center", valign: "middle"
  });
  
  // Connector line
  if (i < pipeline.length - 1) {
    slide6.addShape(pres.ShapeType.line, {
      x: x + 0.6, y: 1.8, w: 0.75, h: 0,
      line: { color: colors.ibmBlue, width: 3 }
    });
  }
  
  // Text
  slide6.addText(stage.title, {
    x: x - 0.3, y: 2.3, w: 1.2, h: 0.3,
    fontSize: 14, bold: true, color: colors.black, align: "center"
  });
  slide6.addText(stage.desc, {
    x: x - 0.3, y: 2.6, w: 1.2, h: 0.4,
    fontSize: 12, color: colors.black, align: "center"
  });
});

// ===== SLIDE 7: DATA MODELS =====
let slide7 = pres.addSlide();
slide7.background = { fill: colors.white };
slide7.addText("Core Data Models (14 Collections)", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

const models = [
  { title: "College", desc: "Core schema with score, tier, geospatial data" },
  { title: "User", desc: "RBAC with roles and permissions" },
  { title: "Lead", desc: "Lead tracking with status pipeline" },
  { title: "Review", desc: "User reviews with moderation workflow" },
  { title: "DynamicForm", desc: "Customizable forms with validation" },
  { title: "ContentSection", desc: "CMS for dynamic page content" }
];

models.forEach((model, i) => {
  slide7.addText(`→ ${model.title}`, {
    x: 0.6, y: 1.5 + (i * 0.6), w: 2.5, h: 0.4,
    fontSize: 18, bold: true, color: colors.black
  });
  slide7.addText(`— ${model.desc}`, {
    x: 3.2, y: 1.5 + (i * 0.6), w: 6.2, h: 0.4,
    fontSize: 18, color: colors.black
  });
});

// ===== SLIDE 8: SCORING ALGORITHM =====
let slide8 = pres.addSlide();
slide8.background = { fill: colors.blue };
slide8.addText("College Scoring Model", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

slide8.addText("7-Component Algorithm", {
  x: 0.6, y: 1.3, w: 5.5, h: 0.4,
  fontSize: 20, bold: true, color: colors.black
});
const components = [
  "Placement Rate: 25%",
  "Average Package: 20%",
  "NAAC Grade: 15%",
  "Faculty Ratio: 15%",
  "Infrastructure: 10%",
  "Research Output: 10%",
  "Student Satisfaction: 5%"
];
components.forEach((comp, i) => {
  slide8.addText(`• ${comp}`, {
    x: 0.6, y: 1.8 + (i * 0.35), w: 5.5, h: 0.3,
    fontSize: 16, color: colors.black
  });
});

slide8.addText("Tier Classification", {
  x: 6.3, y: 1.3, w: 3.1, h: 0.4,
  fontSize: 20, bold: true, color: colors.black
});
const tiers = [
  "Tier 1: Score ≥ 80",
  "Tier 2: 60-79",
  "Tier 3: 40-59",
  "Tier 4: < 40"
];
tiers.forEach((tier, i) => {
  slide8.addText(`• ${tier}`, {
    x: 6.3, y: 1.8 + (i * 0.35), w: 3.1, h: 0.3,
    fontSize: 16, color: colors.black
  });
});

// ===== SLIDE 9: SECTION DIVIDER =====
let slide9 = pres.addSlide();
slide9.background = { fill: colors.cyan };
slide9.addText("02", {
  x: 0.5, y: 1.5, w: 9, h: 1.0,
  fontSize: 72, bold: true, color: colors.ibmBlue, align: "center", transparency: 70
});
slide9.addText("Data Usage & Analytics", {
  x: 0.5, y: 2.5, w: 9, h: 0.8,
  fontSize: 42, bold: true, color: colors.black, align: "center"
});
slide9.addText("How data drives business decisions", {
  x: 0.5, y: 3.5, w: 9, h: 0.4,
  fontSize: 18, color: colors.black, align: "center"
});

// ===== SLIDE 10: DATA USAGE PATTERNS =====
let slide10 = pres.addSlide();
slide10.background = { fill: colors.mint };
slide10.addText("Key Data Usage Patterns", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

const usagePatterns = [
  { icon: "🔍", title: "Search & Discovery", desc: "Full-text search, filters by location, type, fees, and tier" },
  { icon: "📈", title: "Lead Management", desc: "Track leads through new → contacted → qualified → converted" },
  { icon: "⭐", title: "Review System", desc: "User reviews with moderation and sentiment analysis" },
  { icon: "📊", title: "Analytics Dashboard", desc: "Aggregation pipelines for real-time business intelligence" }
];

usagePatterns.forEach((item, i) => {
  const yPos = 1.5 + (i * 1.0);
  slide10.addShape(pres.ShapeType.rect, {
    x: 0.6, y: yPos, w: 8.8, h: 0.85,
    fill: { color: colors.white }
  });
  slide10.addText(item.icon, {
    x: 0.8, y: yPos + 0.1, w: 0.5, h: 0.5,
    fontSize: 28, align: "center"
  });
  slide10.addText(item.title, {
    x: 1.5, y: yPos + 0.1, w: 7.0, h: 0.3,
    fontSize: 18, bold: true, color: colors.black
  });
  slide10.addText(item.desc, {
    x: 1.5, y: yPos + 0.45, w: 7.0, h: 0.3,
    fontSize: 16, color: colors.black
  });
});

// ===== SLIDE 11: ANALYTICS CAPABILITIES =====
let slide11 = pres.addSlide();
slide11.background = { fill: colors.white };
slide11.addText("Current Analytics Implementation", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

const analyticsMetrics = [
  { value: "50+", label: "RBAC Permissions" },
  { value: "14", label: "REST API Endpoints" },
  { value: "7", label: "Aggregation Pipelines" },
  { value: "100%", label: "Audit Log Coverage" }
];

analyticsMetrics.forEach((metric, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.6 + (col * 4.7);
  const y = 1.5 + (row * 1.8);
  
  slide11.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 4.4, h: 1.5,
    fill: { color: colors.sky }
  });
  slide11.addText(metric.value, {
    x: x, y: y + 0.2, w: 4.4, h: 0.8,
    ...styles.largeNumber, align: "center"
  });
  slide11.addText(metric.label, {
    x: x, y: y + 1.0, w: 4.4, h: 0.3,
    fontSize: 18, color: colors.black, align: "center"
  });
});

// ===== SLIDE 12: SECTION DIVIDER =====
let slide12 = pres.addSlide();
slide12.background = { fill: colors.cyan };
slide12.addText("03", {
  x: 0.5, y: 1.5, w: 9, h: 1.0,
  fontSize: 72, bold: true, color: colors.ibmBlue, align: "center", transparency: 70
});
slide12.addText("Data Analyst Focus Areas", {
  x: 0.5, y: 2.5, w: 9, h: 0.8,
  fontSize: 42, bold: true, color: colors.black, align: "center"
});
slide12.addText("Priority initiatives and recommendations", {
  x: 0.5, y: 3.5, w: 9, h: 0.4,
  fontSize: 18, color: colors.black, align: "center"
});

// ===== SLIDE 13: FOCUS AREAS =====
let slide13 = pres.addSlide();
slide13.background = { fill: colors.cream };
slide13.addText("Data Analyst Priority Areas", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

const focusAreas = [
  { title: "Scoring Model Validation", desc: "Test against real-world outcomes and adjust weights" },
  { title: "Analytics Dashboard", desc: "Build comprehensive BI dashboards for stakeholders" },
  { title: "User Behavior Tracking", desc: "Implement event tracking and session analytics" },
  { title: "Lead Conversion Optimization", desc: "Analyze and optimize the lead funnel" },
  { title: "A/B Testing Framework", desc: "Set up experimentation infrastructure" }
];

focusAreas.forEach((item, i) => {
  slide13.addText(`→ ${item.title}`, {
    x: 0.6, y: 1.5 + (i * 0.65), w: 3.5, h: 0.3,
    fontSize: 18, bold: true, color: colors.black
  });
  slide13.addText(`— ${item.desc}`, {
    x: 4.2, y: 1.5 + (i * 0.65), w: 5.2, h: 0.3,
    fontSize: 18, color: colors.black
  });
});

// ===== SLIDE 14: DATA QUALITY =====
let slide14 = pres.addSlide();
slide14.background = { fill: colors.blue };
slide14.addText("Data Quality Assessment", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

slide14.addText("Strengths", {
  x: 0.6, y: 1.3, w: 4.2, h: 0.4,
  fontSize: 20, bold: true, color: colors.black
});
const strengths = [
  "99.1% data retention rate",
  "Comprehensive audit logging",
  "Geospatial indexing for location queries",
  "Soft deletes for data recovery"
];
strengths.forEach((strength, i) => {
  slide14.addText(`• ${strength}`, {
    x: 0.6, y: 1.8 + (i * 0.4), w: 4.2, h: 0.3,
    fontSize: 16, color: colors.black
  });
});

slide14.addText("Risks & Gaps", {
  x: 5.2, y: 1.3, w: 4.2, h: 0.4,
  fontSize: 20, bold: true, color: colors.black
});
const risks = [
  "Static dataset needs refresh pipeline",
  "Synthetic data vs. real sources",
  "No user behavior analytics",
  "Aggregation performance at scale"
];
risks.forEach((risk, i) => {
  slide14.addText(`• ${risk}`, {
    x: 5.2, y: 1.8 + (i * 0.4), w: 4.2, h: 0.3,
    fontSize: 16, color: colors.black
  });
});

// ===== SLIDE 15: RECOMMENDATIONS =====
let slide15 = pres.addSlide();
slide15.background = { fill: colors.white };
slide15.addText("Key Recommendations", {
  x: 0.6, y: 0.5, w: 8.8, h: 0.6,
  ...styles.contentTitle
});

const recommendations = [
  { title: "Immediate", desc: "Set up analytics dashboard and data quality monitoring" },
  { title: "Short-term", desc: "Implement user behavior tracking and A/B testing" },
  { title: "Long-term", desc: "Integrate real-time data sources (NIRF, NAAC APIs)" },
  { title: "Continuous", desc: "Monitor data freshness, quality, and pipeline performance" }
];

recommendations.forEach((item, i) => {
  slide15.addText(`→ ${item.title}`, {
    x: 0.6, y: 1.5 + (i * 0.75), w: 2.0, h: 0.3,
    fontSize: 18, bold: true, color: colors.black
  });
  slide15.addText(`— ${item.desc}`, {
    x: 2.7, y: 1.5 + (i * 0.75), w: 6.7, h: 0.3,
    fontSize: 18, color: colors.black
  });
});

// ===== SLIDE 16: CONCLUSION =====
let slide16 = pres.addSlide();
slide16.background = { fill: colors.cyan };
slide16.addText("Thank You", {
  x: 0.5, y: 2.2, w: 9, h: 0.8,
  fontSize: 42, bold: true, color: colors.black, align: "center"
});
slide16.addText("Questions & Discussion", {
  x: 0.5, y: 3.2, w: 9, h: 0.4,
  fontSize: 18, color: colors.black, align: "center"
});

// Save presentation
pres.writeFile({ fileName: "ReactCampus-Technical-Analysis.pptx" })
  .then(() => {
    console.log("✅ Technical PowerPoint presentation created successfully!");
    console.log("📁 File: ReactCampus-Technical-Analysis.pptx");
    console.log("📊 17 slides with code snippets, data flows, and technical details");
    console.log("🔧 Includes: Python code, MongoDB schemas, API implementation, scoring algorithm");
  })
  .catch((err) => {
    console.error("❌ Error creating presentation:", err);
  });

// Made with Bob
