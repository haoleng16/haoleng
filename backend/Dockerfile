# ===== Backend Dockerfile (FastAPI + OCR) =====
FROM python:3.13-slim

# System deps required for PDF resume OCR:
#   poppler-utils  → pdftoppm (PDF → image)
#   tesseract-ocr  → OCR engine
#   tesseract-ocr-chi-sim → Chinese simplified language data (resume_ocr.py uses chi_sim+eng)
#   libgl1         → shared lib sometimes needed by image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-chi-sim \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Ensure the static dir exists (FastAPI mounts it at /static)
RUN mkdir -p static

EXPOSE 8000
# Launch the ASGI server. main:app = FastAPI instance in main.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
