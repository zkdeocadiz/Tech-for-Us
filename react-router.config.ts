import type { Config } from "@react-router/dev/config";
import fs from "node:fs";
import path from "node:path";

export default {
  // Define the paths you want to prerender into static HTML
  async prerender() {
    const baseRoutes = [
      "/",
      "/your-content",
      "/quiz",
      "/quiz/results",
      "/technology-types",
      "/activities",
      "/activity-sets",
      "/alternative-social-tech",
      "/contributors",
    ];

    const contentRoutes: string[] = [];
    const publicDir = path.resolve(process.cwd(), "public");
    
    // Scan folders for markdown files to generate valid static routes
    const contentDirs = [".", "results", "activities"];

    contentDirs.forEach(dir => {
      const fullPath = path.join(publicDir, dir);
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
          if (file.endsWith(".md")) {
            contentRoutes.push(`/content/${path.parse(file).name}`);
          }
        });
      }
    });

    return Array.from(new Set([...baseRoutes, ...contentRoutes]));
  },
} satisfies Config;