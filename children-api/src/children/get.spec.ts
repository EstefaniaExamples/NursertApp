import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

import { handler } from './get'

describe('Add function Tests', () => {
  const dynamodbMock = mockClient(DynamoDBDocumentClient)

  beforeEach(() => {
    dynamodbMock.reset()
  })

  it('should get user details from the DynamoDB', async () => {
    const item1 = {
      KidSurname: 'Ameneiros Castro',
      Address: 'Comunidad de Cantabria, 121, Laguna de Duero',
      KidId: '7f019626-253b-43e0-aca4-636ce656f47b',
      KidName: 'Andreia',
      BirthDate: '16/07/2019',
    }
    const item2 = {
      KidSurname: 'Moro Martín',
      Address: 'Laguna de Duero',
      KidId: '18a66edb-cfbd-4b06-8a57-54e03fe0ba70',
      KidName: 'Julia',
      BirthDate: '27/05/2019',
    }
    
    dynamodbMock
      .on(ScanCommand, {
        TableName: 'children-api-dev',
      })
      .resolves({
        Items: [item1, item2],
      })

    const result = await handler()

    expect(result.statusCode).toEqual(200)
    expect(result.body).not.toBeNull()
    expect(JSON.parse(result.body)).toStrictEqual({ kids: [item1, item2] })
  })

  it('should return a specific error when query to database fails', async () => {
    dynamodbMock
      .on(ScanCommand, {
        TableName: 'children-api-dev',
      })
      .rejects('specific error message')

    const result = await handler()

    expect(result.statusCode).toEqual(500)
    expect(result.body).not.toBeNull()
    expect(JSON.parse(result.body).message).toStrictEqual(
      'specific error message'
    )
  })

  it('should get an empty array when no children in the database', async () => {
    dynamodbMock
      .on(ScanCommand, {
        TableName: 'children-api-dev',
      })
      .resolves({ Items: [] })

    const result = await handler()

    expect(result.statusCode).toEqual(200)
    expect(result.body).not.toBeNull()
    expect(JSON.parse(result.body)).toStrictEqual({ kids: [] })
  })
})
