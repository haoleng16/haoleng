from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from pathlib import Path

from agent import ResumeAgent, AgentConfig

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


# ── 路由 ────────────────────────────────────────────────
@app.post("/api/agent/chat")
async def agent_chat(req: ChatRequest):
    target_agent = agent
    if req.model:
        cfg = AgentConfig(model=req.model)
        target_agent = ResumeAgent(config=cfg)
    return StreamingResponse(
        target_agent.chat_stream(req.messages),
        media_type="text/event-stream",
    )



