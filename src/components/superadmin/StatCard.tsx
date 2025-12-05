import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant: 'events' | 'admins' | 'orders' | 'revenue';
  growth?: number;
  growthLabel?: string;
}

export function StatCard({
  title,
  value,
  icon,
  variant,
  growth,
  growthLabel,
}: StatCardProps) {
  const variantClass = `stat-card-${variant}`;

  return (
    <div className={cn('stat-card', variantClass)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {typeof growth === 'number' && (
            <div className="flex items-center gap-1 text-sm">
              {growth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-status-active" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  'font-medium',
                  growth >= 0 ? 'text-status-active' : 'text-destructive'
                )}
              >
                {growth >= 0 ? '+' : ''}
                {growth}%
              </span>
              {growthLabel && (
                <span className="text-muted-foreground">{growthLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="stat-icon flex h-12 w-12 items-center justify-center rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
