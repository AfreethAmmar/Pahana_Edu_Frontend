import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validateRequired } from '../../utils/helpers';
import { FORM_VALIDATION } from '../../utils/constants';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm = ({ onSuccess }) => {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await login({
        username: data.username,
        password: data.password
      });

      if (result.success) {
        onSuccess?.();
      } else {
        setError('root', {
          type: 'manual',
          message: result.message || 'Login failed'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred'
      });
    }
  };

  const emailIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const passwordIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Pahana Educational Bookshop Management System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="username"
              label="Username or Email"
              type="text"
              autoComplete="username"
              required
              icon={emailIcon}
              placeholder="Enter your username or email"
              error={errors.username?.message}
              {...register('username', {
                required: FORM_VALIDATION.REQUIRED,
                validate: (value) => {
                  if (!validateRequired(value)) {
                    return FORM_VALIDATION.REQUIRED;
                  }
                  return true;
                }
              })}
            />

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                icon={passwordIcon}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: FORM_VALIDATION.REQUIRED,
                  minLength: {
                    value: 6,
                    message: FORM_VALIDATION.MIN_PASSWORD
                  }
                })}
              />
              
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {(errors.root?.message || error) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {errors.root?.message || error}
                  </p>
                  {(errors.root?.message || error)?.includes('CORS') && (
                    <div className="mt-2 text-xs text-red-600">
                      <p>💡 <strong>Quick Fix:</strong> Please ensure your backend server is running on port 8081 and has CORS enabled.</p>
                      <p>See CORS_SETUP.md for detailed configuration instructions.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button 
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 underline"
                onClick={() => {
                  // TODO: Implement forgot password functionality
                  console.log('Forgot password clicked');
                }}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo Credentials: admin / password
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;