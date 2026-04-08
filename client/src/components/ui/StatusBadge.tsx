import { cn } from '@/lib/cn';

interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
}

export function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        colorMap[status] || 'bg-gray-100 text-gray-800'
      )}
    >
      {status}
    </span>
  );
}
