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
    host_name = var.domain_name  # Use actual domain, not S3 endpoint
    protocol  = "https"         # ✅ SECURE
  }
}

# S3 Bucket Server-Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "domain_bucket" {
  bucket = aws_s3_bucket.domain_bucket.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true  # Reduces costs by 99%
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "www_bucket" {
  bucket = aws_s3_bucket.www_bucket.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true  # Reduces costs by 99%
  }
}

# S3 Public Access Blocks
resource "aws_s3_bucket_public_access_block" "domain_bucket" {
  bucket = aws_s3_bucket.domain_bucket.id
  
  block_public_acls       = true
  block_public_policy     = true  
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "www_bucket" {
  bucket = aws_s3_bucket.www_bucket.id
  
  block_public_acls       = true
  block_public_policy     = true  
  ignore_public_acls      = true
  restrict_public_buckets = true
}

