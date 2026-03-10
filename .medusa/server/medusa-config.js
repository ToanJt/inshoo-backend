"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
module.exports = (0, utils_1.defineConfig)({
    admin: {
        disable: false,
    },
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        http: {
            storeCors: process.env.STORE_CORS ||
                "http://169.254.82.84:3000,http://localhost:3000,https://inshoo.netlify.app",
            adminCors: process.env.ADMIN_CORS ||
                "http://localhost:3000,https://inshoo.netlify.app",
            authCors: process.env.AUTH_CORS ||
                "http://169.254.82.84:3000,http://localhost:3000,https://inshoo.netlify.app",
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBeUQ7QUFFekQsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDNUIsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELGFBQWEsRUFBRTtRQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7UUFDckMsSUFBSSxFQUFFO1lBQ0osU0FBUyxFQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVTtnQkFDdEIsNEVBQTRFO1lBQzlFLFNBQVMsRUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7Z0JBQ3RCLGtEQUFrRDtZQUNwRCxRQUFRLEVBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTO2dCQUNyQiw0RUFBNEU7WUFDOUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLGFBQWE7WUFDbEQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLGFBQWE7U0FDekQ7S0FDRjtDQUNGLENBQUMsQ0FBQyJ9