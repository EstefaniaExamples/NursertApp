import { APIGatewayProxyResult } from 'aws-lambda'

// This is one of those Typescript things where you want to avoid using it as
//  much as possible, like `any` however it is super useful from time to time, it
//  essentially represents something JSON-ish...
// Look through "that other project" and see how many times `PlainObject` is
//  used and imagine what it's like to desperately try to tell what bloody
//  fields an object should have...

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Pojo = { [key: string]: any }

export const simpleHttpResponse = (
  body: Pojo,
  status = 200,
  headers: { [key: string]: string } = { 'Content-Type': 'application/json' }
): APIGatewayProxyResult =>
  // I'm only mentioning this here as if you've not come across it, it can cause a
  //  headache. If you want to return something from an arrow function without the
  //  `return` keyword you can with:
  //      () => 2
  //   which is the same as:
  //      () => { return 2; }
  //  however, if you wish to return an object, well the parser sees the braces
  //  and assumes they define a block, not an object, so you have to bracket
  //  them, e.g.:
  ({
    statusCode: status,
    body: JSON.stringify(body, null, 2),
    headers,
  })
