import { and, eq, gte, lte } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import { habitLogs, tasks } from '~/server/db/schema';


export const tasksRouter = createTRPCRouter({
    createNewTask:protectedProcedure
    .input(z.object({
        habitId:z.uuid().optional(),
        task:z.string(),
        targetValue:z.int(),
        targetUnit:z.string()
    }))
    .mutation(async ({ctx,input})=>{
        const {habitId, task, targetValue, targetUnit} = input

        await ctx.db.insert(tasks).values({
            habitId,
            task,
            targetValue,
            targetUnit,
            userId:ctx.userId
        })

        return {success:true}
    }),
     completeTask:protectedProcedure
        .input(z.object({
          taskId:z.uuid(),
          habitId:z.uuid().optional(),
          completed:z.boolean(),
        }))
        .mutation(async({ctx,input})=>{
        const today = new Date().toISOString().split('T')[0]!; 

        const task = await ctx.db
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

        await ctx.db
        .update(tasks)
        .set({
            completed:input.completed,
            completedAt:new Date()
        })
        .where(
            and (
                eq(tasks.userId,ctx.userId),
                eq(tasks.id,input.taskId)
            )
        )
        .returning()
        
        if(input.habitId === undefined) return;

            await ctx.db
            .insert(habitLogs)
            .values({
                habitId:input.habitId,
                date: today,
                completed: true,
            })
    
        
        return {success:true}
        })
        ,

    startTask:protectedProcedure
    .input(z.object({
        taskId:z.uuid(),
        startedAt:z.date()
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
            startedAt:new Date()
        })
        .where(
            and (
                eq(tasks.userId,ctx.userId),
                eq(tasks.id,input.taskId)
            )
        )
        .returning()
        
        return {success:true,task:updatedTask}
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

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

        const allTasks = await ctx.db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.userId,ctx.userId),
                gte(tasks.createdAt,startOfDay),
                lte(tasks.createdAt,endOfDay)
            )
        )

         if(!allTasks){
            throw new Error("No tasks found")
        }

        return allTasks
    })
})