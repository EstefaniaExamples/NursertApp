import { DynamoDBDocumentClient, GetCommand, TranslateConfig } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const REGION = 'eu-west-2'

function getDynamoDBClient(): DynamoDBClient {
  if (process.env.IS_OFFLINE) {
    console.info('Setting the configuration to use the localhost database')
    return new DynamoDBClient({
      region: 'localhost',
      endpoint: 'http://localhost:5001',
    })
  }
  console.info('Setting the configuration to use the AWS database')
  return new DynamoDBClient({ region: REGION })
}

export const ddbClient: DynamoDBClient = getDynamoDBClient()
// export const ddbClient: DynamoDBClient = new DynamoDBClient({ region: REGION })

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false,
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false,
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: true,
}

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false,
}

const translateConfig: TranslateConfig = { marshallOptions, unmarshallOptions }

export const ddbDocClient = DynamoDBDocumentClient.from(
  ddbClient,
  translateConfig
)

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getChildrenById(id: string): Promise<any> {
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: 'children-api-dev',
        Key: { KidId: id },
      })
    )
    
    if (Item == undefined) {
      throw new TypeError(`Item with id ${id} not found`);
    }

    return Item;
}

