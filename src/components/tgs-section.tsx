'use client';

import { useState, useEffect } from 'react';
import { TgsData } from '@/lib/types';
import { FrameLayoutCard } from '@/components/frame-layout-card';
import { SpacingTable } from '@/components/spacing-table';
import { MmsCodesReference } from '@/components/mms-codes-reference';
import { CommonMistakes } from '@/components/common-mistakes';
import { TgsFlowchart } from '@/components/tgs-flowchart';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LayoutGrid,
  Hash,
  AlertTriangle,
  GitBranch,
  Ruler,
  Signpost,
  Gauge,
  ShieldCheck,
} from 'lucide-react';

type SubSection = 'overview' | 'layouts' | 'spacing' | 'codes' | 'mistakes' | 'flowchart';

const SUB_SECTIONS: { key: SubSection; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { key: 'layouts', label: 'Frame Layouts', icon: <Signpost className="h-3.5 w-3.5" /> },
  { key: 'spacing', label: 'Spacing Table', icon: <Ruler className="h-3.5 w-3.5" /> },
  { key: 'codes', label: 'MMS Codes', icon: <Hash className="h-3.5 w-3.5" /> },
  { key: 'mistakes', label: 'Common Mistakes', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { key: 'flowchart', label: 'Logic Flowchart', icon: <GitBranch className="h-3.5 w-3.5" /> },
];

export function TgsSection() {
  const [data, setData] = useState<TgsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SubSection>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/tgs');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load TGS data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Failed to load TGS data. Please try again.</p>
      </div>
    );
  }

  const layoutEntries = Object.entries(data.frameLayouts);
  const regCodes = data.mmsCodeReference.filter((c) => c.type === 'regulatory').length;
  const advCodes = data.mmsCodeReference.filter((c) => c.type === 'advisory').length;
  const terCodes = data.mmsCodeReference.filter((c) => c.type === 'termination').length;

  return (
    <div className="space-y-4">
      {/* Sub-section navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {SUB_SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === s.key
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100">
                  <Signpost className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{layoutEntries.length}</p>
                  <p className="text-xs text-muted-foreground">Frame Layouts</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-100">
                  <Gauge className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{regCodes + advCodes + terCodes}</p>
                  <p className="text-xs text-muted-foreground">MMS Codes Total</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{data.commonMistakes.length}</p>
                  <p className="text-xs text-muted-foreground">Common Mistakes</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{data.spacingTable.values.length}</p>
                  <p className="text-xs text-muted-foreground">Spacing Entries</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Worksite Speed Rules summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-slate-500" />
                Worksite Speed Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.worksiteSpeedRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 ${
                      rule.worksiteSpeed_kmh === 40
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      Distance from lane
                    </p>
                    <p className="text-sm font-semibold">{rule.distanceFromLane}</p>
                    <p className="text-lg font-bold mt-1">
                      {rule.worksiteSpeed_kmh} km/h
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ref: {rule.rfReference}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick preview cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {layoutEntries.map(([key, layout]) => (
              <Card key={key} className="overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{key}</h3>
                    <span className="text-xs text-slate-300">p.{layout.tmpPage}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{layout.title}</p>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Posted:</span>{' '}
                      <span className="font-semibold">{layout.postedSpeed}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Worksite:</span>{' '}
                      <span className="font-semibold">{layout.worksiteSpeed}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Proximity:</span>{' '}
                      <span className="font-semibold">{layout.worksiteProximity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frames:</span>{' '}
                      <span className="font-semibold">{layout.approachFrames.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Frame Layouts */}
      {activeSection === 'layouts' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {layoutEntries.map(([key, layout]) => (
            <FrameLayoutCard key={key} layoutKey={key} layout={layout} />
          ))}
        </div>
      )}

      {/* Spacing Table */}
      {activeSection === 'spacing' && (
        <SpacingTable
          values={data.spacingTable.values}
          source={data.spacingTable.source}
          conditionalRules={data.conditionalRules}
        />
      )}

      {/* MMS Codes */}
      {activeSection === 'codes' && (
        <MmsCodesReference codes={data.mmsCodeReference} />
      )}

      {/* Common Mistakes */}
      {activeSection === 'mistakes' && (
        <CommonMistakes mistakes={data.commonMistakes} />
      )}

      {/* Flowchart */}
      {activeSection === 'flowchart' && <TgsFlowchart />}
    </div>
  );
}
