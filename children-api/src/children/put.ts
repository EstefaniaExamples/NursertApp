import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { simpleHttpResponse } from '../util';
import { ddbDocClient } from '../dynamo';
import { kidSchema } from '../kid';


const put = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event.body)

  // I'd possible return a different error if the body doesn't exist, I know
  //  it'll come through as a Zod validation error in the `.catch` below but I'd
  //  argue that "body doesn't exist" is different to "body doesn't conform"
  const item = kidSchema.parse(JSON.parse(event.body!))

  const newKidParams = {
    TableName: "children-api-dev",
    // I would create a type for this which describes this particular table,
    //  without types is an how your end up with 100 artists and 10 artsts
    // It doesn't matter that `PutCommand` isn't aware of your custom type as
    //  your DB-suitable type will conform the to the expected:
    //       Item: Record<string, NativeAttributeValue> | undefined;
    //  and TS will happily pass between the types
    Item: {
      // Unless you have none-variable-namepsace characters in your keys,
      //  there's no need to quote them, even when nested
      KidId: uuidv4(),
      KidName: item.KidName,
      KidSurname: item.KidSurname,
      BirthDate: item.BirthDate,
      Address: item.Address
    },
  };

  const data = await ddbDocClient.send(new PutCommand(newKidParams));
  console.log('Success - item added or updated', data);

  // When the key and the value take the same name, i.e. the key "item" being
  //  set to the variable `item`, you don't need to specify twice, just the name
  //  and JS will internally work it out
  return simpleHttpResponse({ item }, 201);
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
