provider "aws" {
  region = "us-west-2"
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
  filename      = "${path.module}/../functions/${each.value}.zip"
  source_code_hash = filebase64sha256("${path.module}/../functions/${each.value}.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.tasks.name
    }
  }
}

# ========================
# API Gateway REST (apenas estrutura)
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

# Resource /tasks/{id}
resource "aws_api_gateway_resource" "task_id_resource" {
  rest_api_id = aws_api_gateway_rest_api.lambida_api.id
  parent_id   = aws_api_gateway_resource.tasks_resource.id
  path_part   = "{id}"
}
