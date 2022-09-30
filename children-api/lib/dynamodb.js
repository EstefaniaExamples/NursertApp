import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const REGION = 'eu-west-2';
export const ddbClient = new DynamoDBClient({ region: REGION });
const marshallOptions = {
    convertEmptyValues: false,
    removeUndefinedValues: false,
    convertClassInstanceToMap: false,
};
const unmarshallOptions = {
    wrapNumbers: false,
};
const translateConfig = { marshallOptions, unmarshallOptions };
export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);
//# sourceMappingURL=dynamodb.js.map