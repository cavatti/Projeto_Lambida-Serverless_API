const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid"); // para gerar IDs únicas
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!body.title || !body.description) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Título e descrição são obrigatórios." }),
      };
    }

    const newTask = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: TABLE_NAME,
      Item: newTask,
    };

    await dynamo.put(params).promise();

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(newTask),
    };
  } catch (error) {
    console.error("Erro ao criar task:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Erro ao criar task." }),
    };
  }
};
