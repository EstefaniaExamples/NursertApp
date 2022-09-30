import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import middy from '@middy/core'
import { QueryCommand } from '@aws-sdk/client-dynamodb'

import { ddbClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'

const get = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Starting get kid by id handler')

  if (event.pathParameters && event.pathParameters.id) {
    return await ddbClient
      .send(
        new QueryCommand({
          KeyConditionExpression: 'KidId = :id',
          ExpressionAttributeValues: {
            ':id': { S: event.pathParameters?.['id'] || '' },
          },
          TableName: 'children-api-dev',
          ConsistentRead: true
        })
      )
      .then(data => simpleHttpResponse({ kid: data.Items }))
  } else {
    return simpleHttpResponse(
      { message: 'Error in the path params, `id` is expected' },
      400
    )
  }
}

const wrapper = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(event).catch((err: any) =>
    simpleHttpResponse({ message: err.message }, 500)
  )

// I'm guessing at some point you'll be registering and using more middleware,
//  as, at the mo, there's not much need for middy
export const handler = middy(wrapper)
