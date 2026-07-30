#!/usr/bin/env python3
"""Generate verified Cebuano audio clips with Google Cloud Gemini-TTS.

Requires:
  pip install "google-cloud-texttospeech>=2.29.0"
  gcloud auth application-default login
  export GOOGLE_CLOUD_PROJECT="your-project-id"

Cloud requirements:
  - Cloud Text-to-Speech API enabled
  - billing enabled
  - roles/aiplatform.user for the authenticated principal

The script writes MP3 files beneath audio/ceb-PH and updates
`audio/audio_manifest.json` using Salita Quest's existing manifest format.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
COURSE_PATH = ROOT / "languages" / "cebuano" / "course.json"
MANIFEST_PATH = ROOT / "languages" / "cebuano" / "modules" / "manifest.json"
AUDIO_MANIFEST_PATH = ROOT / "audio" / "audio_manifest.json"
OUTPUT_DIR = ROOT / "audio" / "ceb-PH"
LANGUAGE_CODE = "ceb-PH"
DEFAULT_MODEL = "gemini-3.1-flash-tts-preview"
DEFAULT_VOICE = "Kore"
DEFAULT_PROMPT = (
    "Speak natural conversational Cebuano from the Philippines clearly and warmly. "
    "Use a moderate learning pace, preserve normal Cebuano stress and rhythm, and do not translate the text."
)


def normalise(text: str) -> str:
    return " ".join(str(text or "").split()).strip()


def iter_course_texts() -> Iterable[str]:
    course = json.loads(COURSE_PATH.read_text(encoding="utf-8"))
    module_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    packs = []
    for name in module_manifest.get("packs", []):
        path = MANIFEST_PATH.parent / name
        packs.append(json.loads(path.read_text(encoding="utf-8")))

    for item in [*course.get("items", []), *(item for pack in packs for item in pack.get("items", []))]:
        for field in ("term", "example", "root"):
            value = normalise(item.get(field, ""))
            if value:
                yield value

    dialogues = [course.get("dialogue"), *(pack.get("dialogue") for pack in packs)]
    for dialogue in dialogues:
        if not dialogue:
            continue
        for line in dialogue.get("lines", []):
            value = normalise(line.get("text", ""))
            if value:
                yield value


def unique_texts() -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for text in iter_course_texts():
        if text not in seen:
            seen.add(text)
            result.append(text)
    return result


def filename_for(text: str) -> str:
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()[:20]
    return f"ceb-{digest}.mp3"


def load_audio_manifest() -> dict:
    if AUDIO_MANIFEST_PATH.exists():
        data = json.loads(AUDIO_MANIFEST_PATH.read_text(encoding="utf-8"))
    else:
        data = {"version": 1, "entries": {}}
    data.setdefault("entries", {}).setdefault(LANGUAGE_CODE, {})
    return data


def synthesize(text: str, output: Path, model: str, voice_name: str, prompt: str) -> None:
    try:
        from google.api_core.client_options import ClientOptions
        from google.cloud import texttospeech
    except ImportError as exc:
        raise SystemExit('Install the client first: pip install "google-cloud-texttospeech>=2.29.0"') from exc

    region = os.getenv("GOOGLE_CLOUD_REGION", "global")
    endpoint = "texttospeech.googleapis.com" if region == "global" else f"{region}-texttospeech.googleapis.com"
    client = texttospeech.TextToSpeechClient(client_options=ClientOptions(api_endpoint=endpoint))
    request_input = texttospeech.SynthesisInput(text=text, prompt=prompt)
    voice = texttospeech.VoiceSelectionParams(
        language_code=LANGUAGE_CODE,
        name=voice_name,
        model_name=model,
    )
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    response = client.synthesize_speech(input=request_input, voice=voice, audio_config=audio_config)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(response.audio_content)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--prompt", default=DEFAULT_PROMPT)
    parser.add_argument("--limit", type=int, default=0, help="Generate only the first N missing clips")
    parser.add_argument("--force", action="store_true", help="Regenerate clips already present")
    parser.add_argument("--dry-run", action="store_true", help="List work without calling Google Cloud")
    args = parser.parse_args()

    if not os.getenv("GOOGLE_CLOUD_PROJECT") and not args.dry_run:
        raise SystemExit("Set GOOGLE_CLOUD_PROJECT before generating audio.")

    manifest = load_audio_manifest()
    entries = manifest["entries"][LANGUAGE_CODE]
    texts = unique_texts()
    missing = [text for text in texts if args.force or text not in entries or not (ROOT / entries.get(text, "")).exists()]
    if args.limit > 0:
        missing = missing[: args.limit]

    print(f"Cebuano phrases discovered: {len(texts)}")
    print(f"Clips to generate: {len(missing)}")
    if args.dry_run:
        for text in missing:
            print(text)
        return 0

    for index, text in enumerate(missing, start=1):
        relative = Path("audio") / LANGUAGE_CODE / filename_for(text)
        output = ROOT / relative
        print(f"[{index}/{len(missing)}] {text}")
        synthesize(text, output, args.model, args.voice, args.prompt)
        entries[text] = relative.as_posix()
        AUDIO_MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
        AUDIO_MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Updated {AUDIO_MANIFEST_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
