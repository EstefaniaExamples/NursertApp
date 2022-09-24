// This is something I half mentioned on Teams, if you add `{"types": ["jest"]}`
//  to your `tsconfig.json` you can avoid having to import things like
//  `describe`, `it`, `test`, etc. in aaaalllll your test files
// And, your tsserver should still be able to find them if you need to inspect
//  them (i.e. your editor should find the definitions)
//
// I prefer `spec` to `test` for the filename for no good reason... just a style
//  thing :D
//
// I prefer `it` to `test` (you can use either, one is an alias of the other)
//  but this time I have a reason: phrasing. Writing meaningful test titles is
//  helped my starting the test with "it", i.e. "I am *describing* the put
//  function and *it* should put some data" - means you can read your tests like
//  a little story

describe('Add function Tests', () => {
  test('Adding 5 and 3 to be number 8', () => {
    expect(8).toBe(8)
  })

  test('Adding 7 and 2 to be string "9"', () => {
    expect(9).toBe('9')
  })

  test('Adding 3 and 2 to be 5', () => {
    expect(5).toBe(5)
  })
})
