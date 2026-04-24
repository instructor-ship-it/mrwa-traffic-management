'use client';

import { CommonMistake } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface CommonMistakesProps {
  mistakes: CommonMistake[];
}

export function CommonMistakes({ mistakes }: CommonMistakesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Common Mistakes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mistakes.map((mistake, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 overflow-hidden"
            >
              {/* Mistake header */}
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600">
                    Mistake #{idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-amber-800 mt-0.5">
                    {mistake.mistake}
                  </p>
                </div>
              </div>

              {/* Correct & Wrong */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
                {/* Correct */}
                <div className="p-3 bg-emerald-50/50 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600">
                      Correct
                    </span>
                    <p className="text-sm text-emerald-800 mt-0.5">{mistake.correct}</p>
                  </div>
                </div>

                {/* Wrong */}
                <div className="p-3 bg-red-50/50 flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-red-600">
                      Wrong
                    </span>
                    <p className="text-sm text-red-800 mt-0.5">{mistake.wrong}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
