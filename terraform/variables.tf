# Variáveis de configuração do projeto

variable "aws_region" {
  description = "Região da AWS"
  type        = string
  default     = "eu-east-1"
}

variable "lambda_runtime" {
  description = "Runtime das funções Lambda"
  type        = string
  default     = "nodejs18.x"
}

variable "lambda_functions" {
  description = "Lista de funções Lambda do projeto"
  type        = list(string)
  default     = ["getTasks", "createTask", "updateTask", "deleteTask"]
}
