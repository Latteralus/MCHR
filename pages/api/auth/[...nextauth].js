// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AppDataSource } from "../../../utils/db";
import User from "../../../entities/User";

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
          await AppDataSource.initialize();
          const userRepository = AppDataSource.getRepository(User);
          
          const user = await userRepository.findOne({
            where: { email: credentials.email },
            relations: ['department']
          });

          // Here you would typically verify the password hash
          // For development, we might use a simple check
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
          
          await AppDataSource.destroy();
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
          }
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
};

export default NextAuth(authOptions);