import { POST } from '../../../app/(api)/users+api';
import { setupTestDatabase } from './setup';

describe('Users API - Integration Tests', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('should create and retrieve a user in the database', async () => {
    const userData = {
      name: 'Integration Test User',
      email: 'integration@test.com',
      clerkId: 'clerk_test_123',
    };

    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('data');

    // Verify in database
    const sql = neon(process.env.TEST_DATABASE_URL);
    const user = await sql`
      SELECT * FROM users WHERE email = ${userData.email}
    `;

    expect(user[0]).toMatchObject({
      name: userData.name,
      email: userData.email,
      clerk_id: userData.clerkId,
    });
  });
}); 