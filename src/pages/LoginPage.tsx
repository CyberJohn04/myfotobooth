/**
 * LoginPage Component
 * 
 * Professional login interface for the Photobooth app.
 * 
 * Features:
 * - Responsive design: stacked mobile, side-by-side on desktop
 * - Form validation with inline error messages
 * - Email domain validation (@gmail.com only)
 * - Accessible form with ARIA attributes and keyboard navigation
 * - Loading state with spinner
 * - Remember me checkbox for token persistence
 * - Clear error messages for:
 *   - Invalid email domain (not @gmail.com)
 *   - Account not found (not registered)
 *   - Incorrect password
 * 
 * Integration:
 * 1. Add route to App.tsx: <Route path="/login" element={<LoginPage />} />
 * 2. Redirect unauthenticated users to /login
 * 3. On success, user is redirected to /photobooth
 * 4. Users must be registered (via RegisterPage) before they can log in
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface FormErrors {
  email?: string;
  password?: string;
}

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 */
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
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

export default function LoginPage() {
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for registration success message from location state
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage('Registration successful — please sign in');
      // Clear the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  /**
   * Validates entire form
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

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
      // Call auth service (checks @gmail.com, registered user, password)
      await auth.login(email, password, rememberMe);

      toast({
        title: 'Welcome!',
        description: `Successfully signed in as ${email}`,
      });

      // Redirect to photobooth (or intended page if using ProtectedRoute)
      const from = location.state?.from?.pathname || '/photobooth';
      navigate(from);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setGeneralError(errorMessage);

      // Clear password field on error for security
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if form is valid
   */
  const isFormValid = email && password && !errors.email && !errors.password;

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
            <h1 className="text-4xl font-bold mb-4">Capture Moments</h1>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-sm">
              Create beautiful memories with our cosmic photobooth. Professional quality,
              instant prints, and endless fun.
            </p>
            <div className="mt-8 flex gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Right panel: Login form */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center animate-in fade-in slide-in-from-right-5 duration-500">
          {/* Brand header */}
          <div className="mb-8 text-center md:text-left">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <div className="bg-indigo-600 rounded-lg p-2">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Photobooth</h2>
            </div>
            <p className="text-slate-500 text-sm">Sign in to your account</p>
          </div>

          {/* Success banner */}
          {successMessage && (
            <Alert className="mb-6 animate-in fade-in slide-in-from-top-2 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Error banner */}
          {generalError && (
            <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isFormValid && !loading) {
                    handleSubmit(e as any);
                  }
                }}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isFormValid && !loading) {
                      handleSubmit(e as any);
                    }
                  }}
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

            {/* Remember me checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={loading}
                className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-slate-700 font-normal cursor-pointer"
              >
                Remember me on this device
              </Label>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer links */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
