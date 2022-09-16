// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
const REGION = "eu-west-2"; 
// Create an Amazon DynamoDB service client object.
const ddbClient: DynamoDBClient = new DynamoDBClient({ region: REGION });
export { ddbClient };