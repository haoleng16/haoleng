"""PDF OCR helpers used by the resume scoring endpoint."""

from __future__ import annotations

import base64
import shutil
import subprocess
import tempfile
from pathlib import Path


RUNTIME_BIN = Path("/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin")
MAX_PDF_BYTES = 12 * 1024 * 1024


class OCRError(RuntimeError):
    pass


def decode_pdf_base64(content_base64: str) -> bytes:
    try:
        data = base64.b64decode(content_base64, validate=True)
    except Exception as exc:
        raise OCRError("PDF 内容不是有效的 base64。") from exc
    if not data.startswith(b"%PDF"):
        raise OCRError("只支持上传 PDF 简历。")
    if len(data) > MAX_PDF_BYTES:
        raise OCRError("PDF 文件过大，请控制在 12MB 以内。")
    return data


def _tool(name: str) -> str:
    found = shutil.which(name)
    if found:
        return found
    bundled = RUNTIME_BIN / name
    if bundled.exists():
        return str(bundled)
    raise OCRError(f"未找到 {name}，无法进行 PDF OCR。")


def ocr_pdf_bytes(pdf_bytes: bytes) -> str:
    pdftoppm = _tool("pdftoppm")
    tesseract = _tool("tesseract")

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        pdf_path = tmp_path / "resume.pdf"
        out_prefix = tmp_path / "page"
        pdf_path.write_bytes(pdf_bytes)

        subprocess.run(
            [pdftoppm, "-r", "220", "-png", str(pdf_path), str(out_prefix)],
            check=True,
            capture_output=True,
            text=True,
            timeout=60,
        )

        page_texts = []
        for page in sorted(tmp_path.glob("page-*.png")):
            result = subprocess.run(
                [tesseract, str(page), "stdout", "-l", "chi_sim+eng", "--psm", "6"],
                check=True,
                capture_output=True,
                text=True,
                timeout=60,
            )
            if result.stdout.strip():
                page_texts.append(result.stdout.strip())

    text = "\n\n".join(page_texts).strip()
    if not text:
        raise OCRError("OCR 未识别到有效文字，请换一份清晰的 PDF。")
    return text
