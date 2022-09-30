import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
const ddbMock = mockClient(DynamoDBDocumentClient)

import { GetCommand } from '@aws-sdk/lib-dynamodb'

// https://dev.to/aws-builders/getting-into-aws-sdk-js-v3-mindset-15ki

it('should get user names from the DynamoDB', async () => {
  ddbMock
    .on(GetCommand)
    .resolves({
      Item: undefined,
    })
    .on(GetCommand, {
      TableName: 'users',
      Key: { id: 'user1' },
    })
    .resolves({
      Item: { id: 'user1', name: 'Alice' },
    })
    .on(GetCommand, {
      TableName: 'users',
      Key: { id: 'user2' },
    })
    .resolves({
      Item: { id: 'user2', name: 'Bob' },
    })

  // const names = await handler(null, null, null);
  // expect(names).toStrictEqual(["Alice", "Bob", undefined]);
})

it('whatever', async () => {
  const dataIds: string[] = []
  const id = dataIds?.[0] || ''
  expect(id).toStrictEqual('')
})
