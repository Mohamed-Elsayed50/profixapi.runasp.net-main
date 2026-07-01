import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://profixapi.runasp.net";

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = (await getSession()) as (Session & { accessToken?: string }) | null;

  if (session?.accessToken) {
    const rawToken = String(session.accessToken).replace(/^Bearer\s+/i, "");
    const headers = config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers as Record<string, string> | undefined);

    headers.set("Authorization", `Bearer ${rawToken}`);
    config.headers = headers;
  }

  return config;
});