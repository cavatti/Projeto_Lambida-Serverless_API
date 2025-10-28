const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Tasks";

exports.handler = async (event) => {
    try {
        console.log("Requisição recebida:", event);

        // ID vem do path (ex: /tasks/{id})
        const id = event.pathParameters?.id;
        if (!id) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ message: "ID da task não informado." })
            };
        }

        // Lê o corpo (título e descrição)
        const { title, description } = JSON.parse(event.body || "{}");

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

        // Atualiza no DynamoDB
        await dynamo.update({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "set title = :t, description = :d",
            ExpressionAttributeValues: {
                ":t": title,
                ":d": description
            }
        }).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify({
                message: "Task atualizada com sucesso.",
                task: { id, title, description }
            })
        };
    } catch (err) {
        console.error("Erro ao atualizar task:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify({
                message: "Erro ao atualizar task",
                error: err.message
            })
        };
    }
};