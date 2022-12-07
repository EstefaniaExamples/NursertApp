import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid'
import { APIError, HttpStatusCode } from "./baseError";
import { ddbDocClient } from "./dynamodb";

export async function getAllChildren(): Promise<Record<string, unknown>[]> {
    const { Items } = await ddbDocClient.send(
        new ScanCommand({
            TableName: 'children-api-dev',
            ConsistentRead: true,
        })
    )

    if (Items === undefined) {
        return []
    } else {
        return Items
    }
}

export async function getChildrenById(id: string): Promise<Record<string, unknown>> {
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: 'children-api-dev',
        Key: { KidId: id },
      })
    )
    
    if (Item == undefined) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        `Item with id ${id} not found`,
        true
      );
    }

    return Item;
}

export async function deleteChildrenById(id: string): Promise<void> {
  await getChildrenById(id)

  await ddbDocClient.send(
    new DeleteCommand({
      TableName: 'children-api-dev',
      Key: {
        KidId: id,
      },
    })
  )
}

export async function saveChildren(item: Record<string, unknown>): Promise<void> {
    await ddbDocClient.send(
        new PutCommand({
          TableName: 'children-api-dev',
          Item: {
            ...item,
            KidId: uuidv4(),
          },
        })
    )
}
