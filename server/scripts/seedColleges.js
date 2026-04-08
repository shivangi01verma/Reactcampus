/**
 * Seed script: Clears all colleges, courses, and college content sections,
 * then creates 15 courses and 30 colleges with realistic Indian data.
 *
 * Usage: node server/scripts/seedColleges.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const College = require('../src/models/College.model');
const Course = require('../src/models/Course.model');
const ContentSection = require('../src/models/ContentSection.model');

const MONGO_URI = process.env.MONGODB_URI;

// ─── Course Data ──────────────────────────────────────────────────────────────

const coursesData = [
  // Engineering
  { name: 'B.Tech Computer Science', slug: 'btech-cs', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'engineering', specializations: ['AI & Machine Learning', 'Data Science', 'Cybersecurity', 'Cloud Computing'], fees: { amount: 200000, currency: 'INR', per: 'year' }, description: 'Four-year undergraduate programme in Computer Science and Engineering covering algorithms, data structures, software engineering, and emerging technologies.', eligibility: '10+2 with Physics, Chemistry, and Mathematics with minimum 60% marks. Valid JEE Main / state entrance exam score.' },
  { name: 'B.Tech Mechanical Engineering', slug: 'btech-me', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'engineering', specializations: ['Robotics', 'Thermal Engineering', 'Automobile Engineering'], fees: { amount: 180000, currency: 'INR', per: 'year' }, description: 'Four-year programme covering thermodynamics, mechanics, manufacturing, and design engineering.', eligibility: '10+2 with PCM, minimum 55% marks. JEE Main / state entrance exam.' },
  { name: 'B.Tech Electronics & Communication', slug: 'btech-ece', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'engineering', specializations: ['VLSI Design', 'Embedded Systems', 'Signal Processing'], fees: { amount: 190000, currency: 'INR', per: 'year' }, description: 'Four-year programme in electronics, communication systems, and signal processing.', eligibility: '10+2 with PCM, minimum 55% marks. Valid entrance exam score.' },
  { name: 'M.Tech Data Science', slug: 'mtech-ds', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'engineering', specializations: ['Big Data Analytics', 'Deep Learning', 'NLP'], fees: { amount: 250000, currency: 'INR', per: 'year' }, description: 'Two-year postgraduate programme focused on advanced data analytics, machine learning, and artificial intelligence.', eligibility: 'B.Tech/BE with minimum 60% marks. Valid GATE score preferred.' },
  // Medical
  { name: 'MBBS', slug: 'mbbs', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'medical', specializations: [], fees: { amount: 500000, currency: 'INR', per: 'year' }, description: 'Five-and-a-half year programme including one year of internship, covering preclinical, paraclinical, and clinical subjects.', eligibility: '10+2 with Physics, Chemistry, Biology with minimum 50% marks. Valid NEET UG score.' },
  { name: 'BDS', slug: 'bds', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'medical', specializations: ['Orthodontics', 'Oral Surgery', 'Prosthodontics'], fees: { amount: 350000, currency: 'INR', per: 'year' }, description: 'Five-year dental surgery programme covering oral anatomy, pathology, and clinical dentistry.', eligibility: '10+2 with PCB, minimum 50% marks. Valid NEET UG score.' },
  { name: 'B.Pharma', slug: 'bpharma', level: 'undergraduate', duration: { value: 4, unit: 'years' }, stream: 'pharmacy', specializations: ['Pharmaceutics', 'Pharmacology', 'Clinical Research'], fees: { amount: 150000, currency: 'INR', per: 'year' }, description: 'Four-year pharmacy programme covering pharmaceutical chemistry, pharmacology, and drug formulation.', eligibility: '10+2 with PCB/PCM, minimum 50% marks.' },
  // Management
  { name: 'MBA', slug: 'mba', level: 'postgraduate', duration: { value: 2, unit: 'years' }, stream: 'management', specializations: ['Finance', 'Marketing', 'Human Resources', 'Operations', 'IT Management'], fees: { amount: 400000, currency: 'INR', per: 'year' }, description: 'Two-year postgraduate management programme covering business strategy, finance, marketing, and leadership.', eligibility: 'Graduation in any discipline with minimum 50% marks. Valid CAT / MAT / XAT score.' },
  { name: 'BBA', slug: 'bba', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'management', specializations: ['Finance', 'Marketing', 'International Business'], fees: { amount: 120000, currency: 'INR', per: 'year' }, description: 'Three-year undergraduate programme in business administration covering management fundamentals.', eligibility: '10+2 in any stream with minimum 50% marks.' },
  // Law
  { name: 'BA LLB (Hons)', slug: 'ba-llb', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'law', specializations: ['Corporate Law', 'Criminal Law', 'Constitutional Law'], fees: { amount: 200000, currency: 'INR', per: 'year' }, description: 'Integrated five-year programme combining arts and law covering constitutional, criminal, corporate, and international law.', eligibility: '10+2 in any stream with minimum 45% marks. Valid CLAT / AILET score.' },
  { name: 'LLB', slug: 'llb', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'law', specializations: ['Litigation', 'Corporate Law', 'Intellectual Property'], fees: { amount: 150000, currency: 'INR', per: 'year' }, description: 'Three-year law programme for graduates covering substantive and procedural law.', eligibility: 'Graduation in any discipline with minimum 45% marks.' },
  // Arts & Science
  { name: 'B.Sc Computer Science', slug: 'bsc-cs', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'science', specializations: ['Software Development', 'Data Analytics'], fees: { amount: 50000, currency: 'INR', per: 'year' }, description: 'Three-year science programme covering programming, mathematics, and computer applications.', eligibility: '10+2 with Mathematics, minimum 50% marks.' },
  { name: 'BA Economics', slug: 'ba-economics', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'arts', specializations: ['Development Economics', 'Econometrics'], fees: { amount: 40000, currency: 'INR', per: 'year' }, description: 'Three-year arts programme covering micro and macroeconomics, econometrics, and development studies.', eligibility: '10+2 in any stream with minimum 50% marks.' },
  { name: 'B.Arch', slug: 'barch', level: 'undergraduate', duration: { value: 5, unit: 'years' }, stream: 'architecture', specializations: ['Urban Design', 'Sustainable Architecture', 'Interior Design'], fees: { amount: 250000, currency: 'INR', per: 'year' }, description: 'Five-year professional programme in architecture covering design, construction technology, and urban planning.', eligibility: '10+2 with Mathematics, minimum 50% marks. Valid NATA / JEE Main Paper 2 score.' },
  { name: 'B.Com (Hons)', slug: 'bcom-hons', level: 'undergraduate', duration: { value: 3, unit: 'years' }, stream: 'commerce', specializations: ['Accounting', 'Taxation', 'Banking & Finance'], fees: { amount: 45000, currency: 'INR', per: 'year' }, description: 'Three-year commerce programme covering accounting, finance, taxation, and business law.', eligibility: '10+2 in Commerce stream with minimum 55% marks.' },
];

// ─── College Data ─────────────────────────────────────────────────────────────

const collegesData = [
  // Pure Engineering (5)
  { name: 'Indian Institute of Technology Bombay', slug: 'iit-bombay', type: 'public', categories: ['engineering'], city: 'Mumbai', state: 'Maharashtra', ranking: 3, established: 1958, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://www.iitb.ac.in', fees: { min: 200000, max: 800000 }, facilities: ['Library', 'Hostel', 'Sports Complex', 'Research Labs', 'Placement Cell', 'Wi-Fi Campus'], description: 'IIT Bombay is one of India\'s premier engineering institutions, known for cutting-edge research and world-class faculty. Located in Powai, Mumbai, it offers top-tier programmes in technology, science, and design.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'mtech-ds'] },
  { name: 'National Institute of Technology Trichy', slug: 'nit-trichy', type: 'public', categories: ['engineering'], city: 'Tiruchirappalli', state: 'Tamil Nadu', ranking: 9, established: 1964, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://www.nitt.edu', fees: { min: 150000, max: 600000 }, facilities: ['Library', 'Hostel', 'Sports Complex', 'Labs', 'Placement Cell'], description: 'NIT Trichy is among the top NITs in India, known for strong academics and excellent placement records in engineering and technology.', courseNames: ['btech-cs', 'btech-me', 'btech-ece'] },
  { name: 'Birla Institute of Technology and Science Pilani', slug: 'bits-pilani', type: 'deemed', categories: ['engineering'], city: 'Pilani', state: 'Rajasthan', ranking: 24, established: 1964, accreditation: 'NAAC A', affiliation: 'UGC', website: 'https://www.bits-pilani.ac.in', fees: { min: 400000, max: 1000000 }, facilities: ['Library', 'Hostel', 'Labs', 'Innovation Centre', 'Placement Cell', 'Wi-Fi Campus'], description: 'BITS Pilani is a premier private engineering institution known for its unique admission process and strong industry connections.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'mtech-ds'] },
  { name: 'Vellore Institute of Technology', slug: 'vit-vellore', type: 'deemed', categories: ['engineering'], city: 'Vellore', state: 'Tamil Nadu', ranking: 12, established: 1984, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://vit.ac.in', fees: { min: 200000, max: 700000 }, facilities: ['Library', 'Hostel', 'Research Park', 'Sports Facilities', 'Placement Cell'], description: 'VIT is a leading private university offering world-class engineering education with international collaborations and excellent placement records.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'bsc-cs'] },
  { name: 'Delhi Technological University', slug: 'dtu-delhi', type: 'public', categories: ['engineering'], city: 'New Delhi', state: 'Delhi', ranking: 36, established: 1941, accreditation: 'NAAC A+', affiliation: 'UGC', website: 'https://dtu.ac.in', fees: { min: 150000, max: 500000 }, facilities: ['Library', 'Hostel', 'Labs', 'Sports Ground', 'Placement Cell'], description: 'DTU (formerly Delhi College of Engineering) is one of the oldest and most reputed engineering colleges in Delhi with excellent alumni network.', courseNames: ['btech-cs', 'btech-me', 'btech-ece'] },

  // Pure Medical (4)
  { name: 'All India Institute of Medical Sciences Delhi', slug: 'aiims-delhi', type: 'public', categories: ['medical'], city: 'New Delhi', state: 'Delhi', ranking: 1, established: 1956, accreditation: 'NAAC A++', affiliation: 'MCI', website: 'https://www.aiims.edu', fees: { min: 10000, max: 50000 }, facilities: ['Hospital', 'Library', 'Hostel', 'Research Labs', 'Auditorium'], description: 'AIIMS Delhi is India\'s top medical institution, established by an Act of Parliament. It is a centre of excellence in medical education, research, and patient care.', courseNames: ['mbbs'] },
  { name: 'Christian Medical College Vellore', slug: 'cmc-vellore', type: 'private', categories: ['medical'], city: 'Vellore', state: 'Tamil Nadu', ranking: 5, established: 1900, accreditation: 'NAAC A++', affiliation: 'MCI', website: 'https://www.cmch-vellore.edu', fees: { min: 50000, max: 200000 }, facilities: ['Hospital', 'Library', 'Hostel', 'Research Centre', 'Community Health'], description: 'CMC Vellore is one of the oldest and most prestigious medical colleges in India, renowned for clinical excellence and community-oriented medical education.', courseNames: ['mbbs', 'bds'] },
  { name: 'Kasturba Medical College Manipal', slug: 'kmc-manipal', type: 'private', categories: ['medical'], city: 'Manipal', state: 'Karnataka', ranking: 8, established: 1953, accreditation: 'NAAC A++', affiliation: 'Manipal Academy of Higher Education', website: 'https://manipal.edu/kmc-manipal.html', fees: { min: 600000, max: 1500000 }, facilities: ['Hospital', 'Library', 'Hostel', 'Simulation Centre', 'Research Labs'], description: 'KMC Manipal is a leading private medical college under MAHE, offering comprehensive medical education with modern infrastructure and clinical training.', courseNames: ['mbbs', 'bds', 'bpharma'] },
  { name: 'Maulana Azad Medical College', slug: 'mamc-delhi', type: 'public', categories: ['medical'], city: 'New Delhi', state: 'Delhi', ranking: 4, established: 1958, accreditation: 'NAAC A+', affiliation: 'University of Delhi', website: 'https://www.mamc.ac.in', fees: { min: 10000, max: 30000 }, facilities: ['Hospital', 'Library', 'Hostel', 'Labs', 'Auditorium'], description: 'MAMC is one of Delhi\'s premier government medical colleges affiliated with Lok Nayak Hospital, known for its affordable quality medical education.', courseNames: ['mbbs'] },

  // Pure Law (3)
  { name: 'National Law School of India University', slug: 'nlsiu-bangalore', type: 'public', categories: ['law'], city: 'Bangalore', state: 'Karnataka', ranking: 1, established: 1987, accreditation: 'NAAC A', affiliation: 'BCI', website: 'https://www.nls.ac.in', fees: { min: 200000, max: 350000 }, facilities: ['Library', 'Moot Court', 'Hostel', 'Legal Aid Clinic', 'Wi-Fi Campus'], description: 'NLSIU Bangalore is India\'s premier law university and pioneer of the five-year integrated law programme, consistently ranked #1 in law education.', courseNames: ['ba-llb', 'llb'] },
  { name: 'National Academy of Legal Studies and Research', slug: 'nalsar-hyderabad', type: 'public', categories: ['law'], city: 'Hyderabad', state: 'Telangana', ranking: 2, established: 1998, accreditation: 'NAAC A+', affiliation: 'BCI', website: 'https://www.nalsar.ac.in', fees: { min: 200000, max: 300000 }, facilities: ['Library', 'Moot Court', 'Hostel', 'Seminar Hall', 'Legal Clinic'], description: 'NALSAR is one of India\'s top National Law Universities, known for its rigorous academic programme and distinguished faculty in legal studies.', courseNames: ['ba-llb', 'llb'] },
  { name: 'West Bengal National University of Juridical Sciences', slug: 'nujs-kolkata', type: 'public', categories: ['law'], city: 'Kolkata', state: 'West Bengal', ranking: 3, established: 1999, accreditation: 'NAAC A', affiliation: 'BCI', website: 'https://www.nujs.edu', fees: { min: 180000, max: 280000 }, facilities: ['Library', 'Moot Court', 'Hostel', 'Computer Lab', 'Legal Aid'], description: 'NUJS Kolkata is a top-ranked National Law University offering excellent legal education with strong emphasis on research and advocacy.', courseNames: ['ba-llb', 'llb'] },

  // Pure Management (3)
  { name: 'Indian Institute of Management Ahmedabad', slug: 'iim-ahmedabad', type: 'public', categories: ['management'], city: 'Ahmedabad', state: 'Gujarat', ranking: 1, established: 1961, accreditation: 'AACSB, AMBA, EQUIS', affiliation: 'AICTE', website: 'https://www.iima.ac.in', fees: { min: 1000000, max: 2500000 }, facilities: ['Library', 'Hostel', 'Auditorium', 'Sports Complex', 'Incubation Centre'], description: 'IIM Ahmedabad is India\'s most prestigious business school, known for its flagship PGP programme, case-based teaching methodology, and stellar placement record.', courseNames: ['mba'] },
  { name: 'Indian Institute of Management Bangalore', slug: 'iim-bangalore', type: 'public', categories: ['management'], city: 'Bangalore', state: 'Karnataka', ranking: 2, established: 1973, accreditation: 'AACSB, AMBA, EQUIS', affiliation: 'AICTE', website: 'https://www.iimb.ac.in', fees: { min: 1000000, max: 2400000 }, facilities: ['Library', 'Hostel', 'Auditorium', 'Innovation Hub', 'Placement Cell'], description: 'IIM Bangalore is a world-renowned management institution offering cutting-edge business education with strong focus on entrepreneurship and innovation.', courseNames: ['mba'] },
  { name: 'Xavier Labour Relations Institute', slug: 'xlri-jamshedpur', type: 'private', categories: ['management'], city: 'Jamshedpur', state: 'Jharkhand', ranking: 7, established: 1949, accreditation: 'AACSB, AMBA', affiliation: 'AICTE', website: 'https://www.xlri.ac.in', fees: { min: 800000, max: 2200000 }, facilities: ['Library', 'Hostel', 'Sports Complex', 'Conference Hall', 'Placement Cell'], description: 'XLRI is one of India\'s oldest and most reputed private business schools, especially renowned for its HR management programme.', courseNames: ['mba', 'bba'] },

  // Engineering + Management (4)
  { name: 'Indian Institute of Technology Delhi', slug: 'iit-delhi', type: 'public', categories: ['engineering', 'management'], city: 'New Delhi', state: 'Delhi', ranking: 2, established: 1961, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://home.iitd.ac.in', fees: { min: 200000, max: 1000000 }, facilities: ['Library', 'Hostel', 'Sports Complex', 'Research Labs', 'Incubation Centre', 'Placement Cell'], description: 'IIT Delhi is a world-class institution offering premier engineering and management programmes with exceptional research output and industry collaborations.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'mtech-ds', 'mba'] },
  { name: 'Indian Institute of Technology Madras', slug: 'iit-madras', type: 'public', categories: ['engineering', 'management'], city: 'Chennai', state: 'Tamil Nadu', ranking: 1, established: 1959, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://www.iitm.ac.in', fees: { min: 200000, max: 900000 }, facilities: ['Library', 'Hostel', 'Research Park', 'Sports Complex', 'Incubation Centre'], description: 'IIT Madras is India\'s #1 ranked engineering institution, known for its research park, industry connections, and excellent academic environment.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'mtech-ds', 'mba'] },
  { name: 'Manipal Institute of Technology', slug: 'mit-manipal', type: 'private', categories: ['engineering', 'management'], city: 'Manipal', state: 'Karnataka', ranking: 18, established: 1957, accreditation: 'NAAC A++', affiliation: 'MAHE', website: 'https://manipal.edu/mit.html', fees: { min: 300000, max: 900000 }, facilities: ['Library', 'Hostel', 'Labs', 'Sports Complex', 'Innovation Centre', 'Placement Cell'], description: 'MIT Manipal is a top private engineering college under MAHE, offering diverse programmes in engineering and management with excellent campus life.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'mba', 'bba'] },
  { name: 'SRM Institute of Science and Technology', slug: 'srm-chennai', type: 'deemed', categories: ['engineering', 'management'], city: 'Chennai', state: 'Tamil Nadu', ranking: 19, established: 1985, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://www.srmist.edu.in', fees: { min: 250000, max: 800000 }, facilities: ['Library', 'Hostel', 'Labs', 'Sports Complex', 'Placement Cell', 'Incubation Centre'], description: 'SRM is a top deemed university in Chennai offering quality education in engineering, management, and sciences with strong placement records.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'mba', 'bba', 'bsc-cs'] },

  // Engineering + Medical (2)
  { name: 'Manipal Academy of Higher Education', slug: 'mahe-manipal', type: 'deemed', categories: ['engineering', 'medical'], city: 'Manipal', state: 'Karnataka', ranking: 6, established: 1953, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://manipal.edu', fees: { min: 200000, max: 1500000 }, facilities: ['Hospital', 'Library', 'Hostel', 'Research Labs', 'Sports Complex', 'Innovation Centre'], description: 'MAHE is a premier multi-disciplinary university offering world-class programmes in engineering, medicine, management, and more across its Manipal campus.', courseNames: ['btech-cs', 'btech-me', 'mbbs', 'bds', 'bpharma'] },
  { name: 'Amrita Vishwa Vidyapeetham', slug: 'amrita-coimbatore', type: 'deemed', categories: ['engineering', 'medical'], city: 'Coimbatore', state: 'Tamil Nadu', ranking: 7, established: 2003, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://www.amrita.edu', fees: { min: 150000, max: 800000 }, facilities: ['Hospital', 'Library', 'Hostel', 'Labs', 'Sports Complex', 'Wi-Fi Campus'], description: 'Amrita is a multi-campus university offering strong programmes in engineering and medical sciences with emphasis on values-based education.', courseNames: ['btech-cs', 'btech-ece', 'mbbs', 'bpharma'] },

  // Medical + Management (2)
  { name: 'Symbiosis International University', slug: 'symbiosis-pune', type: 'deemed', categories: ['management', 'medical', 'law'], city: 'Pune', state: 'Maharashtra', ranking: 15, established: 1971, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://www.siu.edu.in', fees: { min: 200000, max: 1200000 }, facilities: ['Library', 'Hostel', 'Hospital', 'Moot Court', 'Sports Complex', 'Placement Cell'], description: 'Symbiosis is a multi-disciplinary deemed university in Pune known for its management, law, and health sciences programmes with international outlook.', courseNames: ['mba', 'bba', 'mbbs', 'ba-llb', 'llb'] },
  { name: 'JSS Academy of Higher Education', slug: 'jss-mysuru', type: 'deemed', categories: ['medical', 'management'], city: 'Mysuru', state: 'Karnataka', ranking: 20, established: 2008, accreditation: 'NAAC A+', affiliation: 'UGC', website: 'https://jssuni.edu.in', fees: { min: 200000, max: 900000 }, facilities: ['Hospital', 'Library', 'Hostel', 'Labs', 'Pharmacy College', 'Placement Cell'], description: 'JSS Academy is a leading deemed university in Mysuru offering quality education in medical sciences, pharmacy, and management with excellent clinical facilities.', courseNames: ['mbbs', 'bds', 'bpharma', 'mba'] },

  // Engineering + Law (1)
  { name: 'Gujarat National Law University', slug: 'gnlu-gandhinagar', type: 'public', categories: ['law', 'management'], city: 'Gandhinagar', state: 'Gujarat', ranking: 5, established: 2003, accreditation: 'NAAC A', affiliation: 'BCI', website: 'https://www.gnlu.ac.in', fees: { min: 200000, max: 400000 }, facilities: ['Library', 'Moot Court', 'Hostel', 'Seminar Hall', 'Legal Clinic'], description: 'GNLU is a top National Law University offering integrated law programmes along with business management courses with strong focus on research.', courseNames: ['ba-llb', 'llb', 'mba'] },

  // Multi-category (engineering + management + science) (3)
  { name: 'Birla Institute of Technology Mesra', slug: 'bit-mesra', type: 'deemed', categories: ['engineering', 'management', 'science'], city: 'Ranchi', state: 'Jharkhand', ranking: 28, established: 1955, accreditation: 'NAAC A', affiliation: 'UGC', website: 'https://www.bitmesra.ac.in', fees: { min: 200000, max: 600000 }, facilities: ['Library', 'Hostel', 'Labs', 'Sports Complex', 'Placement Cell'], description: 'BIT Mesra is a reputed deemed university offering diverse programmes in engineering, science, and management with strong focus on holistic education.', courseNames: ['btech-cs', 'btech-me', 'mba', 'bsc-cs'] },
  { name: 'Anna University', slug: 'anna-university', type: 'public', categories: ['engineering', 'science', 'architecture'], city: 'Chennai', state: 'Tamil Nadu', ranking: 14, established: 1978, accreditation: 'NAAC A++', affiliation: 'UGC', website: 'https://www.annauniv.edu', fees: { min: 50000, max: 300000 }, facilities: ['Library', 'Hostel', 'Labs', 'Research Centre', 'Sports Ground', 'Placement Cell'], description: 'Anna University is a leading state technical university in Tamil Nadu, offering quality education in engineering, architecture, and sciences.', courseNames: ['btech-cs', 'btech-me', 'btech-ece', 'barch', 'bsc-cs'] },
  { name: 'Savitribai Phule Pune University', slug: 'sppu-pune', type: 'public', categories: ['science', 'arts', 'commerce', 'management'], city: 'Pune', state: 'Maharashtra', ranking: 10, established: 1949, accreditation: 'NAAC A+', affiliation: 'UGC', website: 'http://www.unipune.ac.in', fees: { min: 20000, max: 200000 }, facilities: ['Library', 'Hostel', 'Labs', 'Sports Complex', 'Cultural Centre', 'Placement Cell'], description: 'SPPU is one of India\'s premier public universities offering a wide range of programmes in arts, science, commerce, and management.', courseNames: ['bba', 'mba', 'ba-economics', 'bsc-cs', 'bcom-hons'] },

  // Arts + Commerce + Management (2)
  { name: 'St. Xavier\'s College Mumbai', slug: 'xaviers-mumbai', type: 'autonomous', categories: ['arts', 'science', 'commerce'], city: 'Mumbai', state: 'Maharashtra', ranking: 22, established: 1869, accreditation: 'NAAC A++', affiliation: 'University of Mumbai', website: 'https://xaviers.edu', fees: { min: 30000, max: 150000 }, facilities: ['Library', 'Auditorium', 'Labs', 'Sports Ground', 'Cultural Centre'], description: 'St. Xavier\'s College is one of Mumbai\'s oldest and most prestigious colleges, known for academic excellence and vibrant campus life in arts, science, and commerce.', courseNames: ['ba-economics', 'bsc-cs', 'bcom-hons'] },
  { name: 'Loyola College Chennai', slug: 'loyola-chennai', type: 'autonomous', categories: ['arts', 'science', 'commerce'], city: 'Chennai', state: 'Tamil Nadu', ranking: 25, established: 1925, accreditation: 'NAAC A++', affiliation: 'University of Madras', website: 'https://www.loyolacollege.edu', fees: { min: 20000, max: 100000 }, facilities: ['Library', 'Hostel', 'Labs', 'Auditorium', 'Sports Complex'], description: 'Loyola College is a premier autonomous institution in Chennai offering quality education in arts, science, and commerce with a tradition of academic excellence.', courseNames: ['ba-economics', 'bsc-cs', 'bcom-hons'] },
];

// ─── Content Section Templates ───────────────────────────────────────────────

function makeOverview(college) {
  return {
    sectionKey: 'overview',
    title: `About ${college.name}`,
    contentType: 'richtext',
    content: `<p>${college.description}</p><p>${college.name} was established in ${college.established} and is located in ${college.city}, ${college.state}. The institution is accredited with ${college.accreditation} and offers a range of programmes to students from across India and abroad.</p><p>With a strong emphasis on academic excellence, research, and holistic development, ${college.name} continues to be a preferred choice for aspiring students.</p>`,
    order: 0,
    isVisible: true,
  };
}

function makeAdmission(college) {
  return {
    sectionKey: 'admission',
    title: 'Admission Process',
    contentType: 'faq',
    content: {
      items: [
        { question: `How to apply for admission at ${college.name}?`, answer: `Visit the official website at ${college.website || 'the college portal'}, fill out the online application form during the admission window, and submit required documents along with the application fee.` },
        { question: 'What entrance exams are accepted?', answer: college.categories.includes('engineering') ? 'JEE Main, JEE Advanced, and state-level entrance exams are accepted for engineering programmes.' : college.categories.includes('medical') ? 'NEET UG is the primary entrance exam accepted for medical admissions.' : college.categories.includes('law') ? 'CLAT and AILET are the primary entrance exams accepted for law programmes.' : college.categories.includes('management') ? 'CAT, XAT, MAT, and GMAT scores are accepted for management programmes.' : 'Relevant national and state-level entrance exam scores are accepted.' },
        { question: 'What is the fee structure?', answer: `Fees range from ₹${(college.fees.min / 1000).toFixed(0)}K to ₹${college.fees.max >= 100000 ? (college.fees.max / 100000).toFixed(1) + 'L' : (college.fees.max / 1000).toFixed(0) + 'K'} per year depending on the programme.` },
      ],
    },
    order: 1,
    isVisible: true,
  };
}

function makePlacement(college) {
  const avgPackage = college.ranking <= 5 ? '18-25' : college.ranking <= 15 ? '10-16' : '6-10';
  const topRecruiters = college.categories.includes('engineering')
    ? 'Google, Microsoft, Amazon, Flipkart, Goldman Sachs, Adobe, Infosys, TCS'
    : college.categories.includes('medical')
    ? 'Apollo Hospitals, Fortis Healthcare, AIIMS, Medanta, Max Healthcare'
    : college.categories.includes('management')
    ? 'McKinsey, BCG, Bain, Deloitte, Goldman Sachs, JP Morgan, Amazon'
    : college.categories.includes('law')
    ? 'Cyril Amarchand Mangaldas, AZB & Partners, Khaitan & Co, Shardul Amarchand'
    : 'Leading national and multinational companies';

  return {
    sectionKey: 'placements',
    title: 'Placement Statistics',
    contentType: 'table',
    content: {
      headers: ['Metric', 'Details'],
      rows: [
        ['Average Package (LPA)', `₹${avgPackage} LPA`],
        ['Highest Package', `₹${college.ranking <= 5 ? '60-80' : college.ranking <= 15 ? '40-55' : '25-35'} LPA`],
        ['Placement Rate', `${college.ranking <= 10 ? '95-100' : college.ranking <= 20 ? '85-95' : '75-90'}%`],
        ['Top Recruiters', topRecruiters],
        ['Internship Offers', `${college.ranking <= 10 ? '90' : '75'}%+ students receive pre-placement internships`],
      ],
    },
    order: 2,
    isVisible: true,
  };
}

function makeFacilities(college) {
  return {
    sectionKey: 'infrastructure',
    title: 'Campus & Facilities',
    contentType: 'list',
    content: {
      items: (college.facilities || []).map(f => {
        switch (f) {
          case 'Library': return 'State-of-the-art central library with 100,000+ books, digital journals, and 24/7 reading rooms';
          case 'Hostel': return 'Separate hostels for boys and girls with modern amenities, mess facilities, and security';
          case 'Sports Complex': return 'Multi-sport complex with indoor and outdoor facilities including gymnasium, swimming pool, and courts';
          case 'Labs': return 'Well-equipped laboratories with modern instruments for practical and research work';
          case 'Research Labs': return 'Advanced research laboratories with state-of-the-art equipment and dedicated research funding';
          case 'Placement Cell': return 'Dedicated placement and career development cell with industry partnerships and training programmes';
          case 'Wi-Fi Campus': return 'Complete Wi-Fi enabled campus with high-speed internet connectivity';
          case 'Hospital': return 'Multi-specialty teaching hospital with 1000+ beds and advanced medical equipment';
          case 'Moot Court': return 'Fully equipped moot court hall for legal advocacy training and competitions';
          case 'Auditorium': return 'Modern auditorium with 1000+ seating capacity for conferences and cultural events';
          case 'Innovation Centre': return 'Dedicated innovation and entrepreneurship centre supporting student startups';
          case 'Incubation Centre': return 'Technology incubation centre supporting startups with mentorship and funding opportunities';
          default: return f;
        }
      }),
    },
    order: 3,
    isVisible: true,
  };
}

function makeCoursesFee(college, courseObjects) {
  const rows = courseObjects.map(c => [
    c.name,
    `${c.duration.value} ${c.duration.unit}`,
    `₹${c.fees.amount.toLocaleString()} / ${c.fees.per}`,
    c.eligibility.length > 80 ? c.eligibility.substring(0, 80) + '...' : c.eligibility,
  ]);

  return {
    sectionKey: 'courses-fee',
    title: 'Courses & Fee Structure',
    contentType: 'table',
    content: {
      headers: ['Course', 'Duration', 'Fees', 'Eligibility'],
      rows,
    },
    order: 1,
    isVisible: true,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.\n');

  // 1. Clear existing data
  console.log('Clearing existing colleges, courses, and college content sections...');
  await College.deleteMany({});
  await Course.deleteMany({});
  await ContentSection.deleteMany({ college: { $ne: null } });
  console.log('Cleared.\n');

  // 2. Create courses
  console.log('Creating 15 courses...');
  const courseMap = {};
  for (const cd of coursesData) {
    const course = await Course.create({ ...cd, isActive: true });
    courseMap[cd.slug] = course;
    console.log(`  ✓ ${course.name}`);
  }
  console.log('');

  // 3. Create colleges with course refs + content sections
  console.log('Creating 30 colleges with content sections...');
  for (const cd of collegesData) {
    // Resolve course refs
    const courseIds = (cd.courseNames || []).map(slug => courseMap[slug]?._id).filter(Boolean);

    const college = await College.create({
      name: cd.name,
      slug: cd.slug,
      type: cd.type,
      categories: cd.categories,
      description: cd.description,
      location: { city: cd.city, state: cd.state, address: `${cd.city}, ${cd.state}, India` },
      courses: courseIds,
      fees: { ...cd.fees, currency: 'INR' },
      ranking: cd.ranking,
      established: cd.established,
      website: cd.website,
      accreditation: cd.accreditation,
      affiliation: cd.affiliation,
      facilities: cd.facilities || [],
      status: 'published',
    });

    // Get actual course objects for content
    const collegeCourses = (cd.courseNames || []).map(slug => courseMap[slug]).filter(Boolean);

    // Create content sections
    const sections = [
      makeOverview(cd),
      makeAdmission(cd),
      makePlacement(cd),
      makeFacilities(cd),
    ];

    if (collegeCourses.length) {
      sections.push(makeCoursesFee(cd, collegeCourses));
    }

    for (const sec of sections) {
      await ContentSection.create({ ...sec, college: college._id });
    }

    console.log(`  ✓ ${college.name} [${cd.categories.join(', ')}] — ${sections.length} sections, ${courseIds.length} courses`);
  }

  console.log(`\nDone! Created ${coursesData.length} courses and ${collegesData.length} colleges.\n`);

  // Print summary
  const catCounts = {};
  for (const c of collegesData) {
    for (const cat of c.categories) {
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  }
  console.log('Category breakdown:');
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count} colleges`);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB.');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
