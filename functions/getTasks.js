const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Tasks";

exports.handler = async () => {
    try {
        const data = await dynamo.scan({ TableName: TABLE_NAME }).promise();
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(data.Items)
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Erro ao listar tasks", error: err.message })
        };
    }
};
