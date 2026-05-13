# Zintlr SEO Static-Render POC

Pre-renders SEO landing pages to HTML and uploads to AWS S3. No origin server in request path.

## Quick start

    docker compose up -d
    cp .env.example .env
    # Edit .env: set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
    cd seo-backend && npm install
    npm run build:css    # builds Tailwind, writes public/_static/main.css
    npm run dev
    cd ../scripts && npm install
    npx tsx seed-pages.ts 10000
    npx tsx trigger-render.ts

See `docs/superpowers/specs/2026-05-12-zintlr-seo-static-design.md` for the full spec.
