const Page = require('../models/Page.model');
const User = require('../models/User.model');
const logger = require('../config/logger');
const slugify = require('slugify');

const pages = [
  {
    title: 'Top Engineering Colleges in India 2026',
    description: '<p>India is home to some of the finest engineering institutions in the world. From the prestigious IITs to leading NITs and private universities, the country offers a diverse range of engineering programs across multiple disciplines. Whether you\'re looking for computer science, mechanical, electrical, or civil engineering — this comprehensive guide covers the best engineering colleges in India for 2026.</p><p>Our rankings are based on NIRF scores, placement records, faculty quality, research output, and infrastructure. Explore the top institutions and find the perfect fit for your engineering career.</p>',
    contentBlocks: [
      {
        title: 'Why Study Engineering in India?',
        contentType: 'richtext',
        content: '<p>India produces over 1.5 million engineering graduates every year, making it one of the largest engineering education ecosystems in the world. Here\'s why India is a top destination for engineering education:</p><ul><li><strong>World-class institutions</strong> — IITs are ranked among the top 200 globally</li><li><strong>Affordable education</strong> — Government institutions offer quality education at subsidized fees</li><li><strong>Strong placement records</strong> — Top colleges have 95%+ placement rates with packages up to 2 Cr+</li><li><strong>Research opportunities</strong> — Growing focus on AI, ML, robotics, and sustainable technology</li><li><strong>Global recognition</strong> — Indian engineering degrees are recognized worldwide</li></ul>',
        order: 0,
      },
      {
        title: 'Top 10 Engineering Colleges - Quick Comparison',
        contentType: 'table',
        content: JSON.stringify({
          headers: ['Rank', 'College', 'Location', 'Type', 'Fees (Approx/Year)', 'Established'],
          rows: [
            ['1', 'IIT Bombay', 'Mumbai, Maharashtra', 'Public', '2-10 Lakh', '1958'],
            ['2', 'IIT Delhi', 'New Delhi, Delhi', 'Public', '2-10 Lakh', '1961'],
            ['3', 'IIT Madras', 'Chennai, Tamil Nadu', 'Public', '2-9 Lakh', '1959'],
            ['4', 'IIT Kanpur', 'Kanpur, UP', 'Public', '2-9 Lakh', '1959'],
            ['5', 'IIT Kharagpur', 'Kharagpur, West Bengal', 'Public', '1.8-8.5 Lakh', '1951'],
            ['6', 'IISc Bangalore', 'Bangalore, Karnataka', 'Public', '0.5-5 Lakh', '1909'],
            ['7', 'IIT Roorkee', 'Roorkee, Uttarakhand', 'Public', '2-9 Lakh', '1847'],
            ['8', 'IIT Guwahati', 'Guwahati, Assam', 'Public', '2-8.5 Lakh', '1994'],
            ['9', 'IIT Hyderabad', 'Hyderabad, Telangana', 'Public', '2-8.5 Lakh', '2008'],
            ['10', 'BITS Pilani', 'Pilani, Rajasthan', 'Deemed', '4-20 Lakh', '1964'],
          ],
        }),
        order: 1,
      },
      {
        title: 'Frequently Asked Questions',
        contentType: 'faq',
        content: JSON.stringify([
          { question: 'What is the best engineering college in India?', answer: 'IIT Bombay is consistently ranked as the #1 engineering college in India based on NIRF rankings, research output, and placement records.' },
          { question: 'What exams are required for admission to top engineering colleges?', answer: 'JEE Main and JEE Advanced are the primary entrance exams for IITs and NITs. Some private universities conduct their own exams like BITSAT, VITEEE, and SRMJEEE.' },
          { question: 'What is the average fee for engineering in India?', answer: 'Government colleges (IITs/NITs) charge 2-10 Lakh for 4 years. Private universities range from 4-20 Lakh for the full program.' },
          { question: 'Which engineering branch has the best placements?', answer: 'Computer Science and Engineering (CSE) consistently offers the highest placement packages, followed by Electrical, Electronics, and Mechanical Engineering.' },
          { question: 'Can I get admission without JEE?', answer: 'Yes, many state-level and private universities accept students based on board exam scores, state-level entrance exams (like MHT-CET, KCET), or their own entrance tests.' },
        ]),
        order: 2,
      },
      {
        title: 'Key Factors to Consider When Choosing an Engineering College',
        contentType: 'list',
        content: JSON.stringify([
          '<strong>NIRF Ranking</strong> — Check the official government ranking for an unbiased assessment',
          '<strong>Placement Records</strong> — Look at average and median packages, not just the highest package',
          '<strong>Faculty Quality</strong> — Research the faculty-to-student ratio and faculty credentials',
          '<strong>Infrastructure</strong> — Labs, libraries, hostels, and sports facilities matter',
          '<strong>Industry Connections</strong> — Colleges with strong industry ties offer better internships',
          '<strong>Alumni Network</strong> — A strong alumni network can open doors throughout your career',
          '<strong>Location</strong> — Metro cities offer more internship and part-time job opportunities',
          '<strong>Accreditation</strong> — Ensure the college is AICTE/UGC approved and NAAC accredited',
        ]),
        order: 3,
      },
    ],
    collegeFilter: {
      enabled: true,
      filterBy: 'all',
      courses: [],
      exams: [],
      collegeType: '',
      state: '',
      city: '',
    },
    sidebarLinks: [
      {
        title: 'Engineering Colleges by City',
        links: [
          { label: 'Engineering Colleges in Mumbai', url: '/colleges?city=Mumbai' },
          { label: 'Engineering Colleges in Delhi', url: '/colleges?city=New Delhi' },
          { label: 'Engineering Colleges in Bangalore', url: '/colleges?city=Bangalore' },
          { label: 'Engineering Colleges in Chennai', url: '/colleges?city=Chennai' },
          { label: 'Engineering Colleges in Pune', url: '/colleges?city=Pune' },
          { label: 'Engineering Colleges in Hyderabad', url: '/colleges?city=Hyderabad' },
        ],
      },
      {
        title: 'Colleges by Type',
        links: [
          { label: 'Top IITs in India', url: '/colleges?type=public' },
          { label: 'Top NITs in India', url: '/colleges?type=public' },
          { label: 'Top Private Engineering Colleges', url: '/colleges?type=private' },
          { label: 'Top Deemed Universities', url: '/colleges?type=deemed' },
        ],
      },
      {
        title: 'Related Pages',
        links: [
          { label: 'Top MBA Colleges in India', url: '/pages/top-mba-colleges-india-2026' },
          { label: 'Top Medical Colleges in India', url: '/pages/top-medical-colleges-india-2026' },
        ],
      },
    ],
    metaTitle: 'Top Engineering Colleges in India 2026 - Rankings, Fees & Admissions',
    metaDescription: 'Explore the best engineering colleges in India for 2026. Compare IITs, NITs, and private universities based on rankings, fees, placements, and admission criteria.',
    metaKeywords: ['top engineering colleges india', 'best engineering colleges 2026', 'IIT rankings', 'NIT rankings', 'engineering admission india'],
  },
  {
    title: 'Top MBA Colleges in India 2026',
    description: '<p>Pursuing an MBA from a top business school in India can be a transformative step in your career. India\'s leading MBA colleges — the IIMs, XLRI, ISB, and top private B-schools — offer world-class management education with strong placement records and global exposure.</p><p>This guide ranks the best MBA colleges in India for 2026 based on NIRF rankings, placement statistics, faculty expertise, industry partnerships, and alumni success stories.</p>',
    contentBlocks: [
      {
        title: 'Why Pursue an MBA in India?',
        contentType: 'richtext',
        content: '<p>An MBA from a top Indian B-school opens doors to leadership roles across industries. Here\'s why India is an excellent choice for MBA education:</p><ul><li><strong>Top-ranked institutions</strong> — IIM Ahmedabad, IIM Bangalore, and ISB are globally recognized</li><li><strong>Exceptional ROI</strong> — IIM graduates earn 25-50 Lakh average packages, making the investment highly worthwhile</li><li><strong>Diverse specializations</strong> — Finance, Marketing, Operations, HR, Analytics, Entrepreneurship, and more</li><li><strong>Industry immersion</strong> — Live projects, summer internships, and guest lectures from industry leaders</li><li><strong>Growing startup ecosystem</strong> — India\'s booming startup culture makes MBA graduates highly sought after</li></ul>',
        order: 0,
      },
      {
        title: 'Top MBA Entrance Exams',
        contentType: 'table',
        content: JSON.stringify({
          headers: ['Exam', 'Conducted By', 'Colleges Accepting', 'Exam Month', 'Type'],
          rows: [
            ['CAT', 'IIMs (Rotational)', 'All IIMs, Top B-schools', 'November', 'National'],
            ['XAT', 'XLRI Jamshedpur', 'XLRI, XIMB, GIM, and 150+ colleges', 'January', 'National'],
            ['GMAT', 'GMAC', 'ISB, Great Lakes, Global programs', 'Year-round', 'International'],
            ['MAT', 'AIMA', '600+ B-schools across India', 'Feb/May/Sep/Dec', 'National'],
            ['SNAP', 'Symbiosis International', 'SIBM, SCMS, SIIB, and SIU institutes', 'December', 'University'],
            ['NMAT', 'NMIMS', 'NMIMS Mumbai, Bangalore, Hyderabad', 'Oct-Dec', 'University'],
          ],
        }),
        order: 1,
      },
      {
        title: 'Frequently Asked Questions',
        contentType: 'faq',
        content: JSON.stringify([
          { question: 'What is the best MBA college in India?', answer: 'IIM Ahmedabad is widely considered the #1 MBA college in India, followed by IIM Bangalore and IIM Calcutta. ISB Hyderabad is the top private B-school.' },
          { question: 'What is the average salary after MBA from a top college?', answer: 'Top IIMs offer average packages of 25-35 Lakh per annum. ISB graduates earn 28-35 Lakh on average. The highest packages can exceed 1 Crore.' },
          { question: 'Is work experience required for MBA admission?', answer: 'While not mandatory at IIMs, having 1-3 years of work experience significantly improves your chances. ISB requires a minimum of 2 years of work experience.' },
          { question: 'What is the CAT exam cutoff for top IIMs?', answer: 'Top IIMs typically require 99+ percentile in CAT. IIM Ahmedabad, Bangalore, and Calcutta have the highest cutoffs, usually above 99.5 percentile.' },
        ]),
        order: 2,
      },
    ],
    collegeFilter: {
      enabled: true,
      filterBy: 'type',
      courses: [],
      exams: [],
      collegeType: 'public',
      state: '',
      city: '',
    },
    sidebarLinks: [
      {
        title: 'MBA Colleges by City',
        links: [
          { label: 'MBA Colleges in Mumbai', url: '/colleges?city=Mumbai' },
          { label: 'MBA Colleges in Bangalore', url: '/colleges?city=Bangalore' },
          { label: 'MBA Colleges in Delhi NCR', url: '/colleges?city=New Delhi' },
          { label: 'MBA Colleges in Pune', url: '/colleges?city=Pune' },
          { label: 'MBA Colleges in Hyderabad', url: '/colleges?city=Hyderabad' },
        ],
      },
      {
        title: 'Related Pages',
        links: [
          { label: 'Top Engineering Colleges', url: '/pages/top-engineering-colleges-india-2026' },
          { label: 'Top Medical Colleges', url: '/pages/top-medical-colleges-india-2026' },
        ],
      },
    ],
    metaTitle: 'Top MBA Colleges in India 2026 - Rankings, Fees, Placements & Admissions',
    metaDescription: 'Discover the best MBA colleges in India for 2026. Compare IIMs, ISB, XLRI based on rankings, fees, average placements, and admission process.',
    metaKeywords: ['top MBA colleges india', 'best B-schools 2026', 'IIM rankings', 'MBA admission india', 'CAT exam colleges'],
  },
  {
    title: 'Top Medical Colleges in India 2026',
    description: '<p>Medical education in India is globally respected, with institutions like AIIMS Delhi, CMC Vellore, and JIPMER producing world-class doctors and researchers. Aspiring medical professionals have access to government medical colleges with highly subsidized fees as well as top private medical institutions.</p><p>This guide covers the top medical colleges in India for 2026 based on NIRF medical rankings, NEET cutoffs, faculty-patient ratio, research publications, and hospital infrastructure.</p>',
    contentBlocks: [
      {
        title: 'Medical Education in India - Overview',
        contentType: 'richtext',
        content: '<p>India has over 700 medical colleges offering MBBS programs, producing approximately 100,000 doctors every year. The National Medical Commission (NMC) regulates medical education quality standards.</p><h3>Key Highlights:</h3><ul><li>NEET is the single entrance exam for all medical admissions in India</li><li>Government medical colleges offer MBBS at just 10,000-50,000/year</li><li>5.5 years duration (4.5 years + 1 year internship)</li><li>Post-MBBS options include MD/MS specialization via NEET PG</li></ul>',
        order: 0,
      },
      {
        title: 'Top Medical Colleges Comparison',
        contentType: 'table',
        content: JSON.stringify({
          headers: ['Rank', 'College', 'City', 'Type', 'MBBS Seats', 'Annual Fees'],
          rows: [
            ['1', 'AIIMS New Delhi', 'New Delhi', 'Government', '107', '1,628/year'],
            ['2', 'PGIMER Chandigarh', 'Chandigarh', 'Government', '150', '1,170/year'],
            ['3', 'CMC Vellore', 'Vellore', 'Private', '100', '2.5 Lakh/year'],
            ['4', 'JIPMER Puducherry', 'Puducherry', 'Government', '200', '5,750/year'],
            ['5', 'NIMHANS Bangalore', 'Bangalore', 'Government', '150', '6,420/year'],
          ],
        }),
        order: 1,
      },
      {
        title: 'Common Questions About Medical Admission',
        contentType: 'faq',
        content: JSON.stringify([
          { question: 'What is the NEET cutoff for AIIMS Delhi?', answer: 'AIIMS Delhi typically requires a NEET score of 700+ out of 720 for general category students. The exact cutoff varies each year based on the difficulty level.' },
          { question: 'How much does MBBS cost in India?', answer: 'Government colleges charge 5,000-50,000/year. Private colleges charge 5-25 Lakh/year. Deemed universities can charge up to 20-30 Lakh/year.' },
          { question: 'Is NEET the only entrance exam for MBBS?', answer: 'Yes, since 2020, NEET-UG is the only entrance exam accepted for MBBS admissions across all medical colleges in India, including AIIMS and JIPMER.' },
        ]),
        order: 2,
      },
    ],
    collegeFilter: {
      enabled: false,
      filterBy: 'all',
      courses: [],
      exams: [],
      collegeType: '',
      state: '',
      city: '',
    },
    sidebarLinks: [
      {
        title: 'Medical Colleges by State',
        links: [
          { label: 'Medical Colleges in Maharashtra', url: '/colleges?state=Maharashtra' },
          { label: 'Medical Colleges in Tamil Nadu', url: '/colleges?state=Tamil Nadu' },
          { label: 'Medical Colleges in Karnataka', url: '/colleges?state=Karnataka' },
          { label: 'Medical Colleges in Delhi', url: '/colleges?state=Delhi' },
          { label: 'Medical Colleges in Kerala', url: '/colleges?state=Kerala' },
        ],
      },
      {
        title: 'Related Pages',
        links: [
          { label: 'Top Engineering Colleges', url: '/pages/top-engineering-colleges-india-2026' },
          { label: 'Top MBA Colleges', url: '/pages/top-mba-colleges-india-2026' },
        ],
      },
    ],
    metaTitle: 'Top Medical Colleges in India 2026 - NIRF Rankings, NEET Cutoffs & Fees',
    metaDescription: 'Find the best medical colleges in India for 2026. Compare AIIMS, CMC, JIPMER based on NIRF rankings, NEET cutoffs, fees, and admission process.',
    metaKeywords: ['top medical colleges india', 'best MBBS colleges 2026', 'AIIMS ranking', 'NEET cutoff', 'medical admission india'],
  },
  {
    title: 'Top Colleges in Bangalore 2026',
    description: '<p>Bangalore, the Silicon Valley of India, is a premier education hub with world-class universities and colleges. The city hosts some of India\'s best engineering, management, medical, and arts institutions. With a thriving IT industry, excellent weather, and cosmopolitan culture, Bangalore attracts students from all over the country.</p>',
    contentBlocks: [
      {
        title: 'Why Study in Bangalore?',
        contentType: 'list',
        content: JSON.stringify([
          '<strong>IT Capital of India</strong> — Home to 10,000+ tech companies including Google, Microsoft, Amazon, and Flipkart',
          '<strong>Startup Hub</strong> — Over 4,000 startups, offering immense internship and job opportunities',
          '<strong>Diverse Institutions</strong> — From IISc and IIM-B to Christ University and Manipal (nearby)',
          '<strong>Pleasant Climate</strong> — Year-round moderate temperatures ideal for studying',
          '<strong>Cultural Melting Pot</strong> — Students from all over India and the world',
          '<strong>Industry Exposure</strong> — Easy access to tech parks, corporate offices, and innovation hubs',
        ]),
        order: 0,
      },
      {
        title: 'Top Colleges in Bangalore',
        contentType: 'table',
        content: JSON.stringify({
          headers: ['College', 'Type', 'Known For', 'Established'],
          rows: [
            ['IISc Bangalore', 'Public', 'Research, Science & Engineering', '1909'],
            ['Christ University', 'Deemed', 'Arts, Commerce, Management', '1969'],
            ['RVCE Bangalore', 'Autonomous', 'Engineering & Technology', '1963'],
            ['Manipal Academy (nearby)', 'Deemed', 'Engineering, Medicine, Management', '1953'],
          ],
        }),
        order: 1,
      },
    ],
    collegeFilter: {
      enabled: true,
      filterBy: 'city',
      courses: [],
      exams: [],
      collegeType: '',
      state: '',
      city: 'Bangalore',
    },
    sidebarLinks: [
      {
        title: 'Colleges in Other Cities',
        links: [
          { label: 'Top Colleges in Mumbai', url: '/colleges?city=Mumbai' },
          { label: 'Top Colleges in Delhi', url: '/colleges?city=New Delhi' },
          { label: 'Top Colleges in Chennai', url: '/colleges?city=Chennai' },
          { label: 'Top Colleges in Pune', url: '/colleges?city=Pune' },
          { label: 'Top Colleges in Hyderabad', url: '/colleges?city=Hyderabad' },
          { label: 'Top Colleges in Kolkata', url: '/colleges?city=Kolkata' },
        ],
      },
    ],
    metaTitle: 'Top Colleges in Bangalore 2026 - Best Universities & Institutes',
    metaDescription: 'Discover the best colleges in Bangalore for 2026. Explore engineering, medical, MBA, and arts colleges in India\'s IT capital with rankings and fees.',
    metaKeywords: ['top colleges bangalore', 'best universities bangalore 2026', 'engineering colleges bangalore', 'MBA colleges bangalore'],
  },
  {
    title: 'Top Private Universities in India 2026',
    description: '<p>Private universities in India have emerged as serious competitors to government institutions, offering modern infrastructure, industry-aligned curricula, and global exposure. From BITS Pilani and Manipal to newer entrants like Ashoka and Shiv Nadar, private universities are reshaping Indian higher education.</p><p>This guide explores the best private universities in India based on academic quality, placements, research output, and student experience.</p>',
    contentBlocks: [
      {
        title: 'Advantages of Private Universities',
        contentType: 'richtext',
        content: '<p>Private universities offer several unique advantages over government institutions:</p><ul><li><strong>Modern infrastructure</strong> — State-of-the-art labs, smart classrooms, and world-class campus facilities</li><li><strong>Industry partnerships</strong> — Direct collaborations with top MNCs for internships and placements</li><li><strong>Flexible curriculum</strong> — Regular updates to match industry demands</li><li><strong>Global exposure</strong> — Semester exchange programs, international faculty, and dual-degree options</li><li><strong>Better student-faculty ratio</strong> — Smaller class sizes enable personalized attention</li></ul>',
        order: 0,
      },
      {
        title: 'Common Questions',
        contentType: 'faq',
        content: JSON.stringify([
          { question: 'Are private university degrees valid?', answer: 'Yes, degrees from UGC-recognized private universities are fully valid and equivalent to government university degrees. Always verify UGC recognition before applying.' },
          { question: 'Why are private universities expensive?', answer: 'Private universities don\'t receive government funding, so they rely on tuition fees to cover infrastructure, faculty salaries, and operational costs. Many offer scholarships to meritorious students.' },
          { question: 'Which private university has the best placements?', answer: 'BITS Pilani, Manipal, VIT, SRM, and Ashoka University consistently report strong placement records. BITS Pilani is often considered the best for engineering placements among private universities.' },
        ]),
        order: 1,
      },
    ],
    collegeFilter: {
      enabled: true,
      filterBy: 'type',
      courses: [],
      exams: [],
      collegeType: 'private',
      state: '',
      city: '',
    },
    sidebarLinks: [
      {
        title: 'Browse by Type',
        links: [
          { label: 'Government Colleges', url: '/colleges?type=public' },
          { label: 'Deemed Universities', url: '/colleges?type=deemed' },
          { label: 'Autonomous Colleges', url: '/colleges?type=autonomous' },
        ],
      },
      {
        title: 'Related Pages',
        links: [
          { label: 'Top Engineering Colleges', url: '/pages/top-engineering-colleges-india-2026' },
          { label: 'Top MBA Colleges', url: '/pages/top-mba-colleges-india-2026' },
          { label: 'Top Colleges in Bangalore', url: '/pages/top-colleges-in-bangalore-2026' },
        ],
      },
    ],
    metaTitle: 'Top Private Universities in India 2026 - Rankings, Fees & Placements',
    metaDescription: 'Explore the best private universities in India for 2026. Compare BITS Pilani, Manipal, VIT, Ashoka based on rankings, fees, and placement records.',
    metaKeywords: ['top private universities india', 'best private colleges 2026', 'private engineering colleges', 'private university rankings'],
  },
];

const staticPages = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    description: '<p>This Privacy Policy describes how Campus Option collects, uses, and protects your personal information when you use our platform.</p>',
    contentBlocks: [
      {
        title: 'Information We Collect',
        contentType: 'richtext',
        content: '<p>We collect information you provide directly to us, including:</p><ul><li><strong>Personal Information:</strong> Name, email address, phone number when you create an account or submit forms</li><li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li><li><strong>Device Information:</strong> Browser type, operating system, IP address</li></ul>',
        order: 0,
      },
      {
        title: 'How We Use Your Information',
        contentType: 'richtext',
        content: '<p>We use the collected information to:</p><ul><li>Provide and improve our education discovery services</li><li>Send relevant college recommendations and updates</li><li>Respond to your inquiries and support requests</li><li>Analyze usage patterns to enhance user experience</li><li>Comply with legal obligations</li></ul>',
        order: 1,
      },
      {
        title: 'Data Protection',
        contentType: 'richtext',
        content: '<p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and access is restricted to authorized personnel only.</p>',
        order: 2,
      },
      {
        title: 'Your Rights',
        contentType: 'richtext',
        content: '<p>You have the right to:</p><ul><li>Access your personal data</li><li>Correct inaccurate data</li><li>Request deletion of your data</li><li>Opt-out of marketing communications</li><li>Lodge a complaint with a data protection authority</li></ul>',
        order: 3,
      },
      {
        title: 'Contact Us',
        contentType: 'richtext',
        content: '<p>If you have questions about this Privacy Policy, please contact us at <strong>info@campusoption.com</strong>.</p><p>Last updated: February 2026</p>',
        order: 4,
      },
    ],
    collegeFilter: { enabled: false, filterBy: 'all', courses: [], exams: [], collegeType: '', state: '', city: '' },
    sidebarLinks: [],
    metaTitle: 'Privacy Policy - Campus Option',
    metaDescription: 'Read the Campus Option privacy policy to understand how we collect, use, and protect your personal information.',
    metaKeywords: ['privacy policy', 'data protection', 'campusoption privacy'],
  },
  {
    title: 'Terms of Use',
    slug: 'terms-of-use',
    description: '<p>These Terms of Use govern your access to and use of the Campus Option platform. By using our services, you agree to be bound by these terms.</p>',
    contentBlocks: [
      {
        title: 'Acceptance of Terms',
        contentType: 'richtext',
        content: '<p>By accessing or using Campus Option, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform.</p>',
        order: 0,
      },
      {
        title: 'Use of Services',
        contentType: 'richtext',
        content: '<p>You agree to use our services only for lawful purposes and in accordance with these terms. You must not:</p><ul><li>Use the platform for any illegal or unauthorized purpose</li><li>Attempt to gain unauthorized access to our systems</li><li>Scrape or collect data without our express permission</li><li>Interfere with or disrupt the platform\'s functionality</li><li>Submit false or misleading information</li></ul>',
        order: 1,
      },
      {
        title: 'Intellectual Property',
        contentType: 'richtext',
        content: '<p>All content on Campus Option, including text, graphics, logos, and software, is the property of Campus Option or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>',
        order: 2,
      },
      {
        title: 'Disclaimer',
        contentType: 'richtext',
        content: '<p>Campus Option provides information about educational institutions for informational purposes only. While we strive for accuracy, we do not guarantee the completeness or accuracy of all information. College details, fees, rankings, and other data may change without notice. Users should verify information directly with institutions.</p>',
        order: 3,
      },
      {
        title: 'Contact',
        contentType: 'richtext',
        content: '<p>For questions about these Terms of Use, please contact us at <strong>info@campusoption.com</strong>.</p><p>Last updated: February 2026</p>',
        order: 4,
      },
    ],
    collegeFilter: { enabled: false, filterBy: 'all', courses: [], exams: [], collegeType: '', state: '', city: '' },
    sidebarLinks: [],
    metaTitle: 'Terms of Use - Campus Option',
    metaDescription: 'Read the Campus Option terms of use to understand the rules and guidelines for using our education platform.',
    metaKeywords: ['terms of use', 'terms and conditions', 'campusoption terms'],
  },
];

const seedPages = async () => {
  const admin = await User.findOne({ email: 'admin@campusoption.com' });

  for (const data of pages) {
    const slug = slugify(data.title, { lower: true, strict: true });
    await Page.findOneAndUpdate(
      { slug },
      { ...data, slug, status: 'published', createdBy: admin?._id || null },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  // Seed static pages (privacy policy, terms of use)
  for (const data of staticPages) {
    await Page.findOneAndUpdate(
      { slug: data.slug },
      { ...data, status: 'published', createdBy: admin?._id || null },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  logger.info(`Seeded ${pages.length + staticPages.length} pages`);
};

module.exports = seedPages;
