'use client';

import { BannerAlertData, getColourClasses } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  MapPin,
} from 'lucide-react';

interface AlertPdfsProps {
  alerts: BannerAlertData[];
}

export function AlertPdfs({ alerts }: AlertPdfsProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No PDFs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {alerts.length} PDF document{alerts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => {
          const colours = getColourClasses(alert.bannerColour);
          return (
            <Card key={alert.id} className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  {/* Colour indicator */}
                  <div className={`shrink-0 w-1.5 h-16 rounded-full ${colours.dot}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className={`text-xs font-mono ${colours.badge}`}>
                        EQ-{alert.eqsafeNumber}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${colours.badge}`}>
                        {alert.bannerType}
                      </Badge>
                      {alert.trafficControlRelated && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          TC
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium leading-snug line-clamp-2 mb-1">
                      {alert.incidentShortDesc}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {alert.dateOfIncident}
                      </span>
                      {alert.region && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.region}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {alert.pdfPath && (
                      <>
                        <Button
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => window.open(alert.pdfPath, '_blank')}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = alert.pdfPath;
                            a.download = alert.pdfFilename || 'alert.pdf';
                            a.click();
                          }}
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
