# 🧠 Projeto Lambida – Serverless Task API

Uma aplicação **Serverless completa** desenvolvida na AWS, utilizando **Lambda, API Gateway e DynamoDB**, com um **frontend simples em HTML + CSS + JavaScript**.  
O projeto implementa um CRUD de tarefas (“Tasks”) 100% funcional e hospedado na infraestrutura da AWS.

---

## 🚀 Arquitetura do Projeto

A arquitetura é baseada em **4 funções Lambda** conectadas a uma **API Gateway REST** e uma **tabela DynamoDB**.  
Cada Lambda representa uma operação CRUD no banco:

```
Frontend (index.html + app.js)
       │
       ▼
API Gateway (LambidaAPI)
 ├── POST   /tasks         → Lambda: createTask
 ├── GET    /tasks         → Lambda: getTasks
 ├── PUT    /tasks/{id}    → Lambda: updateTask
 └── DELETE /tasks/{id}    → Lambda: deleteTask
       │
       ▼
DynamoDB (Tabela: Tasks)
```

---

## 🧩 Tecnologias Utilizadas

| Camada | Serviço / Tecnologia | Descrição |
|--------|----------------------|------------|
| **Backend** | AWS Lambda | Funções serverless escritas em Node.js |
| **API** | AWS API Gateway | Roteamento e exposição HTTP das Lambdas |
| **Banco de Dados** | AWS DynamoDB | Armazenamento NoSQL de tarefas |
| **Infraestrutura como Código** | Terraform | Criação automatizada dos recursos AWS |
| **Frontend** | HTML, CSS, JavaScript | Interface leve e responsiva com integração direta via fetch() |

---

## ⚙️ Estrutura do Projeto

```
Projeto_Lambida–Serverless_API/
│
├── functions/                # Código-fonte das Lambdas
│   ├── createTask.js
│   ├── getTasks.js
│   ├── updateTask.js
│   └── deleteTask.js
│
├── terraform/                # Arquivos Terraform (infraestrutura)
│   └── main.tf
│
├── frontend/
│   ├── index.html            # Interface da aplicação
│   ├── style.css             # Estilo visual
│   └── app.js                # Lógica de integração com API Gateway
│
└── README.md
```

---

## ⚙️ Funcionalidades das Funções Lambda

### 🟩 **createTask.js**
Cria uma nova tarefa e armazena no DynamoDB.
```js
POST /tasks
{
  "title": "Aprender AWS",
  "description": "Estudar Lambda, API Gateway e DynamoDB"
}
```
✅ Retorna a task criada com ID gerado automaticamente (`uuid`).

---

### 🟨 **getTasks.js**
Lista todas as tarefas armazenadas.
```js
GET /tasks
```
✅ Retorna um array JSON com todas as tasks cadastradas.

---

### 🟦 **updateTask.js**
Atualiza título e descrição de uma task existente.
```js
PUT /tasks/{id}
{
  "title": "Aprender AWS (avançado)",
  "description": "Focar em integração API Gateway + Lambda"
}
```
✅ Retorna os dados atualizados.

---

### 🟥 **deleteTask.js**
Remove uma tarefa do DynamoDB.
```js
DELETE /tasks/{id}
```
✅ Retorna uma mensagem de sucesso após exclusão.

---

## 🌐 Endpoints Principais

| Método | Endpoint | Descrição | Lambda |
|:-------|:----------|:-----------|:--------|
| **POST** | `/tasks` | Cria uma nova task | `createTask` |
| **GET** | `/tasks` | Lista todas as tasks | `getTasks` |
| **PUT** | `/tasks/{id}` | Atualiza uma task | `updateTask` |
| **DELETE** | `/tasks/{id}` | Remove uma task | `deleteTask` |

---

## 🧱 Infraestrutura (Terraform)

Toda a infraestrutura foi automatizada com **Terraform**, contendo:
- Criação da tabela DynamoDB (`Tasks`)
- IAM Role para execução das Lambdas
- Criação e deploy automático das funções Lambda
- Configuração do API Gateway REST
- Permissões Lambda ↔ API Gateway

Para executar:
```bash
terraform init
terraform plan
terraform apply
```

---

## 💻 Frontend (Interface Web)

A interface está localizada em `frontend/index.html`, conectando-se diretamente à API.  
Ela permite criar, listar, editar e excluir tarefas em tempo real.  

Basta abrir o arquivo `index.html` no navegador localmente:
```
http://127.0.0.1:5500/frontend/index.html
```

---

## 🧠 Fluxo Completo da Aplicação

1. O usuário acessa o **index.html**
2. O JavaScript (`app.js`) faz as chamadas REST (GET, POST, PUT, DELETE)
3. As requisições passam pelo **API Gateway**
4. O **Lambda** processa a lógica e lê/escreve no **DynamoDB**
5. As respostas são retornadas ao navegador, atualizando o painel de tarefas

---

## 🔒 Permissões e Segurança

As Lambdas utilizam uma **IAM Role** com:
- `AWSLambdaBasicExecutionRole`  
- `AmazonDynamoDBFullAccess`

O **CORS** foi configurado para permitir chamadas do navegador:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

---

## 🧩 Próximos Passos (Evolução do Projeto)

- Adicionar autenticação (Cognito)
- Criar logs centralizados no CloudWatch
- Deploy automático com GitHub Actions
- Hospedar o frontend no S3 + CloudFront

---

## 👨‍💻 Autor

**Marcelo — AWS Cloud & Serverless Developer**  
📍 Baseado na Itália 🇮🇹  
💼 Projeto criado para estudos e portfólio AWS  

---

> 💬 “Infraestrutura como código, backend sem servidor e uma UI limpa — o poder da AWS em um só projeto.”
