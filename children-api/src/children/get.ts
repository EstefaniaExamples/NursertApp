import { APIGatewayProxyResult } from 'aws-lambda'
import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { ddbDocClient } from '../dynamodb'
import { simpleHttpResponse } from '../util'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const get = async (): Promise<APIGatewayProxyResult> => {
  console.info('INFO: Starting get all kids handler')

  const params = {
    TableName: 'children-api-dev',
    ConsistentRead: true,
  }
  const { Items } = await ddbDocClient.send(new ScanCommand(params))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemsResult: any[] = []
  Items?.forEach(element => {
    itemsResult.push(unmarshall(element))
  })

  return simpleHttpResponse({ kids: itemsResult })
}

export const handler = async (): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get().catch((err: any) => simpleHttpResponse({ message: err.message }, 500))
