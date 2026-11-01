import { z } from "zod";
import { LIMITS } from "@/lib/config/constants";
import { isSafeExternalUrl } from "@/lib/utils";

/**
 * Canonical resume content shape (v1).
 *
 * This is the single source of truth consumed by the editor form, the live
 * preview, and the PDF renderer. It is versioned so future fields can be
 * added safely; the server validates every mutation against this schema.
 */

const urlField = z
  .string()
  .trim()
  .max(LIMITS.website)
  .refine((v) => v === "" || isSafeExternalUrl(v), {
    message: "Enter a valid http(s) link.",
  })
  .nullable();

const phoneField = z
  .string()
  .trim()
  .max(LIMITS.phone)
  .nullable();

const locationField = z
  .string()
  .trim()
  .max(LIMITS.location)
  .nullable();

export const experienceEntrySchema = z.object({
  id: z.string().min(1),
  company: z.string().trim().max(LIMITS.experienceCompany),
  role: z.string().trim().max(LIMITS.experienceRole),
  location: locationField,
  startDate: z.string().trim().max(12), // e.g. "2021-03"
  endDate: z.string().trim().max(12).nullable(), // null = Present
  present: z.boolean().default(false),
  bullets: z
    .array(z.string().trim().min(1).max(LIMITS.experienceBullet))
    .max(LIMITS.experienceBulletsPerEntry),
});

export const educationEntrySchema = z.object({
  id: z.string().min(1),
  school: z.string().trim().max(LIMITS.educationSchool),
  degree: z.string().trim().max(LIMITS.educationDegree),
  field: z.string().trim().max(LIMITS.educationField).nullable(),
  startDate: z.string().trim().max(12),
  endDate: z.string().trim().max(12).nullable(),
});

export const resumeContentSchema = z.object({
  version: z.literal(1),
  template: z.literal("ats-classic"),
  contact: z.object({
    name: z.string().trim().max(LIMITS.name),
    email: z
      .string()
      .trim()
      .max(LIMITS.email)
      .refine((value) => value === "" || z.string().email().safeParse(value).success, {
        message: "Enter a valid email address.",
      }),
    phone: phoneField,
    location: locationField,
    website: urlField,
    linkedin: urlField,
  }),
  summary: z.string().trim().max(LIMITS.summary).nullable(),
  experience: z
    .array(experienceEntrySchema)
    .max(LIMITS.experienceEntries)
    .default([]),
  education: z
    .array(educationEntrySchema)
    .max(LIMITS.educationEntries)
    .default([]),
  skills: z
    .array(z.string().trim().min(1).max(LIMITS.skillName))
    .max(LIMITS.skillsPerResume)
    .default([]),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;

/** Build a blank, valid draft so the editor always starts from a valid state. */
export function emptyResumeContent(
  overrides: Partial<ResumeContent> = {}
): ResumeContent {
  return resumeContentSchema.parse({
    version: 1,
    template: "ats-classic",
    contact: {
      name: "",
      email: "",
      phone: null,
      location: null,
      website: null,
      linkedin: null,
    },
    summary: null,
    experience: [],
    education: [],
    skills: [],
    ...overrides,
  });
}
