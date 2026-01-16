import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notification } from "~/server/db/schema";
import { NotificationType } from '~/types/schema';

export const notificationRouter = createTRPCRouter({
  welcomeNotification: protectedProcedure
    .input(z.object({
      title:z.string(),
      message:z.string(),
      type:z.enum(NotificationType)
    }))
    .mutation(async ({ ctx, input }) => {

         const {title,message,type} = input

        await ctx.db.insert(notification).values({
            userId:ctx.userId,
            title,
            message,
            type
        }).returning()

        return {success:true}
    }),
    getAll:protectedProcedure
    .query(async({ctx})=>{
     const data = await ctx.db.select().from(notification).where(eq(notification.userId,ctx.userId))

     if(!data){
      throw new Error("No Notifications found.")
     }

     return data
    }),

    markRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(notification)
        .set({ read: true })
        .where(eq(notification.id, input.id))
      return { success: true }
    }),

    markAllRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.update(notification)
        .set({ read: true })
        .where(eq(notification.userId, ctx.userId))
      return { success: true }
    }),

    clearAll: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.delete(notification)
        .where(eq(notification.userId, ctx.userId))
      return { success: true }
    }),

    getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.db.select().from(notification).where(eq(notification.userId, ctx.userId))
      return data.filter(n => !n.read).length
    })
})
