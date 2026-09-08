import React from 'react';
import { cn, getStatusBadge, getPriorityBadge } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const { label, dotColor, badgeBg } = getStatusBadge(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs transition-colors',
        badgeBg,
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />
      )}
      {label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: string | null | undefined;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const badgeBg = getPriorityBadge(priority);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border uppercase tracking-wider',
        badgeBg,
        className
      )}
    >
      {priority || 'MEDIUM'}
    </span>
  );
}
