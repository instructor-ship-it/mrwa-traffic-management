import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alert = await db.bannerAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}
