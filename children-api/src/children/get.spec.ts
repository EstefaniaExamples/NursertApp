import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb';
import { ScanCommand } from "@aws-sdk/client-dynamodb";

import { handler } from './get'


describe('Add function Tests', () => {
  const dynamodbMock = mockClient(DynamoDBDocumentClient);
  // const event: APIGatewayProxyEvent = {
  //   body: null,
  //   pathParameters: null,
  //   queryStringParameters: null,
  //   multiValueQueryStringParameters: null,
  // }  as any

  beforeEach(() => {
      dynamodbMock.reset();
  });

  it("should get user names from the DynamoDB", async () => {
    const item1 = {
      KidSurname: 'Ameneiros Castro' ,
      Address: 'Comunidad de Cantabria, 121, Laguna de Duero' ,
      KidId: '7f019626-253b-43e0-aca4-636ce656f47b' ,
      KidName: 'Andreia' ,
      BirthDate: '16/07/2019' 
    }
    const item2 = {
      KidSurname: 'Moro Martín',
      Address: 'Laguna de Duero',
      KidId: '18a66edb-cfbd-4b06-8a57-54e03fe0ba70',
      KidName: 'Julia',
      BirthDate: '27/05/2019'
    }
    const getResponse =[
      marshall(item1),
      marshall(item2)
    ]
    dynamodbMock.on(ScanCommand, {
        TableName: "children-api-dev"
    }).resolves({
        Items: getResponse,
    });

    const result = await handler();

    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeNull()


    expect(JSON.parse(result.body)).toStrictEqual(JSON.parse(JSON.stringify({ kids: [item1, item2] }) ));
  });

});
