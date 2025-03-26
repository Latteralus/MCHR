import { useState } from 'react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login({ csrfToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Mountain Care HR</title>
        <meta name="description" content="Login to Mountain Care HR Management System" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src="/images/logo.png" alt="Mountain Care Logo" className="login-logo" />
            <h1 className="login-title">Mountain Care HR</h1>
          </div>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--gray-100);
          padding: 2rem;
        }
        
        .login-card {
          background: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 400px;
          padding: 2rem;
        }
        
        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .login-logo {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
        }
        
        .login-title {
          font-size: 1.5rem;
          color: var(--primary);
          font-weight: 700;
        }
        
        .error-message {
          background-color: rgba(244, 67, 54, 0.1);
          color: var(--danger);
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
        }
        
        .error-message i {
          margin-right: 0.5rem;
        }
        
        .login-form {
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-with-icon i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
        }
        
        .input-with-icon input {
          padding-left: 2.5rem;
        }
        
        .btn-login {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .btn-login:hover {
          background-color: var(--primary-dark);
        }
        
        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .btn-login i {
          margin-right: 0.5rem;
        }
        
        .login-footer {
          text-align: center;
        }
        
        .forgot-password {
          font-size: 0.875rem;
          color: var(--primary);
          text-decoration: none;
        }
        
        .forgot-password:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}