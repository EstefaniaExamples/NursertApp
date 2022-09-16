import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
// Import required AWS SDK clients and commands for Node.js
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient } from '@libs/ddbClient';
import { ddbDocClient } from '@libs/ddbDocClient';


const childrenPutFunction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    console.log(event.body)
    const newKidParams = {
        TableName: "children-api-dev",
        Item: {
          primaryKey: "'Id': 2", // For example, 'Season': 2
          sortKey: "'Name': Antia", // For example,  'Episode': 2 (only required if table has sort key)
          Birthday: "05/03/2022", //For example 'Title': 'The Beginning'
        },
      };

    const data = await ddbDocClient.send(new PutCommand(newKidParams));
    console.log("Success - item added or updated", data);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'New children added',
                input: event,
            },
            null,
            2
        ),
    };
}  

const childrenGetFunction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    console.log("INFO: Starting children handler")
    try {
        const getParams = {
            // Set the projection expression, which the the attributes that you want.
            ProjectionExpression: "Name, Surname",
            TableName: "children-api-dev",
        };
        console.log(getParams)
        const data = await ddbClient.send(new QueryCommand(getParams));
        console.log(data.Items)
        data.Items.forEach(function (element) {
          console.log(element.Name.S + " (" + element.Surname.S + ")");
        });
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: 'Go Serverless v1.0! Your function executed successfully!',
                    input: event,
                },
                null,
                2
            ),
        };
    } catch (err) {
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

export const getChildren = middy(childrenGetFunction);
export const createChildren = middy(childrenPutFunction);
