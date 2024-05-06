terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_instance" "terra-test" {
  ami           = "ami-0ab3794db9457b60a"
  instance_type = "t2.micro"
  key_name      = "test-key"
  tags = {
    Name = "test"
  }
  security_groups = ["launch-wizard-2"]
}
