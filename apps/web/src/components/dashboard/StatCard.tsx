import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'blue' | 'amber' | 'emerald' | 'rose' | 'default';
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
  description,
}) => {
  const variantStyles = {
    default: {
      border: 'border-slate-800/80',
      iconBg: 'bg-slate-800/80 text-slate-300',
      valueColor: 'text-slate-100',
    },
    blue: {
      border: 'border-blue-500/20 bg-blue-500/5',
      iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
      valueColor: 'text-blue-400',
    },
    amber: {
      border: 'border-amber-500/20 bg-amber-500/5',
      iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
      valueColor: 'text-amber-400',
    },
    emerald: {
      border: 'border-emerald-500/20 bg-emerald-500/5',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
      valueColor: 'text-emerald-400',
    },
    rose: {
      border: 'border-rose-500/20 bg-rose-500/5',
      iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
      valueColor: 'text-rose-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:translate-y-[-2px] shadow-sm',
        style.border
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl', style.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-3xl font-extrabold tracking-tight', style.valueColor)}>
          {value}
        </span>
      </div>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
};
