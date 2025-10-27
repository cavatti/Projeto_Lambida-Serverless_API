terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.6.0"
}

provider "aws" {
  region = "us-west-2"
}

# Nome do bucket
variable "bucket_name" {
  default = "static-site-marcelo"
}

# Criação do bucket S3
resource "aws_s3_bucket" "static_site" {
  bucket = var.bucket_name
}

# Configuração de política para permitir acesso público (somente leitura)
resource "aws_s3_bucket_policy" "public_policy" {
  bucket = aws_s3_bucket.static_site.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject"]
        Resource  = "${aws_s3_bucket.static_site.arn}/*"
      }
    ]
  })
}

# Configuração de site estático
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.static_site.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# Saídas de informações úteis
output "website_url" {
  value = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "bucket_name" {
  value = aws_s3_bucket.static_site.bucket
}
