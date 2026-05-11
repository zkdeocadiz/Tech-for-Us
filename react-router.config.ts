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
    const activityRoutes: string[] = [];
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

            // Also prerender activity detail routes so direct /activities/:pageId requests
            // don't fall back to 404 HTML on static hosts (which causes hydration mismatch).
            if (routePath.startsWith("activities/")) {
              const relative = routePath.slice("activities/".length);
              const [activityFolder] = relative.split("/");
              if (activityFolder) {
                activityRoutes.push(`/activity/${activityFolder}`);
              }
            }
          }
        });
      }
    };

    scanDir(".");

    return Array.from(new Set([...baseRoutes, ...contentRoutes, ...activityRoutes]));
  },
} satisfies Config;