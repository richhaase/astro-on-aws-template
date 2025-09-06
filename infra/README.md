# {{PROJECT_TITLE}} Infrastructure

This directory contains the OpenTofu/Terraform infrastructure as code for the {{PROJECT_TITLE}} website.

## Architecture

- **S3**: Static website hosting for {{DOMAIN_NAME}} and www.{{DOMAIN_NAME}}
- **CloudFront**: CDN with custom domain, SSL, and URL rewriting for Astro
- **Route 53**: DNS management and domain registration
- **ACM**: SSL certificate with DNS validation
- **IAM**: Minimal permissions for deployment

## Quick Start

1. **Prerequisites**
   - AWS CLI configured with appropriate credentials
   - OpenTofu installed (or Terraform)
   - Domain `{{DOMAIN_NAME}}` already registered

2. **Initialize**
   ```bash
   cd infra/
   tofu init
   ```

3. **Plan**
   ```bash
   tofu plan
   ```

4. **Apply**
   ```bash
   tofu apply
   ```

## Configuration

### Variables
- `domain_name`: The domain name (e.g., "example.com")
- `common_tags`: Tags applied to all resources

### Backend
- State stored in S3 bucket: `ydl-tf`
- State key: `stacks/{{PROJECT_NAME}}/terraform.tfstate`
- Region: `us-west-2`

## Resources Created

- `aws_s3_bucket.domain_bucket`: Main static site bucket
- `aws_s3_bucket.www_bucket`: WWW redirect bucket
- `aws_cloudfront_distribution.s3_distribution`: CDN distribution
- `aws_cloudfront_function.url_rewrite`: URL rewriting for Astro
- `aws_route53_zone.main`: DNS hosted zone
- `aws_route53_record.*`: DNS A records for domain and www
- `aws_acm_certificate.main`: SSL certificate
- `aws_route53domains_registered_domain.main`: Domain registration

## Outputs

- `website_bucket_url`: S3 bucket URL
- `cloudfront_distribution`: CloudFront distribution ID
- `cloudfront_distribution_url`: CloudFront URL
- `website_url`: Final website URL (https://{{DOMAIN_NAME}})
- `route53_zone_id`: Route 53 zone ID

## Notes

- SSL certificate is created in `us-east-1` (required for CloudFront)
- CloudFront function handles URL rewriting for Astro static builds
- Both apex and www domains redirect to HTTPS