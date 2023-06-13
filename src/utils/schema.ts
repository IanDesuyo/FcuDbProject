import { z } from "zod";

export const previewSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  image: z.string().url().nullable(),
  website_title: z.string(),
});

export const editableUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().url().nullable(),
  phone: z.string().nullable(),
  department: z.string(),
  major: z.string(),
  position: z.string(),
  bio: z.string().nullable(),
});

export const userSchema = editableUserSchema.extend({
  id: z.string(),
  updated_at: z.preprocess((x) => new Date(x as string), z.date()),
  created_at: z.preprocess((x) => new Date(x as string), z.date()),
});

export const editableWebsiteSchema = z.object({
  website_title: z.string(),
});

export const infoSchema = userSchema.merge(editableWebsiteSchema);

export const editableEducationSchema = z.object({
  school: z.string(),
  major: z.string(),
  degree: z.string(),
});

export const educationSchema = editableEducationSchema.extend({
  id: z.number(),
});

export const editableSkillsSchema = z.object({
  skill: z.string(),
  skill_en: z.string(),
});

export const skillsSchema = editableSkillsSchema.extend({
  id: z.number(),
});

export const editableWorkExperienceSchema = z.object({
  in_school: z.preprocess((x) => !!x, z.boolean()),
  company: z.string(),
  position: z.string(),
});

export const workExperienceSchema = editableWorkExperienceSchema.extend({
  id: z.number(),
});

export const editableProjectSchema = z.object({
  type: z.preprocess((x) => Number(x), z.number().gte(0).lte(9)),
  author: z.string(),
  release_date: z.string().regex(/^\d{4}-\d{2}$/),
  title: z.string(),
  journal: z.string(),
  reference: z.string(),
});

export const projectSchema = editableProjectSchema.extend({
  id: z.number(),
});
