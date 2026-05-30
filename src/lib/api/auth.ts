import {
  authResponseSchema,
  forgotPasswordInputSchema,
  loginInputSchema,
  messageResponseSchema,
  registerInputSchema,
  resetPasswordInputSchema,
  userSchema,
  type User,
} from "@/lib/schemas";
import { api, parseApiError } from "./client";
import { setToken } from "./token";

export const authApi = {
  async register(input: { email: string; password: string }) {
    const body = registerInputSchema.parse(input);
    try {
      const data = authResponseSchema.parse(
        await api.post("auth/register", { json: body }).json()
      );
      setToken(data.token);
      return data;
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async login(input: { email: string; password: string }) {
    const body = loginInputSchema.parse(input);
    try {
      const data = authResponseSchema.parse(
        await api.post("auth/login", { json: body }).json()
      );
      setToken(data.token);
      return data;
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async forgotPassword(input: { email: string }) {
    const body = forgotPasswordInputSchema.parse(input);
    try {
      return messageResponseSchema.parse(
        await api.post("auth/forgot-password", { json: body }).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async resetPassword(input: { token: string; password: string }) {
    const body = resetPasswordInputSchema.parse(input);
    try {
      return messageResponseSchema.parse(
        await api.post("auth/reset-password", { json: body }).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async me(): Promise<User> {
    try {
      return userSchema.parse(await api.get("auth/me").json());
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },
};
