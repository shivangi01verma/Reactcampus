import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

export function StarRating({ rating, max = 5, size = 'md', interactive, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
            interactive && 'cursor-pointer hover:text-yellow-400'
          )}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
}
