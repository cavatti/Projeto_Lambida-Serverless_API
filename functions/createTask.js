const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const TABLE_NAME = "Tasks";

exports.handler = async (event) => {
    try {
        // Garante que o body é um JSON válido
        const body = JSON.parse(event.body || "{}");
        const { title, description } = body;

        if (!title || !description) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ message: "Título e descrição são obrigatórios." })
            };
        }

        // Cria a nova task com UUID
        const task = { id: uuidv4(), title, description };
        await dynamo.put({ TableName: TABLE_NAME, Item: task }).promise();

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify({
                message: "Task criada com sucesso.",
                task
            })
        };
    } catch (err) {
        console.error("Erro ao criar task:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify({
                message: "Erro ao criar task",
                error: err.message
            })
        };
    }
};