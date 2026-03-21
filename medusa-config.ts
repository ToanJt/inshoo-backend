import { defineConfig } from "@medusajs/framework/utils";

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors:
        process.env.STORE_CORS ||
        "http://169.254.82.84:3000,http://localhost:3000,https://inshoo.netlify.app",
      adminCors:
        process.env.ADMIN_CORS ||
        "http://localhost:3000,https://inshoo.netlify.app",
      authCors:
        process.env.AUTH_CORS ||
        "http://169.254.82.84:3000,http://localhost:3000,https://inshoo.netlify.app",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
});
