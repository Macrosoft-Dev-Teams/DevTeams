# State bucket
terraform {
  backend "s3" {
    bucket  = "devteamsbucket"
    key     = "devteamsbucket/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}