import { POST } from '../../../app/(api)/ride/create+api';
import { setupTestDatabase } from './setup';
import { neon } from "@neondatabase/serverless";

describe('Ride Creation API - Integration Tests', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('should create and retrieve a ride in the database', async () => {
    const rideData = {
      origin_address: "123 Test Start St",
      destination_address: "456 Test End Ave",
      origin_latitude: 40.7128,
      origin_longitude: -74.0060,
      destination_latitude: 40.7589,
      destination_longitude: -73.9851,
      ride_time: new Date().toISOString(),
      fare_price: 30.00,
      payment_status: "pending",
      driver_id: 1, // Using test driver from setup
      user_id: 1
    };

    const request = new Request('http://localhost/api/ride/create', {
      method: 'POST',
      body: JSON.stringify(rideData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toMatchObject(rideData);

    // Verify in database
    const sql = neon(process.env.TEST_DATABASE_URL);
    const ride = await sql`
      SELECT * FROM rides 
      WHERE origin_address = ${rideData.origin_address}
      AND destination_address = ${rideData.destination_address}
    `;

    expect(ride[0]).toMatchObject({
      origin_address: rideData.origin_address,
      destination_address: rideData.destination_address,
      fare_price: rideData.fare_price,
      payment_status: rideData.payment_status,
    });
  });
}); 