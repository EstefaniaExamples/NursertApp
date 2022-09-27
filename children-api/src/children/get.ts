import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

import { ddbClient } from '../dynamodb.js';
import { simpleHttpResponse } from '../util.js';

const get = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('INFO: Starting children handler')
  const data = await ddbClient.send(new ScanCommand({
    TableName: 'children-api-dev'
  }));

  const kidsList: string[] = data.Items?.map(
    element => `${element.KdId.N} => ${element.KidName.S} ${element.KidSurname.S} (${element.BirthDate.S})`
  ) || [];

  return simpleHttpResponse({ children: kidsList })
};


const wrapper = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  get(event).catch((err: any) => simpleHttpResponse({ message: err.message }, 500));

// I'm guessing at some point you'll be registering and using more middleware,
//  as, at the mo, there's not much need for middy
export const handler = middy(wrapper);