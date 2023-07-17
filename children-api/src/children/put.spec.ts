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
    body: JSON.stringify(inputItem),
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
  } as any

  beforeEach(() => {
    dynamodbMock.reset()
  })

  it('should insert the new kid in the database', async () => {
    dynamodbMock
      .on(PutCommand, {
        TableName: 'children-api-dev',
      })
      .resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: 'QKERDELSM3QSD45UAN89M7TJFJVV4KQNSO5AEMVJF66Q9ASUAAJG',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0,
        },
        Attributes: undefined,
        ConsumedCapacity: undefined,
        ItemCollectionMetrics: undefined,
      })

    const result = await handler(event)

    expect(result.statusCode).toEqual(201)
  })

  it('should fail if name is missed in the body', async () => {
    const wrongInputItem = {
      KidSurname: 'Ameneiros Castro',
      Address: 'Comunidad de Cantabria, 121, Laguna de Duero',
      BirthDate: '16/07/2019',
    }
    const eventWithoutBodyName: APIGatewayProxyEvent = {
      body: JSON.stringify(wrongInputItem),
    } as any

    const result = await handler(eventWithoutBodyName)

    expect(result.statusCode).toEqual(400)
    expect(JSON.parse(result.body).message).toEqual('Error in the request body')
  })

  it('should fail if request body is ian invalid JSON', async () => {
    const wrongInputItem = 'any string, not json format'
    const eventWithWrongBody: APIGatewayProxyEvent = {
      body: wrongInputItem,
    } as any

    const result = await handler(eventWithWrongBody)

    expect(result.statusCode).toEqual(500)
    expect(JSON.parse(result.body).message).toEqual(
      'Unexpected token \'a\', \"any string\"... is not valid JSON'
    )
  })
})
