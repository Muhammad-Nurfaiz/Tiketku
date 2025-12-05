import type { UserStatus, EventStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: UserStatus | EventStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'status-active' },
  inactive: { label: 'Inactive', className: 'status-inactive' },
  draft: { label: 'Draft', className: 'status-draft' },
  published: { label: 'Published', className: 'status-published' },
  ongoing: { label: 'Ongoing', className: 'status-ongoing' },
  completed: { label: 'Completed', className: 'status-completed' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'status-inactive' };

  return (
    <span className={cn('status-badge', config.className, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
