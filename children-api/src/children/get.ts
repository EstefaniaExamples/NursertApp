import { APIGatewayProxyResult } from 'aws-lambda'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

import { ddbDocClient } from '../dynamodb'
import { simpleHttpResponse } from '../util'
import { main } from './top-level-await'

const text = await main();
console.log(text);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const get = async (): Promise<APIGatewayProxyResult> => {
  console.info('INFO: Starting get all kids handler')

  try {
    const { Items } = await ddbDocClient.send(
      new ScanCommand({
        TableName: 'children-api-dev',
        ConsistentRead: true,
      })
    )
    console.info(Items)
    return simpleHttpResponse({ kids: Items })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    return simpleHttpResponse({ message: err.message }, 500)
  }
}

export const handler = async (): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get().catch((err: any) => simpleHttpResponse({ message: err.message }, 500))
