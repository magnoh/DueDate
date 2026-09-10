import React from 'react';
import { DemandStatus } from '../../types/demand';
import { getStatusColor, getStatusLabel, cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: DemandStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { bg, text, border, dot } = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
        bg,
        text,
        border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
};

interface OverdueBadgeProps {
  className?: string;
}

export const OverdueBadge: React.FC<OverdueBadgeProps> = ({ className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse',
        className
      )}
      title="Esta demanda está com o prazo vencido e não foi concluída"
    >
      <AlertCircle className="w-3 h-3 text-rose-400" />
      Atrasada
    </span>
  );
};
