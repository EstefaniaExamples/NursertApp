import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'

import { handler } from './put'

describe('Add function Tests', () => {
  const dynamodbMock = mockClient(DynamoDBDocumentClient)
  const inputItem = {
      KidSurname: 'Ameneiros Castro',
      Address: 'Comunidad de Cantabria, 121, Laguna de Duero',
      KidName: 'Andreia',
      BirthDate: '16/07/2019',
  }
  const event: APIGatewayProxyEvent = {
    body: inputItem,
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
  }  as any

  beforeEach(() => {
    dynamodbMock.reset()
  })

  it('should get user names from the DynamoDB', async () => {
    dynamodbMock
      .on(PutCommand, {
        TableName: 'children-api-dev',
        Item: inputItem
      })
      .resolves({
        Attributes: [],
      })

    const result = await handler(event)

    expect(result.statusCode).toEqual(201)
  })

})
