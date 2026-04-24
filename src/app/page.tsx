'use client';

import { useState, useMemo } from 'react';
import { BannerAlertData, StatsData, FilterState } from '@/lib/types';
import { TgsData } from '@/lib/types';
import tgsStaticData from '@/data/mms-frame-layouts.json';
import alertsData from '@/data/alerts.json';
import { SearchBar } from '@/components/search-bar';
import { StatsBar } from '@/components/stats-bar';
import { FilterSidebar } from '@/components/filter-sidebar';
import { AlertCard } from '@/components/alert-card';
import { AlertDetail } from '@/components/alert-detail';
import { AlertPdfs } from '@/components/alert-pdfs';
import { TgsSection } from '@/components/tgs-section';
import { FrameLayoutCard } from '@/components/frame-layout-card';
import { SpacingTable } from '@/components/spacing-table';
import { MmsCodesReference } from '@/components/mms-codes-reference';
import { CommonMistakes } from '@/components/common-mistakes';
import { TgsFlowchart } from '@/components/tgs-flowchart';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Shield,
  Bell,
  FileText,
  Signpost,
  Gauge,
  AlertTriangle,
  Hash,
  Ruler,
  GitBranch,
  FileWarning,
} from 'lucide-react';

type PageId =
  | 'alerts'
  | 'pdfs'
  | 'tgs-overview'
  | 'tgs-layouts'
  | 'tgs-spacing'
  | 'tgs-codes'
  | 'tgs-mistakes'
  | 'tgs-flowchart';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  group: 'library' | 'tc-tools' | 'reference';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'alerts', label: 'Banner Alerts', icon: <Bell className="h-4 w-4" />, group: 'library' },
  { id: 'pdfs', label: 'Alert PDFs', icon: <FileText className="h-4 w-4" />, group: 'library' },
  { id: 'tgs-overview', label: 'TGS/MMS Overview', icon: <Signpost className="h-4 w-4" />, group: 'tc-tools' },
  { id: 'tgs-layouts', label: 'Frame Layouts', icon: <Gauge className="h-4 w-4" />, group: 'tc-tools' },
  { id: 'tgs-spacing', label: 'Spacing Table', icon: <Ruler className="h-4 w-4" />, group: 'reference' },
  { id: 'tgs-codes', label: 'MMS Codes', icon: <Hash className="h-4 w-4" />, group: 'reference' },
  { id: 'tgs-mistakes', label: 'Common Mistakes', icon: <AlertTriangle className="h-4 w-4" />, group: 'reference' },
  { id: 'tgs-flowchart', label: 'Logic Flowchart', icon: <GitBranch className="h-4 w-4" />, group: 'tc-tools' },
];

const GROUP_LABELS: Record<string, string> = {
  library: 'LIBRARY',
  'tc-tools': 'TC TOOLS',
  reference: 'REFERENCE',
};

// Bottom tab bar items for mobile
const MOBILE_TABS: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'alerts', label: 'Alerts', icon: <Bell className="h-5 w-5" /> },
  { id: 'pdfs', label: 'PDFs', icon: <FileText className="h-5 w-5" /> },
  { id: 'tgs-overview', label: 'TGS/MMS', icon: <Signpost className="h-5 w-5" /> },
  { id: 'tgs-layouts', label: 'Frames', icon: <Gauge className="h-5 w-5" /> },
];

const defaultFilters: FilterState = {
  colour: null,
  category: null,
  region: null,
  icam: null,
  tc: false,
  search: '',
};

// Compute stats from static data
function computeStats(data: BannerAlertData[]): StatsData {
  const red = data.filter(a => a.bannerColour === 'red').length;
  const amber = data.filter(a => a.bannerColour === 'amber').length;
  const grey = data.filter(a => a.bannerColour === 'grey').length;
  const tcRelated = data.filter(a => a.trafficControlRelated).length;
  const icamActive = data.filter(a => a.icamInvestigation && a.bannerType === 'Preliminary Notice').length;
  const icamComplete = data.filter(a => a.icamInvestigation && a.bannerType === 'Final Notice').length;
  const noIcam = data.filter(a => !a.icamInvestigation).length;

  const categoryMap = new Map<string, number>();
  data.forEach(a => {
    const cat = a.incidentCategory || 'Unknown';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  const regionMap = new Map<string, number>();
  data.forEach(a => {
    const reg = a.region || 'Unknown';
    regionMap.set(reg, (regionMap.get(reg) || 0) + 1);
  });

  return {
    total: data.length,
    red,
    amber,
    grey,
    tcRelated,
    icamActive,
    icamComplete,
    noIcam,
    categoryBreakdown: Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count })),
    regionBreakdown: Array.from(regionMap.entries()).map(([region, count]) => ({ region, count })),
  };
}

// Client-side filtering
function filterAlerts(data: BannerAlertData[], filters: FilterState): BannerAlertData[] {
  return data.filter(alert => {
    if (filters.colour && alert.bannerColour !== filters.colour) return false;
    if (filters.category && alert.incidentCategory !== filters.category) return false;
    if (filters.region && alert.region !== filters.region) return false;
    if (filters.tc && !alert.trafficControlRelated) return false;

    if (filters.icam) {
      if (filters.icam === 'active' && !(alert.icamInvestigation && alert.bannerType === 'Preliminary Notice')) return false;
      if (filters.icam === 'complete' && !(alert.icamInvestigation && alert.bannerType === 'Final Notice')) return false;
      if (filters.icam === 'none' && alert.icamInvestigation) return false;
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [
        alert.incidentShortDesc,
        alert.executiveSummary,
        alert.eqsafeNumber,
        alert.directorateRegion,
        alert.incidentCategory,
        alert.eqsafeEventType,
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export default function Home() {
  const [activePage, setActivePage] = useState<PageId>('alerts');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedAlert, setSelectedAlert] = useState<BannerAlertData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Static data
  const allAlerts = alertsData as unknown as BannerAlertData[];
  const tgsData = tgsStaticData as unknown as TgsData;
  const stats = useMemo(() => computeStats(allAlerts), [allAlerts]);
  const filteredAlerts = useMemo(() => filterAlerts(allAlerts, filters), [allAlerts, filters]);

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

  const handlePageChange = (page: PageId) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const pageTitle = NAV_ITEMS.find(i => i.id === activePage)?.label || 'MRWA Toolkit';

  return (
    <SidebarProvider>
      {/* Desktop sidebar */}
      <Sidebar>
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-100">
              <Shield className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">MRWA Toolkit</h2>
              <p className="text-[10px] text-muted-foreground">Main Roads WA</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {(['library', 'tc-tools', 'reference'] as const).map((group) => {
            const items = NAV_ITEMS.filter(i => i.group === group);
            return (
              <SidebarGroup key={group}>
                <SidebarGroupLabel>{GROUP_LABELS[group]}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activePage === item.id}
                          onClick={() => handlePageChange(item.id)}
                          tooltip={item.label}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
      </Sidebar>

      {/* Main content area */}
      <SidebarInset>
        {/* Top header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b bg-background sticky top-0 z-40">
          <SidebarTrigger className="hidden md:flex" />
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Shield className="h-5 w-5 text-red-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">{pageTitle}</h1>
          </div>
          {activePage === 'alerts' && (
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
            />
          )}
        </header>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-background px-2 py-2 space-y-4">
            {(['library', 'tc-tools', 'reference'] as const).map((group) => {
              const items = NAV_ITEMS.filter(i => i.group === group);
              return (
                <div key={group}>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                    {GROUP_LABELS[group]}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handlePageChange(item.id)}
                        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                          activePage === item.id
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-4 pb-20 md:pb-4">
          {/* BANNER ALERTS PAGE */}
          {activePage === 'alerts' && (
            <>
              <div className="mb-4">
                <StatsBar stats={stats} isLoading={false} />
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  isOpen={filterOpen}
                  onToggle={() => setFilterOpen(!filterOpen)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">
                      {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} found
                      {activeFilterCount > 0 && (
                        <span className="text-primary"> · {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</span>
                      )}
                    </p>
                  </div>
                  {filteredAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileWarning className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-1">No alerts found</h3>
                      <p className="text-sm text-muted-foreground/70 max-w-md">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredAlerts.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} onViewDetails={handleViewDetails} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ALERT PDFS PAGE */}
          {activePage === 'pdfs' && (
            <AlertPdfs alerts={allAlerts} />
          )}

          {/* TGS OVERVIEW PAGE */}
          {activePage === 'tgs-overview' && <TgsSection />}

          {/* TGS FRAME LAYOUTS PAGE */}
          {activePage === 'tgs-layouts' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Frame Layouts</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {Object.entries(tgsData.frameLayouts).map(([key, layout]) => (
                  <FrameLayoutCard key={key} layoutKey={key} layout={layout} />
                ))}
              </div>
            </div>
          )}

          {/* SPACING TABLE PAGE */}
          {activePage === 'tgs-spacing' && (
            <SpacingTable
              values={tgsData.spacingTable.values}
              source={tgsData.spacingTable.source}
              conditionalRules={tgsData.conditionalRules}
            />
          )}

          {/* MMS CODES PAGE */}
          {activePage === 'tgs-codes' && (
            <MmsCodesReference codes={tgsData.mmsCodeReference} />
          )}

          {/* COMMON MISTAKES PAGE */}
          {activePage === 'tgs-mistakes' && (
            <CommonMistakes mistakes={tgsData.commonMistakes} />
          )}

          {/* LOGIC FLOWCHART PAGE */}
          {activePage === 'tgs-flowchart' && (
            <TgsFlowchart />
          )}
        </main>

        {/* Mobile bottom tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
          <div className="flex items-center justify-around">
            {MOBILE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handlePageChange(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors ${
                  activePage === tab.id
                    ? 'text-red-600'
                    : 'text-slate-400'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              </button>
            ))}
            {/* More button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors ${
                mobileMenuOpen ? 'text-red-600' : 'text-slate-400'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="text-[10px] mt-0.5 font-medium">More</span>
            </button>
          </div>
        </div>

        {/* Footer (desktop only) */}
        <footer className="hidden md:block border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <p className="text-xs text-muted-foreground text-center">
              MRWA EQSafe Toolkit · Main Roads Western Australia
            </p>
          </div>
        </footer>
      </SidebarInset>

      {/* Alert detail drawer */}
      <AlertDetail
        alert={selectedAlert}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </SidebarProvider>
  );
}
