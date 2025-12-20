ALTER TABLE "pushup_habits" DROP CONSTRAINT "pushup_habits_goal_id_pushup_goals_id_fk";
--> statement-breakpoint
ALTER TABLE "pushup_user_tasks" DROP CONSTRAINT "pushup_user_tasks_goal_id_pushup_goals_id_fk";
--> statement-breakpoint
DROP INDEX "user_email_idx";--> statement-breakpoint
ALTER TABLE "pushup_habits" ADD COLUMN "goals_id" uuid;--> statement-breakpoint
ALTER TABLE "pushup_user_tasks" ADD COLUMN "goals_id" uuid;--> statement-breakpoint
ALTER TABLE "pushup_habits" ADD CONSTRAINT "pushup_habits_goals_id_pushup_goals_id_fk" FOREIGN KEY ("goals_id") REFERENCES "public"."pushup_goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_user_tasks" ADD CONSTRAINT "pushup_user_tasks_goals_id_pushup_goals_id_fk" FOREIGN KEY ("goals_id") REFERENCES "public"."pushup_goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "pushup_user" USING btree ("email");--> statement-breakpoint
ALTER TABLE "pushup_habits" DROP COLUMN "goal_id";--> statement-breakpoint
ALTER TABLE "pushup_habits" DROP COLUMN "goal";--> statement-breakpoint
ALTER TABLE "pushup_user_tasks" DROP COLUMN "goal_id";