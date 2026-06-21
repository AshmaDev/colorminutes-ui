import axios from "axios";
import {
  meetingSchema,
  publicMeetingSchema,
  publishMeetingResponseSchema,
  type Meeting,
  type ParagraphVariant,
  type PublicMeeting,
  type SectionColor,
  type SourceType,
} from "@/lib/schemas";
import { z } from "zod";
import { getApiUrl, getAuthHeaders } from "./token";
import { api, parseApiError } from "./client";

const publicAccessErrorSchema = z.object({
  error: z.string(),
  code: z.enum(["SPACE_MEMBERS_ONLY", "SPACE_PASSWORD_REQUIRED"]).optional(),
  spaceSlug: z.string().optional(),
});

export type UploadProgressHandler = (progress: {
  loaded: number;
  total: number | null;
  percent: number | null;
}) => void;

export type SectionParagraphInput = {
  id?: string;
  content: string;
  sortOrder: number;
  variant?: ParagraphVariant;
  color?: SectionColor;
};

export type SectionInput = {
  id?: string;
  header: string;
  sortOrder: number;
  color?: SectionColor;
  paragraphs: SectionParagraphInput[];
};

export const meetingsApi = {
  async list(spaceId?: string): Promise<Meeting[]> {
    try {
      const searchParams = spaceId ? { spaceId } : undefined;
      return z
        .array(meetingSchema)
        .parse(await api.get("meetings", { searchParams }).json());
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async get(id: string): Promise<Meeting> {
    try {
      return meetingSchema.parse(await api.get(`meetings/${id}`).json());
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async getPreview(id: string): Promise<PublicMeeting> {
    try {
      return publicMeetingSchema.parse(
        await api.get(`meetings/${id}/preview`).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async getPublic(
    identifier: string,
    accessToken?: string | null
  ): Promise<PublicMeeting> {
    const headers: Record<string, string> = {};
    const userAuth = getAuthHeaders();
    if (userAuth.Authorization) {
      headers.Authorization = userAuth.Authorization;
    } else if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `${getApiUrl()}/public/meetings/${encodeURIComponent(identifier)}`,
      { headers, cache: "no-store" }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const parsed = publicAccessErrorSchema.safeParse(body);
      if (parsed.success) {
        const error = new Error(parsed.data.error) as Error & {
          code?: string;
          spaceSlug?: string;
          status: number;
        };
        error.code = parsed.data.code;
        error.spaceSlug = parsed.data.spaceSlug;
        error.status = response.status;
        throw error;
      }
      throw new Error(
        typeof body.error === "string" ? body.error : "Meeting not found."
      );
    }

    return publicMeetingSchema.parse(await response.json());
  },

  async create({
    file,
    sourceType,
    title,
    spaceId,
    onUploadProgress,
    signal,
  }: {
    file: File | Blob;
    sourceType: SourceType;
    title?: string;
    spaceId?: string;
    onUploadProgress?: UploadProgressHandler;
    signal?: AbortSignal;
  }): Promise<Meeting> {
    const formData = new FormData();
    formData.append("sourceType", sourceType);
    if (title) {
      formData.append("title", title);
    }
    if (spaceId) {
      formData.append("spaceId", spaceId);
    }
    formData.append("file", file);

    try {
      const response = await axios.post(`${getApiUrl()}/meetings`, formData, {
        headers: {
          ...getAuthHeaders(),
        },
        maxContentLength: 524_288_000,
        maxBodyLength: 524_288_000,
        signal,
        onUploadProgress: (event) => {
          if (!onUploadProgress) return;
          const total = event.total ?? null;
          const loaded = event.loaded;
          const percent =
            total && total > 0 ? Math.round((loaded / total) * 100) : null;
          onUploadProgress({ loaded, total, percent });
        },
      });
      return meetingSchema.parse(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new Error("Upload cancelled.");
      }
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(String(error.response.data.error));
      }
      throw new Error(await parseApiError(error));
    }
  },

  async updateTitle(id: string, title: string): Promise<Meeting> {
    return this.updateMeeting(id, { title });
  },

  async updateMeeting(
    id: string,
    data: { title?: string; content?: string }
  ): Promise<Meeting> {
    try {
      return meetingSchema.parse(
        await api.patch(`meetings/${id}`, { json: data }).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async generate(id: string): Promise<Meeting> {
    try {
      return meetingSchema.parse(
        await api.post(`meetings/${id}/generate`).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async saveSections(
    id: string,
    data: { title?: string; sections: SectionInput[] }
  ): Promise<Meeting> {
    try {
      return meetingSchema.parse(
        await api.put(`meetings/${id}/sections`, { json: data }).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async publish(id: string): Promise<{ url: string; slug: string | null }> {
    try {
      return publishMeetingResponseSchema.parse(
        await api.post(`meetings/${id}/publish`).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },
};
