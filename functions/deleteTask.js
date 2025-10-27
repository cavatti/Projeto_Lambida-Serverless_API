const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Tasks";

exports.handler = async (event) => {
    try {
        const { id } = JSON.parse(event.body);
        await dynamo.delete({
            TableName: TABLE_NAME,
            Key: { id }
        }).promise();
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Task deletada", id })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Erro ao deletar task", error: err.message })
        };
    }
};
