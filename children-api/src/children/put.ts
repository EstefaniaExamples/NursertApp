import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { ZodError } from 'zod'

import { formatJSONResponse } from '@libs/util'
import { kidSchema } from './kid'
import { saveChildren } from '@libs/repository'

const put = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.body) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const item = kidSchema.parse(JSON.parse(event.body!))
      await saveChildren(item)
      console.info('Success - item added or updated')
      return formatJSONResponse({ kid: item }, 201)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof ZodError) {
        return formatJSONResponse({ message: 'Error in the request body' }, 400)
      }
      return formatJSONResponse({ message: err.message }, 500)
    }

  } else {
    return formatJSONResponse({ message: 'The body cannot be empty' }, 400)
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => put(event)
