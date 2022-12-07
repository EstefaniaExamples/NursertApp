import { APIGatewayProxyResult } from 'aws-lambda'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

import { ddbDocClient } from '@libs/dynamodb'
import { formatJSONResponse } from '@libs/util'
import { main } from './async-method';


const asyncMsg = (async () => {
  return await main();
})();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const get = async (): Promise<APIGatewayProxyResult> => {
  console.info('INFO: Starting get all kids handler')
  console.info('withing get method ' + await asyncMsg)

  try {
    const { Items } = await ddbDocClient.send(
      new ScanCommand({
        TableName: 'children-api-dev',
        ConsistentRead: true,
      })
    )
    console.info(Items)
    return formatJSONResponse({ kids: Items })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    return formatJSONResponse({ message: err.message }, 500)
  }
}

export const handler = async (): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get().catch((err: any) => formatJSONResponse({ message: err.message }, 500))
