import { GET } from '../../../app/(api)/ride/[id]+api';
import { neon } from "@neondatabase/serverless";

jest.mock("@neondatabase/serverless", () => ({
  neon: jest.fn(),
}));

describe('Ride By ID API - Unit Tests', () => {
  const mockSql = jest.fn();
  
  beforeEach(() => {
    (neon as jest.Mock).mockReturnValue(mockSql);
    mockSql.mockReset();
  });

  it('should fetch ride details successfully', async () => {
    const mockRideData = [{
      ride_id: 1,
      origin_address: "123 Start St",
      destination_address: "456 End Ave",
      origin_latitude: 40.7128,
      origin_longitude: -74.0060,
      destination_latitude: 40.7589,
      destination_longitude: -73.9851,
      ride_time: "2024-02-20T10:00:00Z",
      fare_price: 25.50,
      payment_status: "completed",
      created_at: "2024-02-20T10:00:00Z",
      driver: {
        driver_id: 1,
        first_name: "John",
        last_name: "Doe",
        profile_image_url: "http://example.com/profile.jpg",
        car_image_url: "http://example.com/car.jpg",
        car_seats: 4,
        rating: 4.5
      }
    }];

    mockSql.mockResolvedValueOnce(mockRideData);

    const mockRequest = new Request('http://localhost/api/ride/1');
    const response = await GET(mockRequest, { id: "1" });
    const data = await response.json();

    expect(data).toHaveProperty('data', mockRideData);
    expect(mockSql).toHaveBeenCalledWith(
      expect.stringContaining('SELECT')
    );
  });

  it('should return 400 for missing ID', async () => {
    const mockRequest = new Request('http://localhost/api/ride/');
    const response = await GET(mockRequest, { id: "" });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should handle database errors', async () => {
    mockSql.mockRejectedValueOnce(new Error('Database error'));

    const mockRequest = new Request('http://localhost/api/ride/1');
    const response = await GET(mockRequest, { id: "1" });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
}); 