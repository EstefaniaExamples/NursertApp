import { APIGatewayProxyResult } from 'aws-lambda'

export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode = 200,
  headers: Record<string, string> = { 'Content-Type': 'application/json' }): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers,
  }
}
