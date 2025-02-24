import { POST } from '../../../app/(api)/ride/create+api';
import { neon } from "@neondatabase/serverless";

jest.mock("@neondatabase/serverless", () => ({
  neon: jest.fn(),
}));

describe('Ride Creation API - Unit Tests', () => {
  const mockSql = jest.fn();
  
  beforeEach(() => {
    (neon as jest.Mock).mockReturnValue(mockSql);
    mockSql.mockReset();
  });

  const validRideData = {
    origin_address: "123 Start St",
    destination_address: "456 End Ave",
    origin_latitude: 40.7128,
    origin_longitude: -74.0060,
    destination_latitude: 40.7589,
    destination_longitude: -73.9851,
    ride_time: "2024-02-20T10:00:00Z",
    fare_price: 25.50,
    payment_status: "pending",
    driver_id: 1,
    user_id: 1
  };

  it('should create a new ride with valid data', async () => {
    const mockRequest = new Request('http://localhost/api/ride/create', {
      method: 'POST',
      body: JSON.stringify(validRideData),
    });

    mockSql.mockResolvedValueOnce([{ id: 1, ...validRideData }]);

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.data).toMatchObject(validRideData);
    expect(mockSql).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO rides')
    );
  });

  it('should return 400 for missing required fields', async () => {
    const invalidData = {
      origin_address: "123 Start St",
      // Missing other required fields
    };

    const mockRequest = new Request('http://localhost/api/ride/create', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should handle database errors', async () => {
    const mockRequest = new Request('http://localhost/api/ride/create', {
      method: 'POST',
      body: JSON.stringify(validRideData),
    });

    mockSql.mockRejectedValueOnce(new Error('Database error'));

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
}); 