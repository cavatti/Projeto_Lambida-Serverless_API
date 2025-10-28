
# 🧠 Projeto Lambida – Serverless API

Uma aplicação **Serverless completa** construída com **AWS Lambda**, **API Gateway**, **DynamoDB** e **Terraform**, com frontend em HTML/CSS/JS hospedado no **S3**.

---

## 🚀 Visão Geral

Este projeto implementa uma **API RESTful** para gerenciamento de tarefas (**Tasks**) usando arquitetura totalmente **serverless**.

- **AWS Lambda** → processa as requisições (GET, POST, PUT, DELETE)
- **API Gateway** → expõe as rotas da API
- **DynamoDB** → armazena as tasks
- **S3 + Frontend (HTML/JS)** → interface visual para o usuário
- **Terraform** → provisionamento da infraestrutura

---

## 🧱 Estrutura de Pastas

```
Projeto_Lambida–Serverless_API/
├── terraform/              # Código IaC (main.tf, variables.tf, etc)
├── functions/              # Lambdas (create, get, update, delete)
├── frontend/               # HTML, CSS e JS
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

---

## ⚙️ Fluxo da Aplicação

1. O usuário acessa o **frontend** (HTML + JS).
2. O frontend envia requisições HTTP (GET, POST, PUT, DELETE) para o **API Gateway**.
3. O **API Gateway** invoca as funções **Lambda**.
4. As **Lambdas** interagem com o **DynamoDB**.
5. As respostas são retornadas ao navegador.

---

## 🔧 Funções Lambda

| Função | Descrição | Método HTTP |
|:-------|:-----------|:-------------|
| `createTask` | Cria uma nova task com título e descrição | POST |
| `getTasks` | Lista todas as tasks existentes | GET |
| `updateTask` | Atualiza título e descrição de uma task existente | PUT |
| `deleteTask` | Exclui uma task pelo ID | DELETE |

Todas as funções são **Node.js 18.x**, utilizam `aws-sdk` e possuem cabeçalhos **CORS** configurados.

---

## 🔒 Permissões, Segurança e Controle de Tráfego

As funções **Lambda** utilizam uma **IAM Role** dedicada, com políticas seguras e específicas:
- `AWSLambdaBasicExecutionRole` → permite logs no **CloudWatch**
- `AmazonDynamoDBFullAccess` → acesso à tabela **Tasks**

O **CORS** foi configurado em todas as funções e no **API Gateway**, permitindo acesso direto do navegador:
```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

---

### ⚡ Rate Limiting (Controle de Requisições)

Para proteger a API contra abuso, picos de tráfego e consumo excessivo, foi implementado o **Rate Limit no API Gateway**.  
Essa medida garante estabilidade do sistema e evita custos inesperados em ambientes públicos.

#### 🧠 Por que isso é importante:
- 🔒 **Segurança:** previne ataques de negação de serviço (DDoS e flood de requisições).  
- 💸 **Custos:** evita que usuários gerem milhões de invocações Lambda.  
- ⚙️ **Performance:** mantém a API estável, mesmo sob carga alta.  

#### ⚙️ Configuração aplicada:
- Criado um **Usage Plan** (Plano de Consumo) chamado `LambidaBasicPlan`.
- Criada uma **API Key** (`LambidaClientKey`) obrigatória para o uso da API.
- Associado o plano ao **Stage** `prod` da API.
- Definidos limites de consumo:
  ```yaml
  Rate limit: 5 requests/segundo
  Burst limit: 10 requisições simultâneas
  ```

#### 🧾 Exemplo de requisição autenticada:
```bash
curl -X GET "https://s7t9osqh58.execute-api.us-west-2.amazonaws.com/prod/tasks"   -H "x-api-key: SUA_API_KEY_AQUI"
```

> ⚠️ Requisições sem o cabeçalho `x-api-key` receberão `403 Forbidden`.

---

### 🔐 Níveis de Acesso (opcional)
Você pode criar múltiplos planos com diferentes limites de requisições:

| Plano | Rate Limit | Burst | API Key |
|:------|:------------|:------|:---------|
| **Free Tier** | 2/s | 5 | Obrigatória |
| **Pro Tier** | 20/s | 50 | Obrigatória |
| **Admin** | 100/s | 200 | Obrigatória |

> 💬 “Controlar requisições é tão importante quanto proteger dados.  
> Uma API estável é resultado direto de boas políticas de tráfego.”

---

## 📈 Próximos Passos (Evolução do Projeto)

1️⃣ **Adicionar autenticação (Cognito)**  
2️⃣ **Criar logs centralizados (CloudWatch Logs Insights)**  
3️⃣ **Deploy automático (GitHub Actions)**  
4️⃣ **Hospedar frontend (S3 + CloudFront)**  

---

## 💡 Créditos

Desenvolvido por **Marcelo**, com foco em arquitetura **Serverless AWS** e infraestrutura como código (**Terraform**).  
> “Aprender construindo é o melhor jeito de dominar Cloud.” ☁️

---
