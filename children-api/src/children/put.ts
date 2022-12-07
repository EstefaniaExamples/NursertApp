import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ZodError } from 'zod'
import { v4 as uuidv4 } from 'uuid'

import { formatJSONResponse } from '@libs/util'
import { ddbDocClient } from '@libs/dynamodb'
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
      return formatJSONResponse({ message: err.message }, 500)
    }

    console.info('Success - item added or updated')
    return formatJSONResponse({ item }, 201)
  } else {
    return formatJSONResponse({ message: 'The body cannot be empty' }, 400)
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(event).catch((err: any) => {
    if (err instanceof ZodError) {
      return formatJSONResponse({ message: 'Error in the request body' }, 400)
    }
    return formatJSONResponse({ message: err.message }, 500)
  })
