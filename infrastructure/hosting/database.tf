resource "aws_vpc" "dev_teams_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "devTeams VPC"
  }
}

resource "aws_subnet" "subnet_devteams_a" {
  vpc_id            = aws_vpc.dev_teams_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-west-1a"
}

resource "aws_subnet" "subnet_devteams_b" {
  vpc_id            = aws_vpc.dev_teams_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-west-1b"
}

# create security group for the database
resource "aws_security_group" "devteams_security_group" {
  name        = "devTeams database security group"
  description = "allow SQL Server access on port 1433"
  vpc_id      = aws_vpc.dev_teams_vpc.id

  ingress {
    from_port   = 1433
    to_port     = 1433
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "devTeams_security_group"
  }
}

# create the subnet group for the RDS instance
resource "aws_db_subnet_group" "devteams_subnet_group" {
  name       = "devteamssubnetgroup"
  subnet_ids = [aws_subnet.subnet_devteams_a.id, aws_subnet.subnet_devteams_b.id]

  tags = {
    Name = "devTeams_subnet_group"
  }
}

# create the RDS instance
resource "aws_db_instance" "devteams_db_instance" {
  engine                 = "sqlserver-ex"
  multi_az               = false
  identifier             = var.db_name
  username               = var.db_username #use this to connect to db with SQL Server 
  password               = var.db_password #use this to connect to db with SQL Server 
  instance_class         = "db.t3.small"
  allocated_storage      = 20
  publicly_accessible    = false
  db_subnet_group_name   = aws_db_subnet_group.devteams_subnet_group.name
  vpc_security_group_ids = [aws_security_group.devteams_security_group.id]
  availability_zone      = "eu-west-1a" # or specify the desired AZ here
  skip_final_snapshot    = true
}
