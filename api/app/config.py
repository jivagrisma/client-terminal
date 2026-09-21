from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # CORS — dominio de producción; vacío = sin orígenes permitidos (same-origin via rewrites)
    allowed_origin: str = ""

    # GitHub — PAT fine-grained READ-ONLY, repos públicos únicamente. Vacío = sin token
    # (la API pública permite 60 req/h; con caché TTL 60s es suficiente).
    github_token: str = ""

    # Repos cuyo estado alimenta el statusbar (CSV "owner/name" o "name" → owner=jivagrisma)
    status_repos: str = "motos-y-servicios-ia"

    # LLM primario: z.ai GLM vía endpoint Anthropic-compatible
    llm_base_url: str = "https://api.z.ai/api/anthropic"
    llm_api_key: str = ""
    llm_model: str = "glm-4.6"

    # LLM fallback: Anthropic directo (vacío = deshabilitado)
    fallback_llm_base_url: str = "https://api.anthropic.com"
    fallback_llm_api_key: str = ""
    fallback_llm_model: str = "claude-sonnet-4-5-20250929"

    max_tokens: int = 1024
    github_cache_ttl: int = 60


@lru_cache
def get_settings() -> Settings:
    return Settings()
