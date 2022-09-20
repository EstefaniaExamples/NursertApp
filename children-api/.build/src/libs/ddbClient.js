import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const REGION = "eu-west-2";
export const ddbClient = new DynamoDBClient({ region: REGION });
//# sourceMappingURL=ddbClient.js.map