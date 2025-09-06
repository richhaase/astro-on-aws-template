# Plonk CLI Landing Page Architecture Plan

**Date:** 2025-09-03  
**Status:** Phase 1 Complete, Phase 2 Complete, Phase 3 Complete, Phase 4 Quality Enhancements Complete  
**Decision:** Node.js orchestration with Astro + S3 + CloudFront + Route 53

## Goal & Constraints

- **Primary Goal**: Set up Astro static site with AWS S3 + CloudFront + Route 53 for plonk.sh CLI tool landing page
- **Structure**: IaC (OpenTofu) in `infra/`, Astro site in `site/`, Node.js orchestration scripts
- **Domain**: plonk.sh (already owned)
- **Constraints**: Monorepo structure, AWS-only hosting, static site generation, infrastructure as code
- **Scope**: Landing page for CLI tool, not the CLI tool itself

## Current State

- `/` - Monorepo with basic structure and .gitignore
- `/infra/` - **✅ COMPLETE** OpenTofu infrastructure code
  - All .tf files: variables, provider, backend, s3, cloudfront, route53, acm, outputs
  - terraform.tfvars with plonk.sh configuration
  - README.md with setup instructions
- `/site/` - **✅ COMPLETE** Astro site with honest landing page
  - Modern Astro + Tailwind CSS setup with responsive design
  - Hero section with accurate Plonk description and terminal preview
  - Features section highlighting real capabilities (12 package managers, filesystem as truth)
  - Installation section with correct Homebrew tap and Go install methods
  - All content based on actual ../plonk/README.md documentation
- `/CLAUDE.md` - Project context and workflow directives
- `/.claude/commands/monkey/` - Claude Code monkey commands
- **✅ COMPLETE** Node.js orchestration and deployment automation
  - Root package.json with npm workspaces and deployment scripts
  - AWS SDK integration for S3 upload and CloudFront invalidation
  - Professional CLI tools with comprehensive error handling
  - Environment validation and configuration management
  - Health check utilities and monitoring capabilities
- **✅ COMPLETE** Phase 4 site quality enhancements (completed while waiting for domain transfer)
  - Astro sitemap integration with automated XML generation 
  - SEO-optimized layout with comprehensive meta tags and structured data
  - Accessibility compliance with skip links, ARIA attributes, and semantic landmarks
  - Production-ready robots.txt with proper crawling directives
  - All enhancements tested and validated through build process

## Options & Trade-offs

### Option A — Node.js script orchestrator ⭐ (Selected)
- JavaScript-based, integrates perfectly with Astro tooling
- **Why it fits**: Shares language ecosystem with Astro, can use AWS SDK, better error handling
- **Complexity**: Medium, **Blast radius**: Medium, **Performance**: Good (shared runtime)
- **Migration cost**: None (Node.js already required for Astro)

### Option B — justfile orchestrator (Rejected)
- Modern alternative to Make with clean syntax
- **Why rejected**: Additional dependency, shell script complexity, ecosystem mismatch
- **Complexity**: Low, **Blast radius**: Small, **Performance**: Fast
- **Migration cost**: New tool dependency + learning curve

### Option C — Makefile orchestrator (Rejected)
- Universal, simple approach
- **Why rejected**: User explicitly stated "never make, it's horrible"
- **Complexity**: Low, **Blast radius**: Small, **Performance**: Fast
- **Migration cost**: None

**Final Decision**: Node.js orchestration provides the best developer experience and maintainability for this Astro-based project.

## Design Sketch (recommended)

### Interfaces/contracts:
- `package.json` - Root workspace with deployment scripts
- `scripts/deploy.js` - Main deployment orchestrator using AWS SDK
- `scripts/infra.js` - OpenTofu wrapper with error handling
- `infra/main.tf` - OpenTofu root module with S3, CloudFront, Route 53, IAM
- `site/package.json` - Astro project with build scripts
- `site/astro.config.mjs` - Astro configuration for static S3 build

### Data/schema:
- **S3 bucket** for static hosting with public read access policies
- **CloudFront distribution** with custom domain, SSL certificate, and caching rules
- **Route 53 hosted zone** with A/AAAA records pointing to CloudFront
- **IAM roles** for deployment permissions and least-privilege access
- **ACM certificate** for SSL/TLS on plonk.sh domain

### Error & boundaries:
- Graceful handling of AWS API errors with exponential backoff retry logic
- Validation of required environment variables (AWS credentials, region, domain)
- Build failure detection with detailed error reporting and rollback capability
- Health checks for deployed site with timeout handling
- OpenTofu state management and locking

### Compatibility:
- No breaking changes (greenfield project)
- AWS SDK v3 for Node.js compatibility
- Node.js 18+ LTS for Astro and modern JavaScript features
- OpenTofu 1.6+ compatibility with AWS provider 5.x

## Implementation Plan (≤7 steps)

### 1. Initialize Astro site in `site/` ✅ **COMPLETED**
- ✅ Run `npm create astro@latest site/ -- --template minimal`
- ✅ Configure `astro.config.mjs` for static build output
- ✅ Create landing page components with CLI tool focus (Hero, Features, Installation)
- ✅ Setup Tailwind CSS 4.x for modern styling
- ✅ Add responsive design and mobile optimization
- ✅ Fix critical routing issue (redirected to /1/ - resolved by simplifying config)
- ✅ Create honest content based on actual Plonk documentation

### 2. Setup OpenTofu infrastructure in `infra/` ✅ **COMPLETED**
- ✅ Create `main.tf` with S3 bucket, CloudFront, Route 53 resources
- ✅ Define variables for domain name, AWS region, environment  
- ✅ Setup remote state backend (S3 + DynamoDB for locking)
- ✅ Add IAM policies for deployment user with minimal permissions
- ✅ Configure SSL certificate via ACM with DNS validation
- ✅ Create comprehensive README.md with setup instructions
- ✅ Add .gitignore for Terraform/OpenTofu files

### 3. Create Node.js orchestration in root ✅ **COMPLETED**
- ✅ Initialize root `package.json` as workspace with proper npm workspaces
- ✅ Create `scripts/deploy.js` using AWS SDK v3 for S3 upload and CloudFront invalidation
- ✅ Create `scripts/infra.js` wrapper for OpenTofu commands with terraform fallback
- ✅ Add comprehensive configuration management with environment validation
- ✅ Implement professional logging with chalk, ora spinners, and progress indicators
- ✅ Add health check script for endpoint monitoring and verification
- ✅ Create .env.example and comprehensive README documentation

### 4. Implement site build pipeline ✅ **PARTIALLY COMPLETED**
- ✅ Configure Astro build output directory to match S3 requirements (working with format: directory)
- ✅ Add sitemap.xml and robots.txt generation (Astro sitemap integration installed and working)
- ✅ Setup proper MIME types and cache headers for static assets (implemented in deploy.js)
- ⏳ Add build optimization (minification, compression, asset hashing) - Astro handles basic optimization
- ⏳ Implement build artifact validation - basic validation in deploy.js

### 5. Add deployment automation
- AWS CLI fallback commands for regions where SDK has issues
- CloudFront cache invalidation with wildcard patterns
- Health check validation post-deployment
- Deployment rollback capability with previous version restore
- Integration with existing CI/CD systems (GitHub Actions ready)

### 6. Setup environment configuration
- Environment variables for AWS region, domain, bucket names
- Configuration validation with clear error messages
- Development vs production environment separation  
- Secrets management (AWS credentials, etc.)
- Default values with override capability

### 7. Documentation and testing
- Comprehensive README with setup and deployment instructions
- Architecture documentation with diagrams
- Troubleshooting guide for common deployment issues
- Local development setup documentation
- Deployment verification checklist

## Test Plan

### Unit Tests:
- `site/src/components/*.test.js` - Astro component unit tests using Vitest
- `scripts/*.test.js` - Deployment script unit tests with mocked AWS SDK
- `infra/*.tf` - Terraform validate, plan, and security scanning

### Integration Tests:
- Deploy complete stack to staging environment (staging.plonk.sh)
- End-to-end deployment pipeline verification
- Cross-browser testing on landing page
- SSL certificate validation and security headers
- Performance testing with realistic network conditions

### Regression Tests:
- CloudFront caching behavior validation
- Mobile responsiveness across devices
- ✅ SEO optimization verification (meta tags, structured data) - comprehensive meta tags, Open Graph, Twitter Cards, and JSON-LD structured data implemented
- ✅ Accessibility compliance (WCAG 2.1 AA) - skip links, proper heading hierarchy, aria-hidden for decorative SVGs, main content landmarks
- Previous deployment rollback scenarios

### Performance Tests:
- Lighthouse scores >90 for all categories (Performance, Accessibility, Best Practices, SEO)
- Page load time <2s on 3G connection
- CloudFront cache hit ratio >95%
- Core Web Vitals compliance (LCP, FID, CLS)

## Observability & Rollout Strategy

### Monitoring:
- **CloudWatch metrics**: S3 requests, CloudFront cache performance, error rates
- **Route 53 health checks**: Endpoint availability monitoring for plonk.sh
- **Build pipeline observability**: Deployment success/failure rates and timing
- **Real User Monitoring**: Page performance from actual users
- **Cost monitoring**: AWS resource usage and billing alerts

### Rollout Strategy:
1. **Infrastructure first**: Deploy AWS resources without exposing to production traffic
2. **Staging deployment**: Deploy site to staging.plonk.sh for validation
3. **DNS cutover**: Switch DNS to production after full validation
4. **Gradual TTL reduction**: Reduce DNS TTL for faster rollback capability if needed
5. **Monitoring phase**: Watch metrics for 24-48 hours before declaring success

## Documentation & Communications

### Files to create/update:
- `README.md` - Project overview, quick start, deployment instructions
- `docs/ARCHITECTURE.md` - Technical architecture and design decisions  
- `docs/DEPLOYMENT.md` - Step-by-step deployment guide with troubleshooting
- `infra/README.md` - Infrastructure components and variable documentation
- `site/README.md` - Astro development guide and component documentation
- `CHANGELOG.md` - Version history and breaking changes

### Decision Log Entry:
*"Implemented Astro + S3 + CloudFront architecture with OpenTofu IaC and Node.js orchestration for plonk.sh CLI tool landing page. Chose Node.js over justfile/Make for better ecosystem integration and error handling capabilities."*

## Risk Analysis & Mitigations

### High-Risk Items:
1. **AWS quota limits** for new resources  
   - *Mitigation*: Pre-validate service quotas, choose proven regions (us-east-1)
   - *Detection*: Quota exceeded errors in deployment logs

2. **DNS propagation delays** affecting launch timing  
   - *Mitigation*: Staged rollout with health checks, communicate expected delays
   - *Detection*: Route 53 health check failures, user reports

3. **SSL certificate provisioning failures**  
   - *Mitigation*: Manual certificate import option, staging environment testing
   - *Detection*: ACM certificate validation timeouts

4. **OpenTofu state corruption** leading to infrastructure drift  
   - *Mitigation*: Remote state with locking, regular state backups
   - *Detection*: State validation in CI pipeline

### Medium-Risk Items:
- Build pipeline complexity causing deployment delays
- CloudFront cache invalidation costs with frequent deployments  
- Node.js dependency management across environments

### Detection Signals:
- Failed health checks on plonk.sh returning 4xx/5xx status codes
- CloudFront error rate spikes above 1%
- Build failure notifications from deployment scripts
- AWS billing alerts for unexpected resource usage

## Backout Plan

### Emergency Rollback Steps (< 5 minutes):
1. **Immediate DNS revert**: Update Route 53 A record to previous working IP
2. **CloudFront disable**: Disable distribution to stop serving broken content
3. **Verification**: Confirm plonk.sh accessibility within DNS TTL window

### Full Infrastructure Rollback (< 30 minutes):
1. **Preserve current state**: `tofu state pull > backup-$(date).tfstate`
2. **Revert infrastructure**: `npm run infra:destroy` to remove all AWS resources
3. **Code rollback**: `git revert <deployment-commit>` 
4. **State cleanup**: Remove Terraform state if infrastructure was destroyed
5. **Verification**: Confirm no AWS resources remain and billing stops

### Rollback Testing:
- Monthly rollback drills on staging environment
- Automated rollback capability in deployment scripts
- Documentation of rollback procedures with screenshots

## Acceptance Checklist

### Technical Requirements:
- [ ] `https://plonk.sh` loads successfully with valid SSL certificate (no browser warnings)
- [ ] Lighthouse performance score >90 across all categories
- [ ] `npm run deploy:all` completes without errors in <5 minutes
- [ ] Mobile responsiveness validated on iOS Safari, Android Chrome, desktop Chrome/Firefox
- [ ] CloudFront caching working correctly (verify via response headers and HIT/MISS status)

### Content & Design Requirements:
- [ ] Landing page content matches approved design mockups
- [ ] CLI installation instructions are accurate and tested
- [ ] All internal links work correctly (no 404s)
- [ ] SEO meta tags and OpenGraph tags properly configured
- [ ] Accessibility compliance verified with automated tools

### Infrastructure Requirements:
- [ ] All AWS resources properly tagged with project, environment, owner
- [ ] IAM permissions follow least-privilege principle (security review)
- [ ] OpenTofu state is stored remotely with proper locking
- [ ] Cost monitoring alerts configured and tested
- [ ] Backup and disaster recovery procedures documented

### Operational Requirements:
- [ ] Documentation complete and reviewed by team
- [ ] Rollback procedure tested successfully on staging
- [ ] Monitoring and alerting properly configured
- [ ] Team trained on deployment and troubleshooting procedures
- [ ] Post-deployment support plan established

---

**Next Steps**: 
1. ✅ Review and approve this plan
2. ✅ Complete Phase 1 (Astro site implementation)
3. ✅ Complete Phase 3 (Node.js orchestration and deployment automation)
4. **READY**: Domain transfer to Route 53 (see docs/plans/aws-domain-transfer.md)
5. **READY**: Infrastructure provisioning with `npm run infra:apply`
6. **READY**: First production deployment with `npm run deploy:all`

**Estimated Timeline**: 5-7 business days for full implementation and testing