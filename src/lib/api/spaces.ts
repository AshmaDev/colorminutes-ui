import { getApiUrl, getAuthHeaders } from "./token";
import { api, parseApiError } from "./client";
import {
  publicSpaceSchema,
  spaceAccessResponseSchema,
  spaceSchema,
  type PublicSpace,
  type Space,
} from "@/lib/schemas";
import { z } from "zod";

const spaceAccessErrorSchema = z.object({
  error: z.string(),
  code: z.enum(["SPACE_MEMBERS_ONLY", "SPACE_PASSWORD_REQUIRED"]).optional(),
});

export type SpaceAccessError = z.infer<typeof spaceAccessErrorSchema>;

function spaceAccessStorageKey(identifier: string) {
  return `colorminutes-space-access:${identifier}`;
}

export function getStoredSpaceAccessToken(identifier: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(spaceAccessStorageKey(identifier));
}

export function setStoredSpaceAccessToken(identifier: string, token: string) {
  sessionStorage.setItem(spaceAccessStorageKey(identifier), token);
}

export const spacesApi = {
  async list(): Promise<Space[]> {
    try {
      return z.array(spaceSchema).parse(await api.get("spaces/me").json());
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async create(input: {
    name: string;
    visibility: Space["visibility"];
    password?: string;
  }): Promise<Space> {
    try {
      return spaceSchema.parse(
        await api.post("spaces", { json: input }).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async update(
    id: string,
    input: {
      name?: string;
      visibility?: Space["visibility"];
      password?: string;
    }
  ): Promise<Space> {
    try {
      return spaceSchema.parse(
        await api.patch(`spaces/${id}`, { json: input }).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async getPublic(
    identifier: string,
    accessToken?: string | null
  ): Promise<PublicSpace> {
    const headers: Record<string, string> = {};
    const userAuth = getAuthHeaders();
    if (userAuth.Authorization) {
      headers.Authorization = userAuth.Authorization;
    } else if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `${getApiUrl()}/public/spaces/${encodeURIComponent(identifier)}`,
      { headers, cache: "no-store" }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const parsed = spaceAccessErrorSchema.safeParse(body);
      if (parsed.success) {
        const error = new Error(parsed.data.error) as Error & {
          code?: string;
          status: number;
        };
        error.code = parsed.data.code;
        error.status = response.status;
        throw error;
      }
      throw new Error(
        typeof body.error === "string" ? body.error : "Failed to load space."
      );
    }

    return publicSpaceSchema.parse(await response.json());
  },

  async verifyAccess(
    identifier: string,
    password: string
  ): Promise<{ accessToken: string }> {
    const response = await fetch(
      `${getApiUrl()}/public/spaces/${encodeURIComponent(identifier)}/access`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(
        typeof body.error === "string" ? body.error : "Invalid password."
      );
    }

    return spaceAccessResponseSchema.parse(await response.json());
  },
};
