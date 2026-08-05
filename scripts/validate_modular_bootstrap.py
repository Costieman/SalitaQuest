#!/usr/bin/env python3
"""Validate the stable Salita Quest course-bootstrap contract."""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "src/config/course-manifest.js"
BOOTSTRAP = ROOT / "src/app/course-bootstrap.js"
SERVICE_WORKER = ROOT / "service-worker.js"


def fail(message: str) -> None:
    raise AssertionError(message)


def read(path: Path) -> str:
    if not path.is_file():
        fail(f"Required file is missing: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def array_values(source: str, variable: str) -> list[str]:
    match = re.search(
        rf"const\s+{re.escape(variable)}\s*=\s*\[(.*?)\];",
        source,
        flags=re.DOTALL,
    )
    if not match:
        fail(f"Could not find asset array: {variable}")
    return re.findall(r'"([^"\n]+)"', match.group(1))


def asset_path(value: str) -> str:
    return value.split("?", 1)[0]


def validate_page(path: str, course_id: str) -> None:
    source = read(ROOT / path)
    required_paths = (
        "src/config/course-manifest.js",
        "src/app/course-bootstrap.js",
    )
    script_sources = {
        asset_path(value)
        for value in re.findall(r'<script\s+[^>]*src=["\']([^"\']+)["\']', source)
    }
    for required in required_paths:
        if required not in script_sources:
            fail(f"{path} does not load {required}")
    if f'courseId: "{course_id}"' not in source:
        fail(f"{path} does not start course {course_id}")
    if "raw.githubusercontent.com" in source:
        fail(f"{path} still contains duplicated source-document bootstrap logic")


def validate_assets(manifest_source: str) -> None:
    arrays = {
        "sharedStyles": array_values(manifest_source, "sharedStyles"),
        "tagalogScripts": array_values(manifest_source, "tagalogScripts"),
        "cebuanoScripts": array_values(manifest_source, "cebuanoScripts"),
    }
    for variable, values in arrays.items():
        if not values:
            fail(f"{variable} is empty")
        paths = [asset_path(value) for value in values]
        if len(paths) != len(set(paths)):
            fail(f"{variable} contains duplicate component paths")
        for relative_path in paths:
            if not (ROOT / relative_path).is_file():
                fail(f"Manifest references a missing asset: {relative_path}")

    if asset_path(arrays["tagalogScripts"][0]) != "progression.js":
        fail("Tagalog bootstrap must load the course runtime before enhancements")
    if asset_path(arrays["cebuanoScripts"][0]) != "bisaya-app-loader.js":
        fail("Cebuano bootstrap must load the course adapter before enhancements")


def validate_storage_contract(manifest_source: str, bootstrap_source: str) -> None:
    storage_keys = (
        "salitaQuestLocalProfilesV1",
        "salitaQuestActiveProfileId",
        "salitaQuestActiveCourse",
        "salitaQuestProgress",
        "salitaQuestBaseProgressOwner",
        "salitaQuestProgress.profile.",
        "salitaQuestAppDocumentV554",
        "salitaQuestBisayaAppDocumentV554",
    )
    for key in storage_keys:
        if key not in manifest_source:
            fail(f"Storage compatibility key is missing from the manifest: {key}")

    required_behaviour = (
        "saveSharedProgress",
        "prepareProgress",
        "force-cache",
        "document.open()",
        "document.write(assembledDocument)",
        'window.location.replace("./")',
    )
    for fragment in required_behaviour:
        if fragment not in bootstrap_source:
            fail(f"Bootstrap compatibility behaviour is missing: {fragment}")


def validate_service_worker() -> None:
    source = read(SERVICE_WORKER)
    required = (
        'const CACHE_PREFIX = "salita-quest-sandbox-";',
        "key.startsWith(CACHE_PREFIX)",
        '"./src/config/course-manifest.js"',
        '"./src/app/course-bootstrap.js"',
    )
    for fragment in required:
        if fragment not in source:
            fail(f"Service worker is missing: {fragment}")


def validate_javascript_syntax() -> None:
    node = shutil.which("node")
    if not node:
        print("Node.js unavailable; skipped JavaScript syntax checks.")
        return
    for path in (MANIFEST, BOOTSTRAP, SERVICE_WORKER):
        result = subprocess.run(
            [node, "--check", str(path)],
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode:
            fail(f"JavaScript syntax check failed for {path.relative_to(ROOT)}:\n{result.stderr}")


def main() -> int:
    manifest_source = read(MANIFEST)
    bootstrap_source = read(BOOTSTRAP)
    validate_page("app.html", "tagalog")
    validate_page("bisaya.html", "cebuano")
    validate_assets(manifest_source)
    validate_storage_contract(manifest_source, bootstrap_source)
    validate_service_worker()
    validate_javascript_syntax()
    print("Modular bootstrap validation passed.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
