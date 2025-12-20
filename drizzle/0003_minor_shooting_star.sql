CREATE TYPE "public"."pushup_goal_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ACHIEVED');--> statement-breakpoint
CREATE TYPE "public"."pushup_goal_type" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'LIFETIME');--> statement-breakpoint
CREATE TABLE "pushup_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "pushup_goal_type" NOT NULL,
	"status" "pushup_goal_status" DEFAULT 'PENDING' NOT NULL,
	"target_deadline" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pushup_habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"goal_id" uuid,
	"name" text NOT NULL,
	"goal" text NOT NULL,
	"description" text,
	"category" text,
	"color" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pushup_user_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"goal_id" uuid,
	"task" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"completed" boolean DEFAULT false NOT NULL,
	"target_value" integer,
	"target_unit" text,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pushup_weekly_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"week_number" integer NOT NULL,
	"year" integer NOT NULL,
	"theme" text,
	"priority" text,
	"rating" integer DEFAULT 0,
	"review_notes" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pushup_habit" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "pushup_habit" CASCADE;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP CONSTRAINT "pushup_habit_log_habit_id_pushup_habit_id_fk";
--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP CONSTRAINT "pushup_habit_log_user_id_pushup_user_id_fk";
--> statement-breakpoint
DROP INDEX "habit_log_user_date_idx";--> statement-breakpoint
DROP INDEX "email_idx";--> statement-breakpoint
DROP INDEX "userstats_leaderboard_idx";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ALTER COLUMN "habit_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ALTER COLUMN "date" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pushup_user_stats" ADD COLUMN "total_habits" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "pushup_goals" ADD CONSTRAINT "pushup_goals_user_id_pushup_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pushup_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_habits" ADD CONSTRAINT "pushup_habits_user_id_pushup_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pushup_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_habits" ADD CONSTRAINT "pushup_habits_goal_id_pushup_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."pushup_goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_user_tasks" ADD CONSTRAINT "pushup_user_tasks_user_id_pushup_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pushup_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_user_tasks" ADD CONSTRAINT "pushup_user_tasks_goal_id_pushup_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."pushup_goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushup_weekly_goals" ADD CONSTRAINT "pushup_weekly_goals_user_id_pushup_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pushup_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_goal_type_idx" ON "pushup_goals" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "habit_user_id_idx" ON "pushup_habits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "habit_category_idx" ON "pushup_habits" USING btree ("category");--> statement-breakpoint
CREATE INDEX "user_task_idx" ON "pushup_user_tasks" USING btree ("task");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_week_plan" ON "pushup_weekly_goals" USING btree ("user_id","year","week_number");--> statement-breakpoint
ALTER TABLE "pushup_habit_log" ADD CONSTRAINT "pushup_habit_log_habit_id_pushup_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."pushup_habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "habit_log_date_idx" ON "pushup_habit_log" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "pushup_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "userstats_leaderboard_idx" ON "pushup_user_stats" USING btree ("total_consistent_days" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "actual_value";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "started_at";--> statement-breakpoint
ALTER TABLE "pushup_habit_log" DROP COLUMN "completed_at";--> statement-breakpoint
ALTER TABLE "pushup_user_stats" DROP COLUMN "current_streak";--> statement-breakpoint
ALTER TABLE "pushup_user_stats" DROP COLUMN "longest_streak";