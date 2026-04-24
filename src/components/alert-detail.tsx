'use client';

import { BannerAlertData, getColourClasses } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Shield,
  AlertTriangle,
  FileText,
  ChevronRight,
  User,
  Activity,
} from 'lucide-react';

interface AlertDetailProps {
  alert: BannerAlertData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function parseJSON(str: string | null): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AlertDetail({ alert, open, onOpenChange }: AlertDetailProps) {
  if (!alert) return null;

  const colours = getColourClasses(alert.bannerColour);
  const contributingFactors = parseJSON(alert.contributingFactors);
  const correctiveActions = parseJSON(alert.correctiveActions);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs font-mono ${colours.badge}`}>
              EQ-{alert.eqsafeNumber}
            </Badge>
            <Badge variant="outline" className={`text-xs ${colours.badge}`}>
              {alert.bannerType}
            </Badge>
            {alert.incidentCategory && (
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                {alert.incidentCategory}
              </Badge>
            )}
          </div>
          <SheetTitle className="text-left text-lg leading-snug">
            {alert.incidentShortDesc}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 pb-8">
          {/* Quick metadata */}
          <div className="grid grid-cols-2 gap-3">
            <MetaItem
              icon={<Calendar className="h-4 w-4" />}
              label="Date"
              value={alert.dateOfIncident}
            />
            {alert.timeOfIncident && (
              <MetaItem
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={alert.timeOfIncident}
              />
            )}
            <MetaItem
              icon={<MapPin className="h-4 w-4" />}
              label="Region"
              value={alert.region || alert.directorateRegion || 'N/A'}
            />
            <MetaItem
              icon={<Building2 className="h-4 w-4" />}
              label="Organisation"
              value={alert.mainRoadsOrContractor || 'N/A'}
            />
            <MetaItem
              icon={<Activity className="h-4 w-4" />}
              label="Event Type"
              value={alert.eqsafeEventType || 'N/A'}
            />
            <MetaItem
              icon={<User className="h-4 w-4" />}
              label="Directorate"
              value={alert.directorateRegion || 'N/A'}
            />
          </div>

          {/* Consequence */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Actual:</span>
              <ConsequenceBadge level={alert.actualConsequence} />
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Potential:</span>
              <ConsequenceBadge level={alert.potentialConsequence} />
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2 flex-wrap">
            {alert.trafficControlRelated && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                <Shield className="h-3 w-3 mr-1" />
                Traffic Control Related
              </Badge>
            )}
            {alert.icamInvestigation && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                ICAM Investigation
              </Badge>
            )}
          </div>

          {/* TC Notes */}
          {alert.trafficControlRelated && alert.trafficControlNotes && (
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
              <p className="text-xs font-medium text-orange-800 mb-1">Traffic Control Notes</p>
              <p className="text-xs text-orange-700">{alert.trafficControlNotes}</p>
            </div>
          )}

          <Separator />

          {/* Executive Summary */}
          {alert.executiveSummary && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Executive Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {alert.executiveSummary}
              </p>
            </div>
          )}

          <Separator />

          {/* Contributing Factors */}
          {contributingFactors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Contributing Factors</h3>
              <ul className="space-y-1.5">
                {contributingFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Corrective Actions */}
          {correctiveActions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Corrective Actions</h3>
              <ul className="space-y-1.5">
                {correctiveActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Critical Risk Profile */}
          {alert.criticalRiskProfile && (
            <>
              <Separator />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Critical Risk Profile</h3>
                <p className="text-sm text-muted-foreground">{alert.criticalRiskProfile}</p>
              </div>
            </>
          )}

          {/* PDF Link */}
          {alert.pdfPath && (
            <>
              <Separator />
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(alert.pdfPath!, '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Open Full PDF Report
                  <ExternalLink className="h-3.5 w-3.5 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {alert.pdfFilename}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

function ConsequenceBadge({ level }: { level: string | null }) {
  if (!level) return <span className="text-sm text-muted-foreground">N/A</span>;
  const isMajor = level.toLowerCase() === 'major';
  return (
    <Badge
      variant="outline"
      className={`text-xs ${
        isMajor
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}
    >
      {level}
    </Badge>
  );
}
