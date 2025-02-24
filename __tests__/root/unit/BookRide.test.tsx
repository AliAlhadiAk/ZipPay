import { render, fireEvent } from '@testing-library/react-native';
import { useUser } from "@clerk/clerk-expo";
import BookRide from '../../../app/(root)/book-ride';
import { useDriverStore, useLocationStore } from "@/store";

// Mock dependencies
jest.mock("@clerk/clerk-expo", () => ({
  useUser: jest.fn(),
}));

jest.mock("@stripe/stripe-react-native", () => ({
  StripeProvider: ({ children }: any) => children,
}));

jest.mock("@/store", () => ({
  useDriverStore: jest.fn(),
  useLocationStore: jest.fn(),
}));

jest.mock("@/components/RideLayout", () => {
  return function MockRideLayout({ children }: any) {
    return <div data-testid="ride-layout">{children}</div>;
  };
});

jest.mock("@/components/Payment", () => {
  return function MockPayment(props: any) {
    return <div data-testid="payment-component" {...props} />;
  };
});

describe('BookRide Component - Unit Tests', () => {
  const mockDriver = {
    id: "1",
    title: "John Doe",
    profile_image_url: "http://example.com/profile.jpg",
    rating: 4.8,
    price: 25.50,
    time: "30",
    car_seats: 4
  };

  beforeEach(() => {
    // Setup default mocks
    (useUser as jest.Mock).mockReturnValue({
      user: {
        fullName: "Test User",
        emailAddresses: [{ emailAddress: "test@example.com" }]
      }
    });

    (useDriverStore as jest.Mock).mockReturnValue({
      drivers: [mockDriver],
      selectedDriver: 1
    });

    (useLocationStore as jest.Mock).mockReturnValue({
      userAddress: "123 Start St",
      destinationAddress: "456 End Ave"
    });
  });

  it('renders ride information correctly', () => {
    const { getByText, getByTestId } = render(<BookRide />);

    expect(getByText('Ride Information')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('4.8')).toBeTruthy();
    expect(getByText('$25.5')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
  });

  it('displays addresses correctly', () => {
    const { getByText } = render(<BookRide />);

    expect(getByText('123 Start St')).toBeTruthy();
    expect(getByText('456 End Ave')).toBeTruthy();
  });

  it('passes correct props to Payment component', () => {
    const { getByTestId } = render(<BookRide />);
    const paymentComponent = getByTestId('payment-component');

    expect(paymentComponent).toHaveProperty('fullName', 'Test User');
    expect(paymentComponent).toHaveProperty('email', 'test@example.com');
    expect(paymentComponent).toHaveProperty('amount', 25.50);
    expect(paymentComponent).toHaveProperty('driverId', "1");
    expect(paymentComponent).toHaveProperty('rideTime', "30");
  });

  it('handles missing driver data gracefully', () => {
    (useDriverStore as jest.Mock).mockReturnValue({
      drivers: [],
      selectedDriver: null
    });

    const { queryByText } = render(<BookRide />);
    
    expect(queryByText('Ride Information')).toBeTruthy();
    expect(queryByText('$')).toBeNull();
  });
}); 