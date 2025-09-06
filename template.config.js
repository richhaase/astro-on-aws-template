// Template configuration schema and defaults
export const templateConfig = {
  // Template metadata
  name: 'astro-aws-template',
  version: '1.0.0',
  description: 'Astro site with AWS infrastructure',

  // Template variables with defaults and validation
  variables: {
    // Project basics
    PROJECT_NAME: {
      type: 'string',
      required: true,
      description: 'Project name (kebab-case)',
      validate: (value) => /^[a-z][a-z0-9-]*$/.test(value),
      example: 'my-awesome-site'
    },
    
    PROJECT_TITLE: {
      type: 'string', 
      required: true,
      description: 'Human-readable project title',
      example: 'My Awesome Site'
    },
    
    PROJECT_DESCRIPTION: {
      type: 'string',
      required: true, 
      description: 'Brief project description',
      example: 'An amazing website built with Astro'
    },

    // Domain configuration
    DOMAIN_NAME: {
      type: 'string',
      required: true,
      description: 'Primary domain name',
      validate: (value) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(value),
      example: 'example.com'
    },

    // Author information
    AUTHOR_NAME: {
      type: 'string',
      required: true,
      description: 'Author full name',
      example: 'Jane Doe'
    },
    
    AUTHOR_EMAIL: {
      type: 'string',
      required: false,
      description: 'Author email address',
      validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      example: 'jane@example.com'
    },
    
    AUTHOR_TWITTER: {
      type: 'string',
      required: false,
      description: 'Twitter handle (without @)',
      validate: (value) => !value || /^[a-zA-Z0-9_]{1,15}$/.test(value),
      example: 'janedoe'
    },

    // Site configuration  
    SITE_TYPE: {
      type: 'select',
      required: true,
      description: 'Type of site to generate',
      options: ['landing-page', 'documentation', 'blog', 'portfolio', 'general'],
      default: 'landing-page'
    },

    // AWS configuration
    AWS_REGION: {
      type: 'select',
      required: true,
      description: 'AWS region for infrastructure',
      options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
      default: 'us-east-1'
    },

    // Optional features
    ANALYTICS_ENABLED: {
      type: 'boolean',
      required: false,
      description: 'Enable analytics tracking',
      default: false
    },

    SITEMAP_ENABLED: {
      type: 'boolean', 
      required: false,
      description: 'Generate XML sitemap',
      default: true
    }
  },

  // Files that should be processed for template replacement
  templateFiles: [
    // Package files
    'package.json',
    'pnpm-workspace.yaml',
    
    // Site configuration
    'site/package.json',
    'site/astro.config.mjs',
    'site/tailwind.config.js',
    
    // Infrastructure
    'infra/variables.tf',
    'infra/main.tf',
    'infra/s3.tf',
    'infra/route53.tf',
    
    // Scripts
    'scripts/deploy.js',
    'scripts/infra.js',
    
    // Content files  
    'site/src/pages/index.astro',
    'site/src/components/Hero.astro',
    'site/src/components/Features.astro',
    'site/src/layouts/BaseLayout.astro',
    
    // Documentation
    'README.md'
  ],

  // Files to exclude from template processing
  excludeFiles: [
    'node_modules/**/*',
    '.git/**/*',
    'site/dist/**/*',
    'infra/.terraform/**/*',
    'infra/terraform.tfstate*',
    '.DS_Store',
    '*.log'
  ],

  // Post-setup commands to run
  postSetupCommands: [
    'pnpm install',
    'git init',
    'git add .',
    'git commit -m "Initial commit from template"'
  ]
};

export default templateConfig;