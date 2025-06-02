ALTER TYPE "transaction_type" ADD VALUE 'investment_profit';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investment_profit_payouts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_investment_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"payout_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investment_profit_payouts" ADD CONSTRAINT "investment_profit_payouts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investment_profit_payouts" ADD CONSTRAINT "investment_profit_payouts_user_investment_id_user_investment_id_fk" FOREIGN KEY ("user_investment_id") REFERENCES "public"."user_investment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
