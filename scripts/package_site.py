#!/usr/bin/env python3
"""Copy an explicit public-file allowlist; only approved public assets are packaged."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "outputs" / "site"
PUBLIC_FILES = (
    "index.html",
    "what-i-build/index.html",
    "dist/page-transitions.js",
    "dist/portfolio.css",
    "dist/portfolio.js",
    "dist/projects.html",
    "dist/experience.html",
    "dist/skills.html",
    "dist/photography.html",
    "dist/assets/favicon.ico",
    "dist/assets/Avatar.png",
    "dist/assets/hero-900.webp",
    "dist/assets/hero-1600.webp",
    "dist/assets/hero-2304.webp",
    "dist/assets/social-preview.jpg",
    "dist/assets/titanium-main-640.webp",
    "dist/assets/titanium-main-1280.webp",
    "dist/assets/titanium-main-2084.webp",
    "dist/assets/titanium-table-left.png",
    "dist/assets/titanium-table-right.png",
    "dist/assets/titanium-line-chart.png",
    "dist/assets/titanium-bar-chart.png",
    "dist/assets/bookstore.jpg",
    "dist/assets/hr-system.jpg",
    "dist/assets/orb-slam-2.jpg",
)

if __name__ == "__main__":
    # Only clean this script's own output, never the source dist/assets directory.
    if DESTINATION.is_symlink():
        raise SystemExit("Refusing a symlink as the package destination")
    if DESTINATION.exists():
        shutil.rmtree(DESTINATION)
    for relative in PUBLIC_FILES:
        source, destination = ROOT / relative, DESTINATION / relative
        if not source.is_file() or source.is_symlink():
            raise SystemExit(f"Missing or unsupported public file: {relative}")
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    (DESTINATION / ".nojekyll").touch()
    print(f"Packaged {len(PUBLIC_FILES)} public files and .nojekyll in {DESTINATION}")
