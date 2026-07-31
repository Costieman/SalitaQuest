from __future__ import annotations

import hashlib
import io
import re
import struct
import subprocess
import tarfile
import tempfile
import zipfile
from pathlib import Path

import cairosvg
import pillow_avif  # noqa: F401 - registers AVIF support with Pillow
from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "avatars" / "canonical"
SIZE = (128, 128)
SOURCE_REFS = (
    "origin/agent/avatar-canonical-rebuild-v5-5-6-1024",
    "origin/agent/avatar-progression-step-06-assets-rare-animals-2",
)

SOURCE_STEMS = {
    "eagle": ("philippine_eagle", "eagle"),
    "tamaraw": ("tamaraw",),
    "anahaw": ("anahaw",),
    "peacock": ("palawan_peacock_pheasant", "peacock"),
    "orchid": ("waling_waling_orchid", "orchid"),
    "jade": ("jade_vine", "jade"),
    "rafflesia": ("philippine_rafflesia", "rafflesia"),
    "tarsier": ("philippine_tarsier", "tarsier"),
    "narra": ("narra",),
    "nipa_palm": ("nipa_palm", "nipa"),
    "buri_palm": ("buri_palm", "buri"),
    "almaciga": ("almaciga",),
    "pandan": ("pandan",),
    "bakawan_mangrove": ("bakawan_mangrove", "bakawan"),
    "kawayang_tinik": ("kawayang_tinik_bamboo", "kawayang_tinik"),
    "pili": ("pili",),
    "katmon": ("katmon_flower", "katmon"),
    "medinilla": ("medinilla_magnifica", "medinilla"),
    "philippine_teak": ("philippine_teak_blossom", "philippine_teak"),
    "banaba": ("banaba_flower", "banaba"),
    "mangkono": ("mangkono_blossom", "mangkono"),
    "attenborough_pitcher": ("attenborough_pitcher_plant", "attenborough_pitcher"),
    "slipper_orchid": ("philippine_slipper_orchid", "slipper_orchid"),
    "philippine_hoya": ("philippine_hoya",),
    "parol": ("parol",),
    "vinta": ("vinta",),
    "kulintang": ("kulintang",),
    "bangka": ("bangka",),
    "jeepney": ("jeepney",),
    "bahay_kubo": ("bahay_kubo",),
    "sarimanok": ("sarimanok",),
    "golden_salita_crest": ("golden_salita_crest",),
    "philippine_pangolin": ("philippine_pangolin",),
    "visayan_spotted_deer": ("visayan_spotted_deer",),
    "visayan_warty_pig": ("visayan_warty_pig",),
    "philippine_crocodile": ("philippine_crocodile",),
    "philippine_forest_turtle": ("philippine_forest_turtle",),
    "philippine_sailfin_lizard": ("philippine_sailfin_lizard",),
    "golden_crowned_flying_fox": (
        "giant_golden_crowned_flying_fox",
        "golden_crowned_flying_fox",
    ),
    "philippine_colugo": ("philippine_colugo",),
    "philippine_cockatoo": ("philippine_cockatoo",),
    "rufous_hornbill": ("rufous_hornbill",),
    "luzon_bleeding_heart_dove": (
        "luzon_bleeding_heart_dove",
        "luzon_bleeding_heart",
    ),
    "cebu_flowerpecker": ("cebu_flowerpecker",),
    "philippine_eagle_owl": ("philippine_eagle_owl",),
    "whale_shark_butanding": ("whale_shark_butanding", "whale_shark"),
    "dugong": ("dugong",),
    "hawksbill_sea_turtle": ("hawksbill_sea_turtle", "hawksbill_turtle"),
}

RASTER_SUFFIXES = {".png", ".webp", ".avif", ".jpg", ".jpeg"}
SUPPORTED_SUFFIXES = RASTER_SUFFIXES | {".svg"}


def slug(value: str) -> str:
    return re.sub(r"^_+|_+$", "", re.sub(r"[^a-z0-9]+", "_", value.lower()))


def extract_ref(ref: str, destination: Path) -> None:
    subprocess.run(
        ["git", "rev-parse", "--verify", ref],
        cwd=ROOT,
        check=True,
        stdout=subprocess.DEVNULL,
    )
    archive = subprocess.check_output(
        ["git", "archive", "--format=tar", ref],
        cwd=ROOT,
    )
    with tarfile.open(fileobj=io.BytesIO(archive), mode="r:") as bundle:
        bundle.extractall(destination, filter="data")


def unpack_embedded_archives(root: Path) -> None:
    for index, archive_path in enumerate(sorted(root.rglob("*.zip"))):
        destination = root / f"_unpacked_zip_{index}"
        destination.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(archive_path) as archive:
            for member in archive.infolist():
                target = (destination / member.filename).resolve()
                if destination.resolve() not in target.parents and target != destination.resolve():
                    raise ValueError(f"Unsafe ZIP member: {member.filename}")
            archive.extractall(destination)

    tar_candidates = sorted(
        path
        for path in root.rglob("*")
        if path.is_file()
        and (
            path.suffix.lower() == ".tar"
            or path.name.lower().endswith((".tar.gz", ".tgz", ".tar.bz2", ".tar.xz"))
        )
    )
    for index, archive_path in enumerate(tar_candidates):
        destination = root / f"_unpacked_tar_{index}"
        destination.mkdir(parents=True, exist_ok=True)
        with tarfile.open(archive_path, mode="r:*") as archive:
            archive.extractall(destination, filter="data")


def candidate_score(path: Path, source_priority: int) -> tuple[int, int, int, int]:
    suffix = path.suffix.lower()
    if suffix in RASTER_SUFFIXES:
        try:
            with Image.open(path) as image:
                image.load()
                area = image.width * image.height
        except (UnidentifiedImageError, OSError, ValueError):
            return (-1, -1, -1, -1)
        return (source_priority, 2, area, path.stat().st_size)
    if suffix == ".svg":
        return (source_priority, 1, 0, path.stat().st_size)
    return (-1, -1, -1, -1)


def select_sources(roots: list[tuple[Path, int]]) -> dict[str, Path]:
    files: list[tuple[Path, int]] = []
    for root, priority in roots:
        files.extend(
            (path, priority)
            for path in root.rglob("*")
            if path.is_file() and path.suffix.lower() in SUPPORTED_SUFFIXES
        )

    selected: dict[str, Path] = {}
    for avatar_id, aliases in SOURCE_STEMS.items():
        accepted = {slug(alias) for alias in aliases}
        candidates = [
            (candidate_score(path, priority), path)
            for path, priority in files
            if slug(path.stem) in accepted
        ]
        candidates = [item for item in candidates if item[0][0] >= 0]
        if not candidates:
            raise FileNotFoundError(f"No readable source found for {avatar_id}")
        candidates.sort(key=lambda item: item[0], reverse=True)
        selected[avatar_id] = candidates[0][1]
    return selected


def render_source(path: Path) -> Image.Image:
    if path.suffix.lower() == ".svg":
        rendered = cairosvg.svg2png(
            url=str(path),
            output_width=SIZE[0],
            output_height=SIZE[1],
        )
        return Image.open(io.BytesIO(rendered)).convert("RGBA")

    source = Image.open(path).convert("RGBA")
    if source.size == SIZE:
        return source

    source.thumbnail(SIZE, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    canvas.alpha_composite(
        source,
        ((SIZE[0] - source.width) // 2, (SIZE[1] - source.height) // 2),
    )
    return canvas


def validate_png(path: Path) -> str:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Not a PNG: {path}")
    width, height = struct.unpack(">II", data[16:24])
    if (width, height) != SIZE:
        raise ValueError(f"Wrong dimensions for {path}: {width}x{height}")
    if len(data) < 1000:
        raise ValueError(f"Unexpectedly small avatar: {path}")
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    if len(SOURCE_STEMS) != 48 or len(set(SOURCE_STEMS)) != 48:
        raise ValueError("The canonical manifest must contain 48 unique IDs")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for stale in OUTPUT.glob("*.png"):
        stale.unlink()

    with tempfile.TemporaryDirectory(prefix="salita-avatar-source-") as temporary:
        temporary_root = Path(temporary)
        source_roots: list[tuple[Path, int]] = []
        for index, ref in enumerate(SOURCE_REFS):
            destination = temporary_root / f"source_{index + 1}"
            destination.mkdir()
            extract_ref(ref, destination)
            unpack_embedded_archives(destination)
            priority = len(SOURCE_REFS) - index
            source_roots.append((destination, priority))

        selected = select_sources(source_roots)
        for avatar_id, source in selected.items():
            destination = OUTPUT / f"{avatar_id}.png"
            render_source(source).save(destination, format="PNG", optimize=True)
            print(f"{avatar_id}: {source.relative_to(temporary_root)}")

    files = sorted(OUTPUT.glob("*.png"))
    if len(files) != 48:
        raise ValueError(f"Expected 48 canonical PNGs, found {len(files)}")

    hashes = [validate_png(path) for path in files]
    if len(set(hashes)) != 48:
        raise ValueError("Canonical avatar output contains duplicate files")

    print("Generated and validated 48 standalone canonical 128x128 PNG avatars.")


if __name__ == "__main__":
    main()
