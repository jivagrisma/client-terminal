"""Tools MCP-style expuestas al agente — todas de SOLO LECTURA sobre GitHub.

El contrato (nombre, descripción, schema JSON) es el mismo que tendrían
en un MCP server; se registran aquí in-process para no exponer un endpoint
MCP público a internet (ver plan, decisión de arquitectura #1).
"""

import json
from typing import Any

from . import github

TOOLS_SCHEMA = [
    {
        "name": "github_get_repo",
        "description": "Get metadata of one of jivagrisma's public GitHub repos (description, default branch, language, stars).",
        "input_schema": {
            "type": "object",
            "properties": {"repo": {"type": "string", "description": "Repo name, e.g. 'motos-y-servicios-ia'"}},
            "required": ["repo"],
        },
    },
    {
        "name": "github_list_commits",
        "description": "List recent commits of a public repo (sha, message, author, date).",
        "input_schema": {
            "type": "object",
            "properties": {
                "repo": {"type": "string"},
                "per_page": {"type": "integer", "description": "1-20, default 5"},
            },
            "required": ["repo"],
        },
    },
    {
        "name": "github_get_file",
        "description": "Read a text file from a public repo (e.g. README.md). Max 4000 chars returned.",
        "input_schema": {
            "type": "object",
            "properties": {"repo": {"type": "string"}, "path": {"type": "string"}},
            "required": ["repo", "path"],
        },
    },
    {
        "name": "github_list_workflows",
        "description": "List GitHub Actions workflows defined in a public repo.",
        "input_schema": {
            "type": "object",
            "properties": {"repo": {"type": "string"}},
            "required": ["repo"],
        },
    },
    {
        "name": "github_list_runs",
        "description": "List recent GitHub Actions runs (CI/CD status) of a public repo.",
        "input_schema": {
            "type": "object",
            "properties": {
                "repo": {"type": "string"},
                "per_page": {"type": "integer", "description": "1-20, default 5"},
            },
            "required": ["repo"],
        },
    },
]


async def dispatch(name: str, args: dict[str, Any]) -> str:
    """Ejecuta una tool y devuelve su resultado como JSON string (contrato MCP)."""
    try:
        if name == "github_get_repo":
            result = await github.get_repo(args["repo"])
        elif name == "github_list_commits":
            result = await github.list_commits(args["repo"], args.get("per_page", 5))
        elif name == "github_get_file":
            result = await github.get_file(args["repo"], args["path"])
        elif name == "github_list_workflows":
            result = await github.list_workflows(args["repo"])
        elif name == "github_list_runs":
            result = await github.list_runs(args["repo"], args.get("per_page", 5))
        else:
            result = {"error": f"unknown tool: {name}"}
    except github.GithubError as e:
        result = {"error": str(e)}
    except (KeyError, TypeError) as e:
        result = {"error": f"invalid arguments: {e}"}
    return json.dumps(result)
