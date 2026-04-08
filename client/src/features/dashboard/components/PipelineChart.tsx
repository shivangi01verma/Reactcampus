import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LEAD_STATUS_COLORS } from '@/config/constants';
import type { PipelineData } from '@/types/dashboard';

interface PipelineChartProps {
  data: PipelineData[];
}

export function PipelineChart({ data }: PipelineChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Pipeline</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.status}>
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize text-gray-700">{item.status}</span>
              <span className="text-gray-500">{item.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${LEAD_STATUS_COLORS[item.status]?.replace('text-', 'bg-').split(' ')[0] || 'bg-blue-500'}`}
                style={{ width: `${(item.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
