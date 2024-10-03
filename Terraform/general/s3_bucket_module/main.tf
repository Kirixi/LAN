resource "aws_s3_bucket" "s3-bucket-lan" {
  bucket = var.bucket_name

  tags = {
    Name        = var.bucket_tag
  }
}