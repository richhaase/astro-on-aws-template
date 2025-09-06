#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

const CONFIG = {
  infraDir: path.join(process.cwd(), 'infra'),
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  autoApprove: process.argv.includes('--auto-approve'),
  dryRun: process.argv.includes('--dry-run')
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

async function validateInfrastructure() {
  const spinner = ora('Validating infrastructure directory...').start();
  
  try {
    await fs.access(CONFIG.infraDir);
    
    // Check for required OpenTofu files
    const requiredFiles = ['main.tf', 'variables.tf', 'terraform.tfvars'];
    const missingFiles = [];
    
    for (const file of requiredFiles) {
      try {
        await fs.access(path.join(CONFIG.infraDir, file));
      } catch {
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      spinner.fail(`Missing required files: ${missingFiles.join(', ')}`);
      logger.error('Required infrastructure files not found in infra/ directory');
      process.exit(1);
    }
    
    spinner.succeed('Infrastructure directory validated');
    logger.debug(`Infrastructure directory: ${CONFIG.infraDir}`);
    
  } catch (error) {
    spinner.fail('Infrastructure validation failed');
    logger.error(`Infrastructure directory not found: ${CONFIG.infraDir}`);
    process.exit(1);
  }
}

async function runOpenTofu(command, args = []) {
  return new Promise((resolve, reject) => {
    // Use OpenTofu exclusively
    const tfCommand = 'tofu';
    const fullArgs = [command, ...args];
    
    if (CONFIG.verbose) {
      logger.debug(`Running: ${tfCommand} ${fullArgs.join(' ')}`);
    }

    const process = spawn(tfCommand, fullArgs, {
      cwd: CONFIG.infraDir,
      stdio: CONFIG.verbose ? 'inherit' : 'pipe',
      shell: true
    });

    let stdout = '';
    let stderr = '';

    if (!CONFIG.verbose) {
      process.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`OpenTofu command failed with exit code ${code}: ${stderr}`));
      }
    });

    process.on('error', (error) => {
      reject(new Error(`OpenTofu not found or failed to execute: ${error.message}`));
    });
  });
}

async function init() {
  const spinner = ora('Initializing OpenTofu...').start();
  
  try {
    await runOpenTofu('init', ['-upgrade']);
    spinner.succeed('Infrastructure initialized successfully');
  } catch (error) {
    spinner.fail('Infrastructure initialization failed');
    throw error;
  }
}

async function plan() {
  console.log(chalk.cyan.bold('📋 Planning Infrastructure Changes\n'));
  
  try {
    await validateInfrastructure();
    await init();
    
    const spinner = ora('Generating deployment plan...').start();
    
    const planArgs = ['-detailed-exitcode', '-out=tfplan'];
    if (CONFIG.verbose) {
      planArgs.push('-no-color');
    }
    
    let result;
    try {
      result = await runOpenTofu('plan', planArgs);
      
      if (result.code === 0) {
        spinner.succeed('No infrastructure changes needed');
        logger.info('Your infrastructure is up to date');
      } else if (result.code === 2) {
        spinner.succeed('Infrastructure changes detected');
        logger.info('Run "pnpm run infra:apply" to apply the changes');
      }
    } catch (error) {
      // Handle exit code 2 as success (changes detected)
      if (error.message.includes('exit code 2')) {
        spinner.succeed('Infrastructure changes detected');
        logger.info('Run "pnpm run infra:apply" to apply the changes');
        result = { stdout: '', stderr: '', code: 2 }; // Set dummy result for output display
      } else {
        throw error;
      }
    }
    
    if (!CONFIG.verbose && result && result.stdout) {
      console.log('\n' + result.stdout);
    }
    
  } catch (error) {
    console.log(chalk.red.bold('\n❌ Planning failed!'));
    logger.error(error.message);
    
    if (CONFIG.verbose) {
      console.error('\nFull error details:');
      console.error(error);
    }
    
    process.exit(1);
  }
}

async function apply() {
  console.log(chalk.cyan.bold('🚀 Applying Infrastructure Changes\n'));
  
  if (CONFIG.dryRun) {
    logger.warn('DRY RUN mode - running plan instead of apply');
    return plan();
  }
  
  try {
    await validateInfrastructure();
    await init();
    
    // First run plan to show what will change
    const spinner = ora('Generating deployment plan...').start();
    await runOpenTofu('plan', ['-out=tfplan']);
    spinner.succeed('Deployment plan generated');
    
    // Apply the changes
    const applySpinner = ora('Applying infrastructure changes...').start();
    
    const applyArgs = ['tfplan'];
    if (CONFIG.autoApprove) {
      applyArgs.unshift('-auto-approve');
    }
    
    const result = await runOpenTofu('apply', applyArgs);
    
    applySpinner.succeed('Infrastructure changes applied successfully');
    
    // Show outputs
    logger.info('Fetching infrastructure outputs...');
    await outputs();
    
    console.log(chalk.green.bold('\n✅ Infrastructure deployment completed!'));
    
  } catch (error) {
    console.log(chalk.red.bold('\n❌ Infrastructure deployment failed!'));
    logger.error(error.message);
    
    if (CONFIG.verbose) {
      console.error('\nFull error details:');
      console.error(error);
    }
    
    process.exit(1);
  }
}

async function destroy() {
  console.log(chalk.red.bold('💥 Destroying Infrastructure\n'));
  
  if (!CONFIG.autoApprove) {
    logger.warn('This will destroy all infrastructure resources!');
    logger.warn('Use --auto-approve to skip this confirmation');
    logger.warn('Press Ctrl+C to cancel, or any key to continue...');
    
    // Wait for user input
    process.stdin.setRawMode(true);
    process.stdin.resume();
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        resolve();
      });
    });
  }
  
  try {
    await validateInfrastructure();
    await init();
    
    const spinner = ora('Destroying infrastructure...').start();
    
    const destroyArgs = [];
    if (CONFIG.autoApprove) {
      destroyArgs.push('-auto-approve');
    }
    
    await runOpenTofu('destroy', destroyArgs);
    
    spinner.succeed('Infrastructure destroyed successfully');
    console.log(chalk.green.bold('\n✅ Infrastructure destruction completed!'));
    
  } catch (error) {
    console.log(chalk.red.bold('\n❌ Infrastructure destruction failed!'));
    logger.error(error.message);
    
    if (CONFIG.verbose) {
      console.error('\nFull error details:');
      console.error(error);
    }
    
    process.exit(1);
  }
}

async function outputs() {
  try {
    const result = await runOpenTofu('output', ['-json']);
    
    if (result.stdout) {
      const outputs = JSON.parse(result.stdout);
      
      console.log(chalk.cyan.bold('\n📊 Infrastructure Outputs:'));
      
      Object.entries(outputs).forEach(([key, output]) => {
        console.log(`  ${chalk.yellow(key)}: ${chalk.white(output.value)}`);
      });
      
      // Set environment variables for deployment script
      if (outputs.s3_bucket_name) {
        process.env.S3_BUCKET = outputs.s3_bucket_name.value;
        logger.debug(`Set S3_BUCKET=${outputs.s3_bucket_name.value}`);
      }
      
      if (outputs.cloudfront_distribution_id) {
        process.env.CLOUDFRONT_DISTRIBUTION_ID = outputs.cloudfront_distribution_id.value;
        logger.debug(`Set CLOUDFRONT_DISTRIBUTION_ID=${outputs.cloudfront_distribution_id.value}`);
      }
      
    } else {
      logger.info('No infrastructure outputs available');
    }
    
  } catch (error) {
    logger.error(`Failed to get outputs: ${error.message}`);
    throw error;
  }
}

function showHelp() {
  console.log(`
${chalk.cyan.bold('Plonk Infrastructure Management Script')}

Usage: node scripts/infra.js <command> [options]

Commands:
  plan      Generate and show an execution plan
  apply     Apply the infrastructure changes
  destroy   Destroy all infrastructure resources
  output    Show infrastructure outputs

Options:
  --auto-approve    Skip interactive approval prompts
  --dry-run        For apply command, runs plan instead
  --verbose, -v    Show detailed output
  --help, -h       Show this help message

Examples:
  npm run infra:plan              Generate deployment plan
  npm run infra:apply             Apply infrastructure changes
  npm run infra:apply -- --auto-approve   Apply without confirmation
  npm run infra:destroy           Destroy infrastructure (with confirmation)
  npm run infra:output            Show current outputs

Environment Variables:
  The script will export infrastructure outputs as environment variables
  for use by the deployment script:
    S3_BUCKET                    From s3_bucket_name output
    CLOUDFRONT_DISTRIBUTION_ID   From cloudfront_distribution_id output
`);
}

// Main execution
const command = process.argv[2];

if (!command || process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

switch (command) {
  case 'plan':
    plan();
    break;
  case 'apply':
    apply();
    break;
  case 'destroy':
    destroy();
    break;
  case 'output':
    outputs();
    break;
  default:
    logger.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}