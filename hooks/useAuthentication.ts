import { useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

type AuthState = 'idle' | 'loading' | 'success' | 'error';

interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

interface AuthStatus {
  state: AuthState;
  error: AuthError | null;
  isLoading: boolean;
}

interface VerificationState {
  state: 'default' | 'pending' | 'success' | 'failed';
  error: string;
  code: string;
}

interface AuthConfig {
  onAuthSuccess?: () => void;
  onAuthError?: (error: AuthError) => void;
  onVerificationSuccess?: () => void;
  redirectPath?: string;
}

class AuthenticationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const useAuthentication = (config?: AuthConfig) => {
  const [status, setStatus] = useState<AuthStatus>({
    state: 'idle',
    error: null,
    isLoading: false,
  });

  const [verification, setVerification] = useState<VerificationState>({
    state: 'default',
    error: '',
    code: '',
  });

  const { isLoaded, signUp, setActive } = useSignUp();

  const handleAuthError = useCallback((error: unknown): AuthError => {
    if (error instanceof AuthenticationError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
      };
    }

    if (error instanceof Error) {
      return {
        code: 'unknown_error',
        message: error.message,
      };
    }

    if (error && typeof error === 'object' && 'errors' in error) {
      const clerkError = error as { errors: Array<{ longMessage: string }> };
      return {
        code: 'clerk_error',
        message: clerkError.errors[0]?.longMessage || 'Authentication failed',
      };
    }

    return {
      code: 'unknown_error',
      message: 'An unexpected error occurred',
    };
  }, []);

  const updateVerification = useCallback(
    (updates: Partial<VerificationState>) => {
      setVerification((prev) => {
     
        if (
          updates.state &&
          prev.state === 'success' &&
          updates.state !== 'success'
        ) {
          console.warn('Invalid state transition attempted');
          return prev;
        }

        return { ...prev, ...updates };
      });
    },
    []
  );

  const handleSignUp = useCallback(
    async (email: string, password: string) => {
      if (!isLoaded) {
        throw new AuthenticationError(
          'not_ready',
          'Authentication system is not ready'
        );
      }

      try {
        setStatus({ state: 'loading', error: null, isLoading: true });

        await signUp.create({
          emailAddress: email,
          password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });

        updateVerification({ state: 'pending' });
        setStatus({ state: 'success', error: null, isLoading: false });
      } catch (error) {
        const authError = handleAuthError(error);
        setStatus({ state: 'error', error: authError, isLoading: false });
        config?.onAuthError?.(authError);
        Alert.alert('Error', authError.message);
      }
    },
    [isLoaded, signUp, handleAuthError, config?.onAuthError]
  );

  const handleVerification = useCallback(
    async (code: string) => {
      if (!isLoaded) {
        throw new AuthenticationError(
          'not_ready',
          'Authentication system is not ready'
        );
      }

      try {
        setStatus({ state: 'loading', error: null, isLoading: true });

        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (completeSignUp.status === 'complete') {
         
          await Promise.all([
            setActive({ session: completeSignUp.createdSessionId }),
          ]);

          updateVerification({ state: 'success' });
          setStatus({ state: 'success', error: null, isLoading: false });
          
          config?.onVerificationSuccess?.();
          
          if (config?.redirectPath) {
            router.push(config.redirectPath);
          }
        } else {
          throw new AuthenticationError(
            'verification_failed',
            'Verification failed. Please try again.'
          );
        }
      } catch (error) {
        const authError = handleAuthError(error);
        updateVerification({
          error: authError.message,
          state: 'failed',
        });
        setStatus({ state: 'error', error: authError, isLoading: false });
        
        if (config?.redirectPath) {
          router.push(config.redirectPath);
        }
      }
    },
    [isLoaded, signUp, setActive, config, handleAuthError]
  );

  // Memoized derived state
  const authState = useMemo(
    () => ({
      isLoading: status.isLoading,
      isError: status.state === 'error',
      isSuccess: status.state === 'success',
      error: status.error,
      verification,
    }),
    [status, verification]
  );

  // Reset utilities
  const resetAuth = useCallback(() => {
    setStatus({ state: 'idle', error: null, isLoading: false });
    setVerification({ state: 'default', error: '', code: '' });
  }, []);

  return {
    ...authState,
        signUp: handleSignUp,
    verify: handleVerification,
    updateVerification,
    reset: resetAuth,
    
    isReady: isLoaded,
  };
};