import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import { ddbDocClient } from '../dynamodb'
import { simpleHttpResponse } from '../util'

const get = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info('Starting get kid by id handler')

  if (event.pathParameters && event.pathParameters.id) {
    const params = {
      TableName: 'children-api-dev',
      Key: { KidId: event.pathParameters?.['id'] || '' },
    }
    const { Item } = await ddbDocClient.send(new GetCommand(params))
    if (Item == undefined) {
      return simpleHttpResponse(
        { message: `Item with id ${event.pathParameters.id} not found` },
        404
      )
    }

    return simpleHttpResponse({ kid: Item })
    
  } else {
    return simpleHttpResponse(
      { message: 'Error in the path params, `id` is expected' },
      400
    )
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(event).catch((err: any) =>
    simpleHttpResponse({ message: err.message }, 500)
  )
