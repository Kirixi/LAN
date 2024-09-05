resource "aws_s3_bucket" "s3-bucket-kops-statefile" {
  bucket = var.bucket_name

  tags = {
    Name = var.bucket_tag
  }
}

resource "aws_s3_bucket_versioning" "s3-bucket-kops-statefile" {
  bucket = var.bucket_name
  versioning_configuration {
    status = var.versioning
  }
}
