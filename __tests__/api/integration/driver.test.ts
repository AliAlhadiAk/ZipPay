import { GET } from '../../../app/(api)/driver+api';
import { setupTestDatabase } from './setup';

describe('Driver API - Integration Tests', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('should fetch all drivers from the database', async () => {
    const request = new Request('http://localhost/api/driver');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
    expect(data.data[0]).toHaveProperty('name', 'Test Driver 1');
    expect(data.data[1]).toHaveProperty('name', 'Test Driver 2');
  });
}); 