resource "aws_acm_certificate" "main" {
  provider = aws.us-east-1

  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = ["www.${var.domain_name}"]

  lifecycle {
    create_before_destroy = true
  }

  tags = var.common_tags
}

resource "aws_acm_certificate_validation" "cert_validation" {
  provider = aws.us-east-1

  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}