DO $$ BEGIN
 CREATE TYPE "public"."id_type" AS ENUM('passport', 'national_id', 'drivers_license');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kyc" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"date_of_birth" timestamp,
	"email" text NOT NULL,
	"phone_number" text,
	"street_address" text,
	"city" text,
	"state" text,
	"postal_code" text,
	"country" text,
	"id_type" "id_type" NOT NULL,
	"id_number" text NOT NULL,
	"id_document_url" text,
	"proof_of_address_url" text,
	"selfie_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kyc_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "kyc_email_unique" UNIQUE("email"),
	CONSTRAINT "kyc_id_number_unique" UNIQUE("id_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kyc" ADD CONSTRAINT "kyc_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
