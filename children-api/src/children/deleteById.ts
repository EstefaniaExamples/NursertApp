import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import middy from '@middy/core'

import { ddbClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'

const deleteItem = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Starting delete children handler')
  console.log(`Path param ${event.pathParameters?.['id']}`)

  return await ddbClient
    .send(
      new ScanCommand({
        TableName: 'children-api-dev',
      })
    )
    .then(data => simpleHttpResponse({ kid: data.Items }))
}

const wrapper = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteItem(event).catch((err: any) =>
    simpleHttpResponse({ message: err.message }, 500)
  )

// I'm guessing at some point you'll be registering and using more middleware,
//  as, at the mo, there's not much need for middy
export const handler = middy(wrapper)
