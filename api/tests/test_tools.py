"""Tests de tools read-only — sin red: se mockea la capa HTTP."""

from unittest.mock import AsyncMock, patch

import pytest

from app import github, tools

# ---------- seguridad de _normalize_repo ----------

@pytest.mark.parametrize("bad", ["other/repo", "a/b/repo", "../etc", "re po", "x" * 200, "repo;rm -rf"])
def test_normalize_repo_rejects(bad):
    with pytest.raises(github.GithubError):
        github._normalize_repo(bad)


@pytest.mark.parametrize("good,expected", [("motos", "jivagrisma/motos"), ("jivagrisma/motos", "jivagrisma/motos")])
def test_normalize_repo_accepts(good, expected):
    assert github._normalize_repo(good) == expected


# ---------- solo GET ----------

async def test_all_tool_calls_are_get():
    """Ninguna tool puede hacer otra cosa que GET: _get es la única salida a red."""
    with patch.object(github, "_get", new=AsyncMock(return_value={})) as mock_get:
        await tools.dispatch("github_get_repo", {"repo": "x"})
        await tools.dispatch("github_list_commits", {"repo": "x"})
        await tools.dispatch("github_get_file", {"repo": "x", "path": "README.md"})
        await tools.dispatch("github_list_workflows", {"repo": "x"})
        await tools.dispatch("github_list_runs", {"repo": "x"})
    assert mock_get.await_count == 5
    for call in mock_get.await_args_list:
        path = call.args[0]
        assert path.startswith("/repos/jivagrisma/")


# ---------- formateo y whitelisting ----------

async def test_list_commits_whitelist():
    fake = [{
        "sha": "abcdef1234567890",
        "commit": {"message": "fix: something\n\nbody", "author": {"name": "jorge", "date": "2026-09-18T04:21:23Z"}},
        "author": {"login": "should-not-appear"},
        "html_url": "should-not-appear",
    }]
    with patch.object(github, "_get", new=AsyncMock(return_value=fake)):
        out = await github.list_commits("motos", 5)
    assert out == [{
        "sha": "abcdef1",
        "message": "fix: something",
        "author": "jorge",
        "date": "2026-09-18T04:21:23Z",
    }]


async def test_dispatch_unknown_tool():
    out = await tools.dispatch("github_delete_repo", {"repo": "x"})
    assert "error" in out


async def test_dispatch_github_error_is_json():
    with patch.object(github, "_get", new=AsyncMock(side_effect=github.GithubError("not found (public repos only)"))):
        out = await tools.dispatch("github_get_repo", {"repo": "viajemos"})
    assert "public repos only" in out


async def test_dispatch_invalid_args():
    out = await tools.dispatch("github_get_file", {"repo": "x"})
    assert "invalid arguments" in out


async def test_get_file_rejects_traversal():
    with pytest.raises(github.GithubError):
        await github.get_file("x", "../../etc/passwd")


# ---------- get_status ----------

async def test_get_status_maps_ci_state():
    repo_fake = {"default_branch": "main"}
    runs_fake = [{"name": "deploy", "status": "completed", "conclusion": "success", "head_branch": "main", "html_url": "u", "created_at": "d"}]
    async def fake_get(path):
        if path.endswith("/commits?per_page=1"):
            return [{"sha": "abc1234", "commit": {"message": "msg", "author": {"name": "j", "date": "d"}}}]
        if "/actions/runs" in path:
            return {"workflow_runs": runs_fake}
        return repo_fake
    with patch.object(github, "_get", new=AsyncMock(side_effect=fake_get)):
        out = await github.get_status("motos")
    assert out["ciState"] == "success"
    assert out["lastCommitSha"] == "abc1234"
    assert out["branch"] == "main"


# ---------- schemas ----------

def test_tools_schema_readonly_names():
    names = {t["name"] for t in tools.TOOLS_SCHEMA}
    assert names == {"github_get_repo", "github_list_commits", "github_get_file", "github_list_workflows", "github_list_runs"}
