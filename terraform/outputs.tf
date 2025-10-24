# Outputs úteis

output "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB"
  value       = aws_dynamodb_table.tasks.name
}

output "api_gateway_invoke_url" {
  description = "URL base para acessar a API via frontend"
  value       = aws_api_gateway_deployment.lambida_deployment.invoke_url
}
