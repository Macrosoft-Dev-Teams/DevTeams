db_name = "dev-teams-db"

db_username = "maindbuser"

db_password = "password123"

vpc_name = "dev-teams-vpc"

vpc_cidr_block = "23.0.0.0/16"

vpc_public_subnet_availability_zones = ["eu-west-1a", "eu-west-1b"]

region = "eu-west-1"

map_public_ip_on_launch = true

enable_dns_hostnames = true

common_tags = {
  owner         = "farisani.ratshikombo@bbd.co.za",
  created-using = "terraform",
}