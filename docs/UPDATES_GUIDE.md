# Updates Guide

This guide covers launcher updates and game updates.

---

## Part 1: Launcher Updates

### Option A: GitHub Releases

1. **Configure electron-builder.json:**
   ```json
   {
     "publish": {
       "provider": "github",
       "owner": "your-username",
       "repo": "DBOD-Launcher",
       "private": false
     }
   }
   ```

2. **Set GH_TOKEN** (PowerShell):
   ```powershell
   $env:GH_TOKEN="your-github-token"
   ```

3. **Build and publish:**
   ```bash
   npm run publish:github
   ```

The launcher uses electron-updater to check GitHub releases. Users get updates automatically on startup.

### Option B: Custom Update Server

Use your own server when you don't want to use GitHub.

**Server structure:**
```
your-server.com/
├── launcher-updates/
│   ├── latest.json
│   └── DBOD-Launcher.exe
```

**latest.json:**
```json
{
  "version": "1.0.2",
  "url": "https://your-server.com/launcher-updates/DBOD-Launcher.exe",
  "notes": "Bug fixes"
}
```

The launcher already supports custom servers. It fetches `latest.json`, compares with `package.json` version, and downloads the new exe when available. No code change needed if you configure the update URL in the launcher.

**Requirements:** HTTPS, static file hosting, large file download support.

---

## Part 2: Game Updates

The launcher downloads and extracts game update zip files with incremental versioning and language-specific localization.

### Server File Structure

```
your-server.com/
└── updates/
    ├── update-1.zip
    ├── update-2.zip
    ├── update-3.zip
    └── localize/
        ├── en.zip
        ├── kr.zip
        └── cn.zip
```

### File Naming

- Game updates: `update-1.zip`, `update-2.zip`, etc. (no gaps)
- Localization: `en.zip`, `kr.zip`, `cn.zip` in `/updates/localize/`

### Zip Structure

**First update (update-1.zip):**
```
pack/
└── (game files)
localize/
└── pack/
    └── (base localization files)
```

**Later updates:** Include only new/changed files with the same structure.

### Configure Base URL

Edit `src/App.js` (around line 50):

```javascript
const baseUrl = 'https://your-server.com/updates';
```

### Version Tracking

The launcher creates `game-version.txt` in its directory:

```
launcher-directory/
├── game-version.txt
├── pack/
└── localize/
    └── pack/
```

### Testing Game Updates

1. Create an update zip with `pack/` and `localize/pack/` folders.
2. Host it (e.g. `python -m http.server 8000`).
3. Set `baseUrl` in `src/App.js` to your local or test URL.
4. Run the launcher, select a language, click "Update Game".
5. Confirm files extract to the launcher directory.

### Troubleshooting

- **"Failed to download game update"** — Check URL, file exists, network.
- **"Invalid update folder structure"** — Ensure zip has `pack/` and `localize/pack/`.
- **Updates not downloading** — Verify naming (update-1.zip, update-2.zip...), HEAD requests allowed.
- **Language file fails** — Update continues; check en.zip, kr.zip, cn.zip exist in `/localize/`.

---

## Quick Reference

| Task | Action |
|------|--------|
| Launcher (GitHub) | `npm run publish:github` |
| Launcher (custom) | Build, upload exe, update latest.json on your server |
| Game updates | Create update-N.zip, upload to /updates/, set baseUrl in App.js |
| Version display | Edit package.json; launcher reads it at runtime |
