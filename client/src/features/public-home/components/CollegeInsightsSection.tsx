import { usePublicInsights } from '../hooks/usePublicInsights';
import { BarChart3, Building2, MapPin, Award } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const TYPE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const TIER_COLORS: Record<string, string> = { 'Tier 1': '#10b981', 'Tier 2': '#3b82f6', 'Tier 3': '#f59e0b', 'Tier 4': '#ef4444' };

export function CollegeInsightsSection() {
  const { data, isLoading } = usePublicInsights();

  if (isLoading || !data) return null;

  const feeData = data.feeAnalysis.map(d => ({
    ...d,
    avgMin: Math.round(d.avgMin / 100000 * 10) / 10,
    avgMax: Math.round(d.avgMax / 100000 * 10) / 10,
  }));

  const topStates = data.byState.slice(0, 8);
  const topFacilities = data.topFacilities.slice(0, 8);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
            <BarChart3 className="h-4 w-4" />
            Data-Driven Insights
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            College Landscape at a Glance
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore insights from {data.totalColleges} top institutions across India, powered by our data analysis pipeline
          </p>
        </div>

        {/* Quick stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Building2, label: 'Colleges Listed', value: data.totalColleges, color: 'text-blue-600 bg-blue-50' },
            { icon: MapPin, label: 'States Covered', value: data.byState.length, color: 'text-emerald-600 bg-emerald-50' },
            { icon: Award, label: 'Tier 1 Colleges', value: data.tierBreakdown.find(t => t.name === 'Tier 1')?.value || 0, color: 'text-amber-600 bg-amber-50' },
            { icon: BarChart3, label: 'College Types', value: data.typeDistribution.length, color: 'text-violet-600 bg-violet-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-2`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Type Distribution */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">College Type Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.typeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                  dataKey="value" nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {data.typeDistribution.map((_, i) => (
                    <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Fee Analysis */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Fees by College Type</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}L`} />
                <Tooltip formatter={(v: number) => `${v} Lakhs`} />
                <Legend />
                <Bar dataKey="avgMin" name="Avg Min Fee" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgMax" name="Avg Max Fee" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colleges by State */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top States by College Count</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topStates} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="state" width={75} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Facilities */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Facilities</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topFacilities} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="facility" width={95} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
