import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbClient } from '../libs/ddbClient.js';
import { ddbDocClient } from '../libs/ddbDocClient.js';


const childrenPutFunction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    console.log(event.body)
    const newKidParams = {
        TableName: "children-api-dev",
        Item: {
            "artist":  "song.artist",
            "song": "song.song",
            "id":  "song.id",
            "priceUsdCents": "song.priceUsdCents",
            "publisher": "song.publisher"
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

const childrenGetFunction = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    console.log("INFO: Starting children handler")
    try {
        const getParams = {
            KeyConditionExpression: 'KidId=:n',
            ExpressionAttributeValues: {
                ":n": { N: "0" },
              },
            TableName: "children-api-dev",
        };
        const data = await ddbClient.send(new QueryCommand(getParams));
        const kidsList: String[] = [];
        data.Items.forEach(function (element) {
          kidsList.push(element.KidName.S + " " +  element.KidSurname.S + " ("  +  element.BirthDate.S + ")")
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                    children: kidsList,
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
