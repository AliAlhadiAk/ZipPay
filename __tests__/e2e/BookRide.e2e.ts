import { device, element, by, expect } from 'detox';

describe('Book Ride Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    // Login user first (implement login helper)
    await loginTestUser();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full booking flow', async () => {
   
    await element(by.text('Book a Ride')).tap();

    await element(by.id('pickup-input')).typeText('123 Start St');
    await element(by.text('123 Start St')).tap();

    await element(by.id('destination-input')).typeText('456 End Ave');
    await element(by.text('456 End Ave')).tap();

    await element(by.id('driver-card-1')).tap();
    await element(by.text('Select Ride')).tap();

    await expect(element(by.text('Ride Information'))).toBeVisible();
    await expect(element(by.text('$25.50'))).toBeVisible();

    await element(by.id('card-input')).typeText('4242424242424242');
    await element(by.id('expiry-input')).typeText('1225');
    await element(by.id('cvc-input')).typeText('123');
    
    await element(by.text('Pay Now')).tap();

    await expect(element(by.text('Booking Confirmed'))).toBeVisible();
  });

  it('should handle payment failure gracefully', async () => {
 

    await element(by.id('card-input')).typeText('4000000000000002'); // Declined card
    await element(by.id('expiry-input')).typeText('1225');
    await element(by.id('cvc-input')).typeText('123');
    
    await element(by.text('Pay Now')).tap();

    await expect(element(by.text('Payment Failed'))).toBeVisible();
  });
});

async function loginTestUser() {
  await element(by.id('email-input')).typeText('test@example.com');
  await element(by.id('password-input')).typeText('password123');
  await element(by.text('Sign In')).tap();
} 