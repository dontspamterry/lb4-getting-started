terraform {
  backend "local" {

  }
}

provider "aws" {
  region = "${var.aws_region}"
  version = "~> 0.1"
  /*
  profile = "fake"
  */
  skip_credentials_validation = true
  access_key = "${var.aws_access_key}"
  secret_key = "FakeSecretKey"
  endpoints {
    dynamodb = "http://localhost:${var.db_port}"
  }
}

resource "aws_dynamodb_table" "ccp_auth" {
  name           = "ccp_self_service_auth_${var.environment}"
  read_capacity  = "${var.self_serve_auth_db_read_cu}"
  write_capacity = "${var.self_serve_auth_db_write_cu}"
  hash_key       = "token"

  attribute {
    name = "token"
    type = "S"
  }

  attribute {
    name = "ntid"
    type = "S"
  }


  ttl {
    attribute_name = "timeToExist"
    enabled        = false
  }

  global_secondary_index {
    hash_key        = "ntid"
    name            = "ntidIndex"
    projection_type = "ALL"
    read_capacity = "${var.self_serve_auth_db_read_cu}"
    write_capacity = "${var.self_serve_auth_db_write_cu}"
  }

  /*
  tags {
    Name         = "Self Serve User State DB"
    Environment  = "local'"
  }
  */
}

resource "aws_dynamodb_table" "ccp_state" {
  name           = "ccp_self_service_state_${var.environment}"
  read_capacity  = "${var.self_serve_state_db_read_cu}"
  write_capacity = "${var.self_serve_state_db_write_cu}"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "timeToExist"
    enabled        = false
  }

  /*
  tags {
    Name         = "Self Serve User State DB"
    Environment  = "local'"
  }
  */
}

resource "aws_dynamodb_table" "ccp_app_secret" {
  name           = "ccp_self_service_app_secrets_${var.environment}"
  read_capacity  = "${var.self_serve_app_secrets_db_read_cu}"
  write_capacity = "${var.self_serve_app_secrets_db_write_cu}"
  hash_key       = "serviceId"

  attribute {
    name = "serviceId"
    type = "S"
  }

  /*
  tags {
    Name         = "Self Serve User State DB"
    Environment  = "local'"
  }
  */
}
