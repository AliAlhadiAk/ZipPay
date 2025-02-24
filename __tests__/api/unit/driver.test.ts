import { GET } from '../../../app/(api)/driver+api';
import { neon } from "@neondatabase/serverless";

jest.mock("@neondatabase/serverless", () => ({
  neon: jest.fn(),
}));

describe('Driver API - Unit Tests', () => {
  const mockSql = jest.fn();
  
  beforeEach(() => {
    (neon as jest.Mock).mockReturnValue(mockSql);
    mockSql.mockReset();
  });

  it('should fetch all drivers successfully', async () => {
    const mockDrivers = [
      { id: 1, name: 'Driver 1' },
      { id: 2, name: 'Driver 2' },
    ];

    mockSql.mockResolvedValueOnce(mockDrivers);

    const mockRequest = new Request('http://localhost/api/driver');
    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data', mockDrivers);
    expect(mockSql).toHaveBeenCalledWith('SELECT * FROM drivers');
  });

  it('should handle database errors', async () => {
    mockSql.mockRejectedValueOnce(new Error('Database error'));

    const mockRequest = new Request('http://localhost/api/driver');
    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
}); 