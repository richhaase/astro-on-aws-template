# Astro + AWS Infrastructure Template

A production-ready Astro template with complete AWS infrastructure setup. Perfect for any type of static site: landing pages, documentation, blogs, portfolios, or general websites.

## ✨ Features

- **Modern Astro Stack**: Latest Astro with Tailwind CSS 4.0
- **Complete AWS Infrastructure**: S3, CloudFront, Route 53, SSL certificates
- **Production Ready**: Sophisticated deployment automation and error handling
- **Infrastructure as Code**: OpenTofu/Terraform with proper security
- **Flexible**: Works for any static site type (landing pages, docs, blogs, etc.)
- **Performance Optimized**: CDN, caching, and build optimization

## 🚀 Quick Start

### 1. Create from Template
Click "Use this template" above or visit the template generation page

### 2. Clone and Initialize
```bash
git clone https://github.com/YOUR_USERNAME/your-new-site.git
cd your-new-site
npm run setup
```

### 3. Configure Your Site
The setup script will prompt for:
- **Domain name** (e.g., `mysite.com`)
- **Site type** (landing page, documentation, blog, general)
- **Project metadata** (title, description, author)
- **AWS configuration** (region, tags)

### 4. Start Development
```bash
pnpm install
pnpm run dev
```

### 5. Deploy
```bash
# Deploy infrastructure
pnpm run infra:apply

# Deploy site
pnpm run deploy
```

## 📁 Project Structure

```
├── site/                 # Astro application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # Site pages/routes
│   │   ├── content/      # Markdown content (optional)
│   │   └── styles/       # Styling and CSS
├── infra/                # AWS infrastructure
│   ├── main.tf          # Core infrastructure
│   ├── s3.tf            # S3 bucket configuration
│   ├── cloudfront.tf    # CDN setup
│   ├── route53.tf       # DNS configuration
│   └── variables.tf     # Configurable parameters
├── scripts/              # Automation scripts
│   ├── setup.js         # Template initialization
│   ├── deploy.js        # Site deployment
│   └── infra.js         # Infrastructure management
└── docs/                # Project documentation
```

## 🎯 Use Cases

This template works great for:

- **🏠 Landing Pages**: Product launches, marketing sites
- **📚 Documentation**: Technical docs, guides, wikis  
- **✍️ Blogs**: Personal blogs, company blogs
- **👤 Portfolios**: Personal or professional portfolios
- **🏢 Corporate Sites**: Company websites, microsites
- **📱 App Sites**: Mobile app landing pages

## 🛠 Development Commands

```bash
# Start development server
pnpm run dev

# Build for production  
pnpm run build

# Preview production build
pnpm run preview

# Type check
pnpm run check

# Lint and format
pnpm run lint
pnpm run format
```

## 🚢 Infrastructure & Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Domain name registered and manageable
- OpenTofu or Terraform installed

### Infrastructure Deployment
```bash
# Initialize infrastructure
pnpm run infra:init

# Preview changes
pnpm run infra:plan  

# Deploy infrastructure
pnpm run infra:apply

# Destroy infrastructure (when needed)
pnpm run infra:destroy
```

### Site Deployment
```bash
# Deploy site (build + upload + CDN invalidation)
pnpm run deploy

# Deploy with verbose logging
pnpm run deploy:verbose

# Dry run (preview without changes)
pnpm run deploy:dry
```

## ⚙️ Infrastructure Components

- **🪣 S3 Bucket**: Static website hosting with proper policies
- **🌐 CloudFront**: Global CDN with custom error pages and functions
- **🏷️ Route 53**: DNS management and domain routing
- **🔒 ACM**: Automatic SSL certificate management  
- **🛡️ IAM**: Minimal required permissions and OAC security
- **📊 Optional**: CloudWatch logging and monitoring

## 🎨 Customization

### Site Configuration
Edit `site/astro.config.mjs` for Astro-specific settings:
- Site URL and base path
- Build output directory
- Integrations and plugins

### Infrastructure Settings  
Modify `infra/variables.tf` to adjust:
- AWS region and availability zones
- S3 bucket configuration
- CloudFront distribution settings
- DNS and certificate options

### Styling
The template includes Tailwind CSS 4.0:
- Modern CSS-first configuration
- Custom design tokens
- Responsive utilities
- Dark mode support (optional)

## 📖 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [OpenTofu Documentation](https://opentofu.org/docs)
- [AWS Static Hosting Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

## 🔧 Troubleshooting

Common issues and solutions:

- **Domain not resolving**: Check Route 53 nameservers
- **SSL certificate pending**: Wait for DNS validation
- **Deploy fails**: Verify AWS credentials and permissions
- **Build errors**: Check Node.js version (18+ required)

## 🤝 Contributing

Improvements welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test changes thoroughly
4. Submit a pull request

## 📄 License

MIT License - Use freely for personal and commercial projects.