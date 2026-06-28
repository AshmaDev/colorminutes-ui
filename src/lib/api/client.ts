import ky, { HTTPError } from "ky";
import { errorResponseSchema } from "@/lib/schemas";
import { clearToken, getApiUrl, getToken } from "./token";

export const api = ky.create({
  prefix: getApiUrl(),
  timeout: 60_000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ response }) => {
        if (response.status === 401) {
          clearToken();
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            const from = window.location.pathname;
            window.location.href = `/login?from=${encodeURIComponent(from)}`;
          }
        }
      },
    ],
  },
});

export async function parseApiError(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const data = errorResponseSchema.parse(await error.response.json());
      return data.error;
    } catch {
      return "Something went wrong. Please try again.";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
