import NextAuth, { NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";

const NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? "development-secret";
process.env.NEXTAUTH_URL = NEXTAUTH_URL;
process.env.NEXTAUTH_SECRET = NEXTAUTH_SECRET;

type AppToken = JWT & { accessToken?: string; role?: string };
type AppSession = DefaultSession & { accessToken?: string; role?: string };

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {

          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://profixapi.runasp.net";
          const res = await axios.post(`${baseUrl}/api/Auth/Login`, {
            userName: credentials?.email,
            password: credentials?.password,
          });

          const data = res.data;
          // API wraps response: { status, message, data: { token, refreshToken } }
          const payload = data.data || data;
          const token = payload.token || payload.accessToken || null;

          if (token) {
            const decoded = parseJwt(token);

            return {
              id: decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded?.sub || "admin",
              name: decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded?.unique_name || decoded?.name || "Admin",
              email: decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded?.email || credentials?.email || "",
              role: decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded?.role || "Admin",
              accessToken: token,
            };
          }
          return null;
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Login authorization error:",
              error.response?.status,
              error.response?.data || error.message
            );
            const message =
              (error.response?.data as { message?: string })?.message ||
              (error.response?.data as { title?: string })?.title ||
              "بيانات الدخول غير صحيحة";
            throw new Error(message);
          }

          const defaultError = error instanceof Error ? error.message : "بيانات الدخول غير صحيحة";
          console.error("Login authorization error:", defaultError);
          throw new Error(defaultError);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as AppToken;
      const appUser = user as { accessToken?: string; role?: string } | undefined | null;

      if (appUser) {
        appToken.accessToken = appUser.accessToken;
        appToken.role = appUser.role;
      }
      return appToken;
    },
    async session({ session, token }) {
      const appSession = session as AppSession;
      const appToken = token as AppToken;

      appSession.accessToken = appToken.accessToken;
      appSession.role = appToken.role;
      return appSession;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };