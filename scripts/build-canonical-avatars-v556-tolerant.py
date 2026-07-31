from __future__ import annotations

import importlib.util
import tarfile
import zipfile
from pathlib import Path

SCRIPT = Path(__file__).with_name("build-canonical-avatars-v556.py")
spec = importlib.util.spec_from_file_location("canonical_builder", SCRIPT)
if spec is None or spec.loader is None:
    raise RuntimeError("Canonical avatar builder could not be loaded")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def safe_destination(root: Path, member_name: str) -> Path:
    destination = (root / member_name).resolve()
    resolved_root = root.resolve()
    if destination != resolved_root and resolved_root not in destination.parents:
        raise ValueError(f"Unsafe archive member: {member_name}")
    return destination


def unpack_complete_members(root: Path) -> None:
    for index, archive_path in enumerate(sorted(root.rglob("*.zip"))):
        destination = root / f"_unpacked_zip_{index}"
        destination.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(archive_path) as archive:
            for member in archive.infolist():
                safe_destination(destination, member.filename)
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
        extracted = 0
        try:
            with tarfile.open(archive_path, mode="r:*") as archive:
                while True:
                    try:
                        member = archive.next()
                    except tarfile.ReadError:
                        break
                    if member is None:
                        break
                    safe_destination(destination, member.name)
                    try:
                        archive.extract(member, destination, filter="data")
                        extracted += 1
                    except (tarfile.ReadError, EOFError, OSError):
                        target = destination / member.name
                        if target.is_file():
                            target.unlink()
                        break
        except tarfile.ReadError:
            pass
        print(f"Recovered {extracted} complete members from {archive_path.name}")


module.unpack_embedded_archives = unpack_complete_members
module.main()
