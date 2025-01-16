CREATE TABLE IF NOT EXISTS "pending_deposits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"crypto_type" text NOT NULL,
	"proof_image_url" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"transaction_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pending_deposits_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "balance" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pending_deposits" ADD CONSTRAINT "pending_deposits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
