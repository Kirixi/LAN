terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0"
    }
  }

  backend "remote" {
    organization = "Loop-Agile-Now" # org name from step 2.
    workspaces {
      name = "lan-terraform" # name for your app's state.
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

module "aws_s3_bucket" {
  source      = "./s3_bucket_module"
  bucket_name = "lan-bucket"
  bucket_tag  = "lan"
}


module "aws_s3_bucket_versioning" {
  source      = "./s3_bucket_versioned_module"
  bucket_name = "lan-kops-statefile"
  bucket_tag  = "lan"
  versioning  = "Enabled"
}

module "aws_route53_zone" {
  source   = "./route53_hosted_zone_module"
  hostname = "lan.tjonathan.com"
}
