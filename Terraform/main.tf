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
  key_name      = "docker-test"
  tags = {
    Name = "docker-test-1"
  }
  security_groups = ["launch-wizard-2"]
  user_data       = <<-EOF
  #!/bin/bash
  sudo yum install docker -y
  sudo service docker start
  sudo chkconfig docker on
  sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  EOF 
}
