import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import { simpleHttpResponse } from '../util'

const eat = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('INFO: Starting meals handler')
  return simpleHttpResponse(
    {
      message: 'Welcome to the meals function',
      input: event,
    },
    200
  )
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eat(event).catch((err: any) =>
    simpleHttpResponse(
      {
        error: 'An error has occurred',
        message: err.message,
      },
      500
    )
  )
