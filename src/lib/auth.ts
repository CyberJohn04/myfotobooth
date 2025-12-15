/**
 * Authentication Service
 * 
 * Provides mock authentication with localStorage-based user storage.
 * Supports:
 * - User registration (email must end with @gmail.com)
 * - User login (must be pre-registered)
 * - Token management
 * - Email domain validation
 * 
 * ⚠️ PRODUCTION INTEGRATION:
 * Replace all localStorage operations with API calls to your backend:
 * - Replace `getStoredUsers()` with GET /api/users
 * - Replace `saveUsers()` with database transaction
 * - Replace `hashPassword()` with server-side bcrypt hashing
 * - Implement proper JWT token management
 * - Add HTTPS-only, SameSite cookies for token storage
 * 
 * For now, this uses:
 * - localStorage for user database (photobooth_users key)
 * - btoa() for password hashing (NOT SECURE - demo only)
 * - sessionStorage/localStorage for tokens (NOT SECURE - demo only)
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  hashedPasswordStub: string; // btoa(password) in demo; bcrypt hash in production
  createdAt: number;
}

interface UserStore {
  [email: string]: User;
}

const USERS_STORAGE_KEY = 'photobooth_users';
const TOKEN_STORAGE_KEY = 'photobooth_auth_token';
const NETWORK_DELAY_MS = 1200; // Simulate network latency

/**
 * Simple password hashing stub (NOT SECURE - DEMO ONLY)
 * ⚠️ In production, use bcrypt on the backend and send hashed passwords over HTTPS
 */
const hashPassword = (password: string): string => {
  return btoa(password); // Base64 encoding (NOT cryptographically secure)
};

/**
 * Retrieve all stored users from localStorage
 * ⚠️ In production: GET /api/users (with pagination)
 */
const getStoredUsers = (): UserStore => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    console.warn('Failed to parse user store from localStorage');
    return {};
  }
};

/**
 * Save users to localStorage
 * ⚠️ In production: POST/PUT /api/users (database transaction)
 */
const saveUsers = (users: UserStore): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
    throw new Error('Failed to save user data. Please try again.');
  }
};

/**
 * Generate a simple user ID (not cryptographically secure)
 * ⚠️ In production: backend generates UUIDs with proper entropy
 */
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format and domain (@gmail.com only)
 */
const isValidGmailEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  return emailRegex.test(email);
};

/**
 * Public authentication API
 */
export const auth = {
  /**
   * Register a new user
   * ⚠️ In production: POST /api/auth/register with CSRF protection
   * 
   * @param email - User email (must end with @gmail.com)
   * @param password - User password (min 6 chars)
   * @param name - Optional display name
   * @returns Promise resolving with created user
   * @throws Error if validation fails or email already exists
   */
  async register(email: string, password: string, name?: string): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

    // Validate email domain
    if (!isValidGmailEmail(email)) {
      throw new Error('Only @gmail.com accounts are allowed.');
    }

    // Validate password
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // Check if user already exists
    const users = getStoredUsers();
    if (users[email]) {
      throw new Error('Account already exists. Try signing in.');
    }

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email,
      displayName: name?.trim() || email.split('@')[0],
      hashedPasswordStub: hashPassword(password),
      createdAt: Date.now(),
    };

    // Save to store
    users[email] = newUser;
    saveUsers(users);

    return newUser;
  },

  /**
   * Log in an existing user
   * ⚠️ In production: POST /api/auth/login with rate limiting & CSRF
   * 
   * @param email - User email
   * @param password - User password
   * @param remember - Whether to persist token in localStorage (vs sessionStorage)
   * @returns Promise resolving with user (excludes password)
   * @throws Error if email domain invalid, user not found, or password incorrect
   */
  async login(email: string, password: string, remember: boolean = false): Promise<User> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

    // Validate email domain
    if (!isValidGmailEmail(email)) {
      throw new Error('Only @gmail.com accounts are allowed.');
    }

    // Check if user exists in store
    const users = getStoredUsers();
    const user = users[email];

    if (!user) {
      throw new Error('Account not found. Please create an account first.');
    }

    // Verify password
    const hashedInput = hashPassword(password);
    if (hashedInput !== user.hashedPasswordStub) {
      throw new Error('Incorrect password.');
    }

    // Generate mock token
    // ⚠️ In production: backend returns JWT with exp, iat, sub claims
    const mockToken = btoa(`${email}:${Date.now()}:${Math.random()}`);

    // Save token to appropriate storage
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_STORAGE_KEY, mockToken);

    // Return user without password
    const { hashedPasswordStub, ...userPublic } = user as User;
    return userPublic as any;
  },

  /**
   * Log out the current user
   * ⚠️ In production: POST /api/auth/logout to invalidate token on server
   */
  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Get the current auth token
   * ⚠️ In production: verify token hasn't expired; handle refresh tokens
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Check if user is authenticated
   * ⚠️ In production: also verify token signature and expiration
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Check if an email is already registered
   * ⚠️ In production: GET /api/auth/check-email (rate limited)
   */
  isRegistered(email: string): boolean {
    const users = getStoredUsers();
    return !!users[email];
  },

  /**
   * Get currently logged-in user (if any)
   * ⚠️ In production: decode JWT and validate signature
   */
  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    // In a real app, you'd decode the JWT and validate it
    // For now, we'll search for a user; this is a limitation of the mock implementation
    // In production: decode the JWT to get user_id, then query /api/users/{id}
    const users = getStoredUsers();
    for (const user of Object.values(users)) {
      // This is naive; in production we'd use the token payload
      // For now, we'll return the first user (assumes single session)
      return user;
    }
    return null;
  },

  /**
   * Clear all user data (dev/debug only)
   * ⚠️ Never expose this in production UI
   */
  _devClearAllUsers(): void {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('_devClearAllUsers is only available in development mode');
      return;
    }
    localStorage.removeItem(USERS_STORAGE_KEY);
    this.logout();
  },
};
