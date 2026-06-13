import axios from "axios";
import {
  meetingSchema,
  publicMeetingSchema,
  publishMeetingResponseSchema,
  type Meeting,
  type MeetingVisibility,
  type ParagraphVariant,
  type PublicMeeting,
  type SourceType,
} from "@/lib/schemas";
import { z } from "zod";
import { getApiUrl, getAuthHeaders } from "./token";
import { api, parseApiError } from "./client";

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
};

export type SectionInput = {
  id?: string;
  header: string;
  sortOrder: number;
  color?: "peach" | "pink" | "lilac" | "sage";
  paragraphs: SectionParagraphInput[];
};

export const meetingsApi = {
  async list(): Promise<Meeting[]> {
    try {
      return z.array(meetingSchema).parse(await api.get("meetings").json());
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

  async getPublic(identifier: string): Promise<PublicMeeting> {
    try {
      return publicMeetingSchema.parse(
        await api.get(`public/meetings/${identifier}`).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },

  async create({
    file,
    sourceType,
    title,
    onUploadProgress,
    signal,
  }: {
    file: File | Blob;
    sourceType: SourceType;
    title?: string;
    onUploadProgress?: UploadProgressHandler;
    signal?: AbortSignal;
  }): Promise<Meeting> {
    const formData = new FormData();
    formData.append("sourceType", sourceType);
    if (title) {
      formData.append("title", title);
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

  async publish(
    id: string,
    visibility: Extract<MeetingVisibility, "public" | "link">
  ): Promise<{ url: string; visibility: MeetingVisibility; slug: string | null }> {
    try {
      return publishMeetingResponseSchema.parse(
        await api.post(`meetings/${id}/publish`, { json: { visibility } }).json()
      );
    } catch (error) {
      throw new Error(await parseApiError(error));
    }
  },
};
