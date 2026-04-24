import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const total = await db.bannerAlert.count();
    const red = await db.bannerAlert.count({ where: { bannerColour: 'red' } });
    const amber = await db.bannerAlert.count({ where: { bannerColour: 'amber' } });
    const grey = await db.bannerAlert.count({ where: { bannerColour: 'grey' } });
    const tcRelated = await db.bannerAlert.count({ where: { trafficControlRelated: true } });
    const icamActive = await db.bannerAlert.count({
      where: { icamInvestigation: true, bannerType: 'Preliminary Notice' },
    });
    const icamComplete = await db.bannerAlert.count({
      where: { icamInvestigation: true, bannerType: 'Final Notice' },
    });
    const noIcam = await db.bannerAlert.count({
      where: { icamInvestigation: false },
    });

    // Category breakdown
    const categoryBreakdown = await db.bannerAlert.groupBy({
      by: ['incidentCategory'],
      _count: { id: true },
    });

    // Region breakdown
    const regionBreakdown = await db.bannerAlert.groupBy({
      by: ['region'],
      _count: { id: true },
    });

    return NextResponse.json({
      total,
      red,
      amber,
      grey,
      tcRelated,
      icamActive,
      icamComplete,
      noIcam,
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c.incidentCategory || 'Unknown',
        count: c._count.id,
      })),
      regionBreakdown: regionBreakdown.map((r) => ({
        region: r.region || 'Unknown',
        count: r._count.id,
      })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
