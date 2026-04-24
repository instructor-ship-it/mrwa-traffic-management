'use client';

import { useState, useEffect, useCallback } from 'react';
import { BannerAlertData, StatsData, FilterState } from '@/lib/types';
import { SearchBar } from '@/components/search-bar';
import { StatsBar } from '@/components/stats-bar';
import { FilterSidebar } from '@/components/filter-sidebar';
import { AlertCard } from '@/components/alert-card';
import { AlertDetail } from '@/components/alert-detail';
import { TgsSection } from '@/components/tgs-section';
import { Shield, FileWarning, Bell, Signpost } from 'lucide-react';

type ActiveSection = 'alerts' | 'tgs';

const defaultFilters: FilterState = {
  colour: null,
  category: null,
  region: null,
  icam: null,
  tc: false,
  search: '',
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('alerts');
  const [alerts, setAlerts] = useState<BannerAlertData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedAlert, setSelectedAlert] = useState<BannerAlertData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.colour) params.set('colour', filters.colour);
      if (filters.category) params.set('category', filters.category);
      if (filters.region) params.set('region', filters.region);
      if (filters.icam) params.set('icam', filters.icam);
      if (filters.tc) params.set('tc', 'true');
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/alerts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    // Debounce search
    const timeout = setTimeout(() => {
      fetchAlerts();
    }, filters.search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [filters, fetchAlerts]);

  const handleViewDetails = (alert: BannerAlertData) => {
    setSelectedAlert(alert);
    setDetailOpen(true);
  };

  const activeFilterCount = [
    filters.colour,
    filters.category,
    filters.region,
    filters.icam,
    filters.tc ? 'tc' : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-red-100">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  MRWA EQSafe Toolkit
                </h1>
                <p className="text-xs text-muted-foreground">
                  Main Roads Western Australia — Traffic Management & Safety
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Section tabs */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setActiveSection('alerts')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeSection === 'alerts'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" />
                  Banner Alerts
                </button>
                <button
                  onClick={() => setActiveSection('tgs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeSection === 'tgs'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Signpost className="h-3.5 w-3.5" />
                  TGS/MMS Frames
                </button>
              </div>
              {/* Only show search in alerts section */}
              {activeSection === 'alerts' && (
                <SearchBar
                  value={filters.search}
                  onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4">
        {activeSection === 'alerts' ? (
          <>
            {/* Stats */}
            <div className="mb-4">
              <StatsBar stats={stats} isLoading={!stats} />
            </div>

            {/* Body with sidebar */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Sidebar Filters */}
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                isOpen={filterOpen}
                onToggle={() => setFilterOpen(!filterOpen)}
              />

              {/* Alert Grid */}
              <div className="flex-1 min-w-0">
                {/* Results info */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : `${alerts.length} alert${alerts.length !== 1 ? 's' : ''} found`}
                    {activeFilterCount > 0 && (
                      <span className="text-primary"> · {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</span>
                    )}
                  </p>
                </div>

                {/* Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-56 rounded-lg border animate-pulse bg-muted" />
                    ))}
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileWarning className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-1">
                      No alerts found
                    </h3>
                    <p className="text-sm text-muted-foreground/70 max-w-md">
                      Try adjusting your search or filters to find what you&apos;re looking for.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {alerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <TgsSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            MRWA EQSafe Toolkit · Main Roads Western Australia ·{' '}
            {activeSection === 'alerts'
              ? stats
                ? `${stats.total} alerts indexed`
                : 'Loading...'
              : 'TGS/MMS Frame Logic Reference'}
          </p>
        </div>
      </footer>

      {/* Detail Drawer */}
      <AlertDetail
        alert={selectedAlert}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
