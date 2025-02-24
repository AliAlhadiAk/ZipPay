import { POST } from '../../../app/(api)/users+api';
import { neon } from "@neondatabase/serverless";

// Mock neon database
jest.mock("@neondatabase/serverless", () => ({
  neon: jest.fn(),
}));

describe('Users API - Unit Tests', () => {
  const mockSql = jest.fn();
  
  beforeEach(() => {
    (neon as jest.Mock).mockReturnValue(mockSql);
    mockSql.mockReset();
  });

  it('should create a new user with valid data', async () => {
    const mockRequest = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        clerkId: 'clerk_123',
      }),
    });

    mockSql.mockResolvedValueOnce([{ id: 1 }]);

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('data');
    expect(mockSql).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users')
    );
  });

  it('should return 400 for missing required fields', async () => {
    const mockRequest = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        // missing email and clerkId
      }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should handle database errors', async () => {
    const mockRequest = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        clerkId: 'clerk_123',
      }),
    });

    mockSql.mockRejectedValueOnce(new Error('Database error'));

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
}); 