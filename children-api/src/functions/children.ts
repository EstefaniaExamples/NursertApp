import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbClient } from '../libs/ddbClient.js';
import { ddbDocClient } from '../libs/ddbDocClient.js';
import { kidSchema } from '../model/kid_model.js';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const childrenPutFunction = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    console.log(event.body)

    try { 
        const item = kidSchema.parse(JSON.parse(event.body!))
        const newKidParams = {
            TableName: "children-api-dev",
            Item: {
                "KidId": uuidv4(),
                "KidName": item.KidName,
                "KidSurname":  item.KidSurname,
                "BirthDate": item.BirthDate,
                "Address": item.Address
            },
          };
    
        const data = await ddbDocClient.send(new PutCommand(newKidParams));
        console.log("Success - item added or updated", data);
    
        return {
            statusCode: 201,
            body: JSON.stringify( {
                    item: item,
                }, null, 2),
            headers: { "Content-Type": "application/json" },
        };
    } catch (error) { 
        console.log(error);
        var message: String = "internal server error"
        if (error instanceof ZodError) {
            message = "Error in the request body."
        }
        return {
            statusCode: 400,
            body: JSON.stringify({ message: message }, null, 2),
            headers: { "Content-Type": "application/json" },
        };
    }        
}
    

const childrenGetFunction = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    console.log("INFO: Starting children handler")
    try {
        const getParams = {
            TableName: "children-api-dev",
        };
        const data = await ddbClient.send(new ScanCommand(getParams));
        const kidsList: String[] = [];
        if (typeof data !== undefined) {
            data.Items.forEach(function (element) {
                kidsList.push(element.KidName.S + " " +  element.KidSurname.S + " ("  +  element.BirthDate.S + ")")
              });
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                    children: kidsList,
                }, null, 2 ),
            headers: { "Content-Type": "application/json"}
        };
    } catch (err) {
        return {
            statusCode: 500, 
            body: JSON.stringify( {
                    error: 'An error has ocurred',
                    message: err,
                }, null, 2 ),
            headers: { "Content-Type": "application/json"}
        };
    }
}

export const getChildren = middy(childrenGetFunction);
export const createChildren = middy(childrenPutFunction);
