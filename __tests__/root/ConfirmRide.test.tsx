import { render, fireEvent } from '@testing-library/react-native';
import { router } from "expo-router";
import ConfirmRide from '../../app/(root)/confirm-ride';
import { useDriverStore } from "@/store";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@/store", () => ({
  useDriverStore: jest.fn(),
}));

// Mock RideLayout component
jest.mock("@/components/RideLayout", () => {
  return function MockRideLayout({ children, title }: any) {
    return (
      <div data-testid="mock-ride-layout" title={title}>
        {children}
      </div>
    );
  };
});

// Mock sample drivers data
const mockDrivers = [
  {
    id: '1',
    name: 'John Doe',
    rating: 4.5,
    car: 'Toyota Camry',
    plate: 'ABC123',
  },
  {
    id: '2',
    name: 'Jane Smith',
    rating: 4.8,
    car: 'Honda Civic',
    plate: 'XYZ789',
  },
];

describe('ConfirmRide Component', () => {
  // Setup default mock values
  beforeEach(() => {
    jest.clearAllMocks();
    (useDriverStore as jest.Mock).mockReturnValue({
      drivers: mockDrivers,
      selectedDriver: '1',
      setSelectedDriver: jest.fn(),
    });
  });

  it('renders correctly with drivers list', () => {
    const { getByText, getByTestId } = render(<ConfirmRide />);
    
    // Check if the title is correct
    expect(getByTestId('mock-ride-layout').props.title).toBe('Choose a Rider');
    
    // Check if drivers are rendered
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
    
    // Check if the select ride button is present
    expect(getByText('Select Ride')).toBeTruthy();
  });

  it('handles driver selection', () => {
    const mockSetSelectedDriver = jest.fn();
    (useDriverStore as jest.Mock).mockReturnValue({
      drivers: mockDrivers,
      selectedDriver: '1',
      setSelectedDriver: mockSetSelectedDriver,
    });

    const { getAllByTestId } = render(<ConfirmRide />);
    
    // Find and click on a driver card
    const driverCards = getAllByTestId('driver-card');
    fireEvent.press(driverCards[1]); // Select second driver
    
    expect(mockSetSelectedDriver).toHaveBeenCalledWith('2');
  });

  it('navigates to book-ride when Select Ride is pressed', () => {
    const { getByText } = render(<ConfirmRide />);
    
    const selectRideButton = getByText('Select Ride');
    fireEvent.press(selectRideButton);
    
    expect(router.push).toHaveBeenCalledWith('/(root)/book-ride');
  });

  it('displays empty state when no drivers available', () => {
    (useDriverStore as jest.Mock).mockReturnValue({
      drivers: [],
      selectedDriver: null,
      setSelectedDriver: jest.fn(),
    });

    const { queryByTestId } = render(<ConfirmRide />);
    
    // Check if the FlatList is empty
    expect(queryByTestId('driver-card')).toBeNull();
  });
}); 