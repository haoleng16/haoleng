"""配置管理和系统设置。"""

from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()


@dataclass
class AgentConfig:
    """Agent 运行配置，从环境变量加载。"""
    api_key: str = ""
    model: str = "deepseek-v4-flash"
    api_base: str = "https://api.deepseek.com"
    timeout: float = 60.0

    def __post_init__(self):
        if not self.api_key:
            self.api_key = os.environ.get("DEEPSEEK_API_KEY", "")
        if self.model == "deepseek-v4-flash":
            env_model = os.environ.get("DEEPSEEK_MODEL")
            if env_model:
                self.model = env_model

    @classmethod
    def from_env(cls) -> "AgentConfig":
        return cls(
            api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
            model=os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash"),
        )
