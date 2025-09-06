# Main configuration file for plonk.sh infrastructure
# This file serves as the entry point for the Terraform/OpenTofu configuration

# All resources are defined in their respective files:
# - provider.tf: AWS provider configuration
# - backend.tf: Remote state configuration  
# - variables.tf: Input variables
# - s3.tf: S3 buckets for static hosting
# - cloudfront.tf: CloudFront distribution and functions
# - route53.tf: DNS and domain configuration
# - acm.tf: SSL certificate configuration
# - outputs.tf: Output values