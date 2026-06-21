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
export const sectionColorSchema = z.enum([
  "blue",
  "green",
  "gold",
  "pink",
  "purple",
  "teal",
  "orange",
  "red",
]);
export const spaceVisibilitySchema = z.enum(["private", "public", "protected"]);

export const paragraphVariantSchema = z.enum([
  "normal",
  "important",
  "warning",
  "info",
  "success",
  "danger",
]);

export const sectionParagraphSchema = z.object({
  id: z.string().uuid(),
  sortOrder: z.number().int(),
  content: z.string(),
  variant: paragraphVariantSchema,
  color: sectionColorSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string(),
});

export const spaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  visibility: spaceVisibilitySchema,
  createdAt: z.string(),
  updatedAt: z.string(),
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
  color: sectionColorSchema,
  paragraphs: z.array(sectionParagraphSchema).min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const meetingSchema = z.object({
  id: z.string().uuid(),
  spaceId: z.string().uuid(),
  title: z.string().nullable(),
  sourceType: sourceTypeSchema,
  status: meetingStatusSchema,
  processingError: z.string().nullable(),
  slug: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  file: meetingFileSchema.nullable(),
  sections: z.array(meetingSectionSchema),
});

export const publicMeetingSpaceSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  visibility: spaceVisibilitySchema,
});

export const publicMeetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  space: publicMeetingSpaceSchema,
  sections: z.array(meetingSectionSchema),
});

export const publicSpaceMeetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
});

export const publicSpaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  visibility: spaceVisibilitySchema,
  meetings: z.array(publicSpaceMeetingSchema),
});

export const publishMeetingResponseSchema = z.object({
  url: z.string().url(),
  slug: z.string().nullable(),
});

export const spaceAccessResponseSchema = z.object({
  accessToken: z.string(),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
  space: spaceSchema,
});

export const meResponseSchema = z.object({
  user: userSchema,
  space: spaceSchema,
});

export const registerSpaceInputSchema = z
  .object({
    name: z.string().min(1).max(100),
    visibility: spaceVisibilitySchema,
    password: z.string().min(8).optional(),
  })
  .refine((data) => data.visibility !== "protected" || !!data.password, {
    message: "Password is required for protected spaces.",
    path: ["password"],
  });

export const createSpaceInputSchema = registerSpaceInputSchema;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  space: registerSpaceInputSchema,
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
        sortOrder: z.number().int().min(0),
        color: sectionColorSchema.optional(),
        paragraphs: z
          .array(
            z.object({
              id: z.string().uuid().optional(),
              content: z.string().max(500_000),
              sortOrder: z.number().int().min(0),
              variant: paragraphVariantSchema.default("normal"),
              color: sectionColorSchema.optional(),
            })
          )
          .min(1),
      })
    )
    .min(1),
});

export const patchSpaceInputSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    visibility: spaceVisibilitySchema.optional(),
    password: z.string().min(8).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.visibility !== undefined ||
      data.password !== undefined,
    { message: "At least one field is required." }
  );

export const messageResponseSchema = z.object({
  message: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  spaceSlug: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Space = z.infer<typeof spaceSchema>;
export type SpaceVisibility = z.infer<typeof spaceVisibilitySchema>;
export type CreateSpaceInput = z.infer<typeof createSpaceInputSchema>;
export type Meeting = z.infer<typeof meetingSchema>;
export type PublicMeeting = z.infer<typeof publicMeetingSchema>;
export type PublicSpace = z.infer<typeof publicSpaceSchema>;
export type PublicSpaceMeeting = z.infer<typeof publicSpaceMeetingSchema>;
export type MeetingSection = z.infer<typeof meetingSectionSchema>;
export type SectionParagraph = z.infer<typeof sectionParagraphSchema>;
export type ParagraphVariant = z.infer<typeof paragraphVariantSchema>;
export type SectionColor = z.infer<typeof sectionColorSchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;
