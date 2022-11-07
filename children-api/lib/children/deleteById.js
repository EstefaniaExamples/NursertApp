import { ExecuteStatementCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import middy from '@middy/core'
import { ddbDocClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'
const deleteItem = async event => {
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
      const id = dataIds?.[0] || ''
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
const wrapper = async event =>
  deleteItem(event).catch(err =>
    simpleHttpResponse({ message: err.message }, 500)
  )
export const handler = middy(wrapper)
//# sourceMappingURL=deleteById.js.map
