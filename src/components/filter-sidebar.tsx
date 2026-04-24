'use client';

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FilterState, BANNER_COLOURS, INCIDENT_CATEGORIES, REGIONS, ICAM_STATUSES } from '@/lib/types';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function FilterSidebar({ filters, onFilterChange, isOpen, onToggle }: FilterSidebarProps) {
  const activeCount = [
    filters.colour,
    filters.category,
    filters.region,
    filters.icam,
    filters.tc ? 'tc' : null,
  ].filter(Boolean).length;

  const clearAll = () => {
    onFilterChange({
      colour: null,
      category: null,
      region: null,
      icam: null,
      tc: false,
      search: filters.search,
    });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Filters</h2>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs h-5">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Banner Colour */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Banner Colour
        </h3>
        <div className="flex flex-wrap gap-2">
          {BANNER_COLOURS.map((colour) => (
            <button
              key={colour.value}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  colour: filters.colour === colour.value ? null : colour.value,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                filters.colour === colour.value
                  ? colour.value === 'red'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : colour.value === 'amber'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              <span>{colour.emoji}</span>
              {colour.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Category */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Incident Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {INCIDENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  category: filters.category === category ? null : category,
                })
              }
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                filters.category === category
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Region
        </h3>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  region: filters.region === region ? null : region,
                })
              }
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                filters.region === region
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* ICAM Status */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Investigation Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {ICAM_STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  icam: filters.icam === status.value ? null : status.value,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                filters.icam === status.value
                  ? status.value === 'active'
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : status.value === 'complete'
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {status.value === 'active' && '🔍'}
              {status.value === 'complete' && '✅'}
              {status.value === 'none' && '—'}
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Traffic Control Toggle */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Traffic Control
        </h3>
        <div className="flex items-center gap-3">
          <Switch
            id="tc-toggle"
            checked={filters.tc}
            onCheckedChange={(checked) =>
              onFilterChange({ ...filters, tc: checked })
            }
          />
          <Label htmlFor="tc-toggle" className="text-sm cursor-pointer">
            TC Related only
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden flex items-center gap-2"
        onClick={onToggle}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <Badge variant="secondary" className="text-xs h-5 ml-1">
            {activeCount}
          </Badge>
        )}
      </Button>

      {/* Mobile slide-down */}
      {isOpen && (
        <div className="lg:hidden border rounded-lg p-4 bg-background">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-4 border rounded-lg p-4 bg-background">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
