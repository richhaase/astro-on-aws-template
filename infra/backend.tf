terraform {
  backend "s3" {
    bucket = "ydl-tf"
    key    = "stacks/plonk-site/terraform.tfstate"
    region = "us-west-2"
  }
}