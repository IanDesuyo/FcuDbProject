import { z } from "zod";
import {
  editableEducationSchema,
  editableProjectSchema,
  editableSkillsSchema,
  editableUserSchema,
  editableWorkExperienceSchema,
  educationSchema,
  infoSchema,
  previewSchema,
  projectSchema,
  skillsSchema,
  workExperienceSchema,
} from "~/utils/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query(
      `
      SELECT u.id, u.name, u.image, u.position, w.website_title FROM users u, website w
      WHERE u.id = w.user_id
      ORDER BY u.id ASC;
      `
    );

    const parsed = z.array(previewSchema).safeParse(result[0]);

    if (parsed.success) {
      return parsed.data;
    }
  }),

  info: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const result = await ctx.db.query(
        `
        SELECT u.*, w.website_title FROM users u, website w
        WHERE u.id = ? AND u.id = w.user_id;
        `,
        [userId]
      );

      const parsed = z.array(infoSchema).safeParse(result[0]);

      if (parsed.success && parsed.data.length > 0) {
        return parsed.data[0];
      }

      return null;
    }),

  updateInfo: protectedProcedure
    .input(editableUserSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      const sqlFields = Object.keys(input).map((key) => `${key} = :${key}`);
      const sqlValues = Object.entries(input).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value || null,
        }),
        {}
      );

      await ctx.db.execute(
        `UPDATE users SET ${sqlFields.join(", ")} WHERE id = :user_id;`,
        {
          user_id,
          ...sqlValues,
        }
      );

      await ctx.db.commit();
      return;
    }),

  educations: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const result = await ctx.db.query(
        `
        SELECT * FROM education
        WHERE user_id = ?
        ORDER BY id ASC;
        `,
        [userId]
      );

      const parsed = z.array(educationSchema).safeParse(result[0]);

      if (parsed.success) {
        return parsed.data;
      }

      return [];
    }),

  updateEducations: protectedProcedure
    .input(educationSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        UPDATE education
        SET school = :school, major = :major, degree = :degree
        WHERE id = :id AND user_id = :user_id;
        `,
        { user_id, ...input }
      );

      await ctx.db.commit();
      return;
    }),

  removeEducation: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        DELETE FROM education
        WHERE id = ? AND user_id = ?;
        `,
        [id, user_id]
      );

      await ctx.db.commit();
      return;
    }),

  addEducation: protectedProcedure
    .input(editableEducationSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        INSERT INTO education (user_id, school, major, degree)
        VALUES (:user_id, :school, :major, :degree);
        `,
        { user_id, ...input }
      );

      await ctx.db.commit();
      return;
    }),

  skills: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const result = await ctx.db.query(
        `
        SELECT * FROM skills
        WHERE user_id = ?
        ORDER BY id ASC;
        `,
        [userId]
      );

      const parsed = z.array(skillsSchema).safeParse(result[0]);

      if (parsed.success) {
        return parsed.data;
      }

      return [];
    }),

  updateSkills: protectedProcedure
    .input(skillsSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        UPDATE skills
        SET skill = :skill, skill_en = :skill_en
        WHERE id = :id AND user_id = :user_id;
        `,
        { user_id, ...input }
      );

      await ctx.db.commit();
      return;
    }),

  removeSkills: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        DELETE FROM skills
        WHERE id = ? AND user_id = ?;
        `,
        [id, user_id]
      );

      await ctx.db.commit();
      return;
    }),

  addSkills: protectedProcedure
    .input(editableSkillsSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        INSERT INTO skills (user_id, skill, skill_en)
        VALUES (:user_id, :skill, :skill_en);
        `,
        { user_id, ...input }
      );

      await ctx.db.commit();
      return;
    }),

  workExperience: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const result = await ctx.db.query(
        `
        SELECT * FROM work_experience
        WHERE user_id = ?
        ORDER BY id ASC;
        `,
        [userId]
      );

      const parsed = z.array(workExperienceSchema).safeParse(result[0]);

      if (parsed.success) {
        return parsed.data;
      }

      return [];
    }),

  updateWorkExperience: protectedProcedure
    .input(workExperienceSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        UPDATE work_experience
        SET in_school = :in_school, company = :company, position = :position
        WHERE id = :id AND user_id = :user_id;
        `,
        { user_id, ...input, in_school: input.in_school ? 1 : 0 }
      );

      await ctx.db.commit();
      return;
    }),

  removeWorkExperience: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        DELETE FROM work_experience
        WHERE id = ? AND user_id = ?;
        `,
        [id, user_id]
      );

      await ctx.db.commit();
      return;
    }),

  addWorkExperience: protectedProcedure
    .input(editableWorkExperienceSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        INSERT INTO work_experience (user_id, in_school, company, position)
        VALUES (:user_id, :in_school, :company, :position);
        `,
        { user_id, ...input, in_school: input.in_school ? 1 : 0 }
      );

      await ctx.db.commit();
      return;
    }),

  projects: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: userId }) => {
      const result = await ctx.db.query(
        `
        SELECT * FROM projects
        WHERE user_id = ?
        ORDER BY id ASC;
        `,
        [userId]
      );

      const parsed = z.array(projectSchema).safeParse(result[0]);

      if (parsed.success) {
        return parsed.data;
      }

      return [];
    }),

  updateProjects: protectedProcedure
    .input(projectSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        UPDATE projects
        SET type = :type, author = :author, release_date = :release_date, title = :title, journal = :journal, reference = :reference
        WHERE id = :id AND user_id = :user_id;
        `,
        { user_id, ...input }
      );

      await ctx.db.commit();
      return;
    }),

  removeProjects: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        DELETE FROM projects
        WHERE id = ? AND user_id = ?;
        `,
        [id, user_id]
      );

      await ctx.db.commit();
      return;
    }),

  addProjects: protectedProcedure
    .input(editableProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      await ctx.db.execute(
        `
        INSERT INTO projects (user_id, type, author, release_date, title, journal, reference)
        VALUES (:user_id, :type, :author, :release_date, :title, :journal, :reference);
        `,
        { user_id, ...input }
      );

      await ctx.db.commit();
      return;
    }),
});
