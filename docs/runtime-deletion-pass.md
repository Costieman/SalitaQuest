# Runtime deletion pass

This sandbox branch follows the browser runtime graph rooted at `index.html`, `app.html`, and `bisaya.html`, including manifest-injected and service-worker-injected dependencies.

- Deleted unreachable browser JS/CSS: 64
- Renamed live components to stable filenames: 33
- Replaced the historical service-worker precache inventory with a small core cache plus cache-on-use.
- Sandbox cache deletion is restricted to cache names beginning with `salita-quest-sandbox-`.

Git history now carries component evolution; filenames describe components rather than release stages.
