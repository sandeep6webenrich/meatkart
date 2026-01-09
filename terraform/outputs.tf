output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = aws_ecr_repository.app.repository_url
}

output "app_runner_service_url" {
  description = "The URL of the App Runner service"
  value       = aws_apprunner_service.app.service_url
}
