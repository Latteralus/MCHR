// pages/login.js
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // For testing, allow hardcoded user
      // In production, this would validate against the database
      if (email === 'FCalkins' && password === 'password') {
        // Use hardcoded credentials with NextAuth
        const result = await signIn('credentials', {
          redirect: false,
          email: 'fcalkins@mountaincare.example',
          password: 'password'
        });
        
        if (result.error) {
          setError('Authentication failed. Please check your credentials.');
        } else {
          router.push('/');
        }
      } else {
        // Regular authentication flow
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        });
        
        if (result.error) {
          setError('Authentication failed. Please check your credentials.');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If still checking authentication, show loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Only show login if not authenticated
  if (session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Mountain Care HR Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
          {/* Display test credentials for testing */}
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 text-center">
              Test with: Username: FCalkins | Password: password
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Username or Email</label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}