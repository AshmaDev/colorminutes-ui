import { z } from "zod";

export const sourceTypeSchema = z.enum(["record", "upload", "notes"]);
export const meetingStatusSchema = z.enum([
  "draft",
  "uploaded",
  "processing",
  "ready",
  "generating",
  "generated",
  "failed",
]);
export const sectionColorSchema = z.enum(["peach", "pink", "lilac", "sage"]);
export const meetingVisibilitySchema = z.enum(["draft", "public", "link"]);

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string(),
});

export const meetingFileSchema = z.object({
  id: z.string().uuid(),
  originalFilename: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  content: z.string().nullable(),
  createdAt: z.string(),
});

export const meetingSectionSchema = z.object({
  id: z.string().uuid(),
  sortOrder: z.number().int(),
  header: z.string(),
  content: z.string(),
  color: sectionColorSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const meetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  sourceType: sourceTypeSchema,
  status: meetingStatusSchema,
  processingError: z.string().nullable(),
  slug: z.string().nullable(),
  visibility: meetingVisibilitySchema,
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  file: meetingFileSchema.nullable(),
  sections: z.array(meetingSectionSchema),
});

export const publicMeetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  visibility: meetingVisibilitySchema,
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  sections: z.array(meetingSectionSchema),
});

export const publishMeetingResponseSchema = z.object({
  url: z.string().url(),
  visibility: meetingVisibilitySchema,
  slug: z.string().nullable(),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const forgotPasswordInputSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordInputSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const patchMeetingInputSchema = z
  .object({
    title: z.string().min(1).max(500).optional(),
    content: z.string().max(500_000).optional(),
  })
  .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: "At least one of title or content is required.",
  });

export const putSectionsInputSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  sections: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        header: z.string().min(1).max(200),
        content: z.string().max(500_000),
        sortOrder: z.number().int().min(0),
        color: sectionColorSchema.optional(),
      })
    )
    .min(1),
});

export const messageResponseSchema = z.object({
  message: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Meeting = z.infer<typeof meetingSchema>;
export type PublicMeeting = z.infer<typeof publicMeetingSchema>;
export type MeetingSection = z.infer<typeof meetingSectionSchema>;
export type SectionColor = z.infer<typeof sectionColorSchema>;
export type MeetingVisibility = z.infer<typeof meetingVisibilitySchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;
