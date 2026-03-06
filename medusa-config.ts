import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors:
        "http://localhost:8000,https://moonlit-cupcake-1a9c76.netlify.app",
      adminCors:
        "http://localhost:5173,https://moonlit-cupcake-1a9c76.netlify.app",
      authCors:
        "http://localhost:5173,http://localhost:8000,https://moonlit-cupcake-1a9c76.netlify.app",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
});
