import middy from '@middy/core'
import { simpleHttpResponse } from '../util'
const eat = async event => {
  console.log('INFO: Starting meals handler')
  return simpleHttpResponse(
    {
      message: 'Welcome to the meals function',
      input: event,
    },
    200
  )
}
const wrapper = async event =>
  eat(event).catch(err =>
    simpleHttpResponse(
      {
        error: 'An error has occurred',
        message: err.message,
      },
      500
    )
  )
export const handler = middy(wrapper)
//# sourceMappingURL=eat.js.map
