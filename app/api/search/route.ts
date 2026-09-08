import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json([]);
    }

    const matchingStatuses: any[] = [];
    const upperQuery = query.toUpperCase();
    if ('ACTIVE'.includes(upperQuery)) matchingStatuses.push('ACTIVE');
    if ('UNDER_REVIEW'.includes(upperQuery) || 'REVIEW'.includes(upperQuery)) matchingStatuses.push('UNDER_REVIEW');
    if ('INACTIVE'.includes(upperQuery)) matchingStatuses.push('INACTIVE');

    const orConditions: any[] = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { owner: { contains: query, mode: 'insensitive' } },
      { developer: { contains: query, mode: 'insensitive' } },
      { server: { contains: query, mode: 'insensitive' } },
      { integration: { contains: query, mode: 'insensitive' } },
      { category: { name: { contains: query, mode: 'insensitive' } } },
    ];

    if (matchingStatuses.length > 0) {
      orConditions.push({ status: { in: matchingStatuses } });
    }

    const services = await prisma.service.findMany({
      where: {
        OR: orConditions,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 10,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('API Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
