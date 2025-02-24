import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import SignIn from '../../app/(auth)/sign-in';
import { Alert } from 'react-native';

// Mock the required dependencies
jest.mock("@clerk/clerk-expo", () => ({
  useSignIn: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
  Link: 'Link',
}));

jest.mock("../../constants", () => ({
  icons: {
    email: 'email-icon',
    lock: 'lock-icon',
  },
  images: {
    signUpCar: 'car-image',
  },
}));

describe('SignIn Component', () => {
  // Setup default mocks before each test
  const mockSignIn = {
    create: jest.fn(),
  };
  const mockSetActive = jest.fn();

  beforeEach(() => {
    (useSignIn as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      setActive: mockSetActive,
      isLoaded: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    
    expect(getByText('Welcome 👋')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
    expect(getByPlaceholderText('Enter password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('handles successful sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');
    const signInButton = getByText('Sign In');

    // Simulate user input
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Mock successful sign in
    mockSignIn.create.mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'test-session-id',
    });

    // Trigger sign in
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn.create).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetActive).toHaveBeenCalledWith({
        session: 'test-session-id',
      });
      expect(router.replace).toHaveBeenCalledWith('/(root)/(tabs)/home');
    });
  });

  it('handles sign in failure', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');
    const signInButton = getByText('Sign In');

    // Simulate user input
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrong-password');

    // Mock failed sign in
    mockSignIn.create.mockRejectedValueOnce({
      errors: [{ longMessage: 'Invalid credentials' }],
    });

    // Spy on Alert.alert
    const alertSpy = jest.spyOn(Alert, 'alert');

    // Trigger sign in
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn.create).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Invalid credentials');
    });
  });

  it('does not attempt sign in when not loaded', async () => {
    // Mock useSignIn to return isLoaded as false
    (useSignIn as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      setActive: mockSetActive,
      isLoaded: false,
    });

    const { getByText } = render(<SignIn />);
    
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    expect(mockSignIn.create).not.toHaveBeenCalled();
  });

  it('navigates to sign up page when link is pressed', () => {
    const { getByText } = render(<SignIn />);
    
    const signUpLink = getByText('Sign Up');
    expect(signUpLink).toBeTruthy();
  });
}); 