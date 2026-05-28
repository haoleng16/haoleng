"""工具函数和辅助方法。"""

import json
from langchain_core.messages import HumanMessage, AIMessage


def dict_to_lc_messages(messages: list[dict[str, str]]) -> list:
    """将前端传入的 dict 消息列表转为 LangChain Message 对象。"""
    result = []
    for m in messages:
        role = m.get("role", "user")
        content = m.get("content", "")
        if role == "user":
            result.append(HumanMessage(content=content))
        elif role == "assistant":
            result.append(AIMessage(content=content))
    return result


def format_sse_chunk(delta: str) -> str:
    """将单个 delta 文本格式化为前端兼容的 SSE data 行。"""
    sse_data = json.dumps(
        {"choices": [{"delta": {"content": delta}}]},
        ensure_ascii=False,
    )
    return f"data: {sse_data}\n\n"


SSE_DONE = "data: [DONE]\n\n"
