import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import middy from '@middy/core'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ZodError } from 'zod'
import { v4 as uuidv4 } from 'uuid'

import { simpleHttpResponse } from '../util.js'
import { ddbDocClient } from '../dynamodb.js'
import { kidSchema } from './kid.js'

const put = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event.body)

  if (event.body) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const item = kidSchema.parse(JSON.parse(event.body!))
    return await ddbDocClient
      .send(
        new PutCommand({
          TableName: 'children-api-dev',
          // I would create a type for this which describes this particular table,
          //  without types is how you end up with 100 "artists" and 10 "artsts"
          // It doesn't matter that `PutCommand` isn't aware of your custom type as
          //  your DB-suitable type will conform the to the expected:
          //       Item: Record<string, NativeAttributeValue> | undefined;
          //  and TS will happily pass between the types
          Item: {
            KidId: uuidv4(),
            KidName: item.KidName,
            KidSurname: item.KidSurname,
            BirthDate: item.BirthDate,
            Address: item.Address,
          },
        })
      )

      .then(data => {
        console.log('Success - item added or updated', data)
        return simpleHttpResponse({ item }, 201)
      })
  } else {
    return simpleHttpResponse({ message: 'The body cannot be empty' }, 400)
  }
}

const wrapper = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(event).catch((err: any) => {
    if (err instanceof ZodError) {
      return simpleHttpResponse({ message: 'Error in the request body' }, 400)
    }
    return simpleHttpResponse({ message: err.message }, 500)
  })

export const handler = middy(wrapper)
