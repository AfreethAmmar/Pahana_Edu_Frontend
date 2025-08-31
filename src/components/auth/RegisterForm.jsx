import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validateRequired, validatePassword } from '../../utils/helpers';
import { FORM_VALIDATION, USER_ROLES } from '../../utils/constants';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const RegisterForm = ({ onSuccess, allowedRoles = [USER_ROLES.CUSTOMER] }) => {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: allowedRoles[0] || USER_ROLES.CUSTOMER,
      phone: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match'
        });
        return;
      }

      const { confirmPassword, ...userData } = data;
      
      const result = await registerUser(userData);

      if (result.success) {
        onSuccess?.();
      } else {
        setError('root', {
          type: 'manual',
          message: result.message || 'Registration failed'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred'
      });
    }
  };

  const roleOptions = allowedRoles.map(role => ({
    value: role,
    label: role.charAt(0) + role.slice(1).toLowerCase()
  }));

  const userIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const emailIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const phoneIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const passwordIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Pahana Educational Bookshop
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="First Name"
              type="text"
              required
              icon={userIcon}
              placeholder="Enter first name"
              error={errors.firstName?.message}
              {...register('firstName', {
                required: FORM_VALIDATION.REQUIRED,
                maxLength: {
                  value: 50,
                  message: FORM_VALIDATION.MAX_LENGTH(50)
                }
              })}
            />

            <Input
              id="lastName"
              label="Last Name"
              type="text"
              required
              icon={userIcon}
              placeholder="Enter last name"
              error={errors.lastName?.message}
              {...register('lastName', {
                required: FORM_VALIDATION.REQUIRED,
                maxLength: {
                  value: 50,
                  message: FORM_VALIDATION.MAX_LENGTH(50)
                }
              })}
            />
          </div>

          <Input
            id="username"
            label="Username"
            type="text"
            required
            icon={userIcon}
            placeholder="Choose a username"
            error={errors.username?.message}
            {...register('username', {
              required: FORM_VALIDATION.REQUIRED,
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 30,
                message: FORM_VALIDATION.MAX_LENGTH(30)
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
              }
            })}
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            required
            icon={emailIcon}
            placeholder="Enter email address"
            error={errors.email?.message}
            {...register('email', {
              required: FORM_VALIDATION.REQUIRED,
              validate: (value) => {
                if (!validateEmail(value)) {
                  return FORM_VALIDATION.EMAIL;
                }
                return true;
              }
            })}
          />

          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            icon={phoneIcon}
            placeholder="Enter phone number"
            error={errors.phone?.message}
            {...register('phone', {
              pattern: {
                value: /^[+]?[\d\s\-\(\)]+$/,
                message: 'Please enter a valid phone number'
              }
            })}
          />

          {allowedRoles.length > 1 && (
            <Select
              id="role"
              label="Role"
              required
              options={roleOptions}
              error={errors.role?.message}
              {...register('role', {
                required: FORM_VALIDATION.REQUIRED
              })}
            />
          )}

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              icon={passwordIcon}
              placeholder="Create a password"
              error={errors.password?.message}
              hint="Password must be at least 6 characters long"
              {...register('password', {
                required: FORM_VALIDATION.REQUIRED,
                minLength: {
                  value: 6,
                  message: FORM_VALIDATION.MIN_PASSWORD
                },
                validate: (value) => {
                  if (!validatePassword(value)) {
                    return FORM_VALIDATION.MIN_PASSWORD;
                  }
                  return true;
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

          <div className="relative">
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              icon={passwordIcon}
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: FORM_VALIDATION.REQUIRED,
                validate: (value) => {
                  if (value !== password) {
                    return 'Passwords do not match';
                  }
                  return true;
                }
              })}
            />
            
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
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

          {errors.root?.message && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {errors.root.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            size="lg"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;