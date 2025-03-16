DO $$ BEGIN
 CREATE TYPE "public"."withdrawal_requirement_status" AS ENUM('fulfilled', 'unfulfilled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "withdrawal_requirement" "withdrawal_requirement_status" DEFAULT 'unfulfilled' NOT NULL;