// Database setup for integration tests
import { neon } from "@neondatabase/serverless";

export const setupTestDatabase = async () => {
  const sql = neon(process.env.TEST_DATABASE_URL);
  
  // Clear test database
  await sql`TRUNCATE TABLE users, drivers, rides CASCADE`;
  
  // Add test data
  await sql`
    INSERT INTO drivers (
      id,
      first_name,
      last_name,
      profile_image_url,
      car_image_url,
      car_seats,
      rating
    ) VALUES 
      (1, 'Test', 'Driver', 'http://example.com/profile.jpg', 'http://example.com/car.jpg', 4, 4.5)
  `;

  await sql`
    INSERT INTO users (id, name, email, clerk_id)
    VALUES
      (1, 'Test User', 'test@example.com', 'clerk_test_123')
  `;
}; 