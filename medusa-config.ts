import { defineConfig } from "@medusajs/framework/utils";

module.exports = defineConfig({
  admin: {
    disable: false,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors:
        process.env.STORE_CORS ||
        "http://localhost:3000,https://moonlit-cupcake-1a9c76.netlify.app",
      adminCors:
        process.env.ADMIN_CORS ||
        "http://localhost:3000,https://moonlit-cupcake-1a9c76.netlify.app",
      authCors:
        process.env.AUTH_CORS ||
        "http://localhost:3000,https://moonlit-cupcake-1a9c76.netlify.app",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
});
