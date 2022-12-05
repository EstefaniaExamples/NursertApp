import { DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import { ddbDocClient } from '../dynamodb'
import { simpleHttpResponse } from '../util'

const deleteItem = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info('Starting delete children handler')

  if (event.pathParameters && event.pathParameters.id) {
    try {
      const { Item } = await ddbDocClient.send(
        new GetCommand({
          TableName: 'children-api-dev',
          Key: { KidId: event.pathParameters?.['id'] || '' },
        })
      )
      if (Item == undefined) {
        return simpleHttpResponse(
          { message: `Item with id ${event.pathParameters.id} not found` },
          404
        )
      } else {
        const result = await ddbDocClient.send(
          new DeleteCommand({
            TableName: 'children-api-dev',
            Key: {
              KidId: event.pathParameters?.['id'],
            },
          })
        )
        console.info(result)
        return simpleHttpResponse({ message: 'Item successfuly deleted' })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      return simpleHttpResponse({ message: err.message }, 500)
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
