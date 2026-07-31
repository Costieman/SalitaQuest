from __future__ import annotations

import hashlib
import io
import struct
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "avatars" / "canonical"
SIZE = (128, 128)

SOURCES = {
    "eagle": "avatars/eagle.png",
    "tamaraw": "avatars/tamaraw.png",
    "anahaw": "avatars/anahaw.png",
    "peacock": "avatars/peacock.png",
    "orchid": "avatars/orchid.png",
    "jade": "avatars/jade.png",
    "rafflesia": "avatars/rafflesia.png",
    "tarsier": "avatars/tarsier.png",
    "narra": "avatars/narra.png",
    "nipa_palm": "avatars/nipa.png",
    "buri_palm": "avatars/buri.png",
    "almaciga": "avatars/almaciga.png",
    "pandan": "avatars/pandan.png",
    "bakawan_mangrove": "avatars/bakawan.png",
    "kawayang_tinik": "avatars/kawayang-tinik.png",
    "pili": "avatars/pili.png",
    "katmon": "avatars/katmon.png",
    "medinilla": "avatars/medinilla.png",
    "philippine_teak": "avatars/philippine-teak.png",
    "banaba": "avatars/banaba.png",
    "mangkono": "avatars/mangkono.png",
    "attenborough_pitcher": "avatars/attenborough-pitcher.png",
    "slipper_orchid": "avatars/slipper-orchid.png",
    "philippine_hoya": "avatars/philippine-hoya.png",
    "parol": "avatars/parol.svg",
    "vinta": "avatars/vinta.svg",
    "kulintang": "avatars/kulintang.svg",
    "bangka": "avatars/bangka.svg",
    "jeepney": "avatars/jeepney.svg",
    "bahay_kubo": "avatars/bahay-kubo.svg",
    "sarimanok": "avatars/sarimanok.svg",
    "golden_salita_crest": "avatars/golden-salita-crest.svg",
    "philippine_pangolin": "avatars/philippine-pangolin.webp",
    "visayan_spotted_deer": "avatars/visayan-spotted-deer.webp",
    "visayan_warty_pig": "avatars/visayan-warty-pig.webp",
    "philippine_crocodile": "avatars/philippine-crocodile.webp",
    "philippine_forest_turtle": "avatars/philippine-forest-turtle.webp",
    "philippine_sailfin_lizard": "avatars/philippine-sailfin-lizard.webp",
    "golden_crowned_flying_fox": "avatars/golden-crowned-flying-fox.webp",
    "philippine_colugo": "avatars/philippine-colugo.webp",
    "philippine_cockatoo": "avatars/philippine-cockatoo.svg",
    "rufous_hornbill": "avatars/rufous-hornbill.svg",
    "luzon_bleeding_heart_dove": "avatars/luzon-bleeding-heart-dove.svg",
    "cebu_flowerpecker": "avatars/cebu-flowerpecker.svg",
    "philippine_eagle_owl": "avatars/philippine-eagle-owl.svg",
    "whale_shark_butanding": "avatars/whale-shark-butanding.svg",
    "dugong": "avatars/dugong.svg",
    "hawksbill_sea_turtle": "avatars/hawksbill-sea-turtle.svg",
}


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
    if len(SOURCES) != 48 or len(set(SOURCES)) != 48:
        raise ValueError("The canonical manifest must contain 48 unique IDs")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for stale in OUTPUT.glob("*.png"):
        stale.unlink()

    for avatar_id, relative_source in SOURCES.items():
        source = ROOT / relative_source
        if not source.is_file():
            raise FileNotFoundError(source)
        destination = OUTPUT / f"{avatar_id}.png"
        render_source(source).save(destination, format="PNG", optimize=True)

    files = sorted(OUTPUT.glob("*.png"))
    if len(files) != 48:
        raise ValueError(f"Expected 48 canonical PNGs, found {len(files)}")

    hashes = [validate_png(path) for path in files]
    if len(set(hashes)) != 48:
        raise ValueError("Canonical avatar output contains duplicate files")

    print("Generated and validated 48 standalone canonical 128x128 PNG avatars.")


if __name__ == "__main__":
    main()
