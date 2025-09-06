resource "aws_s3_bucket" "domain_bucket" {
  bucket = var.domain_name

  tags = {
    type = "static site"
  }
}

resource "aws_s3_bucket" "www_bucket" {
  bucket = "www.${var.domain_name}"

  tags = {
    type = "static site"
  }
}

resource "aws_s3_bucket_policy" "domain_bucket" {
  bucket = aws_s3_bucket.domain_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "s3:GetObject"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Resource = "${aws_s3_bucket.domain_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
          }
        }
      },
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "domain_bucket" {
  bucket = aws_s3_bucket.domain_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

resource "aws_s3_bucket_website_configuration" "www_bucket" {
  bucket = aws_s3_bucket.www_bucket.id

  redirect_all_requests_to {
    host_name = aws_s3_bucket.domain_bucket.bucket_regional_domain_name
    protocol  = "http"
  }
}