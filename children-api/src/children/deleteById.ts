import { ExecuteStatementCommand } from '@aws-sdk/client-dynamodb'
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import { ddbDocClient } from '../dynamodb'
import { simpleHttpResponse } from '../util'

const deleteItem = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info('Starting delete children handler')
 
  if (event.pathParameters && event.pathParameters.id) {
    const { Item } = await ddbDocClient.send(new GetCommand({
      TableName: 'children-api-dev',
      Key: { KidId: event.pathParameters?.['id'] || '' },
    }))

    if (Item == undefined) {
      return simpleHttpResponse(
        { message: `Item with id ${event.pathParameters.id} not found` },
        404
      )
    } else {
      const result = ddbDocClient.send(
        new ExecuteStatementCommand({
          Statement: 'DELETE FROM children-api-dev where kidId=?',
          Parameters: [{ S: Item.KidId }],
        })
      )
      console.info(result)
      return simpleHttpResponse({ message: 'Item successfuly deleted' })
    }
    
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
  deleteItem(event).catch((err: any) =>
    simpleHttpResponse({ message: err.message }, 500)
  )
