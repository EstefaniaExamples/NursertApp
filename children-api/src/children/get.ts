import { APIGatewayProxyResult } from 'aws-lambda'

import { formatJSONResponse } from '@libs/util'
import { main } from './async-method';
import { getAllChildren } from '@libs/repository';


const asyncMsg = (async () => {
  return await main();
})();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getChildren = async (): Promise<APIGatewayProxyResult> => {
  console.info('INFO: Starting get all kids handler')
  console.info('withing get method ' + await asyncMsg)

  try {
    const items = await getAllChildren()
    return formatJSONResponse({ kids: items })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    return formatJSONResponse({ message: err.message }, 500)
  }
}

export const handler = async (): Promise<APIGatewayProxyResult> => getChildren()
