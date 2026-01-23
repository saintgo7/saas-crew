module.exports = {
  ci: {
    collect: {
      // Number of runs to perform
      numberOfRuns: 3,
      
      // Start the web server
      startServerCommand: 'pnpm --filter web start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 30000,
      
      // URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/projects',
        'http://localhost:3000/courses',
        'http://localhost:3000/community',
      ],
      
      // Additional Lighthouse settings
      settings: {
        preset: 'desktop',
      },
    },
    
    assert: {
      // Performance assertions
      assertions: {
        // Core Web Vitals
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Resource hints
        'uses-rel-preconnect': 'off',
        'uses-rel-preload': 'off',
        
        // Performance budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }],
        'resource-summary:font:size': ['warn', { maxNumericValue: 100000 }],
      },
    },
    
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
  },
};
