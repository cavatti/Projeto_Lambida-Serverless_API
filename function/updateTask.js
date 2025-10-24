const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!id || !body.title || !body.description) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "ID, título e descrição são obrigatórios." }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "set title = :t, description = :d",
      ExpressionAttributeValues: {
        ":t": body.title,
        ":d": body.description,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamo.update(params).promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error("Erro ao atualizar task:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Erro ao atualizar task." }),
    };
  }
};
