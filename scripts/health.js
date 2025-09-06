#!/usr/bin/env node

import https from 'https';
import http from 'http';
import { URL } from 'url';
import chalk from 'chalk';
import ora from 'ora';

const CONFIG = {
  urls: [
    process.env.SITE_URL || 'https://plonk.sh',
    process.env.S3_URL || null
  ].filter(Boolean),
  timeout: 10000,
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
};

class Logger {
  constructor(verbose = false) {
    this.verbose = verbose;
  }

  info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message) {
    console.log(chalk.green('✓'), message);
  }

  warn(message) {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message) {
    console.log(chalk.red('✗'), message);
  }

  debug(message) {
    if (this.verbose) {
      console.log(chalk.gray('→'), message);
    }
  }
}

const logger = new Logger(CONFIG.verbose);

function checkUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const startTime = Date.now();
    
    const req = client.get(url, {
      timeout: CONFIG.timeout,
      headers: {
        'User-Agent': 'Plonk Site Health Check'
      }
    }, (res) => {
      const responseTime = Date.now() - startTime;
      
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          responseTime,
          success: res.statusCode >= 200 && res.statusCode < 400,
          headers: res.headers,
          bodyLength: body.length,
          hasContent: body.includes('Plonk') || body.includes('<title>'),
          error: null
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: null,
        responseTime: CONFIG.timeout,
        success: false,
        error: 'Request timeout'
      });
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      resolve({
        url,
        status: null,
        responseTime,
        success: false,
        error: error.message
      });
    });
  });
}

async function runHealthChecks() {
  console.log(chalk.cyan.bold('🏥 Running Health Checks\n'));
  
  if (CONFIG.urls.length === 0) {
    logger.warn('No URLs configured for health checks');
    logger.info('Set SITE_URL and/or S3_URL environment variables');
    return;
  }

  const results = [];
  
  for (const url of CONFIG.urls) {
    const spinner = ora(`Checking ${url}...`).start();
    
    try {
      const result = await checkUrl(url);
      results.push(result);
      
      if (result.success) {
        spinner.succeed(`${url} - ${chalk.green(result.status)} (${result.responseTime}ms)`);
        
        if (CONFIG.verbose) {
          logger.debug(`Response headers: ${JSON.stringify(result.headers, null, 2)}`);
          logger.debug(`Body length: ${result.bodyLength} bytes`);
          logger.debug(`Has expected content: ${result.hasContent}`);
        }
        
        if (!result.hasContent) {
          logger.warn('Response body does not contain expected Plonk content');
        }
        
      } else {
        const errorMsg = result.error || `HTTP ${result.status}`;
        spinner.fail(`${url} - ${chalk.red(errorMsg)} (${result.responseTime}ms)`);
      }
      
    } catch (error) {
      spinner.fail(`${url} - ${chalk.red(error.message)}`);
      results.push({
        url,
        success: false,
        error: error.message
      });
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(chalk.cyan.bold('\n📊 Health Check Summary:'));
  
  if (successful === total) {
    console.log(chalk.green(`✅ All ${total} endpoints are healthy`));
  } else {
    console.log(chalk.red(`❌ ${total - successful}/${total} endpoints failed`));
    
    const failed = results.filter(r => !r.success);
    failed.forEach(result => {
      logger.error(`${result.url}: ${result.error || 'Failed'}`);
    });
  }
  
  // Performance summary
  const avgResponseTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  if (avgResponseTime > 0) {
    console.log(`⏱️  Average response time: ${Math.round(avgResponseTime)}ms`);
  }
  
  process.exit(successful === total ? 0 : 1);
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
${chalk.cyan.bold('Plonk Site Health Check Script')}

Usage: node scripts/health.js [options]

Options:
  --verbose, -v    Show detailed output including headers and response info
  --help, -h       Show this help message

Environment Variables:
  SITE_URL         Primary site URL to check (default: https://plonk.sh)
  S3_URL          S3 website URL to check (optional)

Examples:
  npm run health                   Check default URLs
  npm run health -- --verbose     Check with detailed output
  SITE_URL=https://example.com npm run health   Check custom URL
`);
  process.exit(0);
}

// Run the health checks
runHealthChecks();