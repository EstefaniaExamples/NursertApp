import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'

import { handler } from './getById'

describe('Add function Tests', () => {
  const dynamodbMock = mockClient(DynamoDBDocumentClient)
  const kidId = uuidv4()
  const event: APIGatewayProxyEvent = {
    pathParameters: {
      id: kidId,
    },
  } as any

  beforeEach(() => {
    dynamodbMock.reset()
  })

  it('should get user names from the DynamoDB', async () => {
    const getResponse = {
      KidSurname: 'Ameneiros Castro',
      Address: 'Comunidad de Cantabria, 121, Laguna de Duero',
      KidId: '7f019626-253b-43e0-aca4-636ce656f47b',
      KidName: 'Andreia',
      BirthDate: '16/07/2019',
    }
    dynamodbMock
      .on(GetCommand, {
        TableName: 'children-api-dev',
        Key: { KidId: kidId },
      })
      .resolves({
        Item: getResponse,
      })

    const result = await handler(event)

    expect(result.statusCode).toEqual(200)
    expect(result.body).not.toBeNull()
    expect(JSON.parse(result.body)).toStrictEqual({ kid: getResponse })
  })

  it('should return an error when DynamoDB query fails', async () => {
    dynamodbMock
      .on(GetCommand, {
        TableName: 'children-api-dev',
        Key: { KidId: kidId },
      })
      .rejects('specific error message')

    const result = await handler(event)

    expect(result.statusCode).toEqual(500)
    expect(result.body).not.toBeNull()
    expect(JSON.parse(result.body).message).toStrictEqual(
      'specific error message'
    )
  })

  it('should return an error when no kid found', async () => {
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
    expect(result.body).not.toBeNull()
    expect(JSON.parse(result.body).message).toStrictEqual(
      `Item with id ${kidId} not found`
    )
  })

  it('should return an error when no path param id is send in the request', async () => {
    const getResponse = {
      id: kidId,
      name: 'name-kid1',
      surname: 'surname-kid1',
    }
    dynamodbMock.on(GetCommand).resolves({
      Item: getResponse,
    })

    const eventWithoutId: APIGatewayProxyEvent = {
      pathParameters: {},
    } as any
    const result: APIGatewayProxyResult = await handler(eventWithoutId)

    expect(result.statusCode).toEqual(400)
    expect(result.body).not.toBeNull()
    expect(JSON.parse(result.body).message).toBe(
      'Error in the path params, `id` is expected'
    )
  })
})
