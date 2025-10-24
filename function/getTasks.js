const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

// Nome da tabela definido via variável de ambiente
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const data = await dynamo.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // permite acesso via web
      },
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error("Erro ao buscar tasks:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Erro ao buscar tasks" }),
    };
  }
};
