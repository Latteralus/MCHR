// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Special case for testing - hardcoded test user
        if (credentials.username === 'FCalkins' && credentials.password === 'password') {
          return {
            id: '1',
            name: 'Faith Calkins',
            email: 'fcalkins@mountaincare.example',
            role: 'HR Director',
            department: 'Human Resources'
          };
        }
        
        // For a real app, you would check credentials against your database
        // If credentials invalid, return null
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // First time JWT callback is called, user object is available
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      // Add properties to session from token
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.department = token.department;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
  debug: process.env.NODE_ENV !== 'production',
});