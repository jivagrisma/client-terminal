"""Cliente GitHub REST — SOLO LECTURA, repos públicos de jivagrisma.

Seguridad:
- Únicamente requests GET; ningún endpoint de escritura existe en este módulo.
- El owner está fijado a "jivagrisma": el agente no puede usar nuestro quota
  para leer repos arbitrarios de terceros.
- Las respuestas se filtran a campos whitelisted antes de salir del backend.
"""

import base64
import re
import time
from typing import Any

import httpx

from .config import get_settings

GITHUB_API = "https://api.github.com"
OWNER = "jivagrisma"
_REPO_RE = re.compile(r"^[A-Za-z0-9_.-]{1,100}$")

_cache: dict[str, tuple[float, Any]] = {}


class GithubError(Exception):
    pass


def _normalize_repo(repo: str) -> str:
    """Acepta 'name' o 'jivagrisma/name'; rechaza cualquier otro owner o formato."""
    name = repo.split("/")[-1] if "/" in repo else repo
    if "/" in repo and repo.rsplit("/", 1)[0] != OWNER:
        raise GithubError(f"only {OWNER} repos are accessible")
    if not _REPO_RE.match(name):
        raise GithubError("invalid repo name")
    return f"{OWNER}/{name}"


async def _get(path: str) -> Any:
    settings = get_settings()
    key = f"GET {path}"
    now = time.monotonic()
    cached = _cache.get(key)
    if cached and now - cached[0] < settings.github_cache_ttl:
        return cached[1]

    headers = {"Accept": "application/vnd.github+json"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"

    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get(f"{GITHUB_API}{path}", headers=headers)

    if res.status_code == 404:
        raise GithubError("not found (public repos only)")
    if res.status_code == 403:
        raise GithubError("rate limited by GitHub — try again in a minute")
    res.raise_for_status()
    data = res.json()
    _cache[key] = (now, data)
    return data


async def get_repo(repo: str) -> dict[str, Any]:
    data = await _get(f"/repos/{_normalize_repo(repo)}")
    return {
        "name": data.get("name"),
        "description": data.get("description"),
        "default_branch": data.get("default_branch"),
        "language": data.get("language"),
        "stars": data.get("stargazers_count"),
        "forks": data.get("forks_count"),
        "updated_at": data.get("updated_at"),
        "html_url": data.get("html_url"),
        "archived": data.get("archived"),
    }


async def list_commits(repo: str, per_page: int = 5) -> list[dict[str, Any]]:
    per_page = max(1, min(per_page, 20))
    data = await _get(f"/repos/{_normalize_repo(repo)}/commits?per_page={per_page}")
    return [
        {
            "sha": c.get("sha", "")[:7],
            "message": (c.get("commit", {}).get("message") or "").split("\n")[0],
            "author": (c.get("commit", {}).get("author") or {}).get("name"),
            "date": (c.get("commit", {}).get("author") or {}).get("date"),
        }
        for c in data
    ]


async def get_file(repo: str, path: str) -> dict[str, Any]:
    if not re.match(r"^[\w\-./]{1,200}$", path) or ".." in path:
        raise GithubError("invalid path")
    data = await _get(f"/repos/{_normalize_repo(repo)}/contents/{path}")
    if not isinstance(data, dict) or data.get("encoding") != "base64":
        raise GithubError("file not found or is a directory")
    content = base64.b64decode(data.get("content", "")).decode("utf-8", errors="replace")
    return {"path": data.get("path"), "size": data.get("size"), "content": content[:4000]}


async def list_workflows(repo: str) -> list[dict[str, Any]]:
    data = await _get(f"/repos/{_normalize_repo(repo)}/actions/workflows")
    return [
        {
            "name": w.get("name"),
            "path": w.get("path"),
            "state": w.get("state"),
        }
        for w in data.get("workflows", [])
    ]


async def list_runs(repo: str, per_page: int = 5) -> list[dict[str, Any]]:
    per_page = max(1, min(per_page, 20))
    data = await _get(
        f"/repos/{_normalize_repo(repo)}/actions/runs?per_page={per_page}"
    )
    return [
        {
            "name": r.get("name"),
            "branch": r.get("head_branch"),
            "status": r.get("status"),
            "conclusion": r.get("conclusion"),
            "created_at": r.get("created_at"),
            "html_url": r.get("html_url"),
        }
        for r in data.get("workflow_runs", [])
    ]


async def get_status(repo: str) -> dict[str, Any]:
    """Resumen para el statusbar: rama, último commit y último run de CI."""
    full = _normalize_repo(repo)
    repo_info = await get_repo(full)
    commits = await list_commits(full, per_page=1)
    runs = await list_runs(full, per_page=1)

    last = commits[0] if commits else {}
    run = runs[0] if runs else {}

    if run.get("status") == "completed":
        ci = "success" if run.get("conclusion") == "success" else "failure"
    elif run.get("status") in ("in_progress", "queued"):
        ci = "pending"
    else:
        ci = "unknown"

    return {
        "repo": full.split("/")[1],
        "branch": repo_info.get("default_branch"),
        "lastCommitSha": last.get("sha"),
        "lastCommitMsg": last.get("message"),
        "ciState": ci,
        "ciWorkflow": run.get("name"),
        "ciRunUrl": run.get("html_url"),
        "region": "gcp:us-central1",
    }
