import { mockClient } from 'aws-sdk-client-mock'
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'

import { handler } from './deleteById'

describe('Add function Tests', () => {
  const dynamodbMock = mockClient(DynamoDBDocumentClient)
  const resultItem = {
    KidSurname: 'Ameneiros Castro',
    Address: 'Comunidad de Cantabria, 121, Laguna de Duero',
    KidName: 'Andreia',
    BirthDate: '16/07/2019',
  }
  const kidId = uuidv4()
  const event: APIGatewayProxyEvent = {
    pathParameters: {
      id: kidId,
    },
  } as any

  beforeEach(() => {
    dynamodbMock.reset()
  })

  it('should delete the kid from the database', async () => {
    dynamodbMock
      .on(GetCommand, {
        TableName: 'children-api-dev',
        Key: { KidId: kidId },
      })
      .resolves({
        Item: resultItem,
      })

    dynamodbMock
      .on(DeleteCommand, {
        TableName: 'children-api-dev',
        Key: {
          KidId: kidId,
        },
      })
      .resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: '22ce0356-3feb-4f03-a01f-6b023565632a',
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

    expect(result.statusCode).toEqual(200)
    expect(JSON.parse(result.body).message).toEqual('Item successfuly deleted')
  })

  it('should return and error when trying to delete an unexisted kid', async () => {
    dynamodbMock
      .on(GetCommand, {
        TableName: 'children-api-dev',
        Key: { KidId: kidId },
      })
      .resolves({
        Item: undefined,
      })

    const result = await handler(event)

    expect(result.statusCode).toEqual(404)
    expect(JSON.parse(result.body).message).toEqual(
      `Item with id ${kidId} not found`
    )
  })
})
