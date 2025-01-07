DO $$ BEGIN
 CREATE TYPE "public"."investment_name" AS ENUM('VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6', 'VIP7');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('Deposit', 'Withdrawal', 'Investment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('User', 'Admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" "investment_name" NOT NULL,
	"price" numeric(15, 2) NOT NULL,
	"profit_percent" numeric(5, 2) NOT NULL,
	"rating" integer NOT NULL,
	"principal_return" boolean NOT NULL,
	"principal_withdraw" boolean NOT NULL,
	"credit_amount" numeric(15, 2) NOT NULL,
	"deposit_fee" text NOT NULL,
	"debit_amount" numeric(15, 2) NOT NULL,
	"duration_days" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_referrals" (
	"id" text PRIMARY KEY NOT NULL,
	"referrer_id" text NOT NULL,
	"referred_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'User' NOT NULL,
	"first_name" text,
	"username" text,
	"full_name" text,
	"image_url" text,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "Investment";--> statement-breakpoint
DROP TABLE "TransactionHistory";--> statement-breakpoint
DROP TABLE "UserInvestment";--> statement-breakpoint
DROP TABLE "UserReferral";--> statement-breakpoint
DROP TABLE "User";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referral_idx" ON "user_referrals" USING btree (referrer_id,referred_user_id);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" USING btree (username);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree (email);