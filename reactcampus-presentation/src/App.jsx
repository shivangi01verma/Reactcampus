import React, { useState, useEffect } from 'react';
import CoverSlide from './components/slides/CoverSlide';
import IconTextRowsSlide from './components/slides/IconTextRowsSlide';
import DashboardGridSlide from './components/slides/DashboardGridSlide';
import TwoColumnSlide from './components/slides/TwoColumnSlide';
import TimelineSlide from './components/slides/TimelineSlide';
import BulletSlide from './components/slides/BulletSlide';
import SectionDividerSlide from './components/slides/SectionDividerSlide';
import DataTableSlide from './components/slides/DataTableSlide';
import BeforeAfterSlide from './components/slides/BeforeAfterSlide';
import CodeExplanationSlide from './components/slides/CodeExplanationSlide';
import { exportToPDF, exportToPPTX } from './utils/export';
import './styles/global.css';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Cover
    <CoverSlide
      title="ReactCampus Data Analysis"
      subtitle="Comprehensive Data Architecture & Analytics Review"
      author="Data Analyst"
      date="April 2026"
    />,

    // Slide 2: Project Overview
    <IconTextRowsSlide
      title="Project Overview"
      items={[
        {
          icon: "🎓",
          title: "College Discovery Platform",
          description: "Full-stack MERN application for college search and comparison"
        },
        {
          icon: "📊",
          title: "Data-Driven Insights",
          description: "Python-based analytics pipeline with ML scoring algorithms"
        },
        {
          icon: "🔄",
          title: "End-to-End Pipeline",
          description: "CSV → Python Analysis → MongoDB → REST API → React Frontend"
        }
      ]}
    />,

    // Slide 3: Key Metrics
    <DashboardGridSlide
      title="Dataset Overview"
      metrics={[
        { value: "211", label: "Colleges Analyzed" },
        { value: "31", label: "States Covered" },
        { value: "27", label: "Data Features" },
        { value: "99.1%", label: "Data Retention Rate" }
      ]}
    />,

    // Slide 3.5: Raw Dataset Sample
    <DataTableSlide
      title="Raw Dataset Sample"
      subtitle="Initial data collected from various sources"
      description="📊 This is what our raw data looks like - notice the inconsistencies and missing values that need cleaning"
      headers={['College Name', 'City', 'State', 'Type', 'NIRF Rank', 'NAAC Grade', 'Placement %']}
      rows={[
        ['BITS Pilani', 'Pilani', 'Rajasthan', 'Private', '30', 'A++', '92.5'],
        ['NIT Trichy', 'Tiruchirappalli', 'Tamil Nadu', 'Government', '9', 'A++', '88.3'],
        ['VIT Vellore', 'Vellore', 'Tamil Nadu', 'Private', '15', 'A+', '85.7'],
        ['Manipal Institute', 'Manipal', 'Karnataka', 'Private', '', 'A', '78.2'],
        ['SRM University', 'Chennai', 'Tamil Nadu', 'Private', '41', '', '82.1']
      ]}
      highlightColumns={['NIRF Rank', 'NAAC Grade']}
      caption="⚠️ Notice: Missing values in NIRF Rank and NAAC Grade columns need to be handled"
      variant="before"
    />,

    // Slide 4: Data Sources
    <TwoColumnSlide
      title="Data Sources & Architecture"
      split="50/50"
      leftContent={
        <>
          <h3>Primary Sources</h3>
          <ul>
            <li>Synthetic college dataset (CSV)</li>
            <li>Python analysis outputs (JSON)</li>
            <li>MongoDB collections (14+)</li>
            <li>User-generated content</li>
          </ul>
        </>
      }
      rightContent={
        <>
          <h3>Tech Stack</h3>
          <ul>
            <li>Python: Pandas, Scikit-learn</li>
            <li>MongoDB with geospatial indexing</li>
            <li>Node.js + Express REST API</li>
            <li>React frontend with TypeScript</li>
          </ul>
        </>
      }
    />,

    // Slide 5: Section Divider
    <SectionDividerSlide
      number="01"
      title="Data Flow Architecture"
      subtitle="From raw data to actionable insights"
    />,

    // Slide 6: Data Pipeline
    <TimelineSlide
      title="7-Stage Data Pipeline"
      events={[
        {
          title: "Data Generation",
          description: "Create synthetic dataset with 213 colleges"
        },
        {
          title: "Data Cleaning",
          description: "Remove duplicates, handle missing values"
        },
        {
          title: "EDA & Analysis",
          description: "Statistical analysis and visualizations"
        },
        {
          title: "Scoring Model",
          description: "7-component weighted algorithm"
        },
        {
          title: "JSON Export",
          description: "Export scores and analytics"
        },
        {
          title: "Database Seeding",
          description: "Import to MongoDB collections"
        },
        {
          title: "API & Frontend",
          description: "Serve via REST API to React app"
        }
      ]}
    />,

    // Slide 6.5: Data Cleaning Process
    <BeforeAfterSlide
      title="Data Cleaning Process"
      subtitle="Transforming raw data into analysis-ready format"
      beforeTitle="Raw Data Issues"
      afterTitle="Clean Data"
      beforeContent={
        <table>
          <thead>
            <tr>
              <th>Issue</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Missing Values</td>
              <td>NIRF Rank: blank</td>
            </tr>
            <tr>
              <td>Inconsistent Types</td>
              <td>Type: "Govt" vs "Government"</td>
            </tr>
            <tr>
              <td>Duplicates</td>
              <td>2 entries for same college</td>
            </tr>
            <tr>
              <td>Outliers</td>
              <td>Fees: ₹9,99,999</td>
            </tr>
          </tbody>
        </table>
      }
      afterContent={
        <table>
          <thead>
            <tr>
              <th>Solution</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Filled with median</td>
              <td>NIRF Rank: 125</td>
            </tr>
            <tr>
              <td>Standardized values</td>
              <td>Type: "Government"</td>
            </tr>
            <tr>
              <td>Removed duplicates</td>
              <td>211 unique colleges</td>
            </tr>
            <tr>
              <td>Capped at 99th percentile</td>
              <td>Fees: ₹2,50,000</td>
            </tr>
          </tbody>
        </table>
      }
      changes={[
        'Removed 2 duplicate entries',
        'Filled 18 missing NIRF rankings',
        'Standardized college type labels',
        'Handled 5 outlier values'
      ]}
    />,

    // Slide 6.6: Code Explanation - Data Cleaning
    <CodeExplanationSlide
      title="Data Cleaning Code"
      subtitle="How we prepare data for analysis"
      language="Python"
      codeSnippet={`# Remove duplicates
df = df.drop_duplicates(subset=['name'])

# Fill missing NIRF rankings with median
df['nirf_ranking'].fillna(
    df['nirf_ranking'].median(),
    inplace=True
)

# Standardize college types
df['type'] = df['type'].replace({
    'Govt': 'Government',
    'Pvt': 'Private'
})`}
      explanations={[
        {
          title: 'Remove Duplicates',
          description: 'Ensures each college appears only once in our database, preventing double-counting in analytics'
        },
        {
          title: 'Fill Missing Values',
          description: 'Uses the middle value (median) of all rankings to fill gaps, maintaining data accuracy'
        },
        {
          title: 'Standardize Labels',
          description: 'Makes all college types consistent (e.g., "Govt" → "Government") for proper filtering'
        }
      ]}
      businessImpact="Clean data means accurate search results and reliable college comparisons for users, leading to better decision-making and higher platform trust."
    />,

    // Slide 7: Data Models
    <BulletSlide
      title="Core Data Models (14 Collections)"
      items={[
        { title: "College", description: "Core schema with score, tier, geospatial data" },
        { title: "User", description: "RBAC with roles and permissions" },
        { title: "Lead", description: "Lead tracking with status pipeline" },
        { title: "Review", description: "User reviews with moderation workflow" },
        { title: "DynamicForm", description: "Customizable forms with validation" },
        { title: "ContentSection", description: "CMS for dynamic page content" }
      ]}
    />,

    // Slide 8: Scoring Algorithm
    <TwoColumnSlide
      title="College Scoring Model"
      split="60/40"
      leftContent={
        <>
          <h3>7-Component Algorithm</h3>
          <ul>
            <li>Placement Rate: 25%</li>
            <li>Average Package: 20%</li>
            <li>NAAC Grade: 15%</li>
            <li>Faculty Ratio: 15%</li>
            <li>Infrastructure: 10%</li>
            <li>Research Output: 10%</li>
            <li>Student Satisfaction: 5%</li>
          </ul>
        </>
      }
      rightContent={
        <>
          <h3>Tier Classification</h3>
          <ul>
            <li>Tier 1: Score ≥ 80</li>
            <li>Tier 2: 60-79</li>
            <li>Tier 3: 40-59</li>
            <li>Tier 4: {'<'} 40</li>
          </ul>
          <p style={{ marginTop: '20px', fontSize: '14pt' }}>
            Enables intelligent filtering and recommendations
          </p>
        </>
      }
    />,

    // Slide 8.5: Scoring Model Example
    <DataTableSlide
      title="College Scoring in Action"
      subtitle="Real examples showing how colleges are ranked"
      description="💡 Each college gets a score (0-100) based on multiple factors, helping students make informed decisions"
      headers={['College', 'Placement', 'Package', 'NAAC', 'Faculty', 'Final Score', 'Tier']}
      rows={[
        ['BITS Pilani', '92.5%', '₹12.5L', 'A++', '1:12', '87.3', 'Tier 1'],
        ['NIT Trichy', '88.3%', '₹11.2L', 'A++', '1:15', '84.1', 'Tier 1'],
        ['VIT Vellore', '85.7%', '₹8.5L', 'A+', '1:18', '76.8', 'Tier 2'],
        ['Manipal Institute', '78.2%', '₹7.2L', 'A', '1:20', '68.5', 'Tier 2'],
        ['SRM University', '82.1%', '₹6.8L', 'A', '1:22', '71.2', 'Tier 2']
      ]}
      highlightColumns={['Final Score', 'Tier']}
      caption="✨ Higher scores = Better overall quality. This helps students filter colleges by quality tier."
      variant="after"
    />,

    // Slide 8.6: Scoring Code Explanation
    <CodeExplanationSlide
      title="Scoring Algorithm Code"
      subtitle="How we calculate college quality scores"
      language="Python"
      codeSnippet={`def calculate_score(college):
    score = 0
    
    # Placement (25% weight)
    score += college['placement_rate'] * 0.25
    
    # Package (20% weight)
    normalized_pkg = college['avg_package'] / 20
    score += normalized_pkg * 0.20
    
    # NAAC Grade (15% weight)
    grade_map = {'A++': 100, 'A+': 85, 'A': 70}
    score += grade_map[college['naac']] * 0.15
    
    return round(score, 2)`}
      explanations={[
        {
          title: 'Weighted Components',
          description: 'Each factor (placement, salary, accreditation) contributes a specific percentage to the final score'
        },
        {
          title: 'Normalization',
          description: 'Converts different scales (percentages, rupees, grades) into comparable 0-100 values'
        },
        {
          title: 'Final Score',
          description: 'Combines all factors into a single number (0-100) that represents overall college quality'
        }
      ]}
      businessImpact="Automated scoring saves hours of manual research for students and provides objective, data-driven college rankings that build platform credibility."
    />,

    // Slide 9: Section Divider
    <SectionDividerSlide
      number="02"
      title="Data Usage & Analytics"
      subtitle="How data drives business decisions"
    />,

    // Slide 10: Data Usage Patterns
    <IconTextRowsSlide
      title="Key Data Usage Patterns"
      items={[
        {
          icon: "🔍",
          title: "Search & Discovery",
          description: "Full-text search, filters by location, type, fees, and tier"
        },
        {
          icon: "📈",
          title: "Lead Management",
          description: "Track leads through new → contacted → qualified → converted"
        },
        {
          icon: "⭐",
          title: "Review System",
          description: "User reviews with moderation and sentiment analysis"
        },
        {
          icon: "📊",
          title: "Analytics Dashboard",
          description: "Aggregation pipelines for real-time business intelligence"
        }
      ]}
    />,

    // Slide 10.5: Data Flow Example
    <BeforeAfterSlide
      title="Data Journey: From Database to User"
      subtitle="How college data reaches students"
      beforeTitle="In Database (MongoDB)"
      afterTitle="On Website (User Sees)"
      beforeContent={
        <pre>{`{
  "_id": "65f8a2b...",
  "name": "BITS Pilani",
  "city": "Pilani",
  "state": "Rajasthan",
  "type": "Private",
  "score": 87.3,
  "tier": 1,
  "placement_rate": 92.5,
  "avg_package_lpa": 12.5,
  "naac_grade": "A++",
  "courses_offered": 45
}`}</pre>
      }
      afterContent={
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>BITS Pilani</h3>
          <div style={{ display: 'grid', gap: '10px', fontSize: '11pt' }}>
            <div><strong>📍 Location:</strong> Pilani, Rajasthan</div>
            <div><strong>🏛️ Type:</strong> Private</div>
            <div><strong>⭐ Quality Score:</strong> 87.3/100 (Tier 1)</div>
            <div><strong>💼 Placement:</strong> 92.5%</div>
            <div><strong>💰 Avg Package:</strong> ₹12.5 LPA</div>
            <div><strong>🎓 Accreditation:</strong> NAAC A++</div>
            <div><strong>📚 Courses:</strong> 45 programs</div>
          </div>
        </div>
      }
      changes={[
        'Raw data formatted for readability',
        'Technical fields converted to user-friendly labels',
        'Icons added for visual appeal',
        'Complex numbers simplified (87.3 → "Tier 1 Quality")'
      ]}
    />,

    // Slide 10.6: API Code Example
    <CodeExplanationSlide
      title="API Integration Code"
      subtitle="How frontend fetches college data"
      language="JavaScript"
      codeSnippet={`// Fetch colleges with filters
const response = await fetch(
  '/api/colleges?tier=1&state=Karnataka&limit=10'
);

const data = await response.json();

// Display colleges
data.colleges.forEach(college => {
  displayCollege({
    name: college.name,
    score: college.score,
    tier: college.tier,
    placement: college.placement_rate
  });
});`}
      explanations={[
        {
          title: 'API Request',
          description: 'Frontend asks the server for colleges matching specific criteria (Tier 1, in Karnataka, max 10 results)'
        },
        {
          title: 'Data Processing',
          description: 'Server queries MongoDB, applies filters, and returns matching colleges in JSON format'
        },
        {
          title: 'Display to User',
          description: 'Frontend receives data and shows it in a user-friendly format with cards, filters, and sorting'
        }
      ]}
      businessImpact="Fast API responses (< 200ms) mean students can search and compare colleges instantly, improving user experience and reducing bounce rates."
    />,

    // Slide 11: Analytics Capabilities
    <DashboardGridSlide
      title="Current Analytics Implementation"
      metrics={[
        { value: "50+", label: "RBAC Permissions" },
        { value: "14", label: "REST API Endpoints" },
        { value: "7", label: "Aggregation Pipelines" },
        { value: "100%", label: "Audit Log Coverage" }
      ]}
    />,

    // Slide 11.5: Analytics Dashboard Example
    <DataTableSlide
      title="Real-Time Analytics Dashboard"
      subtitle="Key metrics tracked for business decisions"
      description="📈 Live data helps management understand platform performance and user behavior"
      headers={['Metric', 'Today', 'This Week', 'This Month', 'Trend']}
      rows={[
        ['New Leads', '47', '312', '1,248', '↑ 23%'],
        ['College Searches', '1,523', '9,847', '38,921', '↑ 15%'],
        ['User Registrations', '89', '634', '2,456', '↑ 31%'],
        ['Lead Conversions', '12', '87', '342', '↑ 18%'],
        ['Avg. Session Time', '4m 32s', '4m 18s', '4m 05s', '↑ 7%']
      ]}
      highlightColumns={['This Month', 'Trend']}
      caption="✅ All metrics trending upward - platform engagement is growing steadily"
      variant="after"
    />,

    // Slide 11.6: Analytics Code
    <CodeExplanationSlide
      title="Analytics Aggregation Code"
      subtitle="How we calculate business metrics"
      language="JavaScript (MongoDB)"
      codeSnippet={`// Calculate lead conversion rate
const stats = await Lead.aggregate([
  {
    $match: {
      createdAt: { $gte: startDate }
    }
  },
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      status: '$_id',
      count: 1,
      percentage: {
        $multiply: [
          { $divide: ['$count', totalLeads] },
          100
        ]
      }
    }
  }
]);`}
      explanations={[
        {
          title: 'Filter Data',
          description: 'Select only leads created within the specified time period (e.g., this month)'
        },
        {
          title: 'Group & Count',
          description: 'Organize leads by status (new, contacted, converted) and count how many in each category'
        },
        {
          title: 'Calculate Percentages',
          description: 'Convert raw counts into percentages to show conversion rates (e.g., 27% of leads converted)'
        }
      ]}
      businessImpact="Real-time analytics help identify bottlenecks in the sales funnel, enabling quick adjustments to improve conversion rates and revenue."
    />,

    // Slide 12: Section Divider
    <SectionDividerSlide
      number="03"
      title="Data Analyst Focus Areas"
      subtitle="Priority initiatives and recommendations"
    />,

    // Slide 13: Focus Areas
    <BulletSlide
      title="Data Analyst Priority Areas"
      variant="accent"
      items={[
        { title: "Scoring Model Validation", description: "Test against real-world outcomes and adjust weights" },
        { title: "Analytics Dashboard", description: "Build comprehensive BI dashboards for stakeholders" },
        { title: "User Behavior Tracking", description: "Implement event tracking and session analytics" },
        { title: "Lead Conversion Optimization", description: "Analyze and optimize the lead funnel" },
        { title: "A/B Testing Framework", description: "Set up experimentation infrastructure" }
      ]}
    />,

    // Slide 14: Data Quality & Risks
    <TwoColumnSlide
      title="Data Quality Assessment"
      split="50/50"
      leftContent={
        <>
          <h3>Strengths</h3>
          <ul>
            <li>99.1% data retention rate</li>
            <li>Comprehensive audit logging</li>
            <li>Geospatial indexing for location queries</li>
            <li>Soft deletes for data recovery</li>
          </ul>
        </>
      }
      rightContent={
        <>
          <h3>Risks & Gaps</h3>
          <ul>
            <li>Static dataset needs refresh pipeline</li>
            <li>Synthetic data vs. real sources</li>
            <li>No user behavior analytics</li>
            <li>Aggregation performance at scale</li>
          </ul>
        </>
      }
    />,

    // Slide 15: Recommendations
    <BulletSlide
      title="Key Recommendations"
      items={[
        { title: "Immediate", description: "Set up analytics dashboard and data quality monitoring" },
        { title: "Short-term", description: "Implement user behavior tracking and A/B testing" },
        { title: "Long-term", description: "Integrate real-time data sources (NIRF, NAAC APIs)" },
        { title: "Continuous", description: "Monitor data freshness, quality, and pipeline performance" }
      ]}
    />,

    // Slide 16: Conclusion
    <SectionDividerSlide
      title="Thank You"
      subtitle="Questions & Discussion"
    />
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentSlide(slides.length - 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <div className="export-controls">
        <button 
          className="export-button" 
          onClick={() => exportToPDF(slides, currentSlide, setCurrentSlide)}
        >
          Export to PDF
        </button>
        <button 
          className="export-button" 
          onClick={() => exportToPPTX(slides, currentSlide, setCurrentSlide)}
        >
          Export to PowerPoint
        </button>
      </div>

      <div className="presentation-container">
        {slides[currentSlide]}
      </div>

      <div className="navigation">
        <button 
          className="nav-button" 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
        >
          Previous
        </button>
        
        <div className="dots-container">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <span className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </span>

        <button 
          className="nav-button" 
          onClick={nextSlide} 
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default App;

// Made with Bob
