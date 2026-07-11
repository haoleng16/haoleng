# ===== Backend Dockerfile (FastAPI + OCR, China-mirror accelerated) =====
FROM python:3.13-slim

# Switch apt to a China mirror (Tencent Cloud Ubuntu mirror) for faster installs
RUN sed -i 's|deb.debian.org|mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list.d/debian.sources 2>/dev/null \
    || sed -i 's|deb.debian.org|mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list 2>/dev/null \
    || true

# System deps required for PDF resume OCR:
#   poppler-utils  → pdftoppm (PDF → image)
#   tesseract-ocr  → OCR engine
#   tesseract-ocr-chi-sim → Chinese simplified language data
#   libgl1         → shared lib sometimes needed by image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-chi-sim \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Use a China PyPI mirror for much faster pip downloads
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple \
    && pip config set global.trusted-host pypi.tuna.tsinghua.edu.cn

# Install Python deps first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Ensure the static dir exists (FastAPI mounts it at /static)
RUN mkdir -p static

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
