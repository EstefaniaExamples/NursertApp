import { APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import { ScanCommand } from '@aws-sdk/client-dynamodb'

import { ddbClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const get = async (): Promise<APIGatewayProxyResult> => {
  console.log('INFO: Starting children handler')

  return await ddbClient
    .send(
      new ScanCommand({
        TableName: 'children-api-dev',
        ConsistentRead: true
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

const wrapper = async (): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get().catch((err: any) => simpleHttpResponse({ message: err.message }, 500))

// I'm guessing at some point you'll be registering and using more middleware,
//  as, at the mo, there's not much need for middy
export const handler = middy(wrapper)
