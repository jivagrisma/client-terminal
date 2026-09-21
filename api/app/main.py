from collections.abc import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from .agent import run_agent
from .config import get_settings
from .github import get_status
from .ratelimit import allow

settings = get_settings()

app = FastAPI(title="client-terminal-api", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin] if settings.allowed_origin else [],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    return forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "?")


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/status")
async def status(request: Request) -> JSONResponse:
    if not allow(_client_ip(request), limit=30):
        return JSONResponse({"error": "rate limited"}, status_code=429)
    repos = [r.strip() for r in settings.status_repos.split(",") if r.strip()]
    try:
        data = await get_status(repos[0])
        return JSONResponse(data)
    except Exception as e:  # noqa: BLE001 — el statusbar debe degradar, no romper
        return JSONResponse(
            {"repo": repos[0] if repos else "?", "ciState": "unknown", "error": str(e)[:120]},
            status_code=200,
        )


class AgentMessage(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    history: list[dict[str, str]] = Field(default_factory=list, max_length=20)


@app.post("/api/agent")
async def agent(body: AgentMessage, request: Request) -> StreamingResponse:
    if not allow(_client_ip(request), limit=10):
        return StreamingResponse(iter(['{"error": "rate limited — try again in a minute"}']),
                                 media_type="text/event-stream", status_code=429)

    async def event_stream() -> AsyncIterator[str]:
        async for event in run_agent(body.message, body.history):
            yield f"data: {event}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
