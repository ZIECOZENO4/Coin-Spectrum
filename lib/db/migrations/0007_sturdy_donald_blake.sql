CREATE TABLE IF NOT EXISTS "traders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"followers" integer DEFAULT 0 NOT NULL,
	"min_capital" double precision NOT NULL,
	"percentage_profit" double precision NOT NULL,
	"total_profit" double precision NOT NULL,
	"rating" integer NOT NULL,
	"is_pro" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
