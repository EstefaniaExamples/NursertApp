import { APIGatewayProxyResult } from 'aws-lambda'
import { ScanCommand } from '@aws-sdk/client-dynamodb'

import { ddbClient } from '../dynamodb.js'
import { simpleHttpResponse } from '../util.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const get = async (): Promise<APIGatewayProxyResult> => {
  console.log('INFO: Starting get all kids handler')

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

export const handler = async (): Promise<APIGatewayProxyResult> =>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  get().catch((err: any) => simpleHttpResponse({ message: err.message }, 500))
