CREATE TYPE "public"."pushup_goal_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ACHIEVED');--> statement-breakpoint
CREATE TYPE "public"."pushup_goal_type" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'LIFETIME');--> statement-breakpoint
CREATE TYPE "public"."pushup_notification" AS ENUM('INFO', 'FEATURE', 'UPDATE', 'WARNING', 'SUCCESS', 'WELCOME');--> statement-breakpoint
CREATE TABLE "pushup_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text,
	"message" text,
	"read" boolean DEFAULT false,
	"type" "pushup_notification" NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "pushup_notification" CASCADE;--> statement-breakpoint
ALTER TABLE "pushup_notifications" ADD CONSTRAINT "pushup_notifications_user_id_pushup_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pushup_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_interacted_notifcation" ON "pushup_notifications" USING btree ("user_id","read");