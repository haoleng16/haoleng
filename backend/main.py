from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from pathlib import Path

from agent import ResumeAgent, AgentConfig
from agent.resume_ocr import OCRError, decode_pdf_base64, ocr_pdf_bytes
from agent.resume_scoring import build_resume_scoring_prompt
from agent.utils import SSE_DONE, format_sse_chunk

# ── Agent 实例 ──────────────────────────────────────────
agent = ResumeAgent(config=AgentConfig())

# ── FastAPI 应用 ────────────────────────────────────────
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# ── 请求模型 ────────────────────────────────────────────
class ChatRequest(BaseModel):
    messages: list[dict[str, str]]
    model: str = ""
    files: list[dict[str, str]] = []


# ── 路由 ────────────────────────────────────────────────
@app.post("/api/agent/chat")
async def agent_chat(req: ChatRequest):
    target_agent = agent
    if req.model:
        cfg = AgentConfig(deepseek_model=req.model)
        target_agent = ResumeAgent(config=cfg)

    messages = req.messages
    if req.files:
        try:
            resume_texts = []
            for file in req.files:
                pdf_bytes = decode_pdf_base64(file.get("contentBase64", ""))
                resume_texts.append(ocr_pdf_bytes(pdf_bytes))
            jd_text = messages[-1].get("content", "") if messages else ""
            scoring_prompt = build_resume_scoring_prompt(jd_text, "\n\n".join(resume_texts))
            messages = [*messages[:-1], {"role": "user", "content": scoring_prompt}]
        except OCRError as exc:
            async def error_stream():
                yield format_sse_chunk(f"OCR失败：{str(exc)}")
                yield SSE_DONE

            return StreamingResponse(error_stream(), media_type="text/event-stream")

    return StreamingResponse(
        target_agent.chat_stream(messages),
        media_type="text/event-stream",
    )
