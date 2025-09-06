terraform {
  backend "s3" {
    bucket = "{{PROJECT_NAME}}-terraform-state"
    key    = "stacks/{{PROJECT_NAME}}/terraform.tfstate"
    region = "us-west-2"
  }
}