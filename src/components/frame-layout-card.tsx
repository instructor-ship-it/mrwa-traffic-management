'use client';

import { FrameLayout, ApproachFrame } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowDown,
  ArrowUpDown,
  FlipHorizontal,
  Signpost,
  Gauge,
  MapPin,
} from 'lucide-react';

interface FrameLayoutCardProps {
  layoutKey: string;
  layout: FrameLayout;
}

function getPlateColor(frame: ApproachFrame, plateIndex: number): string {
  const plate = plateIndex === 1 ? frame.plate1 : plateIndex === 2 ? frame.plate2 : frame.plate3;
  if (!plate) return 'bg-slate-50 border-slate-200 text-slate-400';

  // Regulatory plates (speed signs) - red
  if (/^\d+$/.test(plate) || plate.includes('END speed') || plate.includes('Posted speed')) {
    return 'bg-red-50 border-red-300 text-red-800';
  }

  // Termination plates - green
  if (
    plate.includes('END ROAD WORK') ||
    plate.includes('DRIVE SAFELY') ||
    plate.includes('END')
  ) {
    return 'bg-emerald-50 border-emerald-300 text-emerald-800';
  }

  // Advisory plates - amber/yellow
  return 'bg-amber-50 border-amber-300 text-amber-800';
}

function getPlateBadgeColor(frame: ApproachFrame, plateIndex: number): string {
  const plate = plateIndex === 1 ? frame.plate1 : plateIndex === 2 ? frame.plate2 : frame.plate3;
  if (!plate) return 'bg-slate-100 text-slate-400';

  if (/^\d+$/.test(plate) || plate.includes('END speed') || plate.includes('Posted speed')) {
    return 'bg-red-100 text-red-700';
  }

  if (
    plate.includes('END ROAD WORK') ||
    plate.includes('DRIVE SAFELY') ||
    plate.includes('END')
  ) {
    return 'bg-emerald-100 text-emerald-700';
  }

  return 'bg-amber-100 text-amber-700';
}

function getFrameTypeBadge(frame: ApproachFrame) {
  if (frame.plate1.includes('STOP HERE') || frame.plate1.includes('PREPARE TO STOP')) {
    return { label: 'Traffic Control', className: 'bg-orange-100 text-orange-700 border-orange-200' };
  }
  if (/^\d+$/.test(frame.plate1)) {
    return { label: 'Speed Reduction', className: 'bg-red-100 text-red-700 border-red-200' };
  }
  return { label: frame.frameType, className: 'bg-slate-100 text-slate-600 border-slate-200' };
}

export function FrameLayoutCard({ layoutKey, layout }: FrameLayoutCardProps) {
  const spacings = Object.entries(layout.spacings);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Signpost className="h-5 w-5" />
              {layoutKey}
            </CardTitle>
            <CardDescription className="text-slate-300 mt-1">
              {layout.title}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
            p.{layout.tmpPage}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Gauge className="h-3.5 w-3.5 text-red-300" />
            <span className="text-slate-300">Posted:</span>
            <span className="font-semibold text-white">{layout.postedSpeed}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Gauge className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-slate-300">Worksite:</span>
            <span className="font-semibold text-white">{layout.worksiteSpeed}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-3.5 w-3.5 text-emerald-300" />
            <span className="text-slate-300">Proximity:</span>
            <span className="font-semibold text-white">{layout.worksiteProximity}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Approach frames */}
        <div className="space-y-0">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-slate-500" />
            Approach Frames
          </h4>

          <div className="flex flex-col items-center">
            {layout.approachFrames.map((frame, idx) => {
              const typeBadge = getFrameTypeBadge(frame);
              return (
                <div key={frame.id} className="w-full flex flex-col items-center">
                  {/* Spacing indicator above (between frames) */}
                  {idx > 0 && (
                    <div className="flex flex-col items-center py-1 w-full">
                      <div className="flex-1 h-6 w-px bg-slate-300" />
                      {spacings[idx - 1] && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 h-5 bg-slate-50 border-slate-200 text-slate-500 whitespace-nowrap"
                        >
                          {spacings[idx - 1][1]}
                        </Badge>
                      )}
                      <div className="flex-1 h-6 w-px bg-slate-300" />
                      <ArrowDown className="h-3 w-3 text-slate-400" />
                    </div>
                  )}

                  {/* Frame */}
                  <div className="w-full max-w-md border rounded-lg overflow-hidden shadow-sm">
                    {/* Frame header */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b">
                      <span className="text-xs font-bold text-slate-700">{frame.id}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 ${typeBadge.className}`}
                      >
                        {typeBadge.label}
                      </Badge>
                    </div>

                    {/* Plates */}
                    <div className="p-2 space-y-1.5">
                      {/* Plate 1 */}
                      <div
                        className={`rounded border px-3 py-2 text-center text-sm font-semibold ${getPlateColor(frame, 1)}`}
                      >
                        <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                          Plate 1
                        </div>
                        {frame.plate1}
                      </div>

                      {/* Plate 2 */}
                      {frame.plate2 && (
                        <div
                          className={`rounded border px-3 py-2 text-center text-sm font-semibold ${getPlateColor(frame, 2)}`}
                        >
                          <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                            Plate 2
                          </div>
                          {frame.plate2}
                        </div>
                      )}

                      {/* Plate 3 */}
                      {frame.plate3 && (
                        <div
                          className={`rounded border px-3 py-2 text-center text-sm font-semibold ${getPlateColor(frame, 3)}`}
                        >
                          <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                            Plate 3
                          </div>
                          {frame.plate3}
                        </div>
                      )}
                    </div>

                    {/* MMS codes */}
                    <div className="px-3 py-1.5 bg-slate-50 border-t flex flex-wrap gap-1">
                      {frame.mmsCodes.map((code) => (
                        <span
                          key={code}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${getPlateBadgeColor(frame, 1)}`}
                        >
                          {code}
                        </span>
                      ))}
                    </div>

                    {/* Reverse side */}
                    {frame.hasReverseSide && frame.reverseSide && (
                      <>
                        <div className="px-3 py-1 bg-slate-200 border-t flex items-center gap-1 justify-center">
                          <FlipHorizontal className="h-3 w-3 text-slate-500" />
                          <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                            Reverse Side
                          </span>
                          <ArrowUpDown className="h-3 w-3 text-slate-500" />
                        </div>
                        <div className="p-2 space-y-1.5 bg-emerald-50/50">
                          <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-800">
                            <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                              Plate 1
                            </div>
                            {frame.reverseSide.plate1}
                          </div>
                          <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-800">
                            <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                              Plate 2
                            </div>
                            {frame.reverseSide.plate2}
                          </div>
                          <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-800">
                            <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                              Plate 3
                            </div>
                            {frame.reverseSide.plate3}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {frame.reverseSide.mmsCodes.map((code) => (
                              <span
                                key={code}
                                className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-emerald-100 text-emerald-700"
                              >
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Drawing reference */}
        <div className="text-xs text-muted-foreground text-center">
          Drawing: {layout.drawingNo}
        </div>
      </CardContent>
    </Card>
  );
}
