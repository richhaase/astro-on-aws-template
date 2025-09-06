#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import templateConfig from '../template.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

class TemplateSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.values = {};
  }

  async prompt(question, defaultValue = '', validator = null) {
    const defaultText = defaultValue ? ` (${defaultValue})` : '';
    const answer = await new Promise((resolve) => {
      this.rl.question(`${question}${defaultText}: `, resolve);
    });
    
    const value = answer.trim() || defaultValue;
    
    if (validator && !validator(value)) {
      console.log('❌ Invalid input. Please try again.');
      return this.prompt(question, defaultValue, validator);
    }
    
    return value;
  }

  async promptSelect(question, options, defaultValue = '') {
    console.log(`\\n${question}`);
    options.forEach((option, index) => {
      const marker = option === defaultValue ? '→' : ' ';
      console.log(`${marker} ${index + 1}. ${option}`);
    });
    
    const answer = await new Promise((resolve) => {
      this.rl.question(`Choose (1-${options.length})${defaultValue ? ` or press Enter for ${defaultValue}` : ''}: `, resolve);
    });
    
    if (!answer.trim() && defaultValue) {
      return defaultValue;
    }
    
    const index = parseInt(answer) - 1;
    if (index >= 0 && index < options.length) {
      return options[index];
    }
    
    console.log('❌ Invalid selection. Please try again.');
    return this.promptSelect(question, options, defaultValue);
  }

  async promptBoolean(question, defaultValue = false) {
    const defaultText = defaultValue ? ' (Y/n)' : ' (y/N)';
    const answer = await new Promise((resolve) => {
      this.rl.question(`${question}${defaultText}: `, resolve);
    });
    
    if (!answer.trim()) return defaultValue;
    return answer.toLowerCase().startsWith('y');
  }

  async collectVariables() {
    console.log('\\n🚀 Astro + AWS Template Setup');
    console.log('================================\\n');
    
    for (const [key, config] of Object.entries(templateConfig.variables)) {
      console.log(`📝 ${config.description}`);
      if (config.example) {
        console.log(`   Example: ${config.example}`);
      }
      
      let value;
      
      if (config.type === 'select') {
        value = await this.promptSelect(
          `Select ${key.toLowerCase().replace(/_/g, ' ')}:`,
          config.options,
          config.default
        );
      } else if (config.type === 'boolean') {
        value = await this.promptBoolean(
          config.description,
          config.default
        );
      } else {
        value = await this.prompt(
          `Enter ${key.toLowerCase().replace(/_/g, ' ')}`,
          config.default,
          config.validate
        );
      }
      
      this.values[key] = value;
      console.log('');
    }
  }

  replaceInFile(filePath, replacements) {
    if (!existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const [placeholder, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      if (content.includes(`{{${placeholder}}}`)) {
        content = content.replace(regex, value);
        modified = true;
      }
    }
    
    if (modified) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  }

  processTemplateFiles() {
    console.log('\\n🔄 Processing template files...');
    
    for (const file of templateConfig.templateFiles) {
      const filePath = join(rootDir, file);
      this.replaceInFile(filePath, this.values);
    }
  }

  generateProjectReadme() {
    console.log('\\n📝 Generating project README...');
    
    const readmeContent = `# ${this.values.PROJECT_TITLE}

${this.values.PROJECT_DESCRIPTION}

## Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
\`\`\`

## Deployment

\`\`\`bash
# Deploy infrastructure
pnpm run infra:apply

# Deploy site
pnpm run deploy
\`\`\`

## Configuration

- **Domain**: ${this.values.DOMAIN_NAME}
- **AWS Region**: ${this.values.AWS_REGION}
- **Site Type**: ${this.values.SITE_TYPE}

## Author

Created by ${this.values.AUTHOR_NAME}${this.values.AUTHOR_EMAIL ? ` (${this.values.AUTHOR_EMAIL})` : ''}

---

*Generated from [Astro + AWS Infrastructure Template](https://github.com/YOUR_USERNAME/astro-site-template)*
`;

    writeFileSync(join(rootDir, 'README.md'), readmeContent, 'utf8');
    console.log('✅ Generated project README.md');
  }

  async runPostSetupCommands() {
    console.log('\\n🛠️  Running post-setup commands...');
    
    const { spawn } = await import('child_process');
    
    for (const command of templateConfig.postSetupCommands) {
      console.log(`Running: ${command}`);
      
      try {
        await new Promise((resolve, reject) => {
          const [cmd, ...args] = command.split(' ');
          const child = spawn(cmd, args, { 
            cwd: rootDir, 
            stdio: 'inherit' 
          });
          
          child.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Command failed with code ${code}`));
            }
          });
        });
        console.log(`✅ ${command}`);
      } catch (error) {
        console.log(`⚠️  ${command} failed: ${error.message}`);
      }
    }
  }

  cleanupTemplateFiles() {
    console.log('\\n🧹 Cleaning up template files...');
    
    // Remove template-specific files
    const filesToRemove = [
      'template.config.js',
      'scripts/setup.js'
    ];
    
    for (const file of filesToRemove) {
      const filePath = join(rootDir, file);
      if (existsSync(filePath)) {
        try {
          const { unlinkSync } = await import('fs');
          unlinkSync(filePath);
          console.log(`🗑️  Removed: ${file}`);
        } catch (error) {
          console.log(`⚠️  Could not remove ${file}: ${error.message}`);
        }
      }
    }
  }

  async run() {
    try {
      await this.collectVariables();
      
      console.log('\\n📋 Configuration Summary:');
      console.log('========================');
      for (const [key, value] of Object.entries(this.values)) {
        console.log(`${key}: ${value}`);
      }
      
      const proceed = await this.promptBoolean('\\nProceed with setup?', true);
      if (!proceed) {
        console.log('Setup cancelled.');
        process.exit(0);
      }
      
      this.processTemplateFiles();
      this.generateProjectReadme();
      await this.runPostSetupCommands();
      await this.cleanupTemplateFiles();
      
      console.log('\\n🎉 Template setup complete!');
      console.log('\\nNext steps:');
      console.log('1. Review the generated files');
      console.log('2. Customize your site in site/src/');
      console.log('3. Configure AWS credentials');
      console.log('4. Run `pnpm run infra:apply` to deploy infrastructure');
      console.log('5. Run `pnpm run deploy` to deploy your site');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new TemplateSetup();
  setup.run();
}