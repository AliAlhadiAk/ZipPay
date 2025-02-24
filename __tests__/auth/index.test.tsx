import { render, fireEvent } from '@testing-library/react-native';
import { router } from "expo-router";
import Home from '../../app/(auth)';

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("react-native-swiper", () => {
  return function MockSwiper({ children, onIndexChanged }: any) {
    return (
      <div data-testid="mock-swiper" onClick={() => onIndexChanged?.(1)}>
        {children}
      </div>
    );
  };
});

jest.mock("../../constants", () => ({
  onboarding: [
    {
      id: 1,
      title: "Test Title 1",
      description: "Test Description 1",
      image: "test-image-1",
    },
    {
      id: 2,
      title: "Test Title 2",
      description: "Test Description 2",
      image: "test-image-2",
    },
  ],
}));

describe('Home (Onboarding) Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial slide', () => {
    const { getByText, getAllByText } = render(<Home />);
    
    // Check if the skip button is present
    expect(getByText('Skip')).toBeTruthy();
    
    // Check if the first slide content is present
    expect(getByText('Test Title 1')).toBeTruthy();
    expect(getByText('Test Description 1')).toBeTruthy();
    
    // Check if the Next button is present (not Get Started yet)
    expect(getByText('Next')).toBeTruthy();
    expect(getAllByText('Next').length).toBe(1);
  });

  it('navigates to sign-up when skip is pressed', () => {
    const { getByText } = render(<Home />);
    
    fireEvent.press(getByText('Skip'));
    
    expect(router.replace).toHaveBeenCalledWith('/(auth)/sign-up');
  });

  it('changes button text to "Get Started" on last slide', () => {
    const { getByTestId, getByText } = render(<Home />);
    
    // Simulate swipe to last slide
    fireEvent.click(getByTestId('mock-swiper'));
    
    // Check if the button text changed to "Get Started"
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('navigates to sign-up when Get Started is pressed on last slide', () => {
    const { getByTestId, getByText } = render(<Home />);
    
    // Move to last slide
    fireEvent.click(getByTestId('mock-swiper'));
    
    // Press Get Started button
    fireEvent.press(getByText('Get Started'));
    
    expect(router.replace).toHaveBeenCalledWith('/(auth)/sign-up');
  });

  it('displays all onboarding slides with correct content', () => {
    const { getByText } = render(<Home />);
    
    // Check content of all slides
    expect(getByText('Test Title 1')).toBeTruthy();
    expect(getByText('Test Description 1')).toBeTruthy();
    expect(getByText('Test Title 2')).toBeTruthy();
    expect(getByText('Test Description 2')).toBeTruthy();
  });
}); 