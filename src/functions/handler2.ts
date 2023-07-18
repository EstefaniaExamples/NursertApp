import { APIGatewayProxyHandler } from 'aws-lambda';

console.log("Hello2! version 10 ----------------");

export const hello2: APIGatewayProxyHandler = async (event, _context) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello 2, world!' }),
    };
    return response;
  };