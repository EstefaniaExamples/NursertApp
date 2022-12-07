import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

import { deleteChildrenById } from '@libs/repository'
import { formatJSONResponse } from '@libs/util'

const deleteItem = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info('Starting delete children handler')

  if (event.pathParameters && event.pathParameters.id) {
    try {
      await deleteChildrenById(event.pathParameters?.['id'] || '')
      return formatJSONResponse({ message: 'Item successfuly deleted' })
    
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
): Promise<APIGatewayProxyResult> => deleteItem(event)
