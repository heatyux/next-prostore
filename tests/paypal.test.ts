import { generateAccessToken, paypal } from '../lib/paypal'

// Test to generate access token for PayPal
test('generate a PayPal access token', async () => {
  const tokenResponse = await generateAccessToken()
  console.log(tokenResponse)
  // Should be a string that is not empty
  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})

// Test to create a PayPal order
test('create a PayPal order', async () => {
  const price = 10.0 // Example price for testing

  const orderResponse = await paypal.createOrder(price)
  console.log(orderResponse)

  // Ensure the order response contains expected fields
  expect(orderResponse).toHaveProperty('id')
  expect(orderResponse).toHaveProperty('status')
  expect(orderResponse.status).toBe('CREATED')
})

// Test to capture payment with mock order
test('simulates capturing a payment from an order', async () => {
  const orderId = '100' // Mock order ID

  // Mock the capturePayment function to return a successful response
  const mockCapturePayment = jest
    .spyOn(paypal, 'capturePayment')
    .mockResolvedValue({
      status: 'COMPLETED',
    })

  // Call the capturePayment function with the mock order ID
  const captureResponse = await paypal.capturePayment(orderId)
  // Ensure the capture response contains expected fields
  expect(captureResponse).toHaveProperty('status', 'COMPLETED')

  // Clean up mock
  mockCapturePayment.mockRestore()
})
