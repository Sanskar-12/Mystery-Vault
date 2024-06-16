import connectDB from "@/lib/dbConnect";
import { User } from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await User.findOne({
            $or: [
              {
                email: credentials.identifier.email,
              },
              {
                username: credentials.identifier.username,
              },
            ],
          });

          if (!user) {
            throw new Error("Please enter valid email or password.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first.");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isMatch) {
            return user;
          } else {
            throw new Error("Please enter valid email or password.");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        (session.user._id = token._id),
          (session.user.isVerified = token.isVerified),
          (session.user.isAcceptingMessage = token.isAcceptingMessage),
          (session.user.username = token.username);
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token._id = user._id?.toString()),
          (token.isVerified = user.isVerified),
          (token.isAcceptingMessage = user.isAcceptingMessage),
          (token.username = user.username);
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTHSECRET,
};
