import { and, eq } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import { tasks } from '~/server/db/schema';


export const tasksRouter = createTRPCRouter({
    createNewTask:protectedProcedure
    .input(z.object({
        goalId:z.uuid().optional(),
        task:z.string(),
        targetValue:z.int(),
        targetUnit:z.string()
    }))
    .mutation(async ({ctx,input})=>{
        const {goalId, task, targetValue, targetUnit} = input

        await ctx.db.insert(tasks).values({
            goalId,
            task,
            targetValue,
            targetUnit,
            userId:ctx.userId
        })

        return {success:true}
    }),

    updateTask:protectedProcedure
    .input(z.object({
        taskId:z.uuid(),
        startedAt:z.date(),
        notes:z.string()
    }))
    .mutation(async ({ctx, input}) => {
        const [task] = await ctx.db
        .select()
        .from(tasks)
        .where(
            and (
                eq(tasks.userId,ctx.userId),
                eq(tasks.id,input.taskId)
            )
        )
        
        if(!task){
            return {status:"no task exist"}
        }

        const updatedTask = await ctx.db
        .update(tasks)
        .set({
            notes:input.notes,
            completed:true,
            completedAt:new Date()
        })
        .where(
            and (
                eq(tasks.userId,ctx.userId),
                eq(tasks.id,input.taskId)
            )
        )
        .returning()
        
        return {success:true,week:updatedTask}
    }),

    deleteTask: protectedProcedure
    .input(z.object({
        taskId:z.uuid()
    }))
    .mutation(async ({ctx,input}) => {
        const [deletedTask] = await ctx.db
        .delete(tasks)
        .where(
            and (
                eq(tasks.userId,ctx.userId),
                eq(tasks.id,input.taskId)
            )
        ).returning()
        
        if(deletedTask){
            throw new Error("Habit not found or you don't have permission to delete it");
        }

        return { success: true };
    }),

    listAllTasks: protectedProcedure
    .query(async ({ctx}) => {
        const allTasks = await ctx.db
        .select()
        .from(tasks)
        .where(
            eq(tasks.userId,ctx.userId)
        )

         if(!allTasks){
            throw new Error("No habits found")
        }

        return allTasks
    })
})