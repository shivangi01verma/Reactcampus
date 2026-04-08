"""
Generate a comprehensive Indian colleges dataset with 220+ entries.
Uses real college names with realistic synthetic metrics.
Deliberately includes some missing values and inconsistencies for cleaning practice.
"""
import csv
import random
import os

random.seed(42)

# Real Indian colleges with metadata
colleges_data = [
    # IITs
    ("Indian Institute of Technology Bombay", "Mumbai", "Maharashtra", "Government", 1958, "A++", "JEE Advanced", 1000),
    ("Indian Institute of Technology Delhi", "New Delhi", "Delhi", "Government", 1961, "A++", "JEE Advanced", 1100),
    ("Indian Institute of Technology Madras", "Chennai", "Tamil Nadu", "Government", 1959, "A++", "JEE Advanced", 950),
    ("Indian Institute of Technology Kanpur", "Kanpur", "Uttar Pradesh", "Government", 1959, "A++", "JEE Advanced", 900),
    ("Indian Institute of Technology Kharagpur", "Kharagpur", "West Bengal", "Government", 1951, "A++", "JEE Advanced", 1500),
    ("Indian Institute of Technology Roorkee", "Roorkee", "Uttarakhand", "Government", 1847, "A++", "JEE Advanced", 1200),
    ("Indian Institute of Technology Guwahati", "Guwahati", "Assam", "Government", 1994, "A++", "JEE Advanced", 800),
    ("Indian Institute of Technology Hyderabad", "Hyderabad", "Telangana", "Government", 2008, "A+", "JEE Advanced", 600),
    ("Indian Institute of Technology BHU Varanasi", "Varanasi", "Uttar Pradesh", "Government", 1919, "A++", "JEE Advanced", 1050),
    ("Indian Institute of Technology Indore", "Indore", "Madhya Pradesh", "Government", 2009, "A+", "JEE Advanced", 550),
    ("Indian Institute of Technology Dhanbad", "Dhanbad", "Jharkhand", "Government", 1926, "A+", "JEE Advanced", 900),
    ("Indian Institute of Technology Patna", "Patna", "Bihar", "Government", 2008, "A", "JEE Advanced", 450),
    ("Indian Institute of Technology Mandi", "Mandi", "Himachal Pradesh", "Government", 2009, "A", "JEE Advanced", 350),
    ("Indian Institute of Technology Jodhpur", "Jodhpur", "Rajasthan", "Government", 2008, "A", "JEE Advanced", 400),
    ("Indian Institute of Technology Tirupati", "Tirupati", "Andhra Pradesh", "Government", 2015, "A", "JEE Advanced", 300),
    ("Indian Institute of Technology Palakkad", "Palakkad", "Kerala", "Government", 2015, None, "JEE Advanced", 280),
    ("Indian Institute of Technology Bhilai", "Bhilai", "Chhattisgarh", "Government", 2016, None, "JEE Advanced", 260),
    ("Indian Institute of Technology Goa", "Goa", "Goa", "Government", 2016, None, "JEE Advanced", 240),
    ("Indian Institute of Technology Jammu", "Jammu", "Jammu & Kashmir", "Government", 2016, None, "JEE Advanced", 250),
    ("Indian Institute of Technology Dharwad", "Dharwad", "Karnataka", "Government", 2016, None, "JEE Advanced", 230),

    # NITs
    ("National Institute of Technology Trichy", "Tiruchirappalli", "Tamil Nadu", "Government", 1964, "A++", "JEE Main", 1100),
    ("National Institute of Technology Surathkal", "Mangalore", "Karnataka", "Government", 1960, "A+", "JEE Main", 900),
    ("National Institute of Technology Warangal", "Warangal", "Telangana", "Government", 1959, "A+", "JEE Main", 850),
    ("National Institute of Technology Calicut", "Kozhikode", "Kerala", "Government", 1961, "A+", "JEE Main", 800),
    ("National Institute of Technology Rourkela", "Rourkela", "Odisha", "Government", 1961, "A+", "JEE Main", 950),
    ("National Institute of Technology Durgapur", "Durgapur", "West Bengal", "Government", 1960, "A", "JEE Main", 800),
    ("Motilal Nehru National Institute of Technology", "Prayagraj", "Uttar Pradesh", "Government", 1961, "A+", "JEE Main", 750),
    ("Maulana Azad National Institute of Technology", "Bhopal", "Madhya Pradesh", "Government", 1960, "A+", "JEE Main", 700),
    ("Visvesvaraya National Institute of Technology", "Nagpur", "Maharashtra", "Government", 1960, "A+", "JEE Main", 800),
    ("National Institute of Technology Jamshedpur", "Jamshedpur", "Jharkhand", "Government", 1960, "A", "JEE Main", 650),
    ("National Institute of Technology Silchar", "Silchar", "Assam", "Government", 1967, "A", "JEE Main", 600),
    ("National Institute of Technology Hamirpur", "Hamirpur", "Himachal Pradesh", "Government", 1986, "A", "JEE Main", 500),
    ("National Institute of Technology Srinagar", "Srinagar", "Jammu & Kashmir", "Government", 1960, "B++", "JEE Main", 550),
    ("National Institute of Technology Agartala", "Agartala", "Tripura", "Government", 1965, "A", "JEE Main", 450),
    ("National Institute of Technology Raipur", "Raipur", "Chhattisgarh", "Government", 1956, "A", "JEE Main", 500),

    # IISc and IISERs
    ("Indian Institute of Science", "Bangalore", "Karnataka", "Government", 1909, "A++", "KVPY/JEE", 400),
    ("IISER Pune", "Pune", "Maharashtra", "Government", 2006, "A++", "IAT", 200),
    ("IISER Kolkata", "Kolkata", "West Bengal", "Government", 2006, "A+", "IAT", 180),
    ("IISER Mohali", "Mohali", "Punjab", "Government", 2007, "A+", "IAT", 170),
    ("IISER Bhopal", "Bhopal", "Madhya Pradesh", "Government", 2008, "A+", "IAT", 160),
    ("IISER Thiruvananthapuram", "Thiruvananthapuram", "Kerala", "Government", 2008, "A", "IAT", 150),

    # Top Private Universities
    ("BITS Pilani", "Pilani", "Rajasthan", "Private", 1964, "A++", "BITSAT", 1200),
    ("Vellore Institute of Technology", "Vellore", "Tamil Nadu", "Private", 1984, "A++", "VITEEE", 5000),
    ("SRM Institute of Science and Technology", "Chennai", "Tamil Nadu", "Private", 1985, "A++", "SRMJEEE", 4500),
    ("Manipal Academy of Higher Education", "Manipal", "Karnataka", "Private", 1953, "A++", "MET", 3000),
    ("Amity University", "Noida", "Uttar Pradesh", "Private", 2005, "A+", "Amity JEE", 4000),
    ("Lovely Professional University", "Phagwara", "Punjab", "Private", 2005, "A+", "LPUNEST", 6000),
    ("Shiv Nadar University", "Greater Noida", "Uttar Pradesh", "Private", 2011, "A", "SNUSAT", 800),
    ("Ashoka University", "Sonipat", "Haryana", "Private", 2014, "A", "Ashoka Aptitude", 500),
    ("OP Jindal Global University", "Sonipat", "Haryana", "Private", 2009, "A+", "JSAT", 700),
    ("Thapar Institute of Engineering", "Patiala", "Punjab", "Private", 1956, "A+", "JEE Main", 1500),
    ("Kalinga Institute of Industrial Technology", "Bhubaneswar", "Odisha", "Private", 1992, "A++", "KIITEE", 3500),
    ("Chandigarh University", "Mohali", "Punjab", "Private", 2012, "A+", "CUCET", 4000),
    ("Chitkara University", "Rajpura", "Punjab", "Private", 2010, "A+", "Chitkara UG", 2000),
    ("Bennett University", "Greater Noida", "Uttar Pradesh", "Private", 2016, "A", "Own Test", 800),
    ("Plaksha University", "Mohali", "Punjab", "Private", 2021, None, "Own Test", 200),
    ("Azim Premji University", "Bangalore", "Karnataka", "Private", 2010, "A", "Own Test", 400),

    # Deemed Universities
    ("Symbiosis International University", "Pune", "Maharashtra", "Deemed", 2002, "A++", "SET", 2500),
    ("RVCE Bangalore", "Bangalore", "Karnataka", "Autonomous", 1963, "A++", "KCET", 1800),
    ("BMS College of Engineering", "Bangalore", "Karnataka", "Autonomous", 1946, "A+", "KCET", 1600),
    ("PSG College of Technology", "Coimbatore", "Tamil Nadu", "Autonomous", 1951, "A++", "TNEA", 1400),
    ("Dhirubhai Ambani Institute", "Gandhinagar", "Gujarat", "Private", 2001, "A", "JEE Main", 600),
    ("FLAME University", "Pune", "Maharashtra", "Private", 2015, "A", "FLAME Entrance", 500),
    ("Birla Institute of Technology Mesra", "Ranchi", "Jharkhand", "Deemed", 1955, "A+", "BIT MCA", 1000),
    ("Jamia Millia Islamia", "New Delhi", "Delhi", "Government", 1920, "A++", "JMI Entrance", 2000),
    ("Aligarh Muslim University", "Aligarh", "Uttar Pradesh", "Government", 1875, "A++", "AMU Entrance", 3000),
    ("Banaras Hindu University", "Varanasi", "Uttar Pradesh", "Government", 1916, "A++", "UET/PET", 5000),
    ("Jawaharlal Nehru University", "New Delhi", "Delhi", "Government", 1969, "A++", "JNUEE", 2500),
    ("University of Delhi", "New Delhi", "Delhi", "Government", 1922, "A++", "CUET", 8000),
    ("University of Hyderabad", "Hyderabad", "Telangana", "Government", 1974, "A++", "CUET", 1500),
    ("Jadavpur University", "Kolkata", "West Bengal", "Government", 1955, "A++", "WBJEE", 2000),
    ("Anna University", "Chennai", "Tamil Nadu", "Government", 1978, "A++", "TNEA", 4000),
    ("Savitribai Phule Pune University", "Pune", "Maharashtra", "Government", 1949, "A++", "Own Entrance", 3500),
    ("Presidency University Kolkata", "Kolkata", "West Bengal", "Government", 1817, "A", "CUET", 500),
    ("University of Calcutta", "Kolkata", "West Bengal", "Government", 1857, "A", "CUET", 4000),
    ("University of Mumbai", "Mumbai", "Maharashtra", "Government", 1857, "A++", "Own Entrance", 5000),
    ("Cochin University of Science and Technology", "Kochi", "Kerala", "Government", 1971, "A+", "CUSAT CAT", 1200),

    # Medical Colleges
    ("All India Institute of Medical Sciences Delhi", "New Delhi", "Delhi", "Government", 1956, "A++", "NEET UG", 200),
    ("Christian Medical College Vellore", "Vellore", "Tamil Nadu", "Private", 1900, "A++", "NEET UG", 150),
    ("Armed Forces Medical College", "Pune", "Maharashtra", "Government", 1948, "A++", "NEET UG", 150),
    ("Maulana Azad Medical College", "New Delhi", "Delhi", "Government", 1958, "A++", "NEET UG", 250),
    ("King George Medical University", "Lucknow", "Uttar Pradesh", "Government", 1911, "A+", "NEET UG", 250),
    ("Grant Medical College", "Mumbai", "Maharashtra", "Government", 1845, "A+", "NEET UG", 200),
    ("Kasturba Medical College Manipal", "Manipal", "Karnataka", "Private", 1953, "A++", "NEET UG", 250),
    ("St Johns Medical College", "Bangalore", "Karnataka", "Private", 1963, "A+", "NEET UG", 150),
    ("JIPMER Puducherry", "Puducherry", "Puducherry", "Government", 1823, "A++", "NEET UG", 200),

    # Law Colleges
    ("National Law School Bangalore", "Bangalore", "Karnataka", "Government", 1987, "A++", "CLAT", 120),
    ("NALSAR Hyderabad", "Hyderabad", "Telangana", "Government", 1998, "A++", "CLAT", 100),
    ("National Law Institute University Bhopal", "Bhopal", "Madhya Pradesh", "Government", 1997, "A+", "CLAT", 100),
    ("West Bengal National University of Juridical Sciences", "Kolkata", "West Bengal", "Government", 1999, "A+", "CLAT", 100),
    ("National Law University Delhi", "New Delhi", "Delhi", "Government", 2008, "A+", "AILET", 120),
    ("Gujarat National Law University", "Gandhinagar", "Gujarat", "Government", 2003, "A", "CLAT", 100),
    ("Rajiv Gandhi National University of Law", "Patiala", "Punjab", "Government", 2006, "A", "CLAT", 80),

    # Management Institutes
    ("Indian Institute of Management Ahmedabad", "Ahmedabad", "Gujarat", "Government", 1961, "A++", "CAT", 400),
    ("Indian Institute of Management Bangalore", "Bangalore", "Karnataka", "Government", 1973, "A++", "CAT", 450),
    ("Indian Institute of Management Calcutta", "Kolkata", "West Bengal", "Government", 1961, "A++", "CAT", 480),
    ("Indian Institute of Management Lucknow", "Lucknow", "Uttar Pradesh", "Government", 1984, "A++", "CAT", 450),
    ("Indian Institute of Management Kozhikode", "Kozhikode", "Kerala", "Government", 1996, "A++", "CAT", 400),
    ("Indian Institute of Management Indore", "Indore", "Madhya Pradesh", "Government", 1996, "A++", "CAT", 550),
    ("Faculty of Management Studies Delhi", "New Delhi", "Delhi", "Government", 1954, "A++", "CAT", 220),
    ("XLRI Jamshedpur", "Jamshedpur", "Jharkhand", "Private", 1949, "A++", "XAT", 300),
    ("SP Jain Institute of Management", "Mumbai", "Maharashtra", "Private", 1981, "A++", "CAT/XAT", 300),
    ("Management Development Institute", "Gurugram", "Haryana", "Private", 1973, "A++", "CAT", 350),
    ("Indian School of Business", "Hyderabad", "Telangana", "Private", 2001, "A++", "GMAT/GRE", 900),
    ("NMIMS Mumbai", "Mumbai", "Maharashtra", "Deemed", 1981, "A++", "NMAT", 1500),
    ("Christ University", "Bangalore", "Karnataka", "Deemed", 1969, "A++", "CUET", 3500),
    ("Symbiosis Centre for Management", "Pune", "Maharashtra", "Deemed", 1993, "A+", "SNAP", 800),
    ("Great Lakes Institute of Management", "Chennai", "Tamil Nadu", "Private", 2004, "A", "CAT/XAT", 400),
    ("MICA Ahmedabad", "Ahmedabad", "Gujarat", "Private", 1991, "A+", "MICAT", 200),

    # Arts and Sciences
    ("St Stephens College", "New Delhi", "Delhi", "Private", 1881, "A++", "CUET", 1200),
    ("Lady Shri Ram College", "New Delhi", "Delhi", "Private", 1956, "A++", "CUET", 1500),
    ("Loyola College Chennai", "Chennai", "Tamil Nadu", "Autonomous", 1925, "A++", "Own Entrance", 3000),
    ("Fergusson College", "Pune", "Maharashtra", "Autonomous", 1885, "A+", "Own Entrance", 2500),
    ("Madras Christian College", "Chennai", "Tamil Nadu", "Autonomous", 1837, "A+", "Own Entrance", 2000),
    ("St Xaviers College Mumbai", "Mumbai", "Maharashtra", "Autonomous", 1869, "A++", "Own Entrance", 3000),
    ("Hindu College Delhi", "New Delhi", "Delhi", "Government", 1899, "A++", "CUET", 2000),
    ("Ramjas College Delhi", "New Delhi", "Delhi", "Government", 1917, "A+", "CUET", 1500),
    ("Hansraj College Delhi", "New Delhi", "Delhi", "Government", 1948, "A+", "CUET", 1500),
    ("Miranda House Delhi", "New Delhi", "Delhi", "Government", 1948, "A++", "CUET", 1200),

    # Design & Architecture
    ("National Institute of Design Ahmedabad", "Ahmedabad", "Gujarat", "Government", 1961, "A++", "NID DAT", 200),
    ("National Institute of Fashion Technology Delhi", "New Delhi", "Delhi", "Government", 1986, "A+", "NIFT", 400),
    ("School of Planning and Architecture Delhi", "New Delhi", "Delhi", "Government", 1941, "A+", "NATA/JEE", 200),
    ("IIT Bombay IDC School of Design", "Mumbai", "Maharashtra", "Government", 1969, "A++", "CEED", 100),
    ("Srishti Manipal Institute of Art", "Bangalore", "Karnataka", "Private", 1996, "A", "SUAT", 500),

    # More Engineering Colleges
    ("College of Engineering Pune", "Pune", "Maharashtra", "Government", 1854, "A+", "MHT CET", 1200),
    ("PEC Chandigarh", "Chandigarh", "Chandigarh", "Government", 1921, "A+", "JEE Main", 800),
    ("Netaji Subhas University of Technology", "New Delhi", "Delhi", "Government", 1983, "A+", "JEE Main", 1000),
    ("Delhi Technological University", "New Delhi", "Delhi", "Government", 1941, "A++", "JEE Main", 1200),
    ("International Institute of Information Technology Hyderabad", "Hyderabad", "Telangana", "Deemed", 1998, "A++", "JEE Main", 600),
    ("Institute of Chemical Technology Mumbai", "Mumbai", "Maharashtra", "Deemed", 1933, "A++", "MHT CET", 500),
    ("Birla Vishvakarma Mahavidyalaya", "Anand", "Gujarat", "Autonomous", 1948, "A+", "ACPC", 800),
    ("VJTI Mumbai", "Mumbai", "Maharashtra", "Government", 1887, "A+", "MHT CET", 800),
    ("Sardar Vallabhbhai National Institute of Technology Surat", "Surat", "Gujarat", "Government", 1961, "A+", "JEE Main", 900),
    ("Malaviya National Institute of Technology Jaipur", "Jaipur", "Rajasthan", "Government", 1963, "A+", "JEE Main", 850),
    ("National Institute of Technology Kurukshetra", "Kurukshetra", "Haryana", "Government", 1963, "A", "JEE Main", 750),
    ("National Institute of Technology Meghalaya", "Shillong", "Meghalaya", "Government", 2010, "B++", "JEE Main", 300),
    ("Indian Institute of Engineering Science and Technology", "Howrah", "West Bengal", "Government", 1856, "A+", "WBJEE", 1000),
    ("Amrita Vishwa Vidyapeetham", "Coimbatore", "Tamil Nadu", "Deemed", 2003, "A++", "AEEE", 3000),
    ("Hindustan Institute of Technology", "Chennai", "Tamil Nadu", "Deemed", 1985, "A", "HITSEEE", 1800),
    ("Sathyabama Institute of Science and Technology", "Chennai", "Tamil Nadu", "Deemed", 1987, "A+", "Own Entrance", 2500),
    ("Koneru Lakshmaiah Education Foundation", "Guntur", "Andhra Pradesh", "Deemed", 1980, "A++", "KLEEE", 2000),
    ("SR University", "Warangal", "Telangana", "Private", 2018, "A", "Own Entrance", 600),
    ("Sharda University", "Greater Noida", "Uttar Pradesh", "Private", 2009, "A+", "Own Entrance", 2500),
    ("GD Goenka University", "Gurugram", "Haryana", "Private", 2013, "A", "Own Entrance", 800),
    ("Jain University", "Bangalore", "Karnataka", "Deemed", 1990, "A++", "SET", 3000),
    ("MS Ramaiah Institute of Technology", "Bangalore", "Karnataka", "Autonomous", 1962, "A+", "KCET", 1400),
    ("RV College of Engineering", "Bangalore", "Karnataka", "Autonomous", 1963, "A++", "KCET", 1800),
    ("New Horizon College of Engineering", "Bangalore", "Karnataka", "Autonomous", 2001, "A", "KCET", 1200),
    ("Dayananda Sagar College of Engineering", "Bangalore", "Karnataka", "Autonomous", 1979, "A+", "KCET", 1500),
    ("PES University", "Bangalore", "Karnataka", "Private", 1972, "A+", "PESSAT", 2500),
    ("CMR Institute of Technology", "Bangalore", "Karnataka", "Autonomous", 2000, "B++", "KCET", 800),
    ("Woxsen University", "Hyderabad", "Telangana", "Private", 2014, "A", "Own Test", 600),

    # Pharmacy
    ("National Institute of Pharmaceutical Education and Research Mohali", "Mohali", "Punjab", "Government", 1998, "A++", "NIPER JEE", 150),
    ("Jamia Hamdard", "New Delhi", "Delhi", "Deemed", 1989, "A+", "Own Entrance", 1000),
    ("Manipal College of Pharmaceutical Sciences", "Manipal", "Karnataka", "Private", 1963, "A+", "MET", 400),
    ("JSS College of Pharmacy", "Mysore", "Karnataka", "Deemed", 1980, "A++", "Own Entrance", 300),
    ("Bombay College of Pharmacy", "Mumbai", "Maharashtra", "Government", 1957, "A+", "MHT CET", 200),

    # Agriculture
    ("Indian Agricultural Research Institute", "New Delhi", "Delhi", "Government", 1905, "A++", "ICAR AIEEA", 300),
    ("Tamil Nadu Agricultural University", "Coimbatore", "Tamil Nadu", "Government", 1971, "A+", "TNAU Entrance", 800),
    ("Punjab Agricultural University", "Ludhiana", "Punjab", "Government", 1962, "A+", "Own Entrance", 600),
    ("GB Pant University of Agriculture", "Pantnagar", "Uttarakhand", "Government", 1960, "A++", "JRF", 500),

    # Hotel Management
    ("Institute of Hotel Management Delhi", "New Delhi", "Delhi", "Government", 1962, "A+", "NCHM JEE", 300),
    ("Institute of Hotel Management Mumbai", "Mumbai", "Maharashtra", "Government", 1970, "A+", "NCHM JEE", 250),
    ("Welcome Group Graduate School of Hotel Administration", "Manipal", "Karnataka", "Private", 1986, "A", "MET", 200),

    # More Universities
    ("Central University of Rajasthan", "Ajmer", "Rajasthan", "Government", 2009, "A", "CUET", 600),
    ("Central University of Punjab", "Bathinda", "Punjab", "Government", 2009, "B++", "CUET", 400),
    ("Central University of Haryana", "Mahendragarh", "Haryana", "Government", 2009, "B++", "CUET", 350),
    ("Central University of Kerala", "Kasaragod", "Kerala", "Government", 2009, "A", "CUET", 400),
    ("Central University of Tamil Nadu", "Thiruvarur", "Tamil Nadu", "Government", 2009, "B++", "CUET", 300),
    ("Central University of Gujarat", "Gandhinagar", "Gujarat", "Government", 2009, "A", "CUET", 350),
    ("Central University of Karnataka", "Kalaburagi", "Karnataka", "Government", 2009, "B++", "CUET", 350),
    ("Central University of Jharkhand", "Ranchi", "Jharkhand", "Government", 2009, "B+", "CUET", 300),
    ("Pondicherry University", "Puducherry", "Puducherry", "Government", 1985, "A++", "CUET", 800),
    ("Tezpur University", "Tezpur", "Assam", "Government", 1994, "A", "CUET", 500),
    ("North Eastern Hill University", "Shillong", "Meghalaya", "Government", 1973, "A", "CUET", 400),
    ("Mizoram University", "Aizawl", "Mizoram", "Government", 2001, "A", "CUET", 300),
    ("Nagaland University", "Zunheboto", "Nagaland", "Government", 1994, "B++", "CUET", 200),
    ("Sikkim University", "Gangtok", "Sikkim", "Government", 2007, "B++", "CUET", 250),
    ("Tripura University", "Agartala", "Tripura", "Government", 1987, "B++", "CUET", 350),
    ("Assam University", "Silchar", "Assam", "Government", 1994, "B++", "CUET", 400),
    ("Rajiv Gandhi University", "Itanagar", "Arunachal Pradesh", "Government", 1984, "B+", "CUET", 250),
    ("Hemvati Nandan Bahuguna Garhwal University", "Srinagar", "Uttarakhand", "Government", 1973, "A", "CUET", 500),
    ("Kumaun University", "Nainital", "Uttarakhand", "Government", 1973, "B++", "CUET", 400),

    # State Universities
    ("Gujarat University", "Ahmedabad", "Gujarat", "Government", 1949, "A+", "Own Entrance", 2000),
    ("Osmania University", "Hyderabad", "Telangana", "Government", 1918, "A", "OUCET", 3000),
    ("Bangalore University", "Bangalore", "Karnataka", "Government", 1964, "A+", "Own Entrance", 2500),
    ("University of Madras", "Chennai", "Tamil Nadu", "Government", 1857, "A++", "Own Entrance", 3000),
    ("University of Kerala", "Thiruvananthapuram", "Kerala", "Government", 1937, "A++", "Own Entrance", 2000),
    ("Panjab University", "Chandigarh", "Chandigarh", "Government", 1882, "A++", "Own Entrance", 3000),
    ("University of Rajasthan", "Jaipur", "Rajasthan", "Government", 1947, "A+", "Own Entrance", 2500),
    ("Patna University", "Patna", "Bihar", "Government", 1917, "A", "Own Entrance", 2000),
    ("Ranchi University", "Ranchi", "Jharkhand", "Government", 1960, "B++", "Own Entrance", 1500),
    ("Lucknow University", "Lucknow", "Uttar Pradesh", "Government", 1920, "A+", "Own Entrance", 2500),
    ("University of Allahabad", "Prayagraj", "Uttar Pradesh", "Government", 1887, "A+", "CUET", 2000),
    ("Guru Nanak Dev University", "Amritsar", "Punjab", "Government", 1969, "A++", "Own Entrance", 1500),
    ("Maharaja Sayajirao University of Baroda", "Vadodara", "Gujarat", "Government", 1949, "A++", "Own Entrance", 2500),
    ("SNDT Womens University", "Mumbai", "Maharashtra", "Government", 1916, "A+", "Own Entrance", 1000),
    ("Bharathiar University", "Coimbatore", "Tamil Nadu", "Government", 1982, "A+", "Own Entrance", 1500),
    ("Andhra University", "Visakhapatnam", "Andhra Pradesh", "Government", 1926, "A", "Own Entrance", 2000),
    ("Sri Venkateswara University", "Tirupati", "Andhra Pradesh", "Government", 1954, "A+", "Own Entrance", 1500),
    ("Mysore University", "Mysore", "Karnataka", "Government", 1916, "A+", "Own Entrance", 2000),
    ("Bharathidasan University", "Tiruchirappalli", "Tamil Nadu", "Government", 1982, "A+", "Own Entrance", 1200),
    ("Dibrugarh University", "Dibrugarh", "Assam", "Government", 1965, "B++", "Own Entrance", 800),
    ("Gauhati University", "Guwahati", "Assam", "Government", 1948, "A", "Own Entrance", 1000),
    ("Utkal University", "Bhubaneswar", "Odisha", "Government", 1943, "A+", "Own Entrance", 1500),
    ("Berhampur University", "Berhampur", "Odisha", "Government", 1967, "B++", "Own Entrance", 600),
    ("Sambalpur University", "Sambalpur", "Odisha", "Government", 1967, "B+", "Own Entrance", 500),
    ("Kalyani University", "Kalyani", "West Bengal", "Government", 1960, "A", "Own Entrance", 800),
    ("Visva-Bharati University", "Santiniketan", "West Bengal", "Government", 1921, "A", "Own Entrance", 1000),
    ("Jammu University", "Jammu", "Jammu & Kashmir", "Government", 1969, "A+", "CUET", 1000),
    ("Kashmir University", "Srinagar", "Jammu & Kashmir", "Government", 1948, "A", "CUET", 800),
]

# Fee ranges by type and prestige (annual in INR)
FEE_RANGES = {
    "Government_top":    (50000, 300000),
    "Government_mid":    (15000, 100000),
    "Government_low":    (5000, 50000),
    "Private_top":       (500000, 2500000),
    "Private_mid":       (200000, 800000),
    "Private_low":       (100000, 400000),
    "Deemed_top":        (300000, 1500000),
    "Deemed_mid":        (150000, 600000),
    "Autonomous_top":    (100000, 500000),
    "Autonomous_mid":    (50000, 250000),
}

# Placement ranges
PLACEMENT_RANGES = {
    "Government_top":    (85, 99),
    "Government_mid":    (65, 88),
    "Government_low":    (40, 70),
    "Private_top":       (80, 98),
    "Private_mid":       (55, 82),
    "Private_low":       (35, 65),
    "Deemed_top":        (75, 95),
    "Deemed_mid":        (50, 78),
    "Autonomous_top":    (70, 92),
    "Autonomous_mid":    (45, 75),
}

# Package ranges (in LPA)
PACKAGE_RANGES = {
    "Government_top":    (12.0, 35.0),
    "Government_mid":    (5.0, 15.0),
    "Government_low":    (3.0, 8.0),
    "Private_top":       (10.0, 30.0),
    "Private_mid":       (4.0, 12.0),
    "Private_low":       (2.5, 7.0),
    "Deemed_top":        (8.0, 22.0),
    "Deemed_mid":        (3.5, 10.0),
    "Autonomous_top":    (6.0, 18.0),
    "Autonomous_mid":    (3.0, 9.0),
}

STATES_TO_REGIONS = {
    "Delhi": "North", "Uttar Pradesh": "North", "Haryana": "North", "Punjab": "North",
    "Rajasthan": "North", "Himachal Pradesh": "North", "Uttarakhand": "North",
    "Jammu & Kashmir": "North", "Chandigarh": "North",
    "Maharashtra": "West", "Gujarat": "West", "Goa": "West", "Madhya Pradesh": "Central",
    "Chhattisgarh": "Central",
    "Tamil Nadu": "South", "Karnataka": "South", "Kerala": "South", "Telangana": "South",
    "Andhra Pradesh": "South", "Puducherry": "South",
    "West Bengal": "East", "Odisha": "East", "Bihar": "East", "Jharkhand": "East",
    "Assam": "Northeast", "Meghalaya": "Northeast", "Tripura": "Northeast",
    "Mizoram": "Northeast", "Nagaland": "Northeast", "Sikkim": "Northeast",
    "Arunachal Pradesh": "Northeast", "Manipal": "South",
}

FACILITIES = ["Library", "Hostel", "Sports Complex", "Research Labs", "WiFi Campus",
              "Cafeteria", "Gymnasium", "Swimming Pool", "Auditorium", "Hospital",
              "Computer Center", "Placement Cell", "Innovation Hub", "Incubation Center"]

def get_tier(name, type_val, naac, intake):
    """Determine college tier for fee/placement/package ranges"""
    top_keywords = ["IIT ", "IIM ", "IISc", "IISER", "AIIMS", "BITS", "NIT ", "National Law",
                    "VIT", "SRM", "Manipal Academy", "XLRI", "Indian School of Business",
                    "Delhi Technological", "Jadavpur", "Anna University", "NMIMS",
                    "Symbiosis International", "RVCE", "NID ", "NIFT"]
    if any(k in name for k in top_keywords):
        return "top"
    if naac in ("A++", "A+"):
        return "mid"
    return "low"

def generate_row(idx, college):
    name, city, state, type_val, estd, naac, exam, intake = college
    tier = get_tier(name, type_val, naac, intake)
    key = f"{type_val}_{tier}"

    fee_range = FEE_RANGES.get(key, FEE_RANGES.get(f"{type_val}_mid", (50000, 300000)))
    plc_range = PLACEMENT_RANGES.get(key, PLACEMENT_RANGES.get(f"{type_val}_mid", (50, 75)))
    pkg_range = PACKAGE_RANGES.get(key, PACKAGE_RANGES.get(f"{type_val}_mid", (4, 10)))

    avg_fee = random.randint(*fee_range)
    hostel_fee = random.randint(30000, 150000)
    placement_rate = round(random.uniform(*plc_range), 1)
    avg_package = round(random.uniform(*pkg_range), 2)
    highest_package = round(avg_package * random.uniform(2.5, 6.0), 2)

    faculty_count = random.randint(80, 1200)
    student_faculty_ratio = round(intake / faculty_count, 1) if faculty_count > 0 else None
    courses_offered = random.randint(15, 200)
    companies = random.randint(30, 600)
    campus_area = round(random.uniform(5, 2500), 1)
    acceptance_rate = round(random.uniform(2, 70), 1)

    # NIRF ranking - not all colleges have one
    nirf = None
    if random.random() > 0.15:  # 85% have ranking
        if tier == "top":
            nirf = random.randint(1, 50)
        elif tier == "mid":
            nirf = random.randint(30, 150)
        else:
            nirf = random.randint(100, 300)

    # Facilities - random subset
    num_facilities = random.randint(5, len(FACILITIES))
    facilities = random.sample(FACILITIES, num_facilities)

    has_library = "Library" in facilities
    has_hostel = "Hostel" in facilities
    has_sports = "Sports Complex" in facilities
    has_wifi = "WiFi Campus" in facilities
    has_lab = "Research Labs" in facilities
    has_hospital = "Hospital" in facilities

    scholarship = random.choice([True, True, True, False])  # 75% have scholarships

    # Deliberately introduce some missing values and inconsistencies
    if random.random() < 0.05:
        avg_fee = None  # ~5% missing fees
    if random.random() < 0.03:
        placement_rate = None  # ~3% missing placement
    if random.random() < 0.04:
        avg_package = None  # ~4% missing package
        highest_package = None
    if random.random() < 0.02:
        faculty_count = None
        student_faculty_ratio = None

    # Some state name inconsistencies
    state_val = state
    if random.random() < 0.03:
        inconsistencies = {"Delhi": "New Delhi", "Tamil Nadu": "Tamilnadu",
                          "West Bengal": "W. Bengal", "Uttar Pradesh": "UP",
                          "Karnataka": "karnataka"}
        state_val = inconsistencies.get(state, state)

    # Some type inconsistencies
    type_out = type_val
    if random.random() < 0.03:
        type_inconsistencies = {"Government": "Govt", "Private": "private", "Deemed": "deemed"}
        type_out = type_inconsistencies.get(type_val, type_val)

    return {
        "name": name,
        "city": city,
        "state": state_val,
        "type": type_out,
        "established_year": estd,
        "nirf_ranking": nirf,
        "naac_grade": naac,
        "courses_offered": courses_offered,
        "faculty_count": faculty_count,
        "student_faculty_ratio": student_faculty_ratio,
        "avg_annual_fee": avg_fee,
        "hostel_fee": hostel_fee,
        "scholarship_available": scholarship,
        "placement_rate": placement_rate,
        "avg_package_lpa": avg_package,
        "highest_package_lpa": highest_package,
        "companies_visiting": companies,
        "campus_area_acres": campus_area,
        "has_library": has_library,
        "has_hostel": has_hostel,
        "has_sports": has_sports,
        "has_wifi": has_wifi,
        "has_lab": has_lab,
        "has_hospital": has_hospital,
        "acceptance_rate": acceptance_rate,
        "entrance_exams_accepted": exam,
        "total_intake": intake,
    }


def main():
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets", "raw")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "indian_colleges_dataset.csv")

    rows = []
    for idx, college in enumerate(colleges_data):
        rows.append(generate_row(idx, college))

    # Add a couple of duplicate rows (for cleaning notebook to catch)
    rows.append(generate_row(0, colleges_data[0]))  # duplicate IIT Bombay
    rows.append(generate_row(2, colleges_data[2]))  # duplicate IIT Madras

    fieldnames = list(rows[0].keys())

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Dataset created: {output_path}")
    print(f"Total rows: {len(rows)} (including 2 intentional duplicates)")
    print(f"Columns: {len(fieldnames)}")
    print(f"Columns: {', '.join(fieldnames)}")


if __name__ == "__main__":
    main()
