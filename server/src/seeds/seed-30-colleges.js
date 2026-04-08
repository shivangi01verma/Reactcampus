/**
 * Seed script: 30 realistic Indian colleges with courses and content sections
 * Run: node server/src/seeds/seed-30-colleges.js
 */

const connectDB = require('../config/db');
const College = require('../models/College.model');
const Course = require('../models/Course.model');
const ContentSection = require('../models/ContentSection.model');
const Category = require('../models/Category.model');
const { ensureUniqueSlug } = require('../utils/slugify');
const mongoose = require('mongoose');

// ─── Course definitions (~40 courses) ────────────────────────────────────────

const courseDefs = [
  // Engineering - Undergraduate
  { name: 'B.Tech in Computer Science and Engineering', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Artificial Intelligence', 'Data Science', 'Cyber Security'], fees: { amount: 150000, currency: 'INR', per: 'year' }, description: 'Four-year undergraduate programme in Computer Science and Engineering covering algorithms, software development, and system design.', eligibility: '10+2 with Physics, Chemistry and Mathematics; JEE Main/Advanced or state-level entrance exam' },
  { name: 'B.Tech in Electrical Engineering', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Power Systems', 'VLSI Design', 'Control Systems'], fees: { amount: 140000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme covering electrical circuits, power systems, and electronics.', eligibility: '10+2 with PCM; JEE Main/Advanced' },
  { name: 'B.Tech in Mechanical Engineering', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Thermal Engineering', 'Design Engineering', 'Manufacturing'], fees: { amount: 140000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme in mechanical engineering with focus on design, thermodynamics, and manufacturing.', eligibility: '10+2 with PCM; JEE Main/Advanced' },
  { name: 'B.Tech in Civil Engineering', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Structural Engineering', 'Environmental Engineering', 'Transportation'], fees: { amount: 130000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme covering structural analysis, construction technology, and environmental engineering.', eligibility: '10+2 with PCM; JEE Main/Advanced' },
  { name: 'B.Tech in Electronics and Communication', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Embedded Systems', 'Signal Processing', 'IoT'], fees: { amount: 145000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme in electronics, communication systems, and embedded technologies.', eligibility: '10+2 with PCM; JEE Main/Advanced' },
  { name: 'B.Tech in Information Technology', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Cloud Computing', 'Web Technologies', 'Database Management'], fees: { amount: 145000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme focusing on information systems, networking, and software engineering.', eligibility: '10+2 with PCM; JEE Main/Advanced' },
  { name: 'B.Tech in Chemical Engineering', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Petrochemical', 'Biochemical Engineering', 'Process Engineering'], fees: { amount: 135000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme covering chemical process design, reaction engineering, and plant design.', eligibility: '10+2 with PCM; JEE Main/Advanced' },

  // Engineering - Postgraduate
  { name: 'M.Tech in Computer Science', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Engineering', specializations: ['Machine Learning', 'Distributed Systems', 'Computer Vision'], fees: { amount: 100000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme providing advanced knowledge in computer science research and development.', eligibility: 'B.Tech/BE in CSE or related; GATE score' },
  { name: 'M.Tech in Structural Engineering', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Engineering', specializations: ['Earthquake Engineering', 'Bridge Engineering', 'Geotechnical'], fees: { amount: 95000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme in structural analysis, design of concrete and steel structures.', eligibility: 'B.Tech/BE in Civil Engineering; GATE score' },
  { name: 'M.Tech in VLSI Design', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Engineering', specializations: ['Digital Design', 'Analog IC Design', 'FPGA Prototyping'], fees: { amount: 100000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme focusing on integrated circuit design, verification, and fabrication.', eligibility: 'B.Tech/BE in ECE or EEE; GATE score' },

  // Medical
  { name: 'MBBS', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'Medical', specializations: [], fees: { amount: 50000, currency: 'INR', per: 'year' }, description: 'Bachelor of Medicine and Bachelor of Surgery — the primary medical degree for practising medicine in India.', eligibility: '10+2 with PCB; NEET UG qualified' },
  { name: 'BDS', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'Medical', specializations: ['Orthodontics', 'Prosthodontics', 'Oral Surgery'], fees: { amount: 300000, currency: 'INR', per: 'year' }, description: 'Bachelor of Dental Surgery covering dental anatomy, oral pathology, and clinical dentistry.', eligibility: '10+2 with PCB; NEET UG qualified' },
  { name: 'MD in General Medicine', level: 'postgraduate', duration: { value: 3, unit: 'years' }, stream: 'Medical', specializations: ['Cardiology', 'Neurology', 'Gastroenterology'], fees: { amount: 80000, currency: 'INR', per: 'year' }, description: 'Postgraduate medical degree for specialisation in internal medicine.', eligibility: 'MBBS degree; NEET PG qualified' },
  { name: 'B.Sc Nursing', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Medical', specializations: ['Community Health', 'Paediatric Nursing', 'Psychiatric Nursing'], fees: { amount: 80000, currency: 'INR', per: 'year' }, description: 'Undergraduate nursing programme training students in patient care, health sciences, and clinical practice.', eligibility: '10+2 with PCB; minimum 45% aggregate' },

  // Management
  { name: 'MBA', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Management', specializations: ['Finance', 'Marketing', 'Human Resources', 'Operations', 'Business Analytics'], fees: { amount: 500000, currency: 'INR', per: 'year' }, description: 'Master of Business Administration offering comprehensive management education with specialisations.', eligibility: 'Graduation in any discipline; CAT/MAT/XAT/GMAT score' },
  { name: 'BBA', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Management', specializations: ['Finance', 'Marketing', 'International Business'], fees: { amount: 120000, currency: 'INR', per: 'year' }, description: 'Bachelor of Business Administration providing foundation in business management and leadership.', eligibility: '10+2 in any stream; entrance test or merit' },
  { name: 'PGDM', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Management', specializations: ['Marketing Management', 'Financial Management', 'Operations Management'], fees: { amount: 600000, currency: 'INR', per: 'year' }, description: 'Post Graduate Diploma in Management, an industry-oriented alternative to MBA.', eligibility: 'Graduation in any discipline; CAT/MAT/XAT score' },
  { name: 'Executive MBA', level: 'postgraduate', duration: { value: 1, unit: 'years' }, stream: 'Management', specializations: ['Strategic Management', 'Leadership', 'Digital Transformation'], fees: { amount: 1000000, currency: 'INR', per: 'total' }, description: 'One-year accelerated MBA programme designed for working professionals.', eligibility: 'Graduation + 5 years work experience; CAT/GMAT' },

  // Law
  { name: 'BA LLB (Hons)', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'Law', specializations: ['Constitutional Law', 'Corporate Law', 'Criminal Law'], fees: { amount: 200000, currency: 'INR', per: 'year' }, description: 'Integrated five-year programme combining arts education with legal studies.', eligibility: '10+2 in any stream; CLAT/AILET qualified' },
  { name: 'LLB', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Law', specializations: ['Civil Law', 'Criminal Law', 'Corporate Law'], fees: { amount: 100000, currency: 'INR', per: 'year' }, description: 'Three-year law degree for graduates seeking professional legal education.', eligibility: 'Graduation in any discipline; entrance test' },
  { name: 'LLM', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Law', specializations: ['International Law', 'Intellectual Property', 'Human Rights Law'], fees: { amount: 150000, currency: 'INR', per: 'year' }, description: 'Master of Laws offering advanced specialisation in legal studies.', eligibility: 'LLB degree; CLAT PG or university entrance' },

  // Arts
  { name: 'BA in English Literature', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Arts', specializations: ['Creative Writing', 'Comparative Literature', 'Linguistics'], fees: { amount: 30000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme exploring English literature from classical to contemporary periods.', eligibility: '10+2 in any stream; merit-based or entrance' },
  { name: 'BA in Economics', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Arts', specializations: ['Development Economics', 'Econometrics', 'Public Policy'], fees: { amount: 35000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme covering micro and macroeconomics, statistics, and policy analysis.', eligibility: '10+2 in any stream; merit-based' },
  { name: 'MA in Political Science', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Arts', specializations: ['International Relations', 'Public Administration', 'Political Theory'], fees: { amount: 25000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme in political theory, governance, and international relations.', eligibility: 'BA in Political Science or related; entrance exam' },
  { name: 'BA in Psychology', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Arts', specializations: ['Clinical Psychology', 'Organisational Psychology', 'Counselling'], fees: { amount: 40000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme studying human behaviour, cognition, and mental processes.', eligibility: '10+2 in any stream; merit-based' },

  // Science
  { name: 'B.Sc in Physics', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Science', specializations: ['Astrophysics', 'Quantum Mechanics', 'Nuclear Physics'], fees: { amount: 25000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme in physics covering mechanics, optics, electromagnetism, and modern physics.', eligibility: '10+2 with PCM; merit-based' },
  { name: 'B.Sc in Mathematics', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Science', specializations: ['Pure Mathematics', 'Applied Mathematics', 'Statistics'], fees: { amount: 22000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme in mathematics covering algebra, analysis, and applied mathematics.', eligibility: '10+2 with Mathematics; merit-based' },
  { name: 'M.Sc in Chemistry', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Science', specializations: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'], fees: { amount: 30000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme providing advanced knowledge in chemical sciences and research.', eligibility: 'B.Sc in Chemistry; entrance exam or merit' },

  // Commerce
  { name: 'B.Com (Hons)', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Commerce', specializations: ['Accounting', 'Taxation', 'Banking'], fees: { amount: 35000, currency: 'INR', per: 'year' }, description: 'Undergraduate honours programme in commerce covering accounting, taxation, and business law.', eligibility: '10+2 in Commerce; merit-based or entrance' },
  { name: 'M.Com', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Commerce', specializations: ['Advanced Accounting', 'Business Finance', 'Taxation'], fees: { amount: 30000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme providing advanced knowledge in commerce and business studies.', eligibility: 'B.Com degree; entrance exam or merit' },
  { name: 'BCA', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'Commerce', specializations: ['Software Development', 'Web Development', 'Network Administration'], fees: { amount: 60000, currency: 'INR', per: 'year' }, description: 'Bachelor of Computer Applications focusing on programming, databases, and application development.', eligibility: '10+2 with Mathematics; merit-based or entrance' },

  // Pharmacy
  { name: 'B.Pharm', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'Pharmacy', specializations: ['Pharmaceutics', 'Pharmacology', 'Pharmaceutical Chemistry'], fees: { amount: 100000, currency: 'INR', per: 'year' }, description: 'Undergraduate programme in pharmaceutical sciences covering drug development, formulation, and pharmacology.', eligibility: '10+2 with PCB/PCM; entrance exam' },
  { name: 'M.Pharm', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Pharmacy', specializations: ['Pharmacology', 'Pharmaceutical Analysis', 'Pharmaceutics'], fees: { amount: 120000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme providing specialised knowledge in pharmaceutical research and practice.', eligibility: 'B.Pharm degree; GPAT score' },
  { name: 'D.Pharm', level: 'diploma', duration: { value: 2, unit: 'years' }, stream: 'Pharmacy', specializations: [], fees: { amount: 60000, currency: 'INR', per: 'year' }, description: 'Diploma programme in pharmacy covering basic pharmaceutical sciences and dispensing.', eligibility: '10+2 with PCB/PCM; merit-based' },

  // Architecture
  { name: 'B.Arch', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'Architecture', specializations: ['Urban Design', 'Interior Architecture', 'Landscape Architecture'], fees: { amount: 200000, currency: 'INR', per: 'year' }, description: 'Five-year professional degree in architecture covering design, construction technology, and urban planning.', eligibility: '10+2 with Mathematics; NATA/JEE Main Paper 2' },
  { name: 'M.Arch', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Architecture', specializations: ['Urban Design', 'Sustainable Architecture', 'Digital Architecture'], fees: { amount: 180000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme in architecture providing advanced design and research skills.', eligibility: 'B.Arch degree; GATE Architecture' },

  // Education
  { name: 'B.Ed', level: 'undergraduate', duration: { value: 2, unit: 'years' }, stream: 'Education', specializations: ['Science Education', 'Mathematics Education', 'English Education'], fees: { amount: 50000, currency: 'INR', per: 'year' }, description: 'Bachelor of Education programme preparing graduates for a career in school teaching.', eligibility: 'Graduation in any discipline; entrance exam' },
  { name: 'M.Ed', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'Education', specializations: ['Curriculum Development', 'Educational Technology', 'Special Education'], fees: { amount: 45000, currency: 'INR', per: 'year' }, description: 'Postgraduate programme in education focusing on pedagogy, research, and curriculum design.', eligibility: 'B.Ed degree; entrance exam' },

  // Doctorate
  { name: 'Ph.D in Engineering', level: 'doctorate', duration: { value: 4, unit: 'years' }, stream: 'Engineering', specializations: ['Computer Science', 'Mechanical', 'Electrical', 'Civil'], fees: { amount: 50000, currency: 'INR', per: 'year' }, description: 'Doctoral research programme in engineering disciplines.', eligibility: 'M.Tech/ME with GATE; interview' },
  { name: 'Ph.D in Management', level: 'doctorate', duration: { value: 4, unit: 'years' }, stream: 'Management', specializations: ['Finance', 'Marketing', 'Strategy', 'OB/HR'], fees: { amount: 60000, currency: 'INR', per: 'year' }, description: 'Doctoral programme in management sciences focusing on original research and academic contribution.', eligibility: 'MBA/PGDM with CAT/GMAT; research proposal' },
];

// ─── College definitions (30 colleges) ───────────────────────────────────────

const collegeDefs = [
  // 1
  {
    name: 'Indian Institute of Technology Bombay',
    type: 'public',
    categories: ['engineering', 'science', 'management'],
    description: 'IIT Bombay is one of India\'s premier engineering and technology institutions, established in 1958. Located in Powai, Mumbai, it is recognised globally for its academic excellence, cutting-edge research, and distinguished alumni network.',
    location: { address: 'IIT Bombay, Powai', city: 'Mumbai', state: 'Maharashtra', pincode: '400076' },
    fees: { min: 200000, max: 300000 },
    ranking: 1,
    established: 1958,
    website: 'https://www.iitb.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC, AICTE',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Swimming Pool', 'Gymnasium', 'Hospital'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electrical Engineering', 'B.Tech in Mechanical Engineering', 'B.Tech in Chemical Engineering', 'M.Tech in Computer Science', 'Ph.D in Engineering', 'MBA'],
  },
  // 2
  {
    name: 'Indian Institute of Technology Delhi',
    type: 'public',
    categories: ['engineering', 'science', 'management'],
    description: 'IIT Delhi is a world-renowned institute of higher education dedicated to engineering, science, and technology. It has been consistently ranked among the top engineering colleges in India.',
    location: { address: 'Hauz Khas', city: 'New Delhi', state: 'Delhi', pincode: '110016' },
    fees: { min: 200000, max: 310000 },
    ranking: 2,
    established: 1961,
    website: 'https://home.iitd.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC, AICTE',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Gymnasium', 'Hospital', 'Incubation Centre'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electrical Engineering', 'B.Tech in Civil Engineering', 'M.Tech in Computer Science', 'M.Tech in Structural Engineering', 'MBA', 'Ph.D in Engineering'],
  },
  // 3
  {
    name: 'Indian Institute of Technology Madras',
    type: 'public',
    categories: ['engineering', 'science'],
    description: 'IIT Madras, situated in Chennai, is one of the foremost institutes for engineering and technology in India. Its sprawling green campus inside the Guindy National Park offers a unique academic environment.',
    location: { address: 'IIT Madras, Adyar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600036' },
    fees: { min: 200000, max: 280000 },
    ranking: 3,
    established: 1959,
    website: 'https://www.iitm.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC, AICTE',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Swimming Pool'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Mechanical Engineering', 'B.Tech in Electronics and Communication', 'M.Tech in Computer Science', 'M.Tech in VLSI Design', 'Ph.D in Engineering'],
  },
  // 4
  {
    name: 'Indian Institute of Technology Kanpur',
    type: 'public',
    categories: ['engineering', 'science'],
    description: 'IIT Kanpur is a public technical university established in 1959. It has been instrumental in advancing engineering education and research in India and is known for its rigorous academic programmes.',
    location: { address: 'Kalyanpur', city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208016' },
    fees: { min: 200000, max: 270000 },
    ranking: 4,
    established: 1959,
    website: 'https://www.iitk.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC, AICTE',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Research Labs', 'Auditorium', 'Airstrip', 'Gymnasium'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electrical Engineering', 'B.Tech in Mechanical Engineering', 'B.Tech in Civil Engineering', 'M.Tech in Computer Science', 'Ph.D in Engineering'],
  },
  // 5
  {
    name: 'Indian Institute of Technology Kharagpur',
    type: 'public',
    categories: ['engineering', 'science', 'management', 'law', 'architecture'],
    description: 'IIT Kharagpur is the oldest IIT, established in 1951. It has the largest campus among all IITs and offers a wide range of programmes across engineering, science, law, management, and architecture.',
    location: { address: 'IIT Kharagpur Campus', city: 'Kharagpur', state: 'West Bengal', pincode: '721302' },
    fees: { min: 190000, max: 300000 },
    ranking: 5,
    established: 1951,
    website: 'https://www.iitkgp.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC, AICTE',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Swimming Pool', 'Technology Business Incubator'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electronics and Communication', 'B.Tech in Civil Engineering', 'B.Arch', 'BA LLB (Hons)', 'MBA', 'M.Tech in Computer Science', 'Ph.D in Engineering'],
  },
  // 6
  {
    name: 'All India Institute of Medical Sciences, New Delhi',
    type: 'public',
    categories: ['medical'],
    description: 'AIIMS New Delhi is India\'s premier medical institution, established in 1956. It serves as a centre of excellence in medical education, research, and patient care, attracting the brightest medical aspirants from across the country.',
    location: { address: 'Ansari Nagar', city: 'New Delhi', state: 'Delhi', pincode: '110029' },
    fees: { min: 5000, max: 50000 },
    ranking: 1,
    established: 1956,
    website: 'https://www.aiims.edu',
    accreditation: 'NAAC A++',
    affiliation: 'MCI, NMC',
    facilities: ['Library', 'Hostel', 'Hospital', 'Research Labs', 'Cafeteria', 'Auditorium', 'Sports Ground', 'WiFi Campus'],
    courseNames: ['MBBS', 'B.Sc Nursing', 'MD in General Medicine'],
  },
  // 7
  {
    name: 'Indian Institute of Management Ahmedabad',
    type: 'autonomous',
    categories: ['management'],
    description: 'IIM Ahmedabad is one of India\'s most prestigious business schools, known for its rigorous MBA programme and world-class faculty. Established in 1961, it has produced some of India\'s most successful business leaders.',
    location: { address: 'Vastrapur', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
    fees: { min: 1100000, max: 2500000 },
    ranking: 1,
    established: 1961,
    website: 'https://www.iima.ac.in',
    accreditation: 'AACSB, EQUIS, AMBA',
    affiliation: 'AICTE',
    facilities: ['Library', 'Hostel', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Sports Complex', 'Gymnasium', 'Incubation Centre'],
    courseNames: ['MBA', 'Executive MBA', 'PGDM', 'Ph.D in Management'],
  },
  // 8
  {
    name: 'Indian Institute of Management Bangalore',
    type: 'autonomous',
    categories: ['management'],
    description: 'IIM Bangalore is a leading management school in India, established in 1973. It is known for its strong emphasis on research, academic rigour, and close ties with the thriving Bangalore startup ecosystem.',
    location: { address: 'Bannerghatta Road', city: 'Bangalore', state: 'Karnataka', pincode: '560076' },
    fees: { min: 1200000, max: 2400000 },
    ranking: 2,
    established: 1973,
    website: 'https://www.iimb.ac.in',
    accreditation: 'AACSB, EQUIS',
    affiliation: 'AICTE',
    facilities: ['Library', 'Hostel', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Sports Complex', 'Swimming Pool', 'Incubation Centre'],
    courseNames: ['MBA', 'Executive MBA', 'PGDM', 'Ph.D in Management'],
  },
  // 9
  {
    name: 'National Law School of India University',
    type: 'public',
    categories: ['law'],
    description: 'NLSIU Bangalore is India\'s first National Law University, established in 1987. It pioneered the five-year integrated law programme and is consistently ranked as the top law school in the country.',
    location: { address: 'Nagarbhavi', city: 'Bangalore', state: 'Karnataka', pincode: '560072' },
    fees: { min: 200000, max: 350000 },
    ranking: 1,
    established: 1987,
    website: 'https://www.nls.ac.in',
    accreditation: 'NAAC A',
    affiliation: 'BCI, UGC',
    facilities: ['Library', 'Hostel', 'Moot Court Hall', 'WiFi Campus', 'Cafeteria', 'Sports Ground', 'Auditorium'],
    courseNames: ['BA LLB (Hons)', 'LLM'],
  },
  // 10
  {
    name: 'Jawaharlal Nehru University',
    type: 'public',
    categories: ['arts', 'science', 'management'],
    description: 'JNU is one of India\'s most prestigious universities for humanities, social sciences, and pure sciences. Established in 1969, it is known for its vibrant intellectual culture and outstanding research output.',
    location: { address: 'New Mehrauli Road', city: 'New Delhi', state: 'Delhi', pincode: '110067' },
    fees: { min: 12000, max: 50000 },
    ranking: 8,
    established: 1969,
    website: 'https://www.jnu.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'WiFi Campus', 'Cafeteria', 'Sports Complex', 'Health Centre', 'Auditorium', 'Research Labs'],
    courseNames: ['BA in English Literature', 'BA in Economics', 'MA in Political Science', 'BA in Psychology', 'B.Sc in Physics', 'M.Sc in Chemistry'],
  },
  // 11
  {
    name: 'Birla Institute of Technology and Science, Pilani',
    type: 'deemed',
    categories: ['engineering', 'science', 'pharmacy'],
    description: 'BITS Pilani is a deemed university and one of India\'s leading private engineering institutions. Founded in 1964, it is known for its unique dual-degree programme and strong industry connections.',
    location: { address: 'Vidya Vihar Campus', city: 'Pilani', state: 'Rajasthan', pincode: '333031' },
    fees: { min: 400000, max: 600000 },
    ranking: 12,
    established: 1964,
    website: 'https://www.bits-pilani.ac.in',
    accreditation: 'NAAC A',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Swimming Pool', 'Gymnasium'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electronics and Communication', 'B.Tech in Mechanical Engineering', 'B.Tech in Chemical Engineering', 'B.Pharm', 'M.Tech in Computer Science'],
  },
  // 12
  {
    name: 'Vellore Institute of Technology',
    type: 'deemed',
    categories: ['engineering', 'science', 'management'],
    description: 'VIT is a leading private deemed university in India, established in 1984. Known for its modern infrastructure and diverse student body from across the globe, it conducts its own entrance examination — VITEEE.',
    location: { address: 'VIT University Campus', city: 'Vellore', state: 'Tamil Nadu', pincode: '632014' },
    fees: { min: 200000, max: 500000 },
    ranking: 15,
    established: 1984,
    website: 'https://vit.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Gymnasium', 'Swimming Pool', 'Hospital'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electronics and Communication', 'B.Tech in Information Technology', 'B.Tech in Mechanical Engineering', 'MBA', 'M.Tech in Computer Science', 'B.Sc in Physics'],
  },
  // 13
  {
    name: 'Manipal Academy of Higher Education',
    type: 'deemed',
    categories: ['engineering', 'medical', 'management', 'pharmacy', 'architecture'],
    description: 'MAHE is a leading multidisciplinary deemed university located in Manipal, Karnataka. Established in 1953, it offers programmes across engineering, medicine, management, pharmacy, and architecture.',
    location: { address: 'Manipal Campus', city: 'Manipal', state: 'Karnataka', pincode: '576104' },
    fees: { min: 300000, max: 1200000 },
    ranking: 10,
    established: 1953,
    website: 'https://manipal.edu',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Hospital', 'Research Labs', 'Auditorium', 'Swimming Pool', 'Gymnasium'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'MBBS', 'MBA', 'B.Pharm', 'B.Arch', 'B.Tech in Information Technology', 'BDS', 'B.Sc Nursing'],
  },
  // 14
  {
    name: 'SRM Institute of Science and Technology',
    type: 'deemed',
    categories: ['engineering', 'medical', 'management', 'science'],
    description: 'SRMIST is one of India\'s top-ranked private universities, established in 1985 in Chennai. It is known for its state-of-the-art infrastructure and international collaborations with universities worldwide.',
    location: { address: 'SRM Nagar, Kattankulathur', city: 'Chennai', state: 'Tamil Nadu', pincode: '603203' },
    fees: { min: 250000, max: 700000 },
    ranking: 18,
    established: 1985,
    website: 'https://www.srmist.edu.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Gymnasium', 'Hospital', 'Bank'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electronics and Communication', 'B.Tech in Mechanical Engineering', 'MBBS', 'MBA', 'BBA', 'B.Sc in Physics'],
  },
  // 15
  {
    name: 'University of Delhi',
    type: 'public',
    categories: ['arts', 'science', 'commerce', 'law'],
    description: 'The University of Delhi, established in 1922, is one of the oldest and most prestigious central universities in India. Its sprawling North and South campuses house numerous acclaimed colleges and departments.',
    location: { address: 'University Road', city: 'New Delhi', state: 'Delhi', pincode: '110007' },
    fees: { min: 10000, max: 80000 },
    ranking: 6,
    established: 1922,
    website: 'http://www.du.ac.in',
    accreditation: 'NAAC A+',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Health Centre', 'Research Labs'],
    courseNames: ['BA in English Literature', 'BA in Economics', 'B.Com (Hons)', 'B.Sc in Physics', 'B.Sc in Mathematics', 'BA LLB (Hons)', 'MA in Political Science', 'M.Com'],
  },
  // 16
  {
    name: 'Banaras Hindu University',
    type: 'public',
    categories: ['arts', 'science', 'engineering', 'medical', 'education'],
    description: 'BHU is one of the largest residential universities in Asia, founded by Pandit Madan Mohan Malaviya in 1916. It is renowned for its academic heritage and its beautiful campus along the banks of the Ganges.',
    location: { address: 'BHU Campus, Lanka', city: 'Varanasi', state: 'Uttar Pradesh', pincode: '221005' },
    fees: { min: 15000, max: 150000 },
    ranking: 7,
    established: 1916,
    website: 'https://www.bhu.ac.in',
    accreditation: 'NAAC A',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Hospital', 'Auditorium', 'Museum', 'Temple'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Mechanical Engineering', 'MBBS', 'BA in English Literature', 'B.Sc in Physics', 'B.Ed', 'M.Sc in Chemistry'],
  },
  // 17
  {
    name: 'Jadavpur University',
    type: 'public',
    categories: ['engineering', 'arts', 'science'],
    description: 'Jadavpur University, established in 1955 in Kolkata, is a highly respected state university known for its engineering and humanities programmes. It has a strong tradition of student activism and academic excellence.',
    location: { address: '188, Raja S.C. Mallick Road', city: 'Kolkata', state: 'West Bengal', pincode: '700032' },
    fees: { min: 10000, max: 50000 },
    ranking: 14,
    established: 1955,
    website: 'http://www.jaduniv.edu.in',
    accreditation: 'NAAC A',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Ground', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Labs'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electrical Engineering', 'B.Tech in Electronics and Communication', 'BA in English Literature', 'B.Sc in Physics', 'M.Tech in Computer Science'],
  },
  // 18
  {
    name: 'National Institute of Technology Tiruchirappalli',
    type: 'public',
    categories: ['engineering', 'science', 'architecture'],
    description: 'NIT Trichy is one of the premier National Institutes of Technology in India. Established in 1964, it is widely regarded as one of the best NITs and is known for producing outstanding engineers.',
    location: { address: 'NIT Campus, Tanjore Main Road', city: 'Tiruchirappalli', state: 'Tamil Nadu', pincode: '620015' },
    fees: { min: 125000, max: 200000 },
    ranking: 9,
    established: 1964,
    website: 'https://www.nitt.edu',
    accreditation: 'NAAC A+',
    affiliation: 'AICTE, UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Gymnasium'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electronics and Communication', 'B.Tech in Mechanical Engineering', 'B.Tech in Civil Engineering', 'B.Arch', 'M.Tech in Computer Science', 'M.Tech in Structural Engineering'],
  },
  // 19
  {
    name: 'Amity University, Noida',
    type: 'private',
    categories: ['engineering', 'management', 'law', 'arts', 'commerce'],
    description: 'Amity University is one of India\'s largest private universities with a sprawling campus in Noida. Established in 2005, it offers a wide range of programmes and has strong industry partnerships.',
    location: { address: 'Sector 125', city: 'Noida', state: 'Uttar Pradesh', pincode: '201313' },
    fees: { min: 200000, max: 800000 },
    ranking: 30,
    established: 2005,
    website: 'https://www.amity.edu',
    accreditation: 'NAAC A+',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Labs', 'Gymnasium', 'Bank', 'Food Court'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Information Technology', 'MBA', 'BBA', 'BA LLB (Hons)', 'BA in Psychology', 'B.Com (Hons)', 'BCA'],
  },
  // 20
  {
    name: 'Symbiosis International University',
    type: 'deemed',
    categories: ['management', 'law', 'arts', 'science'],
    description: 'Symbiosis International University, established in 2002 in Pune, is a multi-institutional deemed university known for its management, law, and liberal arts programmes, and its emphasis on international education.',
    location: { address: 'Lavale, Mulshi Taluka', city: 'Pune', state: 'Maharashtra', pincode: '412115' },
    fees: { min: 300000, max: 1200000 },
    ranking: 20,
    established: 2002,
    website: 'https://siu.edu.in',
    accreditation: 'NAAC A',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Gymnasium', 'Swimming Pool'],
    courseNames: ['MBA', 'PGDM', 'BA LLB (Hons)', 'LLM', 'BBA', 'BA in Economics', 'BA in English Literature'],
  },
  // 21
  {
    name: 'Christ University',
    type: 'deemed',
    categories: ['arts', 'commerce', 'management', 'science'],
    description: 'Christ University, established in 1969 in Bangalore, is a prestigious deemed university known for its holistic approach to education. It offers a vibrant campus life and diverse academic programmes.',
    location: { address: 'Hosur Road', city: 'Bangalore', state: 'Karnataka', pincode: '560029' },
    fees: { min: 100000, max: 500000 },
    ranking: 22,
    established: 1969,
    website: 'https://christuniversity.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Labs', 'Chapel'],
    courseNames: ['BBA', 'MBA', 'B.Com (Hons)', 'BA in Economics', 'BA in Psychology', 'B.Sc in Mathematics', 'M.Com'],
  },
  // 22
  {
    name: 'Savitribai Phule Pune University',
    type: 'public',
    categories: ['arts', 'science', 'commerce', 'management', 'education'],
    description: 'SPPU, formerly the University of Pune, is one of the premier universities in India established in 1949. It has a rich academic heritage and is a leading centre for research in science and humanities.',
    location: { address: 'Ganeshkhind Road', city: 'Pune', state: 'Maharashtra', pincode: '411007' },
    fees: { min: 15000, max: 100000 },
    ranking: 11,
    established: 1949,
    website: 'http://www.unipune.ac.in',
    accreditation: 'NAAC A+',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Research Labs', 'Botanical Garden'],
    courseNames: ['BA in English Literature', 'B.Sc in Physics', 'B.Sc in Mathematics', 'B.Com (Hons)', 'MBA', 'B.Ed', 'M.Sc in Chemistry', 'M.Com'],
  },
  // 23
  {
    name: 'Jamia Millia Islamia',
    type: 'public',
    categories: ['engineering', 'arts', 'education', 'law', 'architecture'],
    description: 'Jamia Millia Islamia is a central university in New Delhi, established in 1920. It has grown into a major centre for higher education offering programmes in engineering, humanities, education, and architecture.',
    location: { address: 'Jamia Nagar, Okhla', city: 'New Delhi', state: 'Delhi', pincode: '110025' },
    fees: { min: 15000, max: 120000 },
    ranking: 13,
    established: 1920,
    website: 'https://www.jmi.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Health Centre', 'Labs', 'Mosque'],
    courseNames: ['B.Tech in Civil Engineering', 'B.Tech in Computer Science and Engineering', 'B.Arch', 'BA in English Literature', 'BA LLB (Hons)', 'B.Ed', 'MA in Political Science'],
  },
  // 24
  {
    name: 'Indian Institute of Science',
    type: 'public',
    categories: ['engineering', 'science'],
    description: 'IISc Bangalore, established in 1909, is India\'s premier institute for advanced scientific and technological research. It is consistently ranked number one in research output among Indian universities.',
    location: { address: 'CV Raman Avenue, Malleshwaram', city: 'Bangalore', state: 'Karnataka', pincode: '560012' },
    fees: { min: 20000, max: 50000 },
    ranking: 1,
    established: 1909,
    website: 'https://iisc.ac.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Auditorium', 'Supercomputing Centre', 'Museum'],
    courseNames: ['B.Sc in Physics', 'B.Sc in Mathematics', 'M.Sc in Chemistry', 'M.Tech in Computer Science', 'Ph.D in Engineering'],
  },
  // 25
  {
    name: 'Lovely Professional University',
    type: 'private',
    categories: ['engineering', 'management', 'arts', 'commerce', 'pharmacy'],
    description: 'LPU is one of India\'s largest private universities, established in 2005 in Punjab. With its massive campus and a diverse student body from over 56 countries, it offers more than 200 programmes.',
    location: { address: 'Grand Trunk Road, Phagwara', city: 'Jalandhar', state: 'Punjab', pincode: '144411' },
    fees: { min: 100000, max: 400000 },
    ranking: 35,
    established: 2005,
    website: 'https://www.lpu.in',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Labs', 'Gymnasium', 'Swimming Pool', 'Shopping Complex', 'Hospital'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Mechanical Engineering', 'MBA', 'BBA', 'BA in Psychology', 'B.Com (Hons)', 'B.Pharm', 'BCA'],
  },
  // 26
  {
    name: 'Chandigarh University',
    type: 'private',
    categories: ['engineering', 'management', 'commerce', 'pharmacy', 'education'],
    description: 'Chandigarh University, established in 2012, has rapidly risen to become one of India\'s top private universities. It is known for its patent filings, placement records, and modern infrastructure.',
    location: { address: 'NH-95, Ludhiana-Chandigarh Highway, Mohali', city: 'Mohali', state: 'Punjab', pincode: '140413' },
    fees: { min: 150000, max: 450000 },
    ranking: 25,
    established: 2012,
    website: 'https://www.cuchd.in',
    accreditation: 'NAAC A+',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Labs', 'Gymnasium', 'Swimming Pool', 'Incubation Centre'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electronics and Communication', 'MBA', 'BBA', 'B.Com (Hons)', 'B.Pharm', 'D.Pharm', 'B.Ed'],
  },
  // 27
  {
    name: 'Osmania University',
    type: 'public',
    categories: ['arts', 'science', 'engineering', 'commerce', 'law'],
    description: 'Osmania University, established in 1918 in Hyderabad, is one of the oldest universities in southern India. It is known for its heritage campus architecture and strong academic tradition.',
    location: { address: 'Amberpet', city: 'Hyderabad', state: 'Telangana', pincode: '500007' },
    fees: { min: 10000, max: 80000 },
    ranking: 16,
    established: 1918,
    website: 'https://www.osmania.ac.in',
    accreditation: 'NAAC A',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Arts Centre', 'Health Centre'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'BA in English Literature', 'B.Sc in Physics', 'B.Com (Hons)', 'LLB', 'BA in Economics', 'M.Com'],
  },
  // 28
  {
    name: 'Jamia Hamdard University',
    type: 'deemed',
    categories: ['pharmacy', 'medical', 'management', 'science'],
    description: 'Jamia Hamdard, established in 1989, is a deemed university in New Delhi known for its pharmacy and medical programmes. It has a rich tradition in Unani medicine and pharmaceutical sciences.',
    location: { address: 'Hamdard Nagar, Mehrauli-Badarpur Road', city: 'New Delhi', state: 'Delhi', pincode: '110062' },
    fees: { min: 80000, max: 500000 },
    ranking: 28,
    established: 1989,
    website: 'https://www.jamiahamdard.edu',
    accreditation: 'NAAC A',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'WiFi Campus', 'Cafeteria', 'Research Labs', 'Hospital', 'Herbal Garden', 'Auditorium'],
    courseNames: ['B.Pharm', 'M.Pharm', 'D.Pharm', 'MBBS', 'B.Sc Nursing', 'MBA', 'B.Sc in Mathematics'],
  },
  // 29
  {
    name: 'Anna University',
    type: 'public',
    categories: ['engineering', 'science', 'architecture'],
    description: 'Anna University, established in 1978 in Chennai, is one of the most important technical universities in Tamil Nadu. It is the affiliating university for hundreds of engineering colleges across the state.',
    location: { address: 'Guindy', city: 'Chennai', state: 'Tamil Nadu', pincode: '600025' },
    fees: { min: 30000, max: 100000 },
    ranking: 17,
    established: 1978,
    website: 'https://www.annauniv.edu',
    accreditation: 'NAAC A++',
    affiliation: 'UGC, AICTE',
    facilities: ['Library', 'Hostel', 'Sports Complex', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Research Labs', 'Gymnasium'],
    courseNames: ['B.Tech in Computer Science and Engineering', 'B.Tech in Electronics and Communication', 'B.Tech in Information Technology', 'B.Tech in Civil Engineering', 'B.Arch', 'M.Tech in Computer Science', 'M.Arch'],
  },
  // 30
  {
    name: 'Tata Institute of Social Sciences',
    type: 'deemed',
    categories: ['arts', 'education', 'management'],
    description: 'TISS, established in 1936 in Mumbai, is one of India\'s oldest and most esteemed social science institutions. It is known for its programmes in social work, education, public policy, and development studies.',
    location: { address: 'V.N. Purav Marg, Deonar', city: 'Mumbai', state: 'Maharashtra', pincode: '400088' },
    fees: { min: 60000, max: 250000 },
    ranking: 19,
    established: 1936,
    website: 'https://www.tiss.edu',
    accreditation: 'NAAC A++',
    affiliation: 'UGC',
    facilities: ['Library', 'Hostel', 'WiFi Campus', 'Cafeteria', 'Auditorium', 'Sports Ground', 'Research Labs', 'Health Centre'],
    courseNames: ['BA in Psychology', 'BA in Economics', 'MA in Political Science', 'MBA', 'B.Ed', 'M.Ed'],
  },
];

// ─── Content section templates ───────────────────────────────────────────────

function generateContentSections(collegeName, collegeCity, collegeState, collegeType, categories) {
  const sections = [];

  // About section (always included)
  sections.push({
    sectionKey: 'about',
    title: 'About ' + collegeName,
    content: `<p>${collegeName} is a prestigious ${collegeType} institution located in ${collegeCity}, ${collegeState}. The college has built a strong reputation over the decades for academic excellence, innovative research, and holistic development of its students. With a commitment to nurturing future leaders, the institution provides a stimulating learning environment that encourages critical thinking and creativity.</p>
<p>The campus spans a vast area with modern infrastructure, well-equipped laboratories, and state-of-the-art facilities. The institution boasts a distinguished faculty comprising accomplished academics and industry experts who bring real-world experience into the classroom. Students benefit from a rich ecosystem of mentorship, interdisciplinary collaboration, and exposure to global best practices.</p>
<p>Over the years, ${collegeName} has produced a remarkable roster of alumni who have gone on to make significant contributions in their respective fields — from technology and medicine to public policy and entrepreneurship. The institution continues to evolve, adapting to the changing demands of higher education while staying true to its founding values of excellence, integrity, and service to society.</p>`,
    contentType: 'richtext',
    order: 1,
    isVisible: true,
  });

  // Admissions section
  sections.push({
    sectionKey: 'admissions',
    title: 'Admissions at ' + collegeName,
    content: `<p>Admissions to ${collegeName} are highly competitive and follow a rigorous selection process designed to identify the most talented and motivated students. The institution accepts applications through national and state-level entrance examinations, depending on the programme. For undergraduate programmes, candidates are expected to have a strong academic record in their qualifying examinations.</p>
<p>The admission process typically involves evaluation of entrance exam scores, academic performance, and in some cases, personal interviews or group discussions. The college also reserves seats in accordance with government norms, including provisions for SC/ST, OBC, EWS, and PwD categories. Prospective students are encouraged to visit the official website for detailed programme-specific eligibility criteria and application deadlines.</p>
<p>International students can apply through a separate admission track. The institution has dedicated counselling services to assist applicants throughout the process, ensuring a smooth and transparent experience from application to enrolment.</p>`,
    contentType: 'richtext',
    order: 2,
    isVisible: true,
  });

  // Placements section
  if (categories.some(c => ['engineering', 'management', 'commerce', 'pharmacy'].includes(c))) {
    sections.push({
      sectionKey: 'placements',
      title: 'Placements at ' + collegeName,
      content: `<p>${collegeName} has an outstanding placement record, with leading companies from across India and abroad visiting the campus each year. The college's Training and Placement Cell works tirelessly to prepare students for the job market through resume workshops, mock interviews, aptitude training, and industry interaction sessions.</p>
<p>In the most recent placement season, the institution recorded impressive placement statistics with a high percentage of eligible students receiving offers. Top recruiters include global technology firms, consulting giants, financial institutions, and manufacturing leaders. The median package has shown consistent year-on-year growth, reflecting the strong industry demand for the college's graduates.</p>
<p>Beyond traditional placements, the college actively promotes entrepreneurship through its incubation centre and startup support programmes. Many students choose to launch their own ventures upon graduation, leveraging the entrepreneurial ecosystem and mentorship available on campus. The alumni network also plays a vital role in mentoring current students and providing internship and job referrals.</p>`,
      contentType: 'richtext',
      order: 3,
      isVisible: true,
    });
  }

  // Campus Life section
  sections.push({
    sectionKey: 'campus-life',
    title: 'Campus Life at ' + collegeName,
    content: `<p>Life at ${collegeName} extends far beyond the classroom. The campus buzzes with activity throughout the year, from cultural festivals and technical symposiums to sports tournaments and community service initiatives. Students have access to a wide array of clubs and societies covering interests ranging from robotics and coding to theatre, music, and photography.</p>
<p>The residential experience is an integral part of campus life. Well-maintained hostels provide a comfortable and safe living environment, complete with dining facilities, common rooms, and recreational areas. The campus also features modern amenities including a well-stocked library, sports complex, cafeteria, and healthcare centre, ensuring that students have everything they need for a fulfilling college experience.</p>`,
    contentType: 'richtext',
    order: 4,
    isVisible: true,
  });

  return sections;
}


// ─── Main seeding function ───────────────────────────────────────────────────

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB.\n');

    // ── Clean existing data ──────────────────────────────────────────────
    console.log('Cleaning existing data...');
    await ContentSection.deleteMany({});
    await College.deleteMany({});
    await Course.deleteMany({});
    console.log('Deleted existing colleges, courses, and content sections.\n');

    // ── Create courses ───────────────────────────────────────────────────
    console.log('Creating courses...');
    const courseMap = {}; // name -> ObjectId

    for (const def of courseDefs) {
      const slug = await ensureUniqueSlug(Course, def.name);
      const course = await Course.create({
        name: def.name,
        slug,
        level: def.level,
        duration: def.duration,
        stream: def.stream,
        specializations: def.specializations,
        fees: def.fees,
        description: def.description,
        eligibility: def.eligibility,
        isActive: true,
      });
      courseMap[def.name] = course._id;
    }
    console.log(`Created ${Object.keys(courseMap).length} courses.\n`);

    // ── Create colleges ──────────────────────────────────────────────────
    console.log('Creating colleges...');
    const createdColleges = [];

    for (const def of collegeDefs) {
      const slug = await ensureUniqueSlug(College, def.name);
      const courseIds = def.courseNames
        .filter(n => courseMap[n])
        .map(n => courseMap[n]);

      const college = await College.create({
        name: def.name,
        slug,
        type: def.type,
        categories: def.categories,
        description: def.description,
        location: def.location,
        courses: courseIds,
        fees: { min: def.fees.min, max: def.fees.max, currency: 'INR' },
        ranking: def.ranking,
        established: def.established,
        website: def.website,
        accreditation: def.accreditation,
        affiliation: def.affiliation,
        facilities: def.facilities,
        status: 'published',
      });
      createdColleges.push(college);
    }
    console.log(`Created ${createdColleges.length} colleges.\n`);

    // ── Create content sections ──────────────────────────────────────────
    console.log('Creating content sections...');
    let totalSections = 0;

    for (const college of createdColleges) {
      const sections = generateContentSections(
        college.name,
        college.location.city,
        college.location.state,
        college.type,
        college.categories
      );

      for (const sec of sections) {
        await ContentSection.create({
          college: college._id,
          sectionKey: sec.sectionKey,
          title: sec.title,
          content: sec.content,
          contentType: sec.contentType,
          order: sec.order,
          isVisible: sec.isVisible,
        });
        totalSections++;
      }
    }
    console.log(`Created ${totalSections} content sections.\n`);

    // ── Summary ──────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════');
    console.log('  SEEDING COMPLETE');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Courses created:          ${Object.keys(courseMap).length}`);
    console.log(`  Colleges created:         ${createdColleges.length}`);
    console.log(`  Content sections created: ${totalSections}`);
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
