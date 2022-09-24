import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import { QueryCommand } from '@aws-sdk/client-dynamodb';

// I tend to keep my local imports separate from library imports, just a
//  preference thing I suppose
// I've also removed the extension again, I'm not sure what the configuration
//  option that is preventing this being usable in Lambda... but I'm sure we
//  can find it
import { ddbClient } from '../dynamo';
import { simpleHttpResponse } from '../util';

const get = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('INFO: Starting children handler')
  // There's no point in separating the object and the command into variable
  //  and call... just do it on the one line - particularly with JS you see a
  //  lot of *very* large calls with a great many nested objects, arguably
  //  untidy but I much prefer it to seeing a call with ten variables in it
  //  which I then need to go and find elsewhere...
  const data = await ddbClient.send(new QueryCommand({
    KeyConditionExpression: 'KidId=:n',
    ExpressionAttributeValues: {
      ':n': { N: '0' },
    },
    TableName: 'children-api-dev',
  }));

  // Instead of creating a mutable array (`[]`), iterating another array
  //  (`.forEach`), and updating the first on each iteration of the second, it's
  //  simpler and neater to employ a functional programming idea (loosley) of
  //  mapping data. This way the result is the final array which can now be
  //  const
  //
  // Using string interpolation rather than `'Mykey: ' + myKey + ', myValue: ' +
  //  myValue` for a couple of reasons, the most important for me is
  //  JavaScript's handling of the + operator... e.g. 
  //      var a = 10;
  //      var b = 20;
  //      console.log('result is ' + a + b);
  //               => 'result is 1020'
  // They're also more flexible, multi-line strings are supported by default,
  //  you can embed expressions (e.g. `${1 + 2}`), etc.
  //
  // It's also quite rare to see the `function() {}` syntax these days, the only
  //  benefit is preservation of the `this` keyword... but as `this` doesn't
  //  mean much of value here, an arrow function (`() => {}`) is more common
  const kidsList: String[] = data.Items.map(
    element => `${element.KidName.S} ${element.KidSurname.S} (${element.BirthDate.S})`
  );

  return simpleHttpResponse({ children: kidsList })
};

// In the context of a Lambda it's kinda difficult not to wrap the whole thing
//  in a try-catch as you need to control the response to the user in any
//  error scenario and this is an easy way to do this
// However, putting all the logic on an extra indentation inside the try-block
//  and retaining all the error logic makes the function a bit cumbersome - I
//  suppose it's a style choice but I would argue this is more readable
//
// Also the wrapped function returns a promise which means you can catch any
//  error through function chaining, no need for the try-catch at all
//
// Also, now the logic is moved out of this wrapper, the only statement is the
//  return, so we can clean this up even further removing some of those pesky
//  braces :D
const wrapper = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  get(event).catch((err: any) => simpleHttpResponse({ message: err.message }, 500));

// I'm guessing at some point you'll be registering and using more middleware,
//  as, at the mo, there's not much need for middy
export const handler = middy(wrapper);
