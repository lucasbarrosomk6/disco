ALTER TABLE "users" DROP CONSTRAINT "users_team_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "product_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "target_audience" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "main_use_case" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "key_features" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "key_features" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "problems_solved" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "success_metrics" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "team_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "team_id";