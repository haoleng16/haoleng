"""配置管理和系统设置。"""

from dataclasses import dataclass
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()


@dataclass
class ModelConfig:
    """单个模型配置。"""
    api_key: str
    model: str
    base_url: str
    provider: str = "openai"

    def create_chat_model(self, **kwargs):
        """使用 init_chat_model 创建聊天模型实例。"""
        return init_chat_model(
            model=self.model,
            model_provider=self.provider,
            api_key=self.api_key,
            base_url=self.base_url,
            streaming=True,
            **kwargs,
        )
        


@dataclass
class AgentConfig:
    """Agent 运行配置，从环境变量加载。"""
    timeout: float = 60.0

    # DeepSeek（默认）
    deepseek_api_key: str = ""
    deepseek_model: str = "deepseek-v4-flash"
    deepseek_base_url: str = "https://api.deepseek.com"

    # Qwen VL（多模态）
    qwen_api_key: str = ""
    qwen_model: str = ""
    qwen_base_url: str = ""

    # GLM
    glm_api_key: str = ""
    glm_model: str = ""
    glm_base_url: str = ""

    def __post_init__(self):
        if not self.deepseek_api_key:
            self.deepseek_api_key = os.environ.get("DEEPSEEK_API_KEY", "")
        env_model = os.environ.get("DEEPSEEK_MODEL")
        if env_model:
            self.deepseek_model = env_model
        env_base = os.environ.get("DEEPSEEK_BASE_URL")
        if env_base:
            self.deepseek_base_url = env_base

        if not self.qwen_api_key:
            self.qwen_api_key = os.environ.get("QWEN_API_KEY", "")
        env_qwen_model = os.environ.get("QWEN_MODEL")
        if env_qwen_model:
            self.qwen_model = env_qwen_model
        env_qwen_base = os.environ.get("QWEN_BASE_URL")
        if env_qwen_base:
            self.qwen_base_url = env_qwen_base

        if not self.glm_api_key:
            self.glm_api_key = os.environ.get("GLM_API_KEY", "")
        env_glm_model = os.environ.get("GLM_MODEL")
        if env_glm_model:
            self.glm_model = env_glm_model
        env_glm_base = os.environ.get("GLM_BASE_URL")
        if env_glm_base:
            self.glm_base_url = env_glm_base

    @property
    def deepseek(self) -> ModelConfig:
        return ModelConfig(
            api_key=self.deepseek_api_key,
            model=self.deepseek_model,
            base_url=self.deepseek_base_url,
            provider="openai",
        )

    @property
    def qwen(self) -> ModelConfig:
        return ModelConfig(
            api_key=self.qwen_api_key,
            model=self.qwen_model,
            base_url=self.qwen_base_url,
            provider="openai",
        )

    @property
    def glm(self) -> ModelConfig:
        return ModelConfig(
            api_key=self.glm_api_key,
            model=self.glm_model,
            base_url=self.glm_base_url,
            provider="openai",
        )

    def get_model(self, name: str = "deepseek") -> ModelConfig:
        """按名称获取模型配置。"""
        models = {
            "deepseek": self.deepseek,
            "qwen": self.qwen,
            "glm": self.glm,
        }
        return models.get(name, self.deepseek)
