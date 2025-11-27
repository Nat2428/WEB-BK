import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getDb from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "NISN/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const db = await getDb();
        const [rows] = await db.query(
          "SELECT * FROM users WHERE email = ? OR nisn = ?",
          [credentials.identifier, credentials.identifier]
        );

        if (rows.length === 0) {
          return null;
        }

        const user = rows[0] as any;
        const match = bcrypt.compareSync(credentials.password, user.password);

        if (!match) {
          return null;
        }

        // Update last login
        await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

        return {
          id: user.id.toString(),
          email: user.email || user.nisn,
          name: user.username,
          role: user.role,
          nisn: user.nisn,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.nisn = (user as any).nisn;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).nisn = token.nisn;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-this",
};


