# Astro + AWS Static Site Template

A minimal, production-ready template for deploying Astro sites to AWS. Get a professional static site infrastructure up and running in minutes.

## ✨ What You Get

### 🚀 **Minimal Astro Setup**
- Clean Astro installation with single `index.astro` starter page
- Tailwind CSS 4.x pre-configured and ready to use
- Automatic sitemap generation
- Optimized build configuration for AWS S3

### ☁️ **Complete AWS Infrastructure**
- **S3** static website hosting with AES-256 encryption and public access blocks
- **CloudFront** CDN with SSL/TLS, security headers, and caching optimization
- **Route 53** DNS management and domain configuration
- **ACM** SSL certificate with automatic DNS validation
- **IAM** least-privilege deployment permissions

### 🛠️ **Professional Deployment Pipeline**
- One-command deployment: `npm run deploy`
- Automatic CloudFront cache invalidation
- Health checks and deployment verification
- Environment configuration with validation
- Comprehensive error handling and rollback

### 📦 **Infrastructure as Code**
- OpenTofu/Terraform configuration included
- Version controlled infrastructure state
- Repeatable deployments across environments
- Easy infrastructure updates and rollbacks

## 🚀 Quick Start

### 1. Use This Template
```bash
# Clone the template (replace with your repo URL after creating from template)
git clone https://github.com/YOUR_USERNAME/your-site-name.git
cd your-site-name
```

### 2. Initialize Your Project
```bash
# Run the setup script to configure your site
npm run setup
```

The setup script will prompt for:
- **Project name** (`my-awesome-site`)
- **Domain name** (`mysite.com`) 
- **Project title** (`My Awesome Site`)
- **Description** (`An amazing website built with Astro`)
- **Author information** (name, email, twitter)
- **AWS region** (`us-east-1`, `us-west-2`, etc.)

### 3. Install Dependencies
```bash
# Install all dependencies
pnpm install
```

### 4. Start Development
```bash
# Start Astro dev server
cd site
npm run dev
```

Your site will be available at `http://localhost:4321` with hot-reloading.

### 5. Deploy to AWS

#### First Time Setup
1. **Configure AWS credentials** (AWS CLI, environment variables, or IAM roles)
2. **Create Terraform state bucket** (one-time setup):
   ```bash
   # Create S3 bucket for Terraform state
   aws s3 mb s3://your-project-terraform-state --region us-east-1
   ```

#### Deploy Infrastructure
```bash
# Deploy AWS infrastructure (S3, CloudFront, Route 53, etc.)
npm run infra:apply
```

#### Deploy Your Site
```bash
# Build and deploy your site
npm run deploy
```

That's it! Your site will be live at your custom domain with SSL, CDN, and professional hosting.

## 📁 Template Structure

```
├── site/                    # Astro application
│   ├── src/
│   │   ├── pages/
│   │   │   └── index.astro  # Your starting page
│   │   └── styles/
│   │       └── global.css   # Tailwind CSS imports
│   ├── public/              # Static assets
│   ├── package.json
│   └── astro.config.mjs     # Optimized for AWS deployment
├── infra/                   # AWS infrastructure (OpenTofu/Terraform)
│   ├── main.tf              # Infrastructure configuration  
│   ├── variables.tf         # Customizable variables
│   ├── s3.tf               # S3 bucket and policies
│   ├── cloudfront.tf       # CDN configuration
│   ├── route53.tf          # DNS configuration
│   └── acm.tf              # SSL certificate
├── scripts/                 # Deployment automation
│   ├── deploy.js           # Site deployment script
│   ├── infra.js            # Infrastructure management
│   ├── health.js           # Health check utilities
│   └── setup.js            # Template initialization
├── .env.example            # Environment configuration template
└── template.config.js      # Template settings and variables
```

## 🔧 Available Commands

### Development
```bash
cd site
npm run dev          # Start Astro dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
```bash
npm run deploy       # Deploy site to AWS
npm run health       # Check site health
```

### Infrastructure
```bash
npm run infra:init   # Initialize Terraform
npm run infra:plan   # Preview infrastructure changes  
npm run infra:apply  # Deploy infrastructure
npm run infra:destroy # Destroy infrastructure
```

## 🌍 Multi-Environment Support

Create different environments by copying and modifying configuration:

```bash
# Development environment
cp .env.example .env.dev
# Edit .env.dev with dev-specific values

# Production environment  
cp .env.example .env.prod
# Edit .env.prod with production values

# Deploy to specific environment
NODE_ENV=dev npm run deploy
NODE_ENV=prod npm run deploy
```

## 🔒 Security Features

- **S3 Server-Side Encryption** with AES-256 and bucket key enabled (99% cost reduction)
- **S3 Public Access Blocks** preventing accidental public bucket exposure
- **CloudFront Security Headers** (CSP, HSTS, X-Frame-Options, X-Content-Type, Referrer-Policy)
- **HTTPS Everywhere** with secure redirects and SSL/TLS certificates
- **CloudFront Origin Access Control** restricting S3 access to CDN only
- **IAM least-privilege** access for deployments
- **Environment file security** with proper gitignore patterns
- **No local state files** - all Terraform state stored securely in S3

## 📈 Performance Optimizations

- **CloudFront CDN** with global edge locations
- **Optimized caching** for static assets
- **Compressed HTML** and automatic minification
- **Modern image formats** and optimization
- **Clean URLs** without .html extensions

## 🆘 Troubleshooting

### Common Issues

**Domain not resolving:**
- DNS propagation can take 24-48 hours
- Verify Route 53 name servers match domain registrar

**SSL certificate pending:**
- Ensure DNS is configured correctly for validation
- Certificate validation can take 10-30 minutes

**Deployment fails:**
- Check AWS credentials are configured
- Verify S3 bucket permissions
- Ensure CloudFront distribution is deployed

**Site not updating:**
- CloudFront caching may be serving old content
- Run `npm run deploy` to trigger cache invalidation

### Get Help

1. Check the logs: `npm run health -- --verbose`
2. Verify infrastructure: `npm run infra:plan`
3. Review [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

## 🔗 Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [OpenTofu Documentation](https://opentofu.org/docs)
- [AWS Static Hosting Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built for developers who want professional AWS hosting without the complexity.**