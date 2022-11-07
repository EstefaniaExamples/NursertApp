import middy from '@middy/core'
import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { ddbClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'
const get = async () => {
  console.log('INFO: Starting children handler')
  return await ddbClient
    .send(
      new ScanCommand({
        TableName: 'children-api-dev',
        ConsistentRead: true,
      })
    )
    .then(
      data =>
        data.Items?.map(
          element =>
            `${element.KidId.S} => ${element.KidName.S} ${element.KidSurname.S} (${element.BirthDate.S})`
        ) || []
    )
    .then(kidsList => simpleHttpResponse({ children: kidsList }))
}
const wrapper = async () =>
  get().catch(err => simpleHttpResponse({ message: err.message }, 500))
export const handler = middy(wrapper)
//# sourceMappingURL=get.js.map
