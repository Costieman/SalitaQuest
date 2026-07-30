#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project)}"
REGION="${REGION:-asia-southeast1}"
SERVICE_NAME="${SERVICE_NAME:-salita-quest-social-share}"
BUCKET_NAME="${SHARE_BUCKET:-${PROJECT_ID}-salita-share-cards}"
SERVICE_ACCOUNT_NAME="${SERVICE_ACCOUNT_NAME:-salita-share-service}"
SERVICE_ACCOUNT="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
APP_URL="${PUBLIC_APP_URL:-https://costieman.github.io/SalitaQuest/}"
ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-https://costieman.github.io}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "No Google Cloud project is active." >&2
  exit 1
fi

echo "Project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Service: ${SERVICE_NAME}"
echo "Bucket: ${BUCKET_NAME}"

gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  storage.googleapis.com \
  --project="${PROJECT_ID}"

if ! gcloud iam service-accounts describe "${SERVICE_ACCOUNT}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud iam service-accounts create "${SERVICE_ACCOUNT_NAME}" \
    --display-name="Salita Quest social share service" \
    --project="${PROJECT_ID}"
fi

if ! gcloud storage buckets describe "gs://${BUCKET_NAME}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud storage buckets create "gs://${BUCKET_NAME}" \
    --project="${PROJECT_ID}" \
    --location="${REGION}" \
    --uniform-bucket-level-access
fi

LIFECYCLE_FILE="$(mktemp)"
cat >"${LIFECYCLE_FILE}" <<'JSON'
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 365}
    }
  ]
}
JSON

gcloud storage buckets update "gs://${BUCKET_NAME}" \
  --lifecycle-file="${LIFECYCLE_FILE}" \
  --project="${PROJECT_ID}"
rm -f "${LIFECYCLE_FILE}"

gcloud storage buckets add-iam-policy-binding "gs://${BUCKET_NAME}" \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/storage.objectAdmin" \
  --project="${PROJECT_ID}" >/dev/null

gcloud run deploy "${SERVICE_NAME}" \
  --source="services/social-share" \
  --region="${REGION}" \
  --project="${PROJECT_ID}" \
  --service-account="${SERVICE_ACCOUNT}" \
  --allow-unauthenticated \
  --set-env-vars="SHARE_BUCKET=${BUCKET_NAME},PUBLIC_APP_URL=${APP_URL},ALLOWED_ORIGINS=${ALLOWED_ORIGINS},MAX_UPLOADS_PER_HOUR=30" \
  --memory="512Mi" \
  --cpu="1" \
  --min-instances="0" \
  --max-instances="3"

SERVICE_URL="$(gcloud run services describe "${SERVICE_NAME}" --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')"

echo
echo "Hosted sharing service deployed:"
echo "${SERVICE_URL}"
echo
echo "Health check:"
curl --fail --silent --show-error "${SERVICE_URL}/healthz"
echo
echo
echo "Paste this URL into Salita Quest:"
echo "Settings → Connected accounts → Connection service"
echo "${SERVICE_URL}"
