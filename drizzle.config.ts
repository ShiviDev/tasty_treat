import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", //where to put migration scripts that will be generated
  schema: "./src/**/schema.ts",
  dialect: "postgresql", //the database that we will be using
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
