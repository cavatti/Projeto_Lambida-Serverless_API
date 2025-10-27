const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require("uuid");
const TABLE_NAME = "Tasks";

exports.handler = async (event) => {
    try {
        const { title, description } = JSON.parse(event.body);
        const task = { id: uuidv4(), title, description };
        await dynamo.put({ TableName: TABLE_NAME, Item: task }).promise();
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(task)
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Erro ao criar task", error: err.message })
        };
    }
};
