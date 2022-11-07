import middy from '@middy/core'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ZodError } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { simpleHttpResponse } from '../util.js'
import { ddbDocClient } from '../dynamodb.js'
import { kidSchema } from './kid.js'
const put = async event => {
  console.log(event.body)
  if (event.body) {
    const item = kidSchema.parse(JSON.parse(event.body))
    return await ddbDocClient
      .send(
        new PutCommand({
          TableName: 'children-api-dev',
          Item: {
            KidId: uuidv4(),
            KidName: item.KidName,
            KidSurname: item.KidSurname,
            BirthDate: item.BirthDate,
            Address: item.Address,
          },
        })
      )
      .then(data => {
        console.log('Success - item added or updated', data)
        return simpleHttpResponse({ item }, 201)
      })
  } else {
    return simpleHttpResponse({ message: 'The body cannot be empty' }, 400)
  }
}
const wrapper = async event =>
  put(event).catch(err => {
    if (err instanceof ZodError) {
      return simpleHttpResponse({ message: 'Error in the request body' }, 400)
    }
    return simpleHttpResponse({ message: err.message }, 500)
  })
export const handler = middy(wrapper)
//# sourceMappingURL=put.js.map
