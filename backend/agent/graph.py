"""主要的 LangGraph 实现，入口点是 ResumeAgent。"""

from langchain_deepseek import ChatDeepSeek
from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, START, END

from agent.state import AgentState
from agent.prompts import SYSTEM_PROMPT
from agent.configuration import AgentConfig
from agent.utils import dict_to_lc_messages, format_sse_chunk, SSE_DONE


class ResumeAgent:
    """简历分析 Agent —— 基于 LangGraph StateGraph 架构。"""

    def __init__(self, config: AgentConfig):
        self.config = config
        self.llm = ChatDeepSeek(
            model=config.model,
            api_key=config.api_key,
            streaming=True,
        )
        self.graph = self._build_graph()

    def _call_model(self, state: AgentState) -> dict:
        """节点：调用 LLM 生成回复。"""
        system = SystemMessage(content=SYSTEM_PROMPT)
        response = self.llm.invoke([system, *state["messages"]])
        return {"messages": [response]}

    def _build_graph(self) -> StateGraph:
        """构建 LangGraph 状态图:START → call_model → END"""
        graph = StateGraph(AgentState)
        graph.add_node("call_model", self._call_model)
        graph.add_edge(START, "call_model")
        graph.add_edge("call_model", END)
        return graph.compile()

    async def chat_stream(self, messages: list[dict[str, str]]):
        """
        流式调用 LangGraph，将 LLM token 以兼容前端的 SSE 格式 yield。
        """
        lc_messages = dict_to_lc_messages(messages)
        input_state = {"messages": lc_messages}

        async for chunk in self.graph.astream(
            input_state,
            stream_mode="messages",
            version="v2",
        ):
            if chunk["type"] == "messages":
                msg_chunk, _metadata = chunk["data"]
                if msg_chunk.content:
                    yield format_sse_chunk(msg_chunk.content)

        yield SSE_DONE
