const connectDB = require('../config/db');
const College = require('../models/College.model');

const IMAGES = {
  'indian-institute-of-technology-bombay': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=400&fit=crop'
  },
  'indian-institute-of-technology-delhi': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/200px-Indian_Institute_of_Technology_Delhi_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c6f1?w=1200&h=400&fit=crop'
  },
  'indian-institute-of-technology-madras': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/200px-IIT_Madras_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop'
  },
  'indian-institute-of-technology-kanpur': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/IIT_Kanpur_Logo.svg/200px-IIT_Kanpur_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=400&fit=crop'
  },
  'indian-institute-of-technology-kharagpur': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/200px-IIT_Kharagpur_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&h=400&fit=crop'
  },
  'all-india-institute-of-medical-sciences-new-delhi': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/AIIMS_New_Delhi_logo.svg/200px-AIIMS_New_Delhi_logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop'
  },
  'indian-institute-of-management-ahmedabad': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/IIM_Ahmedabad_Logo.svg/200px-IIM_Ahmedabad_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop'
  },
  'indian-institute-of-management-bangalore': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/IIM_Bangalore_Logo.svg/200px-IIM_Bangalore_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=400&fit=crop'
  },
  'birla-institute-of-technology-and-science-pilani': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani-Logo.svg/200px-BITS_Pilani-Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=1200&h=400&fit=crop'
  },
  'vellore-institute-of-technology': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Vellore_Institute_of_Technology_seal_2017.svg/200px-Vellore_Institute_of_Technology_seal_2017.svg.png',
    cover: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&h=400&fit=crop'
  },
  'national-law-school-of-india-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/National_Law_School_of_India_University_logo.png/200px-National_Law_School_of_India_University_logo.png',
    cover: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=1200&h=400&fit=crop'
  },
  'jawaharlal-nehru-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/JNU_Crest.svg/200px-JNU_Crest.svg.png',
    cover: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=400&fit=crop'
  },
  'university-of-delhi': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/University_of_Delhi.svg/200px-University_of_Delhi.svg.png',
    cover: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&h=400&fit=crop'
  },
  'banaras-hindu-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Banaras_Hindu_University_Coat_of_Arms.svg/200px-Banaras_Hindu_University_Coat_of_Arms.svg.png',
    cover: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=400&fit=crop'
  },
  'jadavpur-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Jadavpur_University_Logo.svg/200px-Jadavpur_University_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop'
  },
  'national-institute-of-technology-tiruchirappalli': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/National_Institute_of_Technology%2C_Tiruchirappalli_Logo.svg/200px-National_Institute_of_Technology%2C_Tiruchirappalli_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=400&fit=crop'
  },
  'manipal-academy-of-higher-education': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/79/MAHE_logo.png',
    cover: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&h=400&fit=crop'
  },
  'srm-institute-of-science-and-technology': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fe/Srmseal.png/200px-Srmseal.png',
    cover: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&h=400&fit=crop'
  },
  'anna-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Anna_University_Logo.svg/200px-Anna_University_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=1200&h=400&fit=crop'
  },
  'indian-institute-of-science': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Indian_Institute_of_Science_logo.png/200px-Indian_Institute_of_Science_logo.png',
    cover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop'
  },
  'jamia-millia-islamia': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Jamia_Millia_Islamia_Logo.svg/200px-Jamia_Millia_Islamia_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop'
  },
  'osmania-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Osmania_University_logo.png/200px-Osmania_University_logo.png',
    cover: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=400&fit=crop'
  },
  'amity-university-noida': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Amity_University_logo.png/200px-Amity_University_logo.png',
    cover: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=1200&h=400&fit=crop'
  },
  'symbiosis-international-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/81/Symbiosis_International_University_logo.png',
    cover: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&h=400&fit=crop'
  },
  'christ-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Christ_University_Logo.png/200px-Christ_University_Logo.png',
    cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c6f1?w=1200&h=400&fit=crop'
  },
  'savitribai-phule-pune-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Savitribai_Phule_Pune_University_Logo.svg/200px-Savitribai_Phule_Pune_University_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop'
  },
  'lovely-professional-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Lovely_Professional_University_logo.png',
    cover: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=400&fit=crop'
  },
  'chandigarh-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Chandigarh_University_Seal.png/200px-Chandigarh_University_Seal.png',
    cover: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1200&h=400&fit=crop'
  },
  'jamia-hamdard-university': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Jamia_Hamdard_Logo.svg/200px-Jamia_Hamdard_Logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&h=400&fit=crop'
  },
  'tata-institute-of-social-sciences': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fe/TISS_logo.svg/200px-TISS_logo.svg.png',
    cover: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=1200&h=400&fit=crop'
  },
};

(async () => {
  await connectDB();
  let updated = 0;
  for (const [slug, imgs] of Object.entries(IMAGES)) {
    const result = await College.updateOne(
      { slug },
      { $set: { logo: imgs.logo, coverImage: imgs.cover } }
    );
    if (result.modifiedCount > 0) updated++;
  }
  console.log(`Updated ${updated} colleges with logo + cover images`);
  process.exit(0);
})();
