'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, ArrowDown, Zap } from 'lucide-react';

interface FlowchartStep {
  number: number;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}

const STEPS: FlowchartStep[] = [
  {
    number: 1,
    title: 'Determine Posted Speed',
    description: 'Identify the posted speed limit of the road. This determines the D-spacing distance between frames.',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
  },
  {
    number: 2,
    title: 'Determine Worksite Proximity',
    description: 'How close is the worksite to the traffic lane? < 1.2m → 40 km/h (RF-046), 1.2m–3.0m → 60 km/h (RF-047), > 3.0m → 60 km/h (RF-047).',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
  },
  {
    number: 3,
    title: 'Build Speed Reduction Frames',
    description: 'First frame: speed + ROAD WORK AHEAD + DRIVE SLOWLY. Subsequent: speed + symbolic plate + REDUCE SPEED. Step down in 20 km/h increments.',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
  },
  {
    number: 4,
    title: 'Add Traffic Control Frames',
    description: 'Second-to-last: PREPARE TO STOP + BAT MAN SYMBOLIC + DO NOT OVERTAKE. Last: STOP HERE WHEN DIRECTED.',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
  },
  {
    number: 5,
    title: 'Add Departure Messaging',
    description: 'On the reverse side of the LOWEST speed frame only: Posted speed + END ROAD WORK + DRIVE SAFELY.',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  {
    number: 6,
    title: 'Apply Spacing Rules',
    description: 'Use the D-spacing table. First two speed frames: 300m (≥100 km/h) or 200m (≥80 km/h). Speed-to-traffic: D metres. Between traffic frames: D metres (min 30m).',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    iconBg: 'bg-slate-100',
  },
  {
    number: 7,
    title: 'Apply Conditional Rules',
    description: '≥100: AHEAD sign required, prepare to stop at 300m. ≥80: REDUCE SPEED required, End of Queue protection. <80: REDUCE SPEED not required, no EoQ protection.',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    iconBg: 'bg-violet-100',
  },
];

export function TgsFlowchart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-slate-600" />
          Logic Flowchart
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Step-by-step decision process for constructing TGS/MMS frame layouts
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {STEPS.map((step, idx) => (
            <div key={step.number} className="w-full flex flex-col items-center">
              {/* Connector arrow */}
              {idx > 0 && (
                <div className="flex flex-col items-center py-1">
                  <div className="h-6 w-px bg-slate-300" />
                  <ArrowDown className="h-4 w-4 text-slate-400" />
                  <div className="h-6 w-px bg-slate-300" />
                </div>
              )}

              {/* Step */}
              <div
                className={`w-full max-w-lg rounded-lg border ${step.borderColor} ${step.bgColor} p-4`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${step.iconBg}`}
                  >
                    {step.number === 1 ? (
                      <Zap className={`h-4 w-4 ${step.color}`} />
                    ) : (
                      <span className={`text-sm font-bold ${step.color}`}>{step.number}</span>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${step.color}`}>{step.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>
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
