'use client';

import { SpacingValue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Ruler, Info } from 'lucide-react';

interface SpacingTableProps {
  values: SpacingValue[];
  source: string;
  conditionalRules: {
    postedSpeedGte100: Record<string, unknown>;
    postedSpeedGte80: Record<string, unknown>;
    postedSpeedLt80: Record<string, unknown>;
  };
}

export function SpacingTable({ values, source, conditionalRules }: SpacingTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Ruler className="h-4 w-4 text-slate-600" />
          Spacing Reference — Distance &apos;D&apos;
        </CardTitle>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {source}
        </p>
      </CardHeader>
      <CardContent>
        {/* Spacing Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Posted Speed (km/h)</TableHead>
              <TableHead className="w-1/2">Distance D (metres)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.map((row) => (
              <TableRow key={row.postedSpeed_kmh}>
                <TableCell className="font-medium">
                  {row.postedSpeed_kmh}
                  {row.note && (
                    <span className="text-xs text-muted-foreground ml-1">({row.note})</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {row.D_m}m
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Conditional Rules */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">Conditional Rules</h4>

          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Posted ≥ 100</Badge>
            </div>
            <ul className="text-xs text-red-800 space-y-1 ml-1">
              {conditionalRules.postedSpeedGte100.firstFrameSpacing && (
                <li>• {conditionalRules.postedSpeedGte100.firstFrameSpacing as string}</li>
              )}
              {conditionalRules.postedSpeedGte100.aheadSignRequired && (
                <li>• {conditionalRules.postedSpeedGte100.aheadSignDescription as string}</li>
              )}
              {conditionalRules.postedSpeedGte100.prepareToStopDistance && (
                <li>• {conditionalRules.postedSpeedGte100.prepareToStopDistance as string}</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Posted ≥ 80</Badge>
            </div>
            <ul className="text-xs text-amber-800 space-y-1 ml-1">
              {conditionalRules.postedSpeedGte80.firstFrameSpacing && (
                <li>• {conditionalRules.postedSpeedGte80.firstFrameSpacing as string}</li>
              )}
              {conditionalRules.postedSpeedGte80.reduceSpeedRequired && (
                <li>• REDUCE SPEED plate required</li>
              )}
              {conditionalRules.postedSpeedGte80.endOfQueueProtectionRequired && (
                <li>• End of Queue protection required ({conditionalRules.postedSpeedGte80.endOfQueueReference as string})</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">Posted &lt; 80</Badge>
            </div>
            <ul className="text-xs text-emerald-800 space-y-1 ml-1">
              {conditionalRules.postedSpeedLt80.reduceSpeedNotRequired && (
                <li>• REDUCE SPEED plate NOT required</li>
              )}
              {conditionalRules.postedSpeedLt80.endOfQueueProtectionNotRequired && (
                <li>• End of Queue protection NOT required</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
