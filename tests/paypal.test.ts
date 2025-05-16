import { generateAccessToken } from '../lib/paypal'

// Test to generate access token for PayPal
test('generate a PayPal access token', async () => {
  const tokenResponse = await generateAccessToken()
  console.log(tokenResponse)
  // Should be a string that is not empty
  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})
