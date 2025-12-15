/**
 * QUICK REFERENCE CARD
 * Photobooth Login Page Implementation
 * 
 * This file serves as a quick lookup guide for common tasks and API references.
 */

// ============================================================================
// 1. COMPONENT USAGE
// ============================================================================

// Add to your app routing:
// import LoginPage from '@/pages/LoginPage';
// 
// <Route path="/login" element={<LoginPage />} />

// ============================================================================
// 2. AUTHENTICATION API
// ============================================================================

import { auth } from '@/lib/auth';

// Check if user is authenticated
if (auth.isAuthenticated()) {
  console.log('User is logged in');
}

// Get stored token
const token = auth.getToken();
console.log('Token:', token);

// Manually log out user
auth.logout();

// Manual login (called internally by component):
// const response = await auth.login('email@example.com', 'password', true);
// response.token    // JWT token
// response.user.id  // User ID
// response.user.email // User email

// ============================================================================
// 3. FORM VALIDATION FUNCTIONS
// ============================================================================

// Email validation regex
// /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password requirements:
// - Minimum 6 characters
// - No special requirements (customize as needed)

// ============================================================================
// 4. STYLING CUSTOMIZATION
// ============================================================================

// Theme colors (replace all instances):
// indigo-50   -> teal-50
// indigo-100  -> teal-100
// indigo-600  -> teal-600
// indigo-700  -> teal-700
// indigo-800  -> teal-800

// Logo icon (replace Camera):
// lucide-react icons: https://lucide.dev
// <Lock /> <Key /> <User /> <Shield /> etc.

// ============================================================================
// 5. ERROR HANDLING
// ============================================================================

// Form errors object:
interface FormErrors {
  email?: string;     // "Email is required" | "Please enter a valid email address"
  password?: string;  // "Password is required" | "Password must be at least 6 characters"
}

// General error (API/server errors):
const generalError = "Server error. Please try again later.";

// Errors are automatically shown via:
// - Inline error messages below each field
// - Alert banner for general errors
// - Toast notifications (useToast hook)

// ============================================================================
// 6. PRODUCTION API INTEGRATION TEMPLATE
// ============================================================================

// File: src/lib/auth.ts
// Replace the login() function with this template:

/*
export const auth = {
  async login(email: string, password: string, remember: boolean) {
    try {
      // 1. Call your backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // 2. Handle HTTP errors
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      // 3. Parse response
      const data = await response.json();

      // 4. Return in expected format
      return {
        token: data.token,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      };
    } catch (error) {
      // 5. Handle errors
      throw error;
    }
  },
};
*/

// ============================================================================
// 7. TOKEN STORAGE STRATEGIES
// ============================================================================

// Current (basic):
// localStorage  - Persists after browser close
// sessionStorage - Cleared on browser close

// Recommended (secure):
// HTTP-only cookie - Backend sets, not accessible via JavaScript

// Advanced (token rotation):
// - Short-lived access token (15 min) in memory or sessionStorage
// - Long-lived refresh token (7 days) in HTTP-only cookie
// - Refresh access token before expiry

// ============================================================================
// 8. PROTECTED ROUTE USAGE
// ============================================================================

// Already implemented in App.tsx:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>

// Unauthenticated users are automatically redirected to /login
// Token is checked via: auth.isAuthenticated()

// ============================================================================
// 9. LOGOUT FUNCTIONALITY
// ============================================================================

// In any component:
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/auth';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();           // Clear token
    navigate('/login');      // Redirect to login
  };

  return <button onClick={handleLogout}>Log Out</button>;
}

// ============================================================================
// 10. ACCESSIBILITY CHECKLIST
// ============================================================================

// Already implemented:
// ✅ Semantic HTML (form, label, input)
// ✅ Form labels with htmlFor
// ✅ aria-invalid on error fields
// ✅ aria-describedby linking errors to fields
// ✅ Keyboard navigation (Tab, Enter)
// ✅ Focus management (visible focus outlines)
// ✅ Error announcements (screen reader friendly)
// ✅ Proper color contrast (WCAG AA)
// ✅ Loading state indication
// ✅ Tooltips on hover (eye icon)

// To test:
// - Browser DevTools: Accessibility tree
// - Screen reader: NVDA (Windows), VoiceOver (Mac)
// - Keyboard: Tab through, use only keyboard, no mouse

// ============================================================================
// 11. TESTING EXAMPLES
// ============================================================================

// Unit test template:
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import LoginPage from '@/pages/LoginPage';

// test('should show email error', async () => {
//   const user = userEvent.setup();
//   render(<BrowserRouter><LoginPage /></BrowserRouter>);
//   
//   const emailInput = screen.getByPlaceholderText('you@example.com');
//   await user.type(emailInput, 'invalid');
//   await user.click(screen.getByRole('button', { name: /sign in/i }));
//   
//   expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
// });

// See: src/__tests__/pages/LoginPage.test.example.tsx for complete examples

// ============================================================================
// 12. COMMON ERRORS & SOLUTIONS
// ============================================================================

// Error: "useNavigate must be used within Router"
// Solution: Component must be wrapped in <BrowserRouter> (already done in App.tsx)

// Error: "Cannot find module '@/components/ui/button'"
// Solution: Run `npm install` to install shadcn/ui components

// Error: "Email validation too strict/lenient"
// Solution: Edit EMAIL_REGEX in LoginPage.tsx (currently: /^[^\s@]+@[^\s@]+\.[^\s@]+$/)

// Error: "Token not saving to localStorage"
// Solution: Check browser DevTools → Application → Storage
//            Ensure auth.login() correctly calls storage.setItem()

// Error: "Redirect not working after login"
// Solution: Verify navigate() is called with correct path ('/photobooth' or your custom path)

// ============================================================================
// 13. ENVIRONMENT VARIABLES (Optional)
// ============================================================================

// Add to .env file:
// VITE_API_BASE_URL=https://api.example.com
// VITE_LOGIN_ENDPOINT=/api/auth/login
// VITE_REDIRECT_PATH=/photobooth
// VITE_SESSION_TIMEOUT=1800000

// Access in code:
// const apiBase = import.meta.env.VITE_API_BASE_URL;

// ============================================================================
// 14. STYLING BREAKPOINTS (Tailwind)
// ============================================================================

// Mobile-first approach:
// sm  640px   - Small devices
// md  768px   - Medium devices (tablet)
// lg  1024px  - Large devices (desktop)
// xl  1280px  - Extra large
// 2xl 1536px  - Ultra wide

// Example responsive class:
// className="grid-cols-1 md:grid-cols-2"
// = 1 column on mobile, 2 columns on tablet+

// ============================================================================
// 15. FILE STRUCTURE REFERENCE
// ============================================================================

// Generated files:
// src/pages/LoginPage.tsx                    (Component)
// src/lib/auth.ts                            (Auth service)
// src/__tests__/pages/LoginPage.test.example.tsx (Tests)
// src/App.tsx                                (Updated with routes)
// LOGIN_INTEGRATION_GUIDE.ts                 (Detailed guide)
// LOGIN_PAGE_README.md                       (Full documentation)
// LOGIN_PAGE_QUICK_REFERENCE.ts              (This file)

// Existing dependencies:
// react, react-router-dom, tailwindcss
// lucide-react (icons)
// @/components/ui/* (shadcn components)
// @/hooks/use-toast (toast notifications)

// ============================================================================
// 16. NEXT STEPS CHECKLIST
// ============================================================================

// Immediate (Day 1):
// ☐ Review LoginPage.tsx component
// ☐ Test login flow at http://localhost:8080/login
// ☐ Test form validation
// ☐ Review accessibility features

// Short-term (Week 1):
// ☐ Integrate with real backend API
// ☐ Implement password reset flow
// ☐ Implement account creation flow
// ☐ Add logout button to navbar
// ☐ Test on mobile devices

// Medium-term (Week 2-3):
// ☐ Set up HTTPS for auth endpoints
// ☐ Implement token refresh logic
// ☐ Add 2FA support (if required)
// ☐ Set up error logging (Sentry, LogRocket)
// ☐ Write unit tests

// Before production:
// ☐ Security audit (OWASP Top 10)
// ☐ Performance testing (Lighthouse, WebPageTest)
// ☐ Accessibility audit (axe, WAVE)
// ☐ Cross-browser testing
// ☐ Load testing with real backend
// ☐ Remove demo credentials hint
// ☐ Set up rate limiting
// ☐ Implement session timeout

// ============================================================================

export {};
