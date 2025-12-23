import { and, eq } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import { GoalStatus, GoalType } from '~/types/schema/goals/goalsTypes';
import { goals } from '~/server/db/schema';


export const goalsRouter = createTRPCRouter({
 createNewGoal:protectedProcedure
    .input(z.object({
       title:z.string().min(1),
       description:z.string(),
       type:z.enum(GoalType),
       status:z.enum(GoalStatus) ,
       targetDeadline:z.date()
    }))
    .mutation(async ({ctx,input}) => {
        const {title,description,type,status,targetDeadline} = input

        await ctx.db.insert(goals).values({
            title,
            description,
            type,
            status,
            userId:ctx.userId,
            targetDeadline
        }).returning()

        return {success:true}
    }),
    
    updateGoal:protectedProcedure
    .input(z.object({
        goalId:z.string(),
        status:z.enum(GoalStatus)
    }))
    .mutation(async ({ctx,input}) =>{
        const [goal] = await ctx.db
        .select()
        .from(goals)
        .where(
            and (
                eq(goals.userId,ctx.userId),
                eq(goals.id,input.goalId)
            )
        )

        if (!goal) {
            throw new Error("goal not found")
        }

        const [updatedGoals] = await ctx.db
        .update(goals)
        .set({
            completedAt:new Date(),
            status:input.status
        })
        .where(
            and (
                eq(goals.userId,ctx.userId),
                eq(goals.id,input.goalId)
            )
        ).returning()

        return {status:true,goals:updatedGoals}
    })
    ,

    deleteGoal:protectedProcedure
    .input(z.object({
        goalId:z.uuid()
    }))
    .mutation(async ({ctx,input})=>{
        const [deletedGoal] = await ctx.db
        .delete(goals)
        .where(
            and(
                eq(goals.userId,ctx.userId),
                eq(goals.id,input.goalId)
            )
        )

        if(!deletedGoal){
            throw new Error("goal doesn't exits")
        }

        return {status:true}
    })

    ,

    listAllGoals:protectedProcedure
    .query(async ({ctx}) => {
        const allGoals = await ctx.db
        .select()
        .from(goals)
        .where(
            eq(goals.userId,ctx.userId)
        )

            if(!allGoals){
            throw new Error("No goals found")
        }

        return allGoals
    })
})