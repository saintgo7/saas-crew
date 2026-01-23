import autocannon from 'autocannon';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * API Performance Benchmark Script
 * Tests major endpoints under load to measure response times
 */

interface BenchmarkResult {
  endpoint: string;
  method: string;
  rps: number;
  p50: number;
  p95: number;
  p99: number;
  avgLatency: number;
  errors: number;
}

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000';

// Define endpoints to benchmark
const ENDPOINTS = [
  { path: '/api/health', method: 'GET', name: 'Health Check' },
  { path: '/api/projects', method: 'GET', name: 'List Projects' },
  { path: '/api/courses', method: 'GET', name: 'List Courses' },
  { path: '/api/posts', method: 'GET', name: 'List Posts' },
];

async function benchmarkEndpoint(endpoint: typeof ENDPOINTS[0]): Promise<BenchmarkResult> {
  console.log('\n📊 Benchmarking: ' + endpoint.name + ' (' + endpoint.method + ' ' + endpoint.path + ')');
  
  const result = await autocannon({
    url: API_BASE_URL + endpoint.path,
    method: endpoint.method,
    connections: 10,
    duration: 10, // 10 seconds
    pipelining: 1,
  });

  return {
    endpoint: endpoint.path,
    method: endpoint.method,
    rps: result.requests.average,
    p50: result.latency.p50,
    p95: result.latency.p95,
    p99: result.latency.p99,
    avgLatency: result.latency.mean,
    errors: result.errors,
  };
}

async function runBenchmarks() {
  console.log('🚀 Starting API Performance Benchmarks');
  console.log('Target: ' + API_BASE_URL);
  console.log('Duration: 10 seconds per endpoint\n');

  const results: BenchmarkResult[] = [];

  for (const endpoint of ENDPOINTS) {
    try {
      const result = await benchmarkEndpoint(endpoint);
      results.push(result);
      
      console.log('✓ ' + endpoint.name);
      console.log('  RPS: ' + result.rps.toFixed(2));
      console.log('  Latency: p50=' + result.p50 + 'ms, p95=' + result.p95 + 'ms, p99=' + result.p99 + 'ms');
      
      if (result.p95 > 200) {
        console.log('  ⚠️  WARNING: p95 latency exceeds 200ms target!');
      }
    } catch (error: any) {
      console.error('✗ Failed to benchmark ' + endpoint.name + ':', error.message);
    }
  }

  // Generate report
  generateReport(results);
  
  // Check if performance targets are met
  checkTargets(results);
}

function generateReport(results: BenchmarkResult[]) {
  const timestamp = new Date().toISOString();
  
  const report = {
    timestamp,
    summary: {
      totalEndpoints: results.length,
      avgRps: results.reduce((sum, r) => sum + r.rps, 0) / results.length,
      slowestEndpoint: results.sort((a, b) => b.p95 - a.p95)[0]?.endpoint,
    },
    results,
  };

  const reportPath = join(__dirname, '../../docs/performance-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📄 Report saved to: ' + reportPath);
}

function checkTargets(results: BenchmarkResult[]) {
  console.log('\n🎯 Performance Target Check:');
  
  let allPassed = true;
  
  for (const result of results) {
    const p95Pass = result.p95 <= 200;
    const p99Pass = result.p99 <= 500;
    
    if (!p95Pass || !p99Pass) {
      allPassed = false;
      console.log('✗ ' + result.endpoint + ': p95=' + result.p95 + 'ms (target: <200ms), p99=' + result.p99 + 'ms (target: <500ms)');
    } else {
      console.log('✓ ' + result.endpoint + ': PASSED');
    }
  }
  
  if (allPassed) {
    console.log('\n✅ All performance targets met!');
    process.exit(0);
  } else {
    console.log('\n❌ Some endpoints failed to meet performance targets');
    process.exit(1);
  }
}

// Run benchmarks
runBenchmarks().catch(console.error);
