variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application Name"
  type        = string
  default     = "meatkart"
}

variable "environment" {
  description = "Environment (dev, prod)"
  type        = string
  default     = "dev"
}

variable "database_url" {
  description = "Database URL for Prisma"
  type        = string
  sensitive   = true
  # Defaulting to empty for now, user must provide via *.tfvars or env vars
  default     = ""
}

variable "next_public_supabase_url" {
  description = "Supabase Project URL"
  type        = string
  default     = ""
}

variable "next_public_supabase_anon_key" {
  description = "Supabase Anon Key"
  type        = string
  sensitive   = true
  default     = ""
}
