import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ZodError } from 'zod'
import { v4 as uuidv4 } from 'uuid'

import { simpleHttpResponse } from '../util'
import { ddbDocClient } from '../dynamodb'
import { kidSchema } from './kid'

const put = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.body) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const item = kidSchema.parse(JSON.parse(event.body!))
    try {
      await ddbDocClient.send(
        new PutCommand({
          TableName: 'children-api-dev',
          Item: {
            ...item,
            KidId: uuidv4(),
          },
        })
      )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      return simpleHttpResponse({ message: err.message }, 500)
    }

    console.info('Success - item added or updated')
    return simpleHttpResponse({ item }, 201)
  } else {
    return simpleHttpResponse({ message: 'The body cannot be empty' }, 400)
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(event).catch((err: any) => {
    if (err instanceof ZodError) {
      return simpleHttpResponse({ message: 'Error in the request body' }, 400)
    }
    return simpleHttpResponse({ message: err.message }, 500)
  })
