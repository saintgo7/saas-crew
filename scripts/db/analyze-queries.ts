import { PrismaClient } from '@prisma/client';

/**
 * Database Query Analysis Script
 * Logs slow queries and suggests optimizations
 */

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

interface QueryLog {
  query: string;
  duration: number;
  timestamp: Date;
}

const queryLogs: QueryLog[] = [];
const SLOW_QUERY_THRESHOLD = 100; // ms

// Listen to query events
prisma.$on('query' as any, (e: any) => {
  const duration = e.duration;
  const query = e.query;
  
  queryLogs.push({
    query,
    duration,
    timestamp: new Date(),
  });

  if (duration > SLOW_QUERY_THRESHOLD) {
    console.warn('⚠️  Slow query detected (' + duration + 'ms):');
    console.warn(query);
    console.warn('');
  } else {
    console.log('✓ Query executed in ' + duration + 'ms');
  }
});

async function analyzeQueries() {
  console.log('🔍 Starting Database Query Analysis\n');

  try {
    // Test common queries
    console.log('Testing common queries...\n');

    // 1. List all projects
    console.log('1. Fetching all projects...');
    await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    // 2. List all courses
    console.log('\n2. Fetching all courses...');
    await prisma.course.findMany({
      include: {
        chapters: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    // 3. List all posts
    console.log('\n3. Fetching all posts...');
    await prisma.post.findMany({
      include: {
        author: true,
        votes: true,
        comments: true,
      },
    });

    // 4. Single project with details
    console.log('\n4. Fetching single project with details...');
    const firstProject = await prisma.project.findFirst();
    if (firstProject) {
      await prisma.project.findUnique({
        where: { id: firstProject.id },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    // Generate report
    console.log('\n' + '='.repeat(50));
    console.log('📊 Query Analysis Report');
    console.log('='.repeat(50) + '\n');

    const slowQueries = queryLogs.filter(q => q.duration > SLOW_QUERY_THRESHOLD);
    const avgDuration = queryLogs.reduce((sum, q) => sum + q.duration, 0) / queryLogs.length;

    console.log('Total Queries: ' + queryLogs.length);
    console.log('Slow Queries (>' + SLOW_QUERY_THRESHOLD + 'ms): ' + slowQueries.length);
    console.log('Average Duration: ' + avgDuration.toFixed(2) + 'ms');
    console.log('');

    if (slowQueries.length > 0) {
      console.log('🐌 Slowest Queries:');
      const sorted = [...slowQueries].sort((a, b) => b.duration - a.duration).slice(0, 5);
      sorted.forEach((q, i) => {
        console.log((i + 1) + '. ' + q.duration + 'ms - ' + q.query.substring(0, 100) + '...');
      });
      console.log('');
    }

    // Suggestions
    console.log('💡 Optimization Suggestions:');
    console.log('');
    
    if (slowQueries.some(q => q.query.includes('SELECT') && q.query.includes('JOIN'))) {
      console.log('- Consider adding indexes on foreign key columns');
    }
    
    if (queryLogs.length > 10) {
      console.log('- Possible N+1 query detected (multiple similar queries)');
      console.log('  Solution: Use Prisma include or select to fetch related data in single query');
    }
    
    if (slowQueries.length > 0) {
      console.log('- Review slow queries and consider:');
      console.log('  1. Adding database indexes');
      console.log('  2. Using select to fetch only needed fields');
      console.log('  3. Implementing pagination for large datasets');
    }

  } catch (error: any) {
    console.error('Error analyzing queries:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run analysis
analyzeQueries();
