/**
 * RegisterPage Component
 * 
 * User registration interface for the Photobooth app.
 * 
 * Features:
 * - Registration form: Full name (optional), Email, Password, Confirm Password
 * - Email domain validation (@gmail.com only)
 * - Password match validation
 * - Clear error messages for:
 *   - Invalid email domain (not @gmail.com)
 *   - Account already exists
 *   - Password too short
 *   - Passwords don't match
 * - Loading state with spinner
 * - Redirect to login after successful registration
 * - Accessible form with ARIA attributes
 * 
 * Integration:
 * 1. Add route to App.tsx: <Route path="/register" element={<RegisterPage />} />
 * 2. Users navigate here from login page "Create one" link
 * 3. After successful registration, user is redirected to /login with success message
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format and domain (@gmail.com)
 */
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  if (!email.endsWith('@gmail.com')) {
    return 'Only @gmail.com accounts are allowed.';
  }
  return undefined;
};

/**
 * Validates password strength
 */
const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return undefined;
};

/**
 * Validates that passwords match
 */
const validatePasswordMatch = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};

export default function RegisterPage() {
  // Navigation
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');

  // Clear errors when user starts typing
  useEffect(() => {
    if (email && errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  }, [email, errors.email]);

  useEffect(() => {
    if (password && errors.password) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  }, [password, errors.password]);

  useEffect(() => {
    if (confirmPassword && errors.confirmPassword) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  }, [confirmPassword, errors.confirmPassword]);

  /**
   * Validates entire form
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validatePasswordMatch(password, confirmPassword);
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call auth service to register new user
      // This will throw if email already exists or domain is not @gmail.com
      await auth.register(email, password, name);

      toast({
        title: 'Account Created!',
        description: 'Your account has been successfully created. Please sign in.',
      });

      // Redirect to login with success message
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setGeneralError(errorMessage);

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if form is valid
   */
  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Desktop side-by-side layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left panel: Illustration (desktop only) */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
                <Camera className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Join the Fun!</h1>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-sm">
              Create your account now for instant prints and endless fun!
            </p>
            <div className="mt-8 flex gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Right panel: Registration form */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center animate-in fade-in slide-in-from-right-5 duration-500">
          {/* Back link */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>

          {/* Brand header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 rounded-lg p-2">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
            </div>
            <p className="text-slate-500 text-sm">Join the photobooth community</p>
          </div>

          {/* Error banner */}
          {generalError && (
            <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full name field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-10 transition-colors border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`h-10 transition-colors ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-xs text-red-600 font-medium animate-in fade-in"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`h-10 pr-10 transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-xs text-red-600 font-medium animate-in fade-in"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  className={`h-10 pr-10 transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="text-xs text-red-600 font-medium animate-in fade-in"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Requirements hint */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Requirements:</strong> Email must end with @gmail.com, password 6+ characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
