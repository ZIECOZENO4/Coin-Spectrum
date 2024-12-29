DO $$ BEGIN
 CREATE TYPE "public"."InvestmentName" AS ENUM('VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6', 'VIP7');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."TransactionType" AS ENUM('Deposit', 'Withdrawal', 'Investment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."UserRole" AS ENUM('User', 'Admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Investment" (
	"id" text PRIMARY KEY NOT NULL,
	"name" "InvestmentName" NOT NULL,
	"price" double precision NOT NULL,
	"profitPercent" double precision NOT NULL,
	"rating" integer NOT NULL,
	"principalReturn" boolean NOT NULL,
	"principalWithdraw" boolean NOT NULL,
	"creditAmount" double precision NOT NULL,
	"depositFee" text NOT NULL,
	"debitAmount" double precision NOT NULL,
	"durationDays" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TransactionHistory" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"investmentId" text,
	"type" "TransactionType" NOT NULL,
	"amount" double precision NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserInvestment" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"investmentId" text NOT NULL,
	"amount" double precision NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserReferral" (
	"id" text PRIMARY KEY NOT NULL,
	"referrerId" text NOT NULL,
	"referredUserId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "UserRole" DEFAULT 'User' NOT NULL,
	"firstName" text,
	"username" text,
	"fullName" text,
	"imageUrl" text,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_investmentId_Investment_id_fk" FOREIGN KEY ("investmentId") REFERENCES "public"."Investment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserInvestment" ADD CONSTRAINT "UserInvestment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserInvestment" ADD CONSTRAINT "UserInvestment_investmentId_Investment_id_fk" FOREIGN KEY ("investmentId") REFERENCES "public"."Investment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserReferral" ADD CONSTRAINT "UserReferral_referrerId_User_id_fk" FOREIGN KEY ("referrerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserReferral" ADD CONSTRAINT "UserReferral_referredUserId_User_id_fk" FOREIGN KEY ("referredUserId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "UserReferral_referral_key" ON "UserReferral" USING btree (referrerId,referredUserId);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User" USING btree (username);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" USING btree (email);