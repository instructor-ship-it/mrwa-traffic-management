import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'mms-frame-layouts.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load TGS data:', error);
    return NextResponse.json({ error: 'Failed to load TGS data' }, { status: 500 });
  }
}
