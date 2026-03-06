import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      port: process.env.PORT || 9000,
      storeCors:
        "http://localhost:3000,https://moonlit-cupcake-1a9c76.netlify.app",
      adminCors:
        "inshoo-backend-production.up.railway.app,https://moonlit-cupcake-1a9c76.netlify.app",
      authCors:
        "http://localhost:3000,https://moonlit-cupcake-1a9c76.netlify.app",

      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
});
