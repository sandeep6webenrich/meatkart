# Deployment Guide (AWS + DevOps)

This guide explains how to deploy the **Meatkart** application to AWS using Terraform (Infrastructure as Code) and GitHub Actions (CI/CD).

## Architecture

- **AWS App Runner**: Fully managed service to run the containerized Next.js application. Handles auto-scaling, load balancing, and SSL.
- **Amazon ECR**: Registry to store the Docker images.
- **GitHub Actions**: Pipeline to build the Docker image and push it to ECR automatically on every commit to `main`.
- **Terraform**: Manages the AWS infrastructure.

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **AWS CLI**: Installed and configured with `aws configure`.
3.  **Terraform**: Installed on your machine.
4.  **GitHub Repository**: This code must be pushed to a GitHub repository.

## Step 1: Infrastructure Setup (Terraform)

1.  Navigate to the terraform directory:
    ```bash
    cd terraform
    ```

2.  Initialize Terraform:
    ```bash
    terraform init
    ```

3.  Create a `terraform.tfvars` file to store your sensitive variables (DO NOT commit this file):
    ```hcl
    # terraform/terraform.tfvars
    database_url                  = "postgresql://..."
    next_public_supabase_url      = "https://..."
    next_public_supabase_anon_key = "eyJ..."
    ```

4.  Apply the configuration (Phase 1 - ECR):
    *Note: The first time you run this, App Runner might fail if the ECR image doesn't exist yet. We will fix this in the next step.*
    ```bash
    terraform apply
    ```
    - Type `yes` to confirm.
    - If it fails creating `aws_apprunner_service`, don't worry. The `aws_ecr_repository` should have been created.

## Step 2: CI/CD Setup (GitHub Actions)

1.  Go to your GitHub Repository Settings -> **Secrets and variables** -> **Actions**.
2.  Add the following **Repository secrets**:
    - `AWS_ACCESS_KEY_ID`: Your AWS Access Key.
    - `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Key.
    
    *Note: Ensure the IAM user for these keys has permissions for ECR and App Runner.*

3.  Push your code to the `main` branch:
    ```bash
    git add .
    git commit -m "Setup AWS DevOps"
    git push origin main
    ```

4.  Go to the **Actions** tab in GitHub. You should see the "Deploy to AWS" workflow running.
    - This workflow will build the Docker image and push it to the ECR repository created in Step 1.

## Step 3: Finalize Deployment

1.  Once the GitHub Action completes successfully (Green checkmark), go back to your terminal in the `terraform` directory.

2.  Run Terraform again to create the App Runner service (now that the image exists):
    ```bash
    terraform apply
    ```

3.  Once finished, Terraform will output the `app_runner_service_url`.
    ```
    Outputs:
    app_runner_service_url = "https://.......awsapprunner.com"
    ```

4.  Visit that URL to see your application live!

## Future Deployments

- Every time you push changes to the `main` branch, GitHub Actions will build a new image and push it to ECR.
- AWS App Runner is configured with `auto_deployments_enabled = true`, so it will detect the new image and automatically update your application (zero downtime).

## Troubleshooting

- **Database Connection**: Ensure your Database (Supabase) allows connections from anywhere (0.0.0.0/0) or check AWS App Runner networking options if you need strict IP allowlisting (App Runner IPs change).
- **Environment Variables**: If you need to add more env vars, update `terraform/variables.tf` and `terraform/main.tf`, then run `terraform apply`.
