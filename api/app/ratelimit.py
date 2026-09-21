"""Rate limiting por IP (token bucket simple, en memoria)."""

import time
from collections import defaultdict, deque

_buckets: dict[str, deque[float]] = defaultdict(deque)


def allow(ip: str, limit: int, window_s: int = 60) -> bool:
    now = time.monotonic()
    bucket = _buckets[ip]
    while bucket and now - bucket[0] > window_s:
        bucket.popleft()
    if len(bucket) >= limit:
        return False
    bucket.append(now)
    return True
