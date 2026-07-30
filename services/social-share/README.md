# Salita Quest hosted achievement sharing

Facebook, LinkedIn and X build link previews by fetching Open Graph metadata from a public URL. They cannot see a canvas or `blob:` image created only inside the learner's browser. This Cloud Run service stores the generated achievement card privately in Cloud Storage and serves a unique public page whose `og:image` is that exact card.

## What it provides

- `POST /api/share-cards` accepts a 1080×1080 square PNG and a 1200×630 Open Graph PNG.
- `GET /share/:id` serves immutable Open Graph and Twitter Card metadata.
- `GET /media/:id/og.png` serves the landscape social preview.
- `GET /media/:id/square.png` serves the square badge or Badge Chest card.
- Each landing page includes a **Start learning a Filipino language free** call-to-action.
- Objects are kept in a private Cloud Storage bucket and streamed by Cloud Run.

The upload endpoint restricts browser origins, validates PNG dimensions and signatures, limits image size, and applies a basic per-IP hourly limit. The deployment script adds a 365-day Cloud Storage lifecycle rule.

## Deploy from Google Cloud Shell

From the repository root:

```bash
chmod +x services/social-share/deploy-cloud-shell.sh
./services/social-share/deploy-cloud-shell.sh
```

The script prints the HTTPS Cloud Run URL. In Salita Quest, open:

```text
Settings → Connected accounts → Connection service
```

Paste and save that URL. Hosted badge/chest previews will then be available for Facebook, LinkedIn, X and WhatsApp.

## Platform behavior

- **Facebook / LinkedIn / X:** share the unique hosted page; the platform crawler receives the 1200×630 card through Open Graph metadata.
- **Instagram / TikTok:** receive the actual 1080×1080 image through device sharing, or through a future approved connected-account publishing integration.
- **Connected-account publishing:** remains a separate OAuth/provider-permission project. This service solves public card hosting and link previews without storing provider tokens.

## Environment variables

- `SHARE_BUCKET` — private Cloud Storage bucket.
- `PUBLIC_APP_URL` — Salita Quest invitation destination.
- `ALLOWED_ORIGINS` — comma-separated browser origins allowed to upload.
- `MAX_UPLOADS_PER_HOUR` — simple per-instance upload limit; default `30`.
