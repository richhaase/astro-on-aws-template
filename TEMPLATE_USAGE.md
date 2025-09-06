# Template Usage Guide

This guide explains how to use the Astro + AWS Infrastructure Template to create your own static site with professional AWS hosting.

## 🎯 What This Template Is For

Perfect for developers who want:
- **Minimal Astro setup** without example cruft
- **Professional AWS infrastructure** without complexity
- **One-command deployment** with proper security
- **Clean starting point** to build any static site

## 🚀 Quick Start (5 Minutes)

### 1. Create Your Project

**Option A: Use GitHub Template**
1. Click "Use this template" on the GitHub repo
2. Create your new repository
3. Clone it locally

**Option B: Clone Directly**
```bash
git clone https://github.com/YOUR_USERNAME/astro-aws-template.git my-new-site
cd my-new-site
rm -rf .git && git init
```

### 2. Initialize Your Project
```bash
# Configure your site details
npm run setup
```

You'll be prompted for:
- **Project name**: `my-awesome-site` (used for AWS resources)
- **Domain name**: `mysite.com` (your custom domain)
- **Site title**: `My Awesome Site` (appears in browser title)
- **Description**: Brief description of your site
- **Author info**: Your name, email, Twitter handle
- **AWS region**: `us-east-1`, `us-west-2`, etc.

### 3. Install & Start Development
```bash
# Install dependencies
pnpm install

# Start Astro dev server
cd site
npm run dev
```

Your minimal site is now running at `http://localhost:4321`

### 4. Deploy to AWS

**Prerequisites:**
- AWS CLI configured with credentials
- Domain registered (Route 53 or external registrar)

**Deploy:**
```bash
# Deploy infrastructure (first time only)
npm run infra:apply

# Deploy your site
npm run deploy
```

**Done!** Your site is live with SSL, CDN, and professional hosting.

## 📁 What You Get

### Minimal Astro Site
- Single `index.astro` page with your project details
- Tailwind CSS ready to customize
- Optimized for AWS S3 deployment
- Automatic sitemap generation

### Complete AWS Infrastructure
- S3 bucket for hosting with security policies
- CloudFront CDN with global edge locations  
- Route 53 DNS with your custom domain
- SSL certificate with automatic renewal
- IAM permissions following security best practices

### Professional Deployment
- One command builds and deploys everything
- Automatic cache invalidation
- Health checks and error handling
- Environment configuration support

## 🛠️ Development Workflow

### Daily Development
```bash
cd site
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Deploy Changes
```bash
npm run deploy       # Build and deploy to AWS
npm run health       # Verify deployment health
```

### Infrastructure Changes
```bash
npm run infra:plan   # Preview infrastructure changes
npm run infra:apply  # Apply infrastructure changes
```

## 🎨 Customizing Your Site

### Start Building
The template gives you a clean `site/src/pages/index.astro` to start from:

```astro
---
const pageTitle = "My Awesome Site";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{pageTitle}</title>
  </head>
  <body class="min-h-screen bg-gray-50">
    <!-- Start building here -->
  </body>
</html>
```

### Add Pages
```bash
# Create new pages
touch site/src/pages/about.astro
touch site/src/pages/blog/index.astro
```

### Add Components
```bash
# Create components directory
mkdir site/src/components
touch site/src/components/Header.astro
touch site/src/components/Footer.astro
```

### Style with Tailwind
Tailwind CSS is pre-configured and ready to use:

```astro
<div class="max-w-4xl mx-auto px-6">
  <h1 class="text-3xl font-bold text-gray-900">Hello World</h1>
  <p class="text-lg text-gray-600">Built with Tailwind CSS</p>
</div>
```

## 🌍 Multi-Environment Setup

### Environment Configuration
```bash
# Development environment
cp .env.example .env.dev
# Edit with dev-specific values

# Production environment  
cp .env.example .env.prod
# Edit with production values
```

### Deploy to Different Environments
```bash
# Deploy to development
NODE_ENV=dev npm run deploy

# Deploy to production
NODE_ENV=prod npm run deploy
```

## 🔧 Configuration Options

### Template Variables
All configured during `npm run setup`:
- `PROJECT_NAME` - Used for AWS resource naming
- `DOMAIN_NAME` - Your custom domain
- `PROJECT_TITLE` - Site title and meta tags
- `PROJECT_DESCRIPTION` - SEO description
- `AUTHOR_NAME` - Author metadata
- `AUTHOR_TWITTER` - Social media links
- `AWS_REGION` - AWS region for resources

### AWS Resources Created
- S3 bucket: `{PROJECT_NAME}-site-bucket-{env}`
- CloudFront distribution with custom domain
- Route 53 hosted zone and records
- ACM SSL certificate
- IAM roles for deployment

## 🆘 Troubleshooting

### Common Issues

**Setup script fails:**
```bash
# Ensure Node.js 18+ is installed
node --version

# Clear npm cache
npm cache clean --force
```

**AWS deployment fails:**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify permissions
aws iam get-user
```

**Domain not resolving:**
- DNS propagation takes 24-48 hours
- Verify nameservers match Route 53
- Check domain registration status

**Site not updating:**
```bash
# Force cache invalidation
npm run deploy

# Check CloudFront status
aws cloudfront list-distributions
```

### Getting Help

1. **Check logs**: `npm run health -- --verbose`
2. **Verify infrastructure**: `npm run infra:plan`
3. **Review AWS console**: S3, CloudFront, Route 53 sections
4. **Check Astro docs**: [docs.astro.build](https://docs.astro.build)

## 📝 Best Practices

### Development
- Use `npm run dev` for development with hot reload
- Test production builds locally with `npm run preview`
- Keep your `site/` directory focused on Astro code
- Use environment variables for configuration

### Deployment
- Always run `npm run infra:plan` before `infra:apply`
- Use separate environments for staging and production
- Monitor costs in AWS Billing console
- Set up CloudWatch alarms for production sites

### Security
- Never commit `.env` files with real credentials
- Use IAM roles instead of access keys when possible
- Enable AWS CloudTrail for audit logging
- Regularly review and rotate access keys

## 🚀 Next Steps

Once your site is deployed:

1. **Customize the design** - Add your own components and styling
2. **Add content** - Create pages, blog posts, documentation
3. **Set up analytics** - Add Google Analytics or similar
4. **Configure monitoring** - Set up uptime monitoring
5. **Add CI/CD** - Automate deployments with GitHub Actions
6. **Scale up** - Add additional environments or features

## 📄 Template Structure Reference

```
├── site/                    # Your Astro application
│   ├── src/pages/index.astro  # Starting page (customize this)
│   ├── src/styles/global.css  # Tailwind CSS imports
│   ├── public/              # Static assets (favicon, images)
│   └── astro.config.mjs     # Optimized for AWS deployment
├── infra/                   # AWS infrastructure (don't modify unless needed)
├── scripts/                 # Deployment scripts (don't modify)
├── .env.example            # Environment template
└── template.config.js      # Template settings (don't modify)
```

**Focus on the `site/` directory - that's where you'll do most of your work.**

---

**Happy building! 🚀**