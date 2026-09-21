"""Harness del agente: Anthropic SDK → z.ai GLM (primario) con fallback a Anthropic API."""

import json
from collections.abc import AsyncIterator

import httpx
from anthropic import Anthropic, APIConnectionError, APIStatusError

from .config import get_settings
from .profile import SYSTEM_PROMPT
from .tools import TOOLS_SCHEMA, dispatch

MAX_TURNS = 6


def _clients() -> list[tuple[Anthropic, str]]:
    """Lista de (cliente, modelo) en orden de preferencia: z.ai → Anthropic."""
    settings = get_settings()
    options: list[tuple[Anthropic, str]] = []
    if settings.llm_api_key:
        options.append(
            (
                Anthropic(base_url=settings.llm_base_url, api_key=settings.llm_api_key, max_retries=1),
                settings.llm_model,
            )
        )
    if settings.fallback_llm_api_key:
        options.append(
            (
                Anthropic(
                    base_url=settings.fallback_llm_base_url,
                    api_key=settings.fallback_llm_api_key,
                    max_retries=1,
                ),
                settings.fallback_llm_model,
            )
        )
    return options


async def run_agent(message: str, history: list[dict[str, str]]) -> AsyncIterator[str]:
    """Yieldea eventos SSE: {"delta": "..."} con el texto final del agente."""
    settings = get_settings()
    messages = [*history, {"role": "user", "content": message}]

    clients = _clients()
    if not clients:
        yield json.dumps({"error": "agent is not configured (missing LLM credentials)"})
        return

    last_error: Exception | None = None
    for client, model in clients:
        try:
            async for event in _run_with_client(client, model, messages, settings.max_tokens):
                yield event
            return
        except (httpx.HTTPError, APIConnectionError, ConnectionError, TimeoutError) as e:
            last_error = e
            continue
        except APIStatusError as e:
            if e.status_code >= 500 and client is not clients[-1][0]:
                last_error = e
                continue  # error de servidor del proveedor → probar fallback
            yield json.dumps({"error": f"LLM provider error ({e.status_code}): {str(e)[:200]}"})
            return
        # Errores de API (status no reintentable, tool bugs, etc.) se reportan directo:
        except _AgentError as e:
            yield json.dumps({"error": str(e)})
            return

    yield json.dumps({"error": f"all LLM providers failed: {last_error}"})


class _AgentError(Exception):
    pass


async def _run_with_client(
    client: Anthropic, model: str, messages: list[dict], max_tokens: int
) -> AsyncIterator[str]:
    """Loop de tool-use completo contra un proveedor; yield de deltas de texto."""
    for _ in range(MAX_TURNS):
        # El SDK de Anthropic es síncrono; se llama en el event loop vía stream
        # (sin bloquear el server: cada chunk llega por HTTP streaming).
        with client.messages.stream(
            model=model,
            max_tokens=max_tokens,
            system=SYSTEM_PROMPT,
            tools=TOOLS_SCHEMA,
            messages=messages,
        ) as stream:
            text = ""
            for chunk in stream.text_stream:
                text += chunk
                yield json.dumps({"delta": chunk})

            final = stream.get_final_message()

        if final.stop_reason != "tool_use":
            return

        # Ejecutar tools solicitadas y continuar la conversación
        messages.append({"role": "assistant", "content": final.content})
        tool_results = []
        for block in final.content:
            if block.type == "tool_use":
                result = await dispatch(block.name, dict(block.input))
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    }
                )
        messages.append({"role": "user", "content": tool_results})

    yield json.dumps({"delta": "\n(reached tool-call limit)"})
