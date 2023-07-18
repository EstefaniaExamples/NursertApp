import { APIGatewayProxyHandler } from 'aws-lambda';

console.log("Hello! version 10 ...");

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello, world!' }),
  };
  return response;
};