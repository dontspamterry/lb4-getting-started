variable "environment" {
  default     = "dev"
  description = "Environment"
}

variable "aws_access_key" {
  description = "AWS access key"
}

variable "aws_region" {
  default     = "us-west-2"
  description = "AWS region to deploy to"
}

variable "db_port" {
  default     = 8008
  description = "DynamoDB port"
}

variable "self_serve_auth_db_read_cu" {
  default     = 5
  description = "Read capacity units"
}

variable "self_serve_auth_db_write_cu" {
  default     = 5
  description = "Write capacity units"
}

variable "self_serve_state_db_read_cu" {
  default     = 5
  description = "Read capacity units"
}

variable "self_serve_state_db_write_cu" {
  default     = 5
  description = "Write capacity units"
}

variable "self_serve_app_secrets_db_read_cu" {
  default     = 5
  description = "Read capacity units"
}

variable "self_serve_app_secrets_db_write_cu" {
  default     = 5
  description = "Write capacity units"
}
