provider "aws" {
  region = "eu-east-1"
}

# ========================
# IAM Role para Lambdas
# ========================
resource "aws_iam_role" "lambda_exec" {
  name = "lambida_lambda_exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = { Service = "lambda.amazonaws.com" },
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_dynamo" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

# ========================
# Tabela DynamoDB
# ========================
resource "aws_dynamodb_table" "tasks" {
  name         = "Tasks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

# ========================
# Funções Lambda
# ========================
locals {
  functions = ["getTasks", "createTask", "updateTask", "deleteTask"]
}

resource "aws_lambda_function" "lambida_functions" {
  for_each      = toset(local.functions)
  function_name = each.value
  runtime       = "nodejs18.x"
  handler       = "${each.value}.handler"
  role          = aws_iam_role.lambda_exec.arn
  filename      = "functions/${each.value}.zip"
  source_code_hash = filebase64sha256("functions/${each.value}.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.tasks.name
    }
  }
}

# ========================
# API Gateway REST
# ========================
resource "aws_api_gateway_rest_api" "lambida_api" {
  name        = "LambidaAPI"
  description = "API REST para Lambida Serverless"
}

# Root resource /tasks
resource "aws_api_gateway_resource" "tasks_resource" {
  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
  parent_id   = aws_api_gateway_rest_api.lambida_api.root_resource_id
  path_part   = "tasks"
}

# Métodos GET e POST em /tasks
resource "aws_api_gateway_method" "tasks_get" {
  rest_api_id   = aws_api_gateway_rest_api.lambida_api.id
  resource_id   = aws_api_gateway_resource.tasks_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "tasks_post" {
  rest_api_id   = aws_api_gateway_rest_api.lambida_api.id
  resource_id   = aws_api_gateway_resource.tasks_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# Resource /tasks/{id}
resource "aws_api_gateway_resource" "task_id_resource" {
  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
  parent_id   = aws_api_gateway_resource.tasks_resource.id
  path_part   = "{id}"
}

# Métodos PUT e DELETE em /tasks/{id}
resource "aws_api_gateway_method" "task_put" {
  rest_api_id   = aws_api_gateway_rest_api.lambida_api.id
  resource_id   = aws_api_gateway_resource.task_id_resource.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "task_delete" {
  rest_api_id   = aws_api_gateway_rest_api.lambida_api.id
  resource_id   = aws_api_gateway_resource.task_id_resource.id
  http_method   = "DELETE"
  authorization = "NONE"
}

# ========================
# Integrações Lambda
# ========================
resource "aws_api_gateway_integration" "get_tasks_integration" {
  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
  resource_id = aws_api_gateway_resource.tasks_resource.id
  http_method = aws_api_gateway_method.tasks_get.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri  = aws_lambda_function.lambida_functions["getTasks"].invoke_arn
}

resource "aws_api_gateway_integration" "create_tasks_integration" {
  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
  resource_id = aws_api_gateway_resource.tasks_resource.id
  http_method = aws_api_gateway_method.tasks_post.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri  = aws_lambda_function.lambida_functions["createTask"].invoke_arn
}

resource "aws_api_gateway_integration" "update_task_integration" {
  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
  resource_id = aws_api_gateway_resource.task_id_resource.id
  http_method = aws_api_gateway_method.task_put.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri  = aws_lambda_function.lambida_functions["updateTask"].invoke_arn
}

resource "aws_api_gateway_integration" "delete_task_integration" {
  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
  resource_id = aws_api_gateway_resource.task_id_resource.id
  http_method = aws_api_gateway_method.task_delete.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri  = aws_lambda_function.lambida_functions["deleteTask"].invoke_arn
}

# ========================
# Permissões Lambda para API Gateway
# ========================
resource "aws_lambda_permission" "api_invoke" {
  for_each = toset(local.functions)
  statement_id  = "AllowAPIGatewayInvoke-${each.value}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambida_functions[each.value].function_name
  principal     = "apigateway.amazonaws.com"
}

# ========================
# Deploy da API Gateway
# ========================
resource "aws_api_gateway_deployment" "lambida_deployment" {
  depends_on = [
    aws_api_gateway_integration.get_tasks_integration,
    aws_api_gateway_integration.create_tasks_integration,
    aws_api_gateway_integration.update_task_integration,
    aws_api_gateway_integration.delete_task_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
}

# Stage prod separado
resource "aws_api_gateway_stage" "prod" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.lambida_api.id
  deployment_id = aws_api_gateway_deployment.lambida_deployment.id
}
