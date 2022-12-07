import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import { formatJSONResponse } from '@libs/util'

const eat = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('INFO: Starting meals handler')
  return formatJSONResponse(
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
  formatJSONResponse(
      {
        error: 'An error has occurred',
        message: err.message,
      },
      500
    )
  )
