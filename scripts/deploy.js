#!/usr/bin/env node

import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';
import chalk from 'chalk';
import ora from 'ora';

const CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  bucketName: process.env.S3_BUCKET || '{{PROJECT_NAME}}-site-bucket',
  distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID || '',
  buildDir: path.join(process.cwd(), 'site/dist'),
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
};

const s3Client = new S3Client({ region: CONFIG.region });
const cloudFrontClient = new CloudFrontClient({ region: CONFIG.region });

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

async function validateConfig() {
  const spinner = ora('Validating configuration...').start();
  
  try {
    // Check if build directory exists
    await fs.access(CONFIG.buildDir);
    
    // Check required environment variables
    const missing = [];
    if (!CONFIG.bucketName || CONFIG.bucketName === '{{PROJECT_NAME}}-site-bucket') {
      missing.push('S3_BUCKET');
    }
    if (!CONFIG.distributionId) {
      missing.push('CLOUDFRONT_DISTRIBUTION_ID');
    }
    
    if (missing.length > 0) {
      spinner.fail(`Missing required environment variables: ${missing.join(', ')}`);
      logger.error('Please set the following environment variables:');
      missing.forEach(env => logger.error(`  ${env}`));
      process.exit(1);
    }

    spinner.succeed('Configuration validated');
    logger.debug(`Build directory: ${CONFIG.buildDir}`);
    logger.debug(`S3 bucket: ${CONFIG.bucketName}`);
    logger.debug(`CloudFront distribution: ${CONFIG.distributionId}`);
    
  } catch (error) {
    spinner.fail('Configuration validation failed');
    if (error.code === 'ENOENT') {
      logger.error(`Build directory not found: ${CONFIG.buildDir}`);
      logger.error('Run "npm run build" first to build the site');
    } else {
      logger.error(`Configuration error: ${error.message}`);
    }
    process.exit(1);
  }
}

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir));
    } else {
      files.push({
        localPath: fullPath,
        s3Key: path.relative(baseDir, fullPath).replace(/\\/g, '/') // Normalize for S3
      });
    }
  }

  return files;
}

async function uploadFile(file) {
  const fileContent = await fs.readFile(file.localPath);
  const contentType = mime.getType(file.localPath) || 'application/octet-stream';
  
  // Set cache headers based on file type
  let cacheControl = 'public, max-age=31536000'; // 1 year for static assets
  if (file.s3Key === 'index.html' || file.s3Key.endsWith('.html')) {
    cacheControl = 'public, max-age=300'; // 5 minutes for HTML files
  }

  const uploadParams = {
    Bucket: CONFIG.bucketName,
    Key: file.s3Key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: cacheControl,
    Metadata: {
      uploadedAt: new Date().toISOString()
    }
  };

  if (CONFIG.dryRun) {
    logger.debug(`[DRY RUN] Would upload: ${file.s3Key} (${contentType})`);
    return;
  }

  try {
    const upload = new Upload({
      client: s3Client,
      params: uploadParams
    });

    await upload.done();
    logger.debug(`Uploaded: ${file.s3Key}`);
  } catch (error) {
    throw new Error(`Failed to upload ${file.s3Key}: ${error.message}`);
  }
}

async function uploadFiles() {
  const spinner = ora('Scanning build directory...').start();
  
  try {
    const files = await getAllFiles(CONFIG.buildDir);
    spinner.succeed(`Found ${files.length} files to upload`);

    if (CONFIG.dryRun) {
      logger.warn('DRY RUN mode - no files will actually be uploaded');
    }

    const uploadSpinner = ora('Uploading files to S3...').start();
    let uploadedCount = 0;

    for (const file of files) {
      await uploadFile(file);
      uploadedCount++;
      uploadSpinner.text = `Uploading files to S3... (${uploadedCount}/${files.length})`;
    }

    uploadSpinner.succeed(`Successfully uploaded ${files.length} files to S3`);
    
  } catch (error) {
    spinner.fail(`Upload failed: ${error.message}`);
    throw error;
  }
}

async function invalidateCloudFront() {
  if (!CONFIG.distributionId) {
    logger.warn('No CloudFront distribution ID provided, skipping cache invalidation');
    return;
  }

  const spinner = ora('Creating CloudFront invalidation...').start();

  if (CONFIG.dryRun) {
    spinner.succeed('[DRY RUN] Would create CloudFront invalidation');
    return;
  }

  try {
    const invalidationParams = {
      DistributionId: CONFIG.distributionId,
      InvalidationBatch: {
        Paths: {
          Quantity: 1,
          Items: ['/*'] // Invalidate everything
        },
        CallerReference: `deploy-${Date.now()}`
      }
    };

    const result = await cloudFrontClient.send(new CreateInvalidationCommand(invalidationParams));
    
    spinner.succeed(`CloudFront invalidation created: ${result.Invalidation.Id}`);
    logger.info('Cache invalidation may take 5-15 minutes to complete');
    
  } catch (error) {
    spinner.fail(`CloudFront invalidation failed: ${error.message}`);
    throw error;
  }
}

async function deploy() {
  console.log(chalk.cyan.bold('🚀 Deploying Site\n'));
  
  try {
    await validateConfig();
    await uploadFiles();
    await invalidateCloudFront();
    
    console.log(chalk.green.bold('\n✅ Deployment completed successfully!'));
    
    if (!CONFIG.dryRun) {
      logger.info('Your site should be available at:');
      logger.info(`  • S3: http://${CONFIG.bucketName}.s3-website-${CONFIG.region}.amazonaws.com`);
      logger.info('  • CloudFront: https://{{DOMAIN_NAME}} (after DNS propagation)');
    }
    
  } catch (error) {
    console.log(chalk.red.bold('\n❌ Deployment failed!'));
    logger.error(error.message);
    
    if (CONFIG.verbose) {
      console.error('\nFull error details:');
      console.error(error);
    }
    
    process.exit(1);
  }
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
${chalk.cyan.bold('Site Deployment Script')}

Usage: node scripts/deploy.js [options]

Options:
  --dry-run        Show what would be deployed without actually doing it
  --verbose, -v    Show detailed output
  --help, -h       Show this help message

Environment Variables:
  S3_BUCKET                    S3 bucket name for hosting
  CLOUDFRONT_DISTRIBUTION_ID   CloudFront distribution ID for cache invalidation
  AWS_REGION                   AWS region (default: us-east-1)

Examples:
  npm run deploy               Deploy the site
  npm run deploy -- --dry-run  Preview deployment without making changes
  npm run deploy -- --verbose  Deploy with detailed output
`);
  process.exit(0);
}

// Run the deployment
deploy();