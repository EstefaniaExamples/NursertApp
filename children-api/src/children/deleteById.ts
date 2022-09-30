import { ExecuteStatementCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import middy from '@middy/core'

import { ddbDocClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'

const deleteItem = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Starting delete children handler')
  console.log(`Path param ${event.pathParameters?.['id']}`)

  return await ddbDocClient

    .send(
      new QueryCommand({
        KeyConditionExpression: 'KidId = :id',
        ExpressionAttributeValues: {
          ':id': { S: event.pathParameters?.['id'] || '' },
        },
        TableName: 'children-api-dev',
      })
    )

    .then(data => data.Items?.map(element => element.KidId.S))

    .then(dataIds => {
      const id: string = dataIds?.[0] || ''
      console.log(`Deleting item ${id}`)
      if (id.length > 0) {
        ddbDocClient.send(
          new ExecuteStatementCommand({
            Statement: 'DELETE FROM children-api-dev where kidId=?',
            Parameters: [{ S: id }],
          })
        )
        return simpleHttpResponse({ message: 'Item successfuly deleted' })
      } else {
        return simpleHttpResponse({ message: 'Item not found' }, 404)
      }
    })
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