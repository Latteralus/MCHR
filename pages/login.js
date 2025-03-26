// pages/login.js
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter both username/email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // For testing, allow hardcoded user
      if (credentials.email === 'FCalkins' && credentials.password === 'password') {
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
          email: credentials.email,
          password: credentials.password
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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Only show login if not authenticated
  if (session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Mountain Care HR Platform</title>
        <meta name="description" content="Login to access Mountain Care HR Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <h1 className={styles.title}>Mountain Care HR Platform</h1>
        </div>
        
        <div className={styles.formContainer}>
          <h2 className={styles.subtitle}>Sign in to access your dashboard</h2>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div className={styles.testCredentials}>
            <p>Test with: Username: FCalkins | Password: password</p>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Username or Email</label>
              <input
                id="email"
                name="email"
                type="text"
                value={credentials.email}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="Username or Email"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="Password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <div className={styles.forgotPassword}>
              <a href="#">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Mountain Care. All rights reserved.</p>
      </footer>
    </div>
  );
}