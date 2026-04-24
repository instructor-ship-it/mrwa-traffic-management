import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const colour = searchParams.get('colour');
    const category = searchParams.get('category');
    const region = searchParams.get('region');
    const icam = searchParams.get('icam');
    const tc = searchParams.get('tc');
    const search = searchParams.get('search');
    const bannerType = searchParams.get('bannerType');

    const where: Record<string, unknown> = {};

    if (colour) {
      where.bannerColour = colour;
    }

    if (category) {
      where.incidentCategory = category;
    }

    if (region) {
      where.region = region;
    }

    if (bannerType) {
      where.bannerType = bannerType;
    }

    if (icam === 'active') {
      where.icamInvestigation = true;
      where.bannerType = 'Preliminary Notice';
    } else if (icam === 'complete') {
      where.icamInvestigation = true;
      where.bannerType = 'Final Notice';
    } else if (icam === 'none') {
      where.icamInvestigation = false;
    }

    if (tc === 'true') {
      where.trafficControlRelated = true;
    }

    if (search) {
      where.OR = [
        { incidentShortDesc: { contains: search } },
        { executiveSummary: { contains: search } },
        { eqsafeNumber: { contains: search } },
        { directorateRegion: { contains: search } },
        { incidentCategory: { contains: search } },
        { eqsafeEventType: { contains: search } },
      ];
    }

    const alerts = await db.bannerAlert.findMany({
      where,
      orderBy: { dateOfIncident: 'desc' },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
