# Salita Quest v5.4 — Local Learner Profiles

This patch adds a local profile gateway without changing the course engine or progress schema.

## Included

- Multiple local learner profiles
- Learner name and 4–6 digit PIN
- Salted SHA-256 PIN hashing through Web Crypto
- Eight 64×64 Philippine flora/fauna avatars
- Explicit local-storage consent
- Separate progress JSON for each profile
- Automatic migration of existing progress into the first profile
- Profile switching and logout
- Browser persistent-storage request
- Existing JSON export/import remains available inside Salita Quest

## Apply

From inside the patch folder:

```bash
python3 apply_patch.py /path/to/SalitaQuest
```

The installer:

1. backs up the current `index.html` and `service-worker.js`;
2. copies the current app page to `app.html`;
3. installs the new login gateway as `index.html`;
4. adds the profile scripts, styling and avatars;
5. updates the service-worker cache.

## Storage design

Profiles are stored under `salitaQuestLocalProfilesV1`. Progress remains compatible with the existing `salitaQuestProgress` structure and is copied into profile-specific keys beginning with `salitaQuestProgress.profile.`.

This is a local profile lock, not a secure server-authenticated account. Progress remains tied to the same website origin, device and browser until a future synchronization backend is added.
