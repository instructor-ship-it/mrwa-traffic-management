'use client';

import { useState, useMemo } from 'react';
import { MmsCodeRef } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Hash, Filter } from 'lucide-react';

interface MmsCodesReferenceProps {
  codes: MmsCodeRef[];
}

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'regulatory', label: 'Regulatory' },
  { value: 'advisory', label: 'Advisory' },
  { value: 'termination', label: 'Termination' },
] as const;

function getTypeStyle(type: string) {
  switch (type) {
    case 'regulatory':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500',
        label: 'Regulatory',
      };
    case 'advisory':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Advisory',
      };
    case 'termination':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Termination',
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-800',
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-500',
        label: type,
      };
  }
}

export function MmsCodesReference({ codes }: MmsCodesReferenceProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return codes.filter((code) => {
      const matchesSearch =
        !search ||
        code.code.toLowerCase().includes(search.toLowerCase()) ||
        code.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || code.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [codes, search, typeFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: codes.length };
    codes.forEach((c) => {
      counts[c.type] = (counts[c.type] || 0) + 1;
    });
    return counts;
  }, [codes]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Hash className="h-4 w-4 text-slate-600" />
          MMS Code Reference
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search codes or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            {TYPE_FILTERS.map((f) => (
              <Button
                key={f.value}
                size="sm"
                variant={typeFilter === f.value ? 'default' : 'outline'}
                className="h-7 text-xs px-2"
                onClick={() => setTypeFilter(f.value)}
              >
                {f.label}
                <span className="ml-1 opacity-70">
                  {typeCounts[f.value] || 0}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Code list */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No MMS codes match your search.
            </div>
          ) : (
            filtered.map((code) => {
              const style = getTypeStyle(code.type);
              return (
                <div
                  key={code.code}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${style.bg} ${style.border}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                  <span className="font-mono text-sm font-semibold min-w-[100px]">
                    {code.code}
                  </span>
                  <Badge variant="outline" className={`text-[10px] h-5 ${style.badge}`}>
                    {style.label}
                  </Badge>
                  <span className={`text-sm ${style.text}`}>{code.description}</span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
