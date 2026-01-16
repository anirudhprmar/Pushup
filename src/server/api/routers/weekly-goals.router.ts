import { WeeklyRating } from '~/types/schema/index';
import { and, desc, eq } from 'drizzle-orm';
import { z } from "zod";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { weeklyGoals } from '~/server/db/schema';
import { db } from '~/server/db';

export const weeklyGoalsRouter = createTRPCRouter({
  createWeek: protectedProcedure
    .input(z.object({
      theme: z.string().optional(),
      date: z.date().default(() => new Date())
    }))
    .mutation(async ({ ctx, input }) => {

      const weekNumber = getISOWeek(input.date);
      const year = getISOWeekYear(input.date);

      const existingWeek = await db.query.weeklyGoals.findFirst({
        where: (
          and(
            eq(weeklyGoals.userId, ctx.userId),
            eq(weeklyGoals.weekNumber, weekNumber),
            eq(weeklyGoals.year, year)
          )
        )
      })

      if (existingWeek) {
        return { status: "exists", week: existingWeek }
      }

      const [newWeek] = await ctx.db.insert(weeklyGoals).values({
        theme: input.theme,
        weekNumber,
        year,
        userId: ctx.userId
      }).returning()

      return { status: "created", week: newWeek };
    }),

  updateWeek: protectedProcedure
    .input(z.object({
      weekId:z.uuid(),
      reviewNotes: z.string().optional(),
      rating: z.enum(WeeklyRating)
    }))
    .mutation(async ({ ctx, input }) => {
        const [week] = await ctx.db
        .select()
        .from(weeklyGoals)
        .where(
            and (
                eq(weeklyGoals.userId,ctx.userId),
                eq(weeklyGoals.id,input.weekId)
            )
        )
        .limit(1)

        if(!week){
            return {status:"week does not exists"}
        }

        const [updatedWeek] = await ctx.db
        .update(weeklyGoals)
        .set({
        rating:input.rating,
        reviewNotes:input.reviewNotes
        })
        .where(
            and (
                eq(weeklyGoals.userId,ctx.userId),
                eq(weeklyGoals.id,input.weekId)
            )
        )
        .returning()
        
        return {success:true,week:updatedWeek}
    }),

    deleteWeek: protectedProcedure
     .input(z.object({
        weekId:z.uuid()
     }))
     .mutation(async ({ ctx,input }) => {

        const [deletedWeek] = await ctx.db
        .delete(weeklyGoals)
        .where(
            and (
                eq(weeklyGoals.userId,ctx.userId),
                eq(weeklyGoals.id,input.weekId)
            )
        )
        .returning()

        if(!deletedWeek){
            return {status:"week doesn't exist"}
        }

        return {success:true}
     }),

     listAllWeeks:protectedProcedure
     .query(async ({ctx}) => {
        const weeks = await ctx.db
        .select()
        .from(weeklyGoals)
        .where(
            eq(weeklyGoals.userId,ctx.userId)
        )
        .orderBy(desc(weeklyGoals.year),(weeklyGoals.weekNumber))

        return weeks
     })
})
