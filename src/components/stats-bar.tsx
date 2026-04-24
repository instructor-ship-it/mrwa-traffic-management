'use client';

import { StatsData } from '@/lib/types';
import { AlertTriangle, FileText, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface StatsBarProps {
  stats: StatsData | null;
  isLoading: boolean;
}

export function StatsBar({ stats, isLoading }: StatsBarProps) {
  if (isLoading || !stats) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 w-28 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Total Alerts',
      value: stats.total,
      icon: FileText,
      color: 'text-foreground',
      bg: 'bg-muted/50',
    },
    {
      label: 'Red',
      value: stats.red,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Amber',
      value: stats.amber,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Grey',
      value: stats.grey,
      icon: FileText,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
    {
      label: 'TC Related',
      value: stats.tcRelated,
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'ICAM Active',
      value: stats.icamActive,
      icon: ShieldAlert,
      color: 'text-red-700',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 ${item.bg}`}
        >
          <item.icon className={`h-4 w-4 ${item.color}`} />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground leading-tight">
              {item.label}
            </span>
            <span className={`text-lg font-bold leading-tight ${item.color}`}>
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
