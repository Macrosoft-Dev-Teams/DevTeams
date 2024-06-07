# Service role creation for elastic beanstalk
data "aws_iam_policy_document" "assume_role_frontend" {
  statement {
    effect = "Allow"

    principals {
      type = "Service"
      identifiers = [
        "ec2.amazonaws.com",
        "elasticbeanstalk.amazonaws.com",
        "ecs.amazonaws.com",
        "cloudformation.amazonaws.com"
      ]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "aws_ebs_service_frontend" {
  name               = "aws_ebs_service_frontend"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = var.common_tags
}

# Attaching policies to role
resource "aws_iam_role_policy_attachment" "AWSElasticBeanstalkWebTierFrontEnd" {
  role       = aws_iam_role.aws_ebs_service_frontend.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "AWSElasticBeanstalkWorkerTierFrontEnd" {
  role       = aws_iam_role.aws_ebs_service_frontend.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

resource "aws_iam_role_policy_attachment" "AWSElasticBeanstalkMulticontainerDockerFrontEnd" {
  role       = aws_iam_role.aws_ebs_service_frontend.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

resource "aws_iam_role_policy_attachment" "AutoScalingFullAccessFrontEnd" {
  role       = aws_iam_role.aws_ebs_service_frontend.name
  policy_arn = "arn:aws:iam::aws:policy/AutoScalingFullAccess"
}

resource "aws_iam_instance_profile" "aws_ebs_profile_frontend" {
  name = "aws-elasticbeanstalk-ec2-role_frontend"

  role = aws_iam_role.aws_ebs_service_frontend.name
}

# Environment and application setup
module "key_pair_front_end" {
  source             = "terraform-aws-modules/key-pair/aws"
  key_name           = "ebs-ec2-key-frontend"
  create_private_key = true
}

resource "aws_elastic_beanstalk_application" "dev_teams_frontend_app" {
  name        = "dev-teams-frontend-app"
  description = "Dev Teams Frontend App"
  tags        = var.common_tags
}

resource "aws_elastic_beanstalk_environment" "dev_teams_app_frontend_env" {
  name                = "dev-teams-frontend-app-env"
  application         = aws_elastic_beanstalk_application.dev_teams_frontend_app.name
  solution_stack_name = "64bit Amazon Linux 2023 v6.1.3 running Node.js 20"
  cname_prefix        = "dev-teams-frontend"
  tags                = var.common_tags

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.default_vpc.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.public_subnets[*].id)
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t2.micro,t3.micro"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.aws_ebs_service_frontend.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "EC2KeyName"
    value     = module.key_pair.key_pair_name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.aws_ebs_profile_frontend.name
  }
}

output "url_frontend" {
  value = aws_elastic_beanstalk_environment.dev_teams_app_env.endpoint_url
}
