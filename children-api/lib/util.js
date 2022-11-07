export const simpleHttpResponse = (
  body,
  status = 200,
  headers = { 'Content-Type': 'application/json' }
) => ({
  statusCode: status,
  body: JSON.stringify(body, null, 2),
  headers,
})
//# sourceMappingURL=util.js.map
