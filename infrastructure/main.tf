# Create a Cognito User Pool
resource "aws_cognito_user_pool" "DevTeams_user_pool" {
  name = "DevTeams_user_pool"
  mfa_configuration        = "ON"
  username_attributes = [ "email" ]
  auto_verified_attributes = ["email"]

  schema {
    attribute_data_type      = "String"
    name                     = "email"
    required                 = true
    mutable                  = false
    developer_only_attribute = false
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  username_configuration {
    case_sensitive = false
  }

  software_token_mfa_configuration {
    enabled = true
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

# Create a Cognito User Pool Client
resource "aws_cognito_user_pool_client" "DevTeams_user_pool_client" {
  name         = "DevTeams_user_pool_client"
  user_pool_id = aws_cognito_user_pool.DevTeams_user_pool.id
  supported_identity_providers = [ "COGNITO" ]
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  prevent_user_existence_errors = "LEGACY"
  refresh_token_validity = 1
  access_token_validity = 1
  id_token_validity = 1
  token_validity_units {
    access_token = "hours"
    id_token = "hours"
    refresh_token = "hours"
  }

  callback_urls = ["http://localhost:4200"]
  # logout_urls   = ["https://example.com/logout"]
}

# Create a Cognito User Pool Domain (for hosted UI)
resource "aws_cognito_user_pool_domain" "DevTeams_user_pool_domain" {
  domain       = "DevTeams-user-pool-domain"
  user_pool_id = aws_cognito_user_pool.DevTeams_user_pool.id
}