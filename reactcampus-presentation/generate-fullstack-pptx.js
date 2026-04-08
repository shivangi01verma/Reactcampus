import pptxgen from "pptxgenjs";

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Full-Stack Engineering Team";
pres.company = "ReactCampus";
pres.subject = "Complete System Architecture";
pres.title = "ReactCampus: Full-Stack Deep Dive";

const colors = {
  mint: "DEFBE6", cream: "F7F3F2", yellow: "FCF4D6", blue: "E5F6FF",
  grayLight: "C6C6C6", sky: "BAE6FF", cyan: "D9FBFB", white: "FFFFFF",
  black: "000000", ibmBlue: "0f62fe", codeBg: "F5F5F5",
  green: "24A148", orange: "FF832B", purple: "8A3FFC", red: "DA1E28"
};

// Helper function to add code slide
function addCodeSlide(title, subtitle, code, output, bgColor) {
  let slide = pres.addSlide();
  slide.background = { fill: bgColor };
  slide.addText(title, { x: 0.6, y: 0.5, w: 8.8, h: 0.5, fontSize: 24, bold: true, color: colors.black });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.6, y: 1.0, w: 8.8, h: 0.3, fontSize: 12, color: colors.black, italic: true });
  }
  slide.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.4, w: 8.8, h: 4.0, fill: { color: colors.codeBg } });
  slide.addText(code, { x: 0.7, y: 1.5, w: 8.6, h: 3.8, fontSize: 9, fontFace: "Courier New", color: colors.black });
  if (output) {
    slide.addShape(pres.ShapeType.rect, { x: 0.6, y: 5.6, w: 8.8, h: 0.6, fill: { color: colors.green } });
    slide.addText(output, { x: 0.8, y: 5.7, w: 8.4, h: 0.4, fontSize: 11, bold: true, color: colors.white, valign: "middle" });
  }
}

// SLIDE 1: COVER
let slide1 = pres.addSlide();
slide1.background = { fill: colors.ibmBlue };
slide1.addText("ReactCampus", { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 48, bold: true, color: colors.white, align: "center" });
slide1.addText("Full-Stack Engineering Deep Dive", { x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 24, color: colors.white, align: "center" });
slide1.addText("Every Component | Every Layer | Every Logic", { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 16, color: colors.white, align: "center", italic: true });
slide1.addText("Python • MongoDB • Node.js • Express • React • TypeScript", { x: 0.5, y: 4.8, w: 9, h: 0.3, fontSize: 13, color: colors.white, align: "center" });

// SLIDE 2: ARCHITECTURE OVERVIEW
let slide2 = pres.addSlide();
slide2.background = { fill: colors.cream };
slide2.addText("Complete System Architecture", { x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontSize: 26, bold: true, color: colors.black });
const layers = [
  { name: "🐍 Data Layer", tech: "Python 3.11 | Pandas 2.0 | Scikit-learn 1.3", files: "4 scripts, 4 notebooks", color: colors.purple },
  { name: "🗄️ Database", tech: "MongoDB 7.0 | Mongoose ODM | 14 Collections", files: "14 models, 8 seeds", color: colors.green },
  { name: "⚙️ Backend", tech: "Node.js 18 | Express 4.18 | JWT Auth", files: "14 services, 14 controllers", color: colors.ibmBlue },
  { name: "🔌 API Layer", tech: "REST APIs | RBAC | 50+ Permissions", files: "14 route modules, 80+ endpoints", color: colors.orange },
  { name: "⚛️ Frontend", tech: "React 18 | TypeScript | TanStack Query", files: "Custom hooks, guards, stores", color: colors.cyan }
];
layers.forEach((l, i) => {
  const y = 1.5 + (i * 0.8);
  slide2.addShape(pres.ShapeType.rect, { x: 0.6, y: y, w: 8.8, h: 0.7, fill: { color: l.color } });
  slide2.addText(l.name, { x: 0.8, y: y + 0.05, w: 2.5, h: 0.3, fontSize: 16, bold: true, color: colors.white });
  slide2.addText(l.tech, { x: 0.8, y: y + 0.35, w: 4.0, h: 0.25, fontSize: 11, color: colors.white });
  slide2.addText(l.files, { x: 5.0, y: y + 0.2, w: 4.0, h: 0.3, fontSize: 11, color: colors.white, italic: true });
});
slide2.addText("📊 15,000+ LOC | 150+ Files | 14 Models | 80+ Endpoints | 50+ Permissions", { x: 0.6, y: 5.8, w: 8.8, h: 0.3, fontSize: 11, color: colors.black, align: "center", bold: true });

// DATA LAYER SLIDES
addCodeSlide(
  "Data Layer: Generation (create_dataset.py)",
  "📁 459 lines | Generates 213 colleges with 27 features",
  `import random, csv
random.seed(42)  # Reproducibility

colleges_data = [
    ("IIT Bombay", "Mumbai", "Maharashtra", "Government", 1958, "A++", "JEE Advanced", 1000),
    ("IIT Delhi", "New Delhi", "Delhi", "Government", 1961, "A++", "JEE Advanced", 1100),
    # ... 211 more real colleges
]

def generate_metrics(tier, college_type):
    if tier == "Tier 1":
        placement_rate = random.uniform(85, 98)
        avg_package = random.uniform(12, 25)
    elif tier == "Tier 2":
        placement_rate = random.uniform(70, 85)
        avg_package = random.uniform(6, 12)
    # ... Tier 3 & 4
    
    return {
        'placement_rate': placement_rate,
        'avg_package_lpa': avg_package,
        'student_faculty_ratio': random.uniform(10, 30),
        'infrastructure_score': random.randint(60, 95),
        'companies_visiting': random.randint(50, 300),
        # ... 22 more features
    }

# Intentional quality issues for testing
if random.random() < 0.05:  # 5% missing
    metrics['placement_rate'] = None`,
  "✅ Output: indian_colleges_dataset.csv | 213 rows × 27 columns",
  colors.purple
);

addCodeSlide(
  "Data Layer: Cleaning (01_data_cleaning.ipynb)",
  "📁 Jupyter Notebook | Pandas data cleaning pipeline",
  `import pandas as pd
import numpy as np

df = pd.read_csv('indian_colleges_dataset.csv')
print(f"Initial: {df.shape}")  # (213, 27)

# 1. Remove duplicates
df = df.drop_duplicates(subset=['name'], keep='first')
print(f"After dedup: {df.shape}")  # (211, 27)

# 2. Standardize state names
state_mapping = {
    'maharashtra': 'Maharashtra', 'MH': 'Maharashtra',
    'delhi': 'Delhi', 'DL': 'Delhi', 'karnataka': 'Karnataka'
}
df['state'] = df['state'].replace(state_mapping)

# 3. Handle missing values (median imputation)
numeric_cols = ['placement_rate', 'avg_package_lpa', 'infrastructure_score']
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

# 4. Remove outliers (IQR method)
Q1 = df['avg_package_lpa'].quantile(0.25)
Q3 = df['avg_package_lpa'].quantile(0.75)
IQR = Q3 - Q1
df = df[(df['avg_package_lpa'] >= Q1 - 1.5*IQR) & 
        (df['avg_package_lpa'] <= Q3 + 1.5*IQR)]

df.to_csv('colleges_cleaned.csv', index=False)
print(f"Final: {df.shape}")  # (211, 27)`,
  "✅ Result: 211 colleges | 99.1% retention | 100% clean",
  colors.mint
);

addCodeSlide(
  "Data Layer: ML Scoring (generate_scores.py)",
  "📁 123 lines | Scikit-learn MinMaxScaler | 7-component weighted model",
  `from sklearn.preprocessing import MinMaxScaler
import pandas as pd, json

SCORING_FEATURES = {
    'placement_rate': {'weight': 0.25, 'higher_is_better': True},
    'avg_package_lpa': {'weight': 0.20, 'higher_is_better': True},
    'naac_numeric': {'weight': 0.15, 'higher_is_better': True},
    'student_faculty_ratio': {'weight': 0.10, 'higher_is_better': False},
    'infrastructure_score': {'weight': 0.10, 'higher_is_better': True},
    'companies_visiting': {'weight': 0.10, 'higher_is_better': True},
    'acceptance_rate': {'weight': 0.10, 'higher_is_better': False}
}

df = pd.read_csv('colleges_cleaned.csv')
feature_names = list(SCORING_FEATURES.keys())

# Normalize to 0-1 range
scaler = MinMaxScaler()
normalized = scaler.fit_transform(df[feature_names])

# Invert metrics where lower is better
for i, feat in enumerate(feature_names):
    if not SCORING_FEATURES[feat]['higher_is_better']:
        normalized[:, i] = 1 - normalized[:, i]

# Calculate weighted score
scores = [sum(row[i] * SCORING_FEATURES[feat]['weight'] 
              for i, feat in enumerate(feature_names)) * 100 
          for row in normalized]

# Assign tiers
def assign_tier(score):
    if score >= 75: return 'Tier 1'
    elif score >= 55: return 'Tier 2'
    elif score >= 35: return 'Tier 3'
    return 'Tier 4'`,
  "✅ Output: college_scores.json | Tier distribution: 10, 85, 107, 9",
  colors.yellow
);

// DATABASE LAYER SLIDES
addCodeSlide(
  "Database: College Model (College.model.js)",
  "📁 MongoDB schema with geospatial indexing & text search",
  `const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Government', 'Private', 'Deemed', 'Autonomous'] },
  
  location: {
    city: { type: String },
    state: { type: String },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }  // [lng, lat]
    }
  },
  
  // ML-generated scores
  score: { type: Number, min: 0, max: 100, default: null },
  tier: { type: String, enum: ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'] },
  scoreBreakdown: {
    placement: { type: Number, default: 0 },
    package: { type: Number, default: 0 },
    naac: { type: Number, default: 0 },
    facultyRatio: { type: Number, default: 0 },
    infrastructure: { type: Number, default: 0 },
    companies: { type: Number, default: 0 },
    selectivity: { type: Number, default: 0 }
  },
  
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  deletedAt: { type: Date, default: null }  // Soft delete
}, { timestamps: true });

// Geospatial index for location queries
collegeSchema.index({ 'location.coordinates': '2dsphere' });

// Text search index
collegeSchema.index({ name: 'text', 'location.city': 'text', 'location.state': 'text' });

module.exports = mongoose.model('College', collegeSchema);`,
  "✅ 14 total models: College, User, Lead, Review, Course, Exam, ContentSection, DynamicForm, etc.",
  colors.green
);

// BACKEND LAYER SLIDES
addCodeSlide(
  "Backend: College Service (college.service.js)",
  "📁 Business logic layer | Advanced queries with MongoDB aggregation",
  `class CollegeService {
  async getColleges(filters, options) {
    const query = { status: 'published', deletedAt: null };
    
    // Text search
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    // Geospatial query (find colleges near location)
    if (filters.near) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [filters.lng, filters.lat]
          },
          $maxDistance: filters.radius || 50000  // 50km default
        }
      };
    }
    
    // Score range filter
    if (filters.minScore) {
      query.score = { $gte: filters.minScore };
    }
    if (filters.maxScore) {
      query.score = { ...query.score, $lte: filters.maxScore };
    }
    
    // Tier filter
    if (filters.tier && filters.tier.length > 0) {
      query.tier = { $in: filters.tier };
    }
    
    // State filter
    if (filters.state) {
      query['location.state'] = filters.state;
    }
    
    // Execute with pagination
    const colleges = await College.find(query)
      .sort(options.sort || { score: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .populate('courses exams')
      .lean();
      
    return colleges;
  }
}`,
  "✅ 14 services: College, User, Lead, Review, Course, Exam, Analytics, etc.",
  colors.ibmBlue
);

addCodeSlide(
  "Backend: Analytics Service (analytics.service.js)",
  "📁 MongoDB aggregation pipelines for real-time analytics",
  `class AnalyticsService {
  async getCollegeAnalytics() {
    // Tier distribution
    const tierDist = await College.aggregate([
      { $match: { status: 'published', deletedAt: null } },
      { $group: { _id: '$tier', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // State-wise statistics
    const stateStats = await College.aggregate([
      { $match: { status: 'published' } },
      { $group: {
          _id: '$location.state',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          avgPlacement: { $avg: '$scoreBreakdown.placement' },
          avgPackage: { $avg: '$scoreBreakdown.package' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Type comparison (Government vs Private vs Deemed)
    const typeComp = await College.aggregate([
      { $match: { status: 'published' } },
      { $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          avgPackage: { $avg: '$scoreBreakdown.package' }
        }
      }
    ]);
    
    // Top performers
    const topColleges = await College.find({ status: 'published' })
      .sort({ score: -1 })
      .limit(20)
      .select('name score tier location.state');
      
    return { tierDist, stateStats, typeComp, topColleges };
  }
}`,
  "✅ Real-time dashboards | Aggregation queries | Lead tracking | Review analytics",
  colors.orange
);

// API LAYER SLIDES
addCodeSlide(
  "API: Authentication (auth.service.js)",
  "📁 JWT-based authentication | Refresh token rotation | Password hashing",
  `const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  async login(email, password) {
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError(401, 'Invalid credentials');
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');
    
    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Store refresh token in DB
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    return { accessToken, refreshToken, user };
  }
  
  async refreshAccessToken(refreshToken) {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Check if token exists in DB
    const tokenDoc = await RefreshToken.findOne({ 
      token: refreshToken, 
      user: decoded.userId 
    });
    if (!tokenDoc) throw new ApiError(401, 'Invalid refresh token');
    
    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    return { accessToken };
  }
}`,
  "✅ JWT Auth | Refresh tokens | Password hashing (bcrypt) | Session management",
  colors.cyan
);

addCodeSlide(
  "API: RBAC System (authorize.js middleware)",
  "📁 Role-Based Access Control | 50+ granular permissions | Permission caching",
  `const authorize = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;  // Set by authenticate middleware
      
      // Super admin bypass
      if (user.role === 'super_admin') {
        return next();
      }
      
      // Get user's role with permissions
      const role = await Role.findById(user.role)
        .populate('permissions')
        .lean();
      
      if (!role) {
        throw new ApiError(403, 'Role not found');
      }
      
      // Extract permission names
      const userPermissions = role.permissions.map(p => p.name);
      
      // Check if user has all required permissions
      const hasPermission = requiredPermissions.every(
        perm => userPermissions.includes(perm)
      );
      
      if (!hasPermission) {
        throw new ApiError(403, 'Insufficient permissions');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Usage in routes
router.post('/colleges', 
  authenticate, 
  authorize('college:create'), 
  collegeController.create
);

router.put('/colleges/:id', 
  authenticate, 
  authorize('college:update'), 
  collegeController.update
);`,
  "✅ 50+ permissions: college:create, college:update, user:manage, lead:view, etc.",
  colors.red
);

// FRONTEND LAYER SLIDES
addCodeSlide(
  "Frontend: Custom Hooks (useAuth.ts)",
  "📁 React hooks for authentication | TanStack Query integration",
  `import { useQuery, useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, setUser, clearUser } = useAuthStore();
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await axios.post('/api/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/auth/logout');
    },
    onSuccess: () => {
      clearUser();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  });
  
  // Get current user query
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await axios.get('/api/auth/me');
      return data.user;
    },
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 5 * 60 * 1000  // 5 minutes
  });
  
  return {
    user: currentUser || user,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isAuthenticated: !!currentUser
  };
}`,
  "✅ Custom hooks: useAuth, usePermissions, usePagination, useDebounce, useQueryParams",
  colors.cyan
);

addCodeSlide(
  "Frontend: College List Component",
  "📁 React + TypeScript | TanStack Query | Infinite scroll | Real-time search",
  `import { useInfiniteQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';

interface CollegeFilters {
  search?: string;
  tier?: string[];
  state?: string;
  minScore?: number;
}

export function CollegeList() {
  const [filters, setFilters] = useState<CollegeFilters>({});
  const debouncedSearch = useDebounce(filters.search, 500);
  
  // Infinite query for pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['colleges', { ...filters, search: debouncedSearch }],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get('/api/colleges', {
        params: {
          ...filters,
          search: debouncedSearch,
          page: pageParam,
          limit: 20
        }
      });
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000  // 5 minutes
  });
  
  if (isLoading) return <Skeleton count={10} />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <SearchBar value={filters.search} onChange={(v) => setFilters({...filters, search: v})} />
      <FilterPanel filters={filters} onChange={setFilters} />
      
      {data?.pages.map((page) => (
        page.colleges.map((college) => (
          <CollegeCard key={college._id} college={college} />
        ))
      ))}
      
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load More</button>}
    </div>
  );
}`,
  "✅ Features: Infinite scroll, Real-time search, Filter persistence, Optimistic updates",
  colors.blue
);

// FINAL SLIDES
let slideConclusion = pres.addSlide();
slideConclusion.background = { fill: colors.ibmBlue };
slideConclusion.addText("Complete System Summary", { x: 0.5, y: 1.5, w: 9, h: 0.6, fontSize: 32, bold: true, color: colors.white, align: "center" });
const summary = [
  "✅ Data Layer: Python pipeline (generation → cleaning → ML scoring)",
  "✅ Database: MongoDB with 14 models, geospatial & text indexes",
  "✅ Backend: Node.js/Express with 14 services, 14 controllers",
  "✅ API: 80+ REST endpoints with JWT auth & RBAC (50+ permissions)",
  "✅ Frontend: React 18 + TypeScript with custom hooks & state management",
  "✅ Total: 15,000+ LOC | 150+ files | Production-ready architecture"
];
summary.forEach((s, i) => {
  slideConclusion.addText(s, { x: 1.0, y: 2.5 + (i * 0.45), w: 8, h: 0.4, fontSize: 16, color: colors.white });
});

let slideThanks = pres.addSlide();
slideThanks.background = { fill: colors.green };
slideThanks.addText("Thank You", { x: 0.5, y: 2.5, w: 9, h: 0.8, fontSize: 48, bold: true, color: colors.white, align: "center" });
slideThanks.addText("Questions?", { x: 0.5, y: 3.5, w: 9, h: 0.5, fontSize: 28, color: colors.white, align: "center" });

pres.writeFile({ fileName: "ReactCampus-FullStack-Complete.pptx" });
console.log("✅ Full-Stack Complete PowerPoint generated!");
