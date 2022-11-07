import { when } from 'jest-when'
import * as AWSMock from "aws-sdk-mock";
import { DocumentClient, GetItemInput } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";

import { handler } from "./get";


describe('Add function Tests', () => {
  beforeAll(() => {
    process.env.tablename = "dummyTableName";
    process.env.AWS_REGION = "us-west-2";
  });

  test("To Test if get function gets the correct values", async () => {
    const validReturnItems: any = {
      orderId: "order123",
      returnId: "sku123",
      date: new Date("2021-05-01T01:01:01+0000"),
      sku: "10146121001",
      skuDescription: "Gold Look Clear Dome Stud Gladiator Sandals - 6",
      quantity: 1,
      countryOfOrigin: "PK",
      reason: {
        id: 1,
        name: "Fit - Too small",
      },
      returningCountry: "US",
    };

    const response: DocumentClient.ItemResponse = {
      Item: validReturnItems,
    };

    // Overwriting DynamoDB.DocumentClient.get()
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("DynamoDB.DocumentClient", "get", (params: GetItemInput, callback) => {
      console.log("DynamoDB", "getITem", "mockCalled");
      console.log(`called with Table name ${params.TableName}`);
      callback(null, response);
    });

    const returnItem: any = await handler();

    expect(returnItem).toEqual(validReturnItems);
  });
});

  test('Adding 5 and 3 to be number 8', () => {
    expect(8).toBe(8)
  })

  test('Adding 3 and 2 to be 5', () => {
    expect(5).toBe(5)
  })

  test('Trying jest when', () => {
    const fn = jest.fn()

    when(fn).calledWith(1, expect.anything()).mockReturnValueOnce('yay! 1').mockReturnValue('yay! 2')
    when(fn).calledWith(2, expect.anything()).mockReturnValue('nay!')

    expect(fn(1, 'arg')).toBe('yay! 1')
    expect(fn(1, { whatever: "value" })).toBe('yay! 2')
    expect(fn(2, 'does not matter')).toBe('nay!')
  })

  // test('Trying jest when spyOn', () => {
  //   const theSpiedMethod = jest.spyOn('./get', 'handler')

  //   when(theSpiedMethod).calledWith(1).mockReturnValueOnce('mock')

  //   const returnValue = handler.apply
  //   expect(returnValue).toBe('mock')
  // })
})
