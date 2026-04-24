'use client';

import { BannerAlertData, getColourClasses } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Shield, AlertTriangle, ArrowRight, FileText } from 'lucide-react';

interface AlertCardProps {
  alert: BannerAlertData;
  onViewDetails: (alert: BannerAlertData) => void;
}

export function AlertCard({ alert, onViewDetails }: AlertCardProps) {
  const colours = getColourClasses(alert.bannerColour);

  return (
    <Card
      className={`border-l-4 ${colours.border} ${colours.hover} transition-all hover:shadow-md cursor-pointer`}
      onClick={() => onViewDetails(alert)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
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
        </div>

        {/* Description */}
        <p className="text-sm font-medium leading-snug line-clamp-2">
          {alert.incidentShortDesc}
        </p>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {alert.dateOfIncident}
          </span>
          {alert.directorateRegion && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {alert.region || alert.directorateRegion}
            </span>
          )}
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          {alert.trafficControlRelated && (
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              <Shield className="h-3 w-3 mr-1" />
              TC Related
            </Badge>
          )}
          {alert.icamInvestigation && (
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              ICAM
            </Badge>
          )}
          {alert.pdfPath && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              <FileText className="h-3 w-3 mr-1" />
              PDF
            </Badge>
          )}
          {/* Consequence */}
          {(alert.actualConsequence || alert.potentialConsequence) && (
            <Badge variant="outline" className="text-xs">
              {alert.actualConsequence}/{alert.potentialConsequence}
            </Badge>
          )}
        </div>

        {/* View button */}
        <div className="pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs w-full justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(alert);
            }}
          >
            View Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
