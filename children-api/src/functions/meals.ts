import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';

const mealsFunction  = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("INFO: Starting meals handler")
    try {
        // const parsedBody = JSON.parse(event.body || '')
        return {
            statusCode: 200, 
            body: JSON.stringify(
                {
                    message: 'Welcome to the meals function', // `Hello ${parsedBody?.name}`,
                    input: event,
                },
                null,
                2
            ),
        };
    } catch (err) {
        console.error(err)
        return {
            statusCode: 500, 
            body: JSON.stringify(
                {
                    error: 'An error has ocurred',
                    message: err,
                },
                null,
                2
            ),
        };
    }
}

export const handler = middy(mealsFunction);
