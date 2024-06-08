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
  source = "./s3_bucket_module"
  bucket_name = "lan-bucket"
  bucket_tag = "lan"
}
# resource "aws_instance" "terra-test" {
#   ami           = "ami-0ab3794db9457b60a"
#   instance_type = "t2.micro"
#   key_name      = "CICD-pipeline"
#   tags = {
#     Name = "Docker-compose-host"
#   }
#   security_groups = ["launch-wizard-2"]
#   user_data       = <<-EOF
#   #!/bin/bash
#   sudo yum install docker -y
#   sudo service docker start
#   sudo chkconfig docker on
#   sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
#   sudo chmod +x /usr/local/bin/docker-compose
#   EOF 
# }
