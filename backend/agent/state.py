"""图状态定义和数据结构。"""

from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """Agent 图状态 —— messages 自动追加而非覆盖。"""
    messages: Annotated[list, add_messages]
