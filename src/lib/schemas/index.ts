import { z } from "zod";

export const sourceTypeSchema = z.enum(["record", "upload", "notes"]);
export const meetingStatusSchema = z.enum([
  "draft",
  "uploaded",
  "processing",
  "ready",
  "failed",
]);

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
  createdAt: z.string(),
});

export const meetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  sourceType: sourceTypeSchema,
  status: meetingStatusSchema,
  content: z.string().nullable(),
  processingError: z.string().nullable(),
  sourceFilename: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  file: meetingFileSchema.nullable(),
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

export const messageResponseSchema = z.object({
  message: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Meeting = z.infer<typeof meetingSchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;
