import type { Config } from "@react-router/dev/config";
import fs from "node:fs";
import path from "node:path";

export default {
  routeDiscovery: {
    mode: "initial",
  },
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
    
    // Recursively scan all directories for markdown files to generate valid static routes
    const scanDir = (dir: string) => {
      const fullPath = path.join(publicDir, dir);
      if (fs.existsSync(fullPath)) {
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        entries.forEach(entry => {
          if (entry.isDirectory()) {
            scanDir(path.join(dir, entry.name));
          } else if (entry.name.endsWith(".md")) {
            const routePath = path.join(dir, path.parse(entry.name).name).replace(/\\/g, "/");
            contentRoutes.push(`/content${routePath === "." ? "" : "/" + routePath}`);
          }
        });
      }
    };

    scanDir(".");

    return Array.from(new Set([...baseRoutes, ...contentRoutes]));
  },
} satisfies Config;