import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert } from 'react-native';
import SignUp from '../../app/(auth)/sign-up';

// Mock the required dependencies
jest.mock("@clerk/clerk-expo", () => ({
  useSignUp: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  Link: 'Link',
}));

jest.mock("../../constants", () => ({
  icons: {
    person: 'person-icon',
    email: 'email-icon',
    lock: 'lock-icon',
  },
  images: {
    signUpCar: 'car-image',
    check: 'check-image',
  },
}));

jest.mock("@/lib/fetch", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("react-native-modal", () => ({
  ReactNativeModal: ({ children, isVisible }: any) => 
    isVisible ? children : null,
}));

describe('SignUp Component', () => {
  const mockSignUp = {
    create: jest.fn(),
    prepareEmailAddressVerification: jest.fn(),
    attemptEmailAddressVerification: jest.fn(),
  };
  const mockSetActive = jest.fn();

  beforeEach(() => {
    (useSignUp as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      setActive: mockSetActive,
      isLoaded: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    expect(getByText('Create Your Account')).toBeTruthy();
    expect(getByPlaceholderText('Enter name')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
    expect(getByPlaceholderText('Enter password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('handles successful sign up and verification', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    
    // Fill out the form
    fireEvent.changeText(getByPlaceholderText('Enter name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter password'), 'password123');

    // Mock successful sign up
    mockSignUp.create.mockResolvedValueOnce({});
    mockSignUp.prepareEmailAddressVerification.mockResolvedValueOnce({});

    // Click sign up button
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp.create).toHaveBeenCalledWith({
        emailAddress: 'test@example.com',
        password: 'password123',
      });
      expect(mockSignUp.prepareEmailAddressVerification).toHaveBeenCalled();
    });

    // Verify email code
    const mockCompleteSignUp = {
      status: 'complete',
      createdSessionId: 'test-session-id',
      createdUserId: 'test-user-id',
    };
    mockSignUp.attemptEmailAddressVerification.mockResolvedValueOnce(mockCompleteSignUp);

    // Enter verification code
    fireEvent.changeText(getByPlaceholderText('12345'), '54321');
    fireEvent.press(getByText('Verify Email'));

    await waitFor(() => {
      expect(mockSignUp.attemptEmailAddressVerification).toHaveBeenCalledWith({
        code: '54321',
      });
      expect(mockSetActive).toHaveBeenCalledWith({ 
        session: 'test-session-id' 
      });
    });
  });

  it('handles sign up failure', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    
    // Fill out the form
    fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter password'), 'password123');

    // Mock failed sign up
    const errorMessage = 'Email already exists';
    mockSignUp.create.mockRejectedValueOnce({
      errors: [{ longMessage: errorMessage }],
    });

    const alertSpy = jest.spyOn(Alert, 'alert');

    // Click sign up button
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', errorMessage);
    });
  });

  it('handles verification failure', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    
    // Setup successful initial sign up
    mockSignUp.create.mockResolvedValueOnce({});
    mockSignUp.prepareEmailAddressVerification.mockResolvedValueOnce({});

    // Fill and submit form
    fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter password'), 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp.prepareEmailAddressVerification).toHaveBeenCalled();
    });

    // Mock verification failure
    mockSignUp.attemptEmailAddressVerification.mockRejectedValueOnce({
      errors: [{ longMessage: 'Invalid verification code' }],
    });

    // Enter and submit verification code
    fireEvent.changeText(getByPlaceholderText('12345'), 'wrong-code');
    fireEvent.press(getByText('Verify Email'));

    await waitFor(() => {
      expect(getByText('Invalid verification code')).toBeTruthy();
      expect(router.push).toHaveBeenCalledWith('/(root)/(tabs)/home');
    });
  });

  it('does not attempt sign up when not loaded', async () => {
    (useSignUp as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
      setActive: mockSetActive,
      isLoaded: false,
    });

    const { getByText } = render(<SignUp />);
    
    fireEvent.press(getByText('Sign Up'));

    expect(mockSignUp.create).not.toHaveBeenCalled();
  });

  it('navigates to sign in page when link is pressed', () => {
    const { getByText } = render(<SignUp />);
    
    expect(getByText('Log In')).toBeTruthy();
  });
}); 