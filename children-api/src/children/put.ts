import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { simpleHttpResponse } from '../util';
import { ddbDocClient } from '../dynamo';
import { ZodError } from 'zod';


const put = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event.body)

  const newKidParams = {
    TableName: 'children-api-dev',
    // I would create a type for this which describes this particular table,
    //  without types is an how your end up with 100 artists and 10 artsts
    // It doesn't matter that `PutCommand` isn't aware of your custom type as
    //  your DB-suitable type will conform the to the expected:
    //       Item: Record<string, NativeAttributeValue> | undefined;
    //  and TS will happily pass between the types
    Item: {
      // Unless you have none-variable-namepsace characters in your keys,
      //  there's no need to quote them, even when nested
      artist: 'song.artist',
      song: 'song.song',
      id: 'song.id',
      priceUsdCents: 'song.priceUsdCents',
      publisher: 'song.publisher'
    },
  };

  const data = await ddbDocClient.send(new PutCommand(newKidParams));
  console.log('Success - item added or updated', data);

  return simpleHttpResponse({
    message: 'New children added',
    input: event,
  });
}

// This is 
const wrapper = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  put(event).catch((err: any) => {
    if (err instanceof ZodError) {
      return simpleHttpResponse({ message: 'Error in the request body' }, 400);
    }
    return simpleHttpResponse({ message: err.message }, 500);
  });

export const handler = middy(wrapper);
