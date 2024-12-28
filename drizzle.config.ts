import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema",
  out: "./lib/db/migrations",
  dbCredentials: {
    // connectionString: process.env.DATABASE_URL!,
    url: process.env.DATABASE_URL!,
  },
});
