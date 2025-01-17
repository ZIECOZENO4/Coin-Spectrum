CREATE TABLE IF NOT EXISTS "signal_purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"signal_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"purchased_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trading_signals" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" double precision NOT NULL,
	"percentage" double precision NOT NULL,
	"expiry" text NOT NULL,
	"risk" text NOT NULL,
	"description" text NOT NULL,
	"signal_details" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signal_purchases" ADD CONSTRAINT "signal_purchases_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signal_purchases" ADD CONSTRAINT "signal_purchases_signal_id_trading_signals_id_fk" FOREIGN KEY ("signal_id") REFERENCES "public"."trading_signals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
