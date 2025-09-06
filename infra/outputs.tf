output "website_bucket_url" {
  value = aws_s3_bucket.domain_bucket.bucket_regional_domain_name
}

output "cloudfront_distribution" {
  value = aws_cloudfront_distribution.s3_distribution.id
}

output "cloudfront_distribution_url" {
  value = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"
}

output "website_url" {
  value = "https://${var.domain_name}"
}

output "route53_zone_id" {
  value = aws_route53_zone.main.zone_id
}