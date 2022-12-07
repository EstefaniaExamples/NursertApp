import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import { getChildrenById } from '@libs/dynamodb'
import { formatJSONResponse } from '@libs/util'

const get = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info('Starting get kid by id handler')

  if (event.pathParameters && event.pathParameters.id) {
    try {
      return formatJSONResponse({ 
        kid: await getChildrenById(event.pathParameters?.['id'] || '')
      })
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      if ((err.message as string).includes('not found')) {
        return formatJSONResponse({ message: err.message }, 404)
      } else {
        return formatJSONResponse({ message: err.message }, 500)
      }
    }
    
  } else {
    return formatJSONResponse(
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
    formatJSONResponse({ message: err.message }, 500)
  )
