// app/api/admin/career-assessments/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const QuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().default(10),
  search: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  sortBy: z.enum(['completedAt', 'confidence']).default('completedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(req: Request) {
  // Get session
  const session = await getServerSession({ req, ...authOptions });

  // Check if user is authenticated
  if (!session || !session.user || session.user.role !== 'USER') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    
    // Parse and validate query parameters with proper type handling
    const query = QuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      sortBy: searchParams.get('sortBy') || 'completedAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    });

    // Build where clause
    const where: any = {};

    // Only add search condition if search is provided
    if (query.search) {
      where.OR = [
        { suggestedCareer: { contains: query.search, mode: 'insensitive' } },
        { careerUser: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    // Add date filters only if dates are provided
    if (query.startDate || query.endDate) {
      where.completedAt = {};
      
      if (query.startDate) {
        where.completedAt.gte = new Date(query.startDate);
      }
      
      if (query.endDate) {
        where.completedAt.lte = new Date(query.endDate);
      }
    }

    // Calculate pagination
    const skip = (query.page - 1) * query.limit;

    // Get total count for pagination
    const total = await db.careerAssessment.count({ where });

    // Fetch assessments with related user data
    const assessments = await db.careerAssessment.findMany({
      where,
      include: {
        careerUser: {
          select: {
            name: true,
            age: true,
            gender: true,
            location: true,
            isAuthenticated: true,
          },
        },
      },
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip,
      take: query.limit,
    });

    // Get analytics summary
    const analytics = await db.careerAnalytics.findMany();

    // Calculate summary statistics
    const totalAssessments = total;
    const averageConfidence = assessments.length > 0
      ? assessments.reduce((acc, curr) => acc + (curr.confidenceScore ?? 0), 0) / assessments.length
      : 0;
      
    const topCareerPaths = analytics
      .sort((a, b) => b.totalSuggestions - a.totalSuggestions)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        assessments,
        pagination: {
          total,
          pages: Math.ceil(total / query.limit),
          currentPage: query.page,
        },
        summary: {
          totalAssessments,
          averageConfidence,
          topCareerPaths,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching admin assessments:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}