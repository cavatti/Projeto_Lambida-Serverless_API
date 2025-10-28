const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Tasks";

exports.handler = async (event) => {
    try {
        console.log("Requisição recebida:", event);

        // Busca todos os itens da tabela DynamoDB
        const data = await dynamo.scan({ TableName: TABLE_NAME }).promise();

        // Retorna apenas o array de itens
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":
                    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify(data.Items || [])
        };
    } catch (err) {
        console.error("Erro ao listar tasks:", err);

        // Retorno em caso de falha
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":
                    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify({
                message: "Erro ao listar tasks",
                error: err.message
            })
        };
    }
};