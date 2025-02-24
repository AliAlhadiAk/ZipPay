import { GET } from '../../../app/(api)/ride/[id]+api';
import { setupTestDatabase } from './setup';
import { neon } from "@neondatabase/serverless";

describe('Ride By ID API - Integration Tests', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('should fetch ride details from database', async () => {
    // First create a test ride
    const sql = neon(process.env.TEST_DATABASE_URL);
    const testRide = await sql`
      INSERT INTO rides (
        origin_address,
        destination_address,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        ride_time,
        fare_price,
        payment_status,
        driver_id,
        user_id
      ) VALUES (
        '123 Test St',
        '456 Test Ave',
        40.7128,
        -74.0060,
        40.7589,
        -73.9851,
        NOW(),
        30.00,
        'completed',
        1,
        1
      ) RETURNING user_id;
    `;

    const userId = testRide[0].user_id;

    // Now fetch the ride details
    const request = new Request('http://localhost/api/ride/1');
    const response = await GET(request, { id: userId.toString() });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
    expect(data.data[0]).toMatchObject({
      origin_address: '123 Test St',
      destination_address: '456 Test Ave',
      payment_status: 'completed',
      driver: expect.objectContaining({
        first_name: expect.any(String),
        last_name: expect.any(String)
      })
    });
  });
}); 