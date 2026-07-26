# Salita Quest v4.2 Mobile

A mobile-first, conversation-based Tagalog learning app. This release keeps the v4 data model and remains compatible with desktop progress backups from v3.2 and v4.0.

## Mobile improvements

- Compact app header and persistent five-tab bottom navigation
- Original, high-end language-learning interface with large touch targets
- Focused home screen with a clear daily lesson and configurable quick review
- Full-screen lesson mode with a progress bar and fixed answer controls
- Phone-friendly topic cards, dictionary filters, dialogues, progress panels, and settings
- More menu for Skill Path, Challenges, Progress, and Settings
- First-run desktop-progress import prompt
- Progressive Web App installation support
- Self-contained `index.html` build included, preventing missing-style problems when files are moved

## Import progress from the desktop version

1. On the desktop version, open **Settings**.
2. Select **Download progress backup** (or **Export progress** in v3.2).
3. Move the downloaded `.json` file to the phone.
4. In this version, open **Settings → Import progress backup**.
5. Select the JSON file.

The importer preserves mastery, due dates, review intervals, correct and incorrect counts, XP, coins, streaks, and compatible settings. It accepts raw v3.2 exports and packaged v4 backups.

## Run

### Simplest offline use

Extract the complete ZIP and open `index.html`. The file is self-contained, so its design and learning logic load even when the browser does not handle nearby CSS or JavaScript files correctly.

### Recommended installed-app use

Run:

```bash
python server.py
```

Open `http://127.0.0.1:8000`. On Android, choose **Install app** or **Add to Home screen** from the browser menu.

Note: a phone cannot normally reach a server running only on a different computer through `127.0.0.1`. For phone installation, host the folder on an HTTPS site or run the server on a reachable local-network address.


## Journey Edition additions

- Visual learning journey with module nodes and review camps
- Daily quests tied to meaningful learning actions rather than XP grinding
- Weekly momentum display
- Level titles and visual XP progression
- Session completion ratings and milestone celebrations
- Combo feedback during lessons
- Research-aligned achievement presentation
- Reduced-motion, dark-mode, and celebration-sound settings
- Full progress import compatibility with v3.2, v4.0, and v4.1 backups
