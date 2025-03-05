ALTER TABLE "user" ADD COLUMN "transaction_pin" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "transaction_pin_unique" ON "user" USING btree (transaction_pin);