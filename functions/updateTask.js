const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Tasks";

exports.handler = async (event) => {
    try {
        const { id, title, description } = JSON.parse(event.body);
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
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ id, title, description })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Erro ao atualizar task", error: err.message })
        };
    }
};
