import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../../utils/db";
import { User } from "../../../entities/User";

// Initialize the TypeORM connection when the API route is accessed
const initializeDb = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  } catch (error) {
    console.error("Error during TypeORM initialization", error);
    throw new Error("Unable to connect to database");
  }
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          await initializeDb();
          
          // Find the user by email
          const userRepository = AppDataSource.getRepository(User);
          const user = await userRepository.findOne({ 
            where: { email: credentials.email },
            relations: ["department"] 
          });
          
          if (!user) {
            return null;
          }
          
          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!isValid) {
            return null;
          }

          // Return user data (excluding sensitive information)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            departmentId: user.department?.id
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // Include additional user data in the JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.departmentId = user.departmentId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Make user data available in the client session
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.departmentId = token.departmentId;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
});