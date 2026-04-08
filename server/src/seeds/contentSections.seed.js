const College = require('../models/College.model');
const ContentSection = require('../models/ContentSection.model');
const logger = require('../config/logger');

const contentByCollege = {
  'indian-institute-of-technology-bombay': [
    { sectionKey: 'overview', title: 'About IIT Bombay', contentType: 'richtext', order: 0, content: { body: '<p>Indian Institute of Technology Bombay (IIT Bombay) is a public technical university located in Powai, Mumbai. Established in 1958, it is the second oldest IIT and is recognized as an Institute of National Importance by the Government of India.</p><p>IIT Bombay is consistently ranked among the top engineering institutions in India and Asia. The institute offers undergraduate, postgraduate, and doctoral programs across departments of engineering, science, design, and management.</p>' } },
    { sectionKey: 'overview', title: 'Highlights', contentType: 'table', order: 1, content: { headers: ['Parameter', 'Details'], rows: [['Established', '1958'], ['Type', 'Public (Institute of National Importance)'], ['Accreditation', 'NAAC A++ / NBA'], ['Campus Size', '550 Acres'], ['Total Students', '12,000+'], ['NIRF Ranking 2025', '#1 (Engineering)'], ['Average Package', 'INR 21.82 LPA'], ['Highest Package', 'INR 3.67 CPA']] } },
    { sectionKey: 'placements', title: 'Placement Overview', contentType: 'richtext', order: 0, content: { body: '<p>IIT Bombay is one of the most sought-after institutes by recruiters across the globe. The placement season typically sees participation from 400+ companies spanning technology, finance, consulting, and core engineering sectors.</p><p>The Training and Placement Cell coordinates the entire placement process, ensuring smooth communication between students and recruiters.</p>' } },
    { sectionKey: 'placements', title: 'Placement Statistics 2024-25', contentType: 'table', order: 1, content: { headers: ['Metric', 'Value'], rows: [['Students Eligible', '2,100+'], ['Students Placed', '1,850+'], ['Placement Rate', '88%'], ['Highest Package', 'INR 3.67 CPA'], ['Average Package', 'INR 21.82 LPA'], ['Median Package', 'INR 18.50 LPA'], ['Top Recruiters', 'Google, Microsoft, Goldman Sachs, McKinsey']] } },
    { sectionKey: 'admission', title: 'Admission Process', contentType: 'richtext', order: 0, content: { body: '<p><strong>B.Tech Admission:</strong> Through JEE Advanced. Candidates must first qualify JEE Main and then appear for JEE Advanced. Seat allocation is through JoSAA counselling.</p><p><strong>M.Tech Admission:</strong> Through GATE score followed by written test and/or interview conducted by individual departments.</p><p><strong>PhD Admission:</strong> Through written test and interview. Valid GATE/NET score is preferred.</p><p><strong>MBA Admission:</strong> Through CAT score followed by group discussion and personal interview.</p>' } },
    { sectionKey: 'cutoff', title: 'JEE Advanced Cutoff 2024', contentType: 'table', order: 0, content: { headers: ['Branch', 'General (Open)', 'OBC-NCL', 'SC', 'ST'], rows: [['Computer Science', '63', '45', '18', '9'], ['Electrical Engineering', '262', '130', '48', '20'], ['Mechanical Engineering', '610', '320', '110', '55'], ['Chemical Engineering', '1580', '780', '310', '150'], ['Civil Engineering', '2100', '1050', '420', '200'], ['Aerospace Engineering', '950', '480', '190', '90']] } },
  ],

  'indian-institute-of-technology-delhi': [
    { sectionKey: 'overview', title: 'About IIT Delhi', contentType: 'richtext', order: 0, content: { body: '<p>Indian Institute of Technology Delhi (IIT Delhi) is a public technical and research university located in Hauz Khas, New Delhi. Established in 1961, IIT Delhi has been declared an Institution of National Importance by the Government of India.</p><p>The institute is known for its rigorous curriculum, world-class research facilities, and a vibrant campus life that attracts students from across the country.</p>' } },
    { sectionKey: 'overview', title: 'Highlights', contentType: 'table', order: 1, content: { headers: ['Parameter', 'Details'], rows: [['Established', '1961'], ['Type', 'Public (Institute of National Importance)'], ['Accreditation', 'NAAC A++ / NBA'], ['Campus Size', '325 Acres'], ['Total Students', '10,500+'], ['NIRF Ranking 2025', '#2 (Engineering)'], ['Average Package', 'INR 20.48 LPA'], ['Highest Package', 'INR 3.02 CPA']] } },
    { sectionKey: 'placements', title: 'Placement Overview', contentType: 'richtext', order: 0, content: { body: '<p>IIT Delhi records excellent placement statistics every year with 350+ companies visiting the campus. The institute has strong ties with tech giants, consulting firms, and financial institutions.</p>' } },
    { sectionKey: 'placements', title: 'Placement Statistics 2024-25', contentType: 'table', order: 1, content: { headers: ['Metric', 'Value'], rows: [['Students Placed', '1,600+'], ['Placement Rate', '85%'], ['Highest Package', 'INR 3.02 CPA'], ['Average Package', 'INR 20.48 LPA'], ['Median Package', 'INR 17.50 LPA'], ['Top Recruiters', 'Google, Amazon, Microsoft, Uber, JP Morgan']] } },
    { sectionKey: 'admission', title: 'Admission Process', contentType: 'richtext', order: 0, content: { body: '<p><strong>B.Tech:</strong> Through JEE Advanced followed by JoSAA counselling.</p><p><strong>M.Tech:</strong> Through GATE score followed by department-level interview.</p><p><strong>MBA:</strong> Through CAT score followed by WAT-PI rounds.</p>' } },
    { sectionKey: 'cutoff', title: 'JEE Advanced Cutoff 2024', contentType: 'table', order: 0, content: { headers: ['Branch', 'General (Open)', 'OBC-NCL', 'SC', 'ST'], rows: [['Computer Science', '94', '55', '22', '12'], ['Electrical Engineering', '350', '180', '65', '30'], ['Mechanical Engineering', '800', '400', '150', '70'], ['Mathematics & Computing', '155', '80', '30', '15']] } },
  ],

  'indian-institute-of-technology-madras': [
    { sectionKey: 'overview', title: 'About IIT Madras', contentType: 'richtext', order: 0, content: { body: '<p>Indian Institute of Technology Madras (IIT Madras) is a public technical university located in Chennai, Tamil Nadu. Established in 1959, it occupies a stunning 617-acre campus set within the Guindy National Park.</p><p>IIT Madras has been ranked #1 in the NIRF Overall Rankings multiple times and is known for its strong research output, entrepreneurial ecosystem, and industry collaboration.</p>' } },
    { sectionKey: 'overview', title: 'Highlights', contentType: 'table', order: 1, content: { headers: ['Parameter', 'Details'], rows: [['Established', '1959'], ['Type', 'Public (Institute of National Importance)'], ['Accreditation', 'NAAC A++ / NBA'], ['Campus Size', '617 Acres'], ['Total Students', '11,000+'], ['NIRF Ranking 2025', '#1 (Overall)'], ['Average Package', 'INR 21.48 LPA'], ['Highest Package', 'INR 1.80 CPA']] } },
    { sectionKey: 'placements', title: 'Placement Statistics 2024-25', contentType: 'table', order: 0, content: { headers: ['Metric', 'Value'], rows: [['Students Placed', '1,700+'], ['Placement Rate', '90%'], ['Highest Package', 'INR 1.80 CPA'], ['Average Package', 'INR 21.48 LPA'], ['Top Recruiters', 'Google, Microsoft, Goldman Sachs, Samsung, TCS']] } },
    { sectionKey: 'admission', title: 'Admission Process', contentType: 'richtext', order: 0, content: { body: '<p><strong>B.Tech:</strong> Through JEE Advanced followed by JoSAA counselling.</p><p><strong>M.Tech/MS:</strong> Through GATE score followed by written test and interview.</p><p><strong>PhD:</strong> Through written test and interview. GATE/NET qualified candidates are preferred.</p>' } },
  ],

  'birla-institute-of-technology-and-science-pilani': [
    { sectionKey: 'overview', title: 'About BITS Pilani', contentType: 'richtext', order: 0, content: { body: '<p>Birla Institute of Technology and Science (BITS) Pilani is one of India\'s leading private universities for engineering and sciences. Founded in 1964, BITS Pilani has campuses in Pilani, Goa, Hyderabad, and Dubai.</p><p>BITS Pilani is known for its unique Practice School program that gives students extensive industry exposure, and its flexible dual-degree programs.</p>' } },
    { sectionKey: 'overview', title: 'Highlights', contentType: 'table', order: 1, content: { headers: ['Parameter', 'Details'], rows: [['Established', '1964'], ['Type', 'Deemed University'], ['Accreditation', 'NAAC A / NBA'], ['Campuses', 'Pilani, Goa, Hyderabad, Dubai'], ['Admission Exam', 'BITSAT'], ['Average Package', 'INR 16.50 LPA'], ['Highest Package', 'INR 1.68 CPA']] } },
    { sectionKey: 'placements', title: 'Placement Statistics 2024-25', contentType: 'table', order: 0, content: { headers: ['Metric', 'Value'], rows: [['Placement Rate', '82%'], ['Highest Package', 'INR 1.68 CPA'], ['Average Package', 'INR 16.50 LPA'], ['Top Recruiters', 'Google, Microsoft, Goldman Sachs, Sprinklr, Adobe']] } },
    { sectionKey: 'admission', title: 'Admission Process', contentType: 'richtext', order: 0, content: { body: '<p><strong>B.E./B.Pharm:</strong> Through BITSAT (online exam conducted by BITS). Based on Class 12 performance eligibility + BITSAT score.</p><p><strong>Higher Degrees:</strong> Through BITS HD entrance exam for M.E., M.Phil., and PhD programs.</p>' } },
  ],

  'rvce-bangalore': [
    { sectionKey: 'overview', title: 'About RVCE', contentType: 'richtext', order: 0, content: { body: '<p>RV College of Engineering (RVCE) is one of the earliest engineering colleges established in Karnataka, founded in 1963. Located in Bangalore, the college is affiliated to Visvesvaraya Technological University (VTU) and has been granted Autonomous status by the UGC.</p><p>RVCE offers undergraduate, postgraduate, and doctoral programs across 15 departments. The college is known for its strong industry connections, research focus, and vibrant student community.</p>' } },
    { sectionKey: 'overview', title: 'Highlights', contentType: 'table', order: 1, content: { headers: ['Parameter', 'Details'], rows: [['Established', '1963'], ['Type', 'Autonomous'], ['Accreditation', 'NAAC A+ / NBA'], ['Affiliation', 'Visvesvaraya Technological University'], ['Campus Size', '52 Acres'], ['Total Students', '5,000+'], ['NIRF Ranking', '47 (Engineering)'], ['Average Package', 'INR 12.50 LPA'], ['Highest Package', 'INR 64 LPA']] } },
    { sectionKey: 'overview', title: 'Why Choose RVCE?', contentType: 'list', order: 2, content: { items: ['One of the top autonomous engineering colleges in Karnataka', 'Excellent placement record with 90%+ placement rate', 'Strong alumni network across tech industry', 'Located in the heart of Bangalore IT hub', 'Active research and innovation ecosystem', 'Multiple student clubs and technical chapters'] } },
    { sectionKey: 'placements', title: 'Placement Overview', contentType: 'richtext', order: 0, content: { body: '<p>RVCE has an excellent placement track record with over 90% of eligible students getting placed every year. The college\'s strategic location in Bangalore — India\'s Silicon Valley — gives students access to a vast number of tech companies and startups.</p><p>The placement cell organizes pre-placement training, mock interviews, and aptitude workshops to prepare students for the recruitment process.</p>' } },
    { sectionKey: 'placements', title: 'Placement Statistics 2024-25', contentType: 'table', order: 1, content: { headers: ['Metric', 'Value'], rows: [['Students Eligible', '1,200+'], ['Students Placed', '1,100+'], ['Placement Rate', '92%'], ['Highest Package', 'INR 64 LPA'], ['Average Package', 'INR 12.50 LPA'], ['Median Package', 'INR 9.80 LPA'], ['Companies Visited', '350+']] } },
    { sectionKey: 'placements', title: 'Top Recruiters', contentType: 'list', order: 2, content: { items: ['Microsoft', 'Amazon', 'Google', 'Cisco', 'Intel', 'Samsung', 'Infosys', 'TCS', 'Wipro', 'Bosch'] } },
    { sectionKey: 'admission', title: 'Admission Process', contentType: 'richtext', order: 0, content: { body: '<p><strong>B.E. Admission:</strong> Through KCET (Karnataka CET) for Karnataka students and COMEDK UGET for management quota seats. Some seats are also available through JEE Main scores.</p><p><strong>M.Tech Admission:</strong> Through GATE score followed by counselling by VTU.</p><p><strong>PhD Admission:</strong> Through entrance test and interview conducted by the college.</p>' } },
    { sectionKey: 'cutoff', title: 'KCET Cutoff 2024', contentType: 'table', order: 0, content: { headers: ['Branch', 'General', 'OBC', 'SC', 'ST'], rows: [['Computer Science', '198', '1250', '4500', '8200'], ['Information Science', '650', '2800', '7500', '12000'], ['Electronics & Communication', '1200', '4500', '10000', '18000'], ['Mechanical Engineering', '5500', '12000', '22000', '35000'], ['Civil Engineering', '8000', '18000', '30000', '42000'], ['Electrical Engineering', '4200', '10000', '18000', '28000']] } },
    { sectionKey: 'cutoff', title: 'COMEDK Cutoff 2024', contentType: 'table', order: 1, content: { headers: ['Branch', 'General Rank'], rows: [['Computer Science', '520'], ['Information Science', '1800'], ['Electronics & Communication', '4200'], ['Mechanical Engineering', '12000'], ['Civil Engineering', '18000']] } },
  ],

  'vellore-institute-of-technology': [
    { sectionKey: 'overview', title: 'About VIT', contentType: 'richtext', order: 0, content: { body: '<p>Vellore Institute of Technology (VIT) is one of India\'s largest private universities, established in 1984. With campuses in Vellore, Chennai, Bhopal, and Amaravati, VIT offers a wide range of engineering, science, and management programs.</p><p>VIT is known for its international collaborations, diverse student body from 60+ countries, and strong placement record.</p>' } },
    { sectionKey: 'overview', title: 'Highlights', contentType: 'table', order: 1, content: { headers: ['Parameter', 'Details'], rows: [['Established', '1984'], ['Type', 'Deemed University'], ['Accreditation', 'NAAC A++ / NBA'], ['Campuses', 'Vellore, Chennai, Bhopal, Amaravati'], ['Admission Exam', 'VITEEE'], ['Total Students', '40,000+'], ['Average Package', 'INR 8.50 LPA']] } },
    { sectionKey: 'placements', title: 'Placement Statistics 2024-25', contentType: 'table', order: 0, content: { headers: ['Metric', 'Value'], rows: [['Placement Rate', '85%'], ['Highest Package', 'INR 54 LPA'], ['Average Package', 'INR 8.50 LPA'], ['Companies Visited', '600+'], ['Top Recruiters', 'Microsoft, Amazon, Deloitte, Cognizant, Infosys']] } },
    { sectionKey: 'admission', title: 'Admission Process', contentType: 'richtext', order: 0, content: { body: '<p><strong>B.Tech:</strong> Through VITEEE (VIT Engineering Entrance Exam). The exam is conducted online and tests Physics, Chemistry, Mathematics/Biology, English, and Aptitude.</p><p><strong>M.Tech:</strong> Through GATE score or VIT entrance test.</p>' } },
  ],

  'national-institute-of-technology-trichy': [
    { sectionKey: 'overview', title: 'About NIT Trichy', contentType: 'richtext', order: 0, content: { body: '<p>National Institute of Technology Tiruchirappalli (NIT Trichy) is the top-ranked NIT in India. Established in 1964, it offers programs in engineering, architecture, management, and sciences.</p><p>NIT Trichy is known for its competitive admissions, strong placement record, and active research community.</p>' } },
    { sectionKey: 'overview', title: 'Highlights', contentType: 'table', order: 1, content: { headers: ['Parameter', 'Details'], rows: [['Established', '1964'], ['Type', 'Public (Institute of National Importance)'], ['Accreditation', 'NAAC A++ / NBA'], ['Campus Size', '800 Acres'], ['Admission Exam', 'JEE Main'], ['Average Package', 'INR 14.50 LPA']] } },
    { sectionKey: 'placements', title: 'Placement Statistics 2024-25', contentType: 'table', order: 0, content: { headers: ['Metric', 'Value'], rows: [['Placement Rate', '90%'], ['Highest Package', 'INR 62 LPA'], ['Average Package', 'INR 14.50 LPA'], ['Companies Visited', '280+'], ['Top Recruiters', 'Google, Microsoft, Amazon, Goldman Sachs, Qualcomm']] } },
    { sectionKey: 'admission', title: 'Admission Process', contentType: 'richtext', order: 0, content: { body: '<p><strong>B.Tech:</strong> Through JEE Main score followed by JoSAA counselling.</p><p><strong>M.Tech:</strong> Through GATE score followed by CCMT counselling.</p>' } },
  ],
};

const seedContentSections = async () => {
  let count = 0;

  for (const [slug, sections] of Object.entries(contentByCollege)) {
    const college = await College.findOne({ slug });
    if (!college) continue;

    for (const section of sections) {
      await ContentSection.findOneAndUpdate(
        { college: college._id, sectionKey: section.sectionKey, title: section.title },
        { ...section, college: college._id, isVisible: true },
        { upsert: true, setDefaultsOnInsert: true }
      );
      count++;
    }
  }

  logger.info(`Seeded ${count} content sections`);
};

module.exports = seedContentSections;
