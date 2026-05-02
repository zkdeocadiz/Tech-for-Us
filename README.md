# Tech for Us
Tech for Us is a toolkit to help you figure out what role technology should have in your life

## GitHub Pages

This repository is published with GitHub Pages using a GitHub Actions workflow (`.github/workflows/main.yml`). Pushing to the `main` branch triggers the workflow which builds the site with `npm run build` (Vite) and deploys the `./dist` output to GitHub Pages.

Quick verification and deployment commands:

- Install dependencies and build locally:

```bash
npm ci
npm run build
```

- Force-push a fresh history (already run in this workspace):

```bash
git remote add origin git@github.com:<your-username>/Tech-for-Us.git
git push -u origin main --force
```

- Open the published site (example):

https://zkdeocadiz.github.io/Tech-for-Us/

If you want a custom domain, add a `CNAME` file to the repository root with your domain (for example `example.com`) and configure DNS to point to GitHub Pages. I can add and configure a `CNAME` file if you provide the domain.

If you'd like, I can also add a short developer note about how to update the workflow or change the publish branch.
