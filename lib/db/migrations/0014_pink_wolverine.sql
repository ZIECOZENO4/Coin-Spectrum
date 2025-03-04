ALTER TABLE "user" ADD COLUMN "crypto_accounts" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "currency" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "trading_account_type" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "bitcoin_account_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "usdt_trc20_account_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "ethereum_account_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "litecoin_account_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "dogecoin_account_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "xrp_account_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "usdt_erc20_account_id";