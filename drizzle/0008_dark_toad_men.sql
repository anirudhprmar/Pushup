CREATE TABLE "pushup_notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text,
	"message" text,
	"read" boolean DEFAULT false,
	"type" "pushup_notification" NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pushup_notification" ADD CONSTRAINT "pushup_notification_user_id_pushup_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pushup_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_interacted_notifcation" ON "pushup_notification" USING btree ("user_id","read");--> statement-breakpoint
DROP TYPE "public"."pushup_goal_status";--> statement-breakpoint
DROP TYPE "public"."pushup_goal_type";