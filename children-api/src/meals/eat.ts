import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';

import { simpleHttpResponse } from '../util';


const eat = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("INFO: Starting meals handler")
  return simpleHttpResponse({
    message: 'Welcome to the meals function',
    input: event,
  }, 200);
};

const wrapper = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  eat(event).catch((err: any) => simpleHttpResponse({
    error: 'An error has occurred',
    message: err.message
  }, 500));

export const handler = middy(wrapper);