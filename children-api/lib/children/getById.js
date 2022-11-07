import middy from '@middy/core'
import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { ddbClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'
const get = async event => {
  console.log('Starting get kid by id handler')
  if (event.pathParameters && event.pathParameters.id) {
    return await ddbClient
      .send(
        new QueryCommand({
          KeyConditionExpression: 'KidId = :id',
          ExpressionAttributeValues: {
            ':id': { S: event.pathParameters?.['id'] || '' },
          },
          TableName: 'children-api-dev',
          ConsistentRead: true,
        })
      )
      .then(data => simpleHttpResponse({ kid: data.Items }))
  } else {
    return simpleHttpResponse(
      { message: 'Error in the path params, `id` is expected' },
      400
    )
  }
}
const wrapper = async event =>
  get(event).catch(err => simpleHttpResponse({ message: err.message }, 500))
export const handler = middy(wrapper)
//# sourceMappingURL=getById.js.map
