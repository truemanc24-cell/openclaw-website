"""
AI Content Generator - Providers
支持多个 AI 生成服务提供商
"""

from .playground import PlaygroundProvider
from .leonardo import LeonardoProvider
from .cogvideo import CogVideoProvider

__all__ = [
    "PlaygroundProvider",
    "LeonardoProvider",
    "CogVideoProvider",
]


def get_provider(name: str, **kwargs):
    """
    获取指定名称的服务商实例
    
    Args:
        name: 服务商名称 (playground, leonardo, cogvideo)
        **kwargs: 传递给提供商的额外参数
        
    Returns:
        提供商实例
    """
    providers = {
        "playground": PlaygroundProvider,
        "leonardo": LeonardoProvider,
        "cogvideo": CogVideoProvider,
    }
    
    if name not in providers:
        raise ValueError(f"未知服务商：{name}")
    
    return providers[name](**kwargs)


def get_available_providers():
    """获取所有可用的服务商实例"""
    available = []
    
    for name, cls in [
        ("playground", PlaygroundProvider),
        ("leonardo", LeonardoProvider),
        ("cogvideo", CogVideoProvider),
    ]:
        provider = cls()
        if provider.is_available():
            available.append((name, provider))
    
    return available
