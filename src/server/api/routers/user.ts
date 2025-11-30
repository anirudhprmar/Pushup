import { eq } from 'drizzle-orm';
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { user } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  me: publicProcedure
    .input(z.object({ userId:z.string().min(1) }))
    .query(async ({ ctx,input }) => {
    const {userId}=input
    const [userInfo] = await ctx.db.select().from(user).where(eq(user.id,userId));
    if(!userInfo){
      throw new Error("User not found")
    }

    return userInfo;
    }),
});
