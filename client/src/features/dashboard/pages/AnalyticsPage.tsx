import { useDashboardAnalytics } from '../hooks/useDashboard';
import { Building2, MapPin, TrendingUp, Award } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const TIER_COLORS: Record<string, string> = { 'Tier 1': '#10b981', 'Tier 2': '#3b82f6', 'Tier 3': '#f59e0b', 'Tier 4': '#ef4444' };

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) return <p className="text-gray-500 p-6">No analytics data available.</p>;

  const feeDataInLakhs = data.feeAnalysis.map(d => ({
    ...d,
    avgMin: Math.round(d.avgMin / 100000 * 10) / 10,
    avgMax: Math.round(d.avgMax / 100000 * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">College Analytics</h1>
        <p className="text-gray-500 mt-1">Data-driven insights from {data.totalColleges} colleges across {data.statesCovered} states</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total Colleges" value={data.totalColleges} color="bg-blue-500" />
        <StatCard icon={MapPin} label="States Covered" value={data.statesCovered} color="bg-emerald-500" />
        <StatCard icon={Award} label="Tier 1 Colleges" value={data.tierBreakdown.find(t => t.name === 'Tier 1')?.value || 0} color="bg-amber-500" />
        <StatCard icon={TrendingUp} label="College Types" value={data.typeDistribution.length} color="bg-violet-500" />
      </div>

      {/* Row 1: Type Distribution + State Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="College Type Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.typeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                dataKey="value" nameKey="name" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {data.typeDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Colleges by State (Top 15)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byState} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="state" width={75} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Fee Analysis + Tier Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Average Fee by College Type (in Lakhs INR)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeDataInLakhs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis tickFormatter={(v) => `${v}L`} />
              <Tooltip formatter={(v: number) => `${v}L`} />
              <Legend />
              <Bar dataKey="avgMin" name="Avg Min Fee" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgMax" name="Avg Max Fee" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tier Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.tierBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={110}
                dataKey="value" nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {data.tierBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={TIER_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Score Distribution + Top Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="College Score Distribution">
          {data.scoreDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No score data available. Run the scoring model first.
            </div>
          )}
        </ChartCard>

        <ChartCard title="Top Facilities">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topFacilities} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="facility" width={95} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
