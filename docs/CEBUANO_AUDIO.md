# Cebuano audio with Google Cloud Gemini-TTS

Salita Quest does not substitute Tagalog pronunciation for Cebuano. Verified Cebuano clips are stored as static MP3 files and indexed in `audio/audio_manifest.json` under the `ceb-PH` language code.

## Current Google Cloud support

Google Cloud Gemini-TTS lists Cebuano (Philippines), `ceb-PH`, as a Preview language. The repository generator defaults to:

- model: `gemini-3.1-flash-tts-preview`
- language: `ceb-PH`
- voice: `Kore`
- output: MP3

Because Gemini-TTS and Cebuano support are Preview features, availability, pricing, model names and required permissions can change. Check the current Google Cloud documentation before a large generation run.

## Google Cloud prerequisites

1. Create or choose a Google Cloud project.
2. Enable billing.
3. Enable Cloud Text-to-Speech.
4. Install and initialise the Google Cloud CLI.
5. Authenticate Application Default Credentials:

```bash
gcloud auth application-default login
```

6. Give the authenticated user `roles/aiplatform.user`. Gemini-TTS requires the `aiplatform.endpoints.predict` permission.
7. Set the project:

```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_REGION="global"
```

## Install the Python client

```bash
python -m pip install "google-cloud-texttospeech>=2.29.0"
```

## Preview the generation list

```bash
python scripts/generate_cebuano_google_audio.py --dry-run
```

## Test a small batch

Generate only the first five missing clips:

```bash
python scripts/generate_cebuano_google_audio.py --limit 5
```

Listen to those clips and confirm the accent, pacing and word stress before generating the complete library.

## Generate every missing clip

```bash
python scripts/generate_cebuano_google_audio.py
```

The generator:

- reads Cebuano course items and dialogue lines;
- removes duplicate text;
- writes deterministic files beneath `audio/ceb-PH/`;
- updates `audio/audio_manifest.json` after each successful clip;
- leaves existing clips untouched unless `--force` is used.

## Voice and delivery controls

Choose another Gemini-TTS voice:

```bash
python scripts/generate_cebuano_google_audio.py --voice Callirrhoe
```

Adjust the delivery prompt:

```bash
python scripts/generate_cebuano_google_audio.py \
  --prompt "Speak natural conversational Cebuano from the Philippines slowly and clearly for a beginner learner. Do not translate."
```

## Safety and credentials

Do not commit service-account keys, access tokens, downloaded credential JSON, or `.env` files. The generator uses Application Default Credentials and does not place credentials in the app or its static files.

The browser app only receives generated MP3 files. It never receives a Google Cloud API key.
