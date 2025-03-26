// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AppDataSource } from "../../../utils/db";
import User from "../../../entities/User";

// Hardcoded test user for development
const testUsers = [
  {
    id: "test-user-1",
    email: "fcalkins@mountaincare.example",
    name: "Frank Calkins",
    passwordHash: "password", // In production, use proper hashing
    role: "admin",
    departmentId: "dept-1"
  }
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // First, check if it's one of our hardcoded test users
          const testUser = testUsers.find(user => 
            user.email === credentials.email && 
            user.passwordHash === credentials.password
          );

          if (testUser) {
            return {
              id: testUser.id,
              email: testUser.email,
              name: testUser.name,
              role: testUser.role,
              departmentId: testUser.departmentId
            };
          }

          // If not a test user, try database authentication
          try {
            if (!AppDataSource.isInitialized) {
              await AppDataSource.initialize();
            }
            
            const userRepository = AppDataSource.getRepository(User);
            
            const user = await userRepository.findOne({
              where: { email: credentials.email },
              relations: ['department']
            });

            // Here you would typically verify the password hash
            if (user && user.passwordHash === credentials.password) {
              await AppDataSource.destroy();
              return {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
                departmentId: user.department?.id
              };
            }
            
            if (AppDataSource.isInitialized) {
              await AppDataSource.destroy();
            }
            return null;
          } catch (dbError) {
            console.error("Database auth error:", dbError);
            if (AppDataSource.isInitialized) {
              await AppDataSource.destroy();
            }
            return null;
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.departmentId = user.departmentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.departmentId = token.departmentId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);