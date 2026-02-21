# Version Display and Release Workflow

This guide covers version display and how to release new launcher versions.

## How Version Display Works

The launcher shows **"DBOD - 1.0.x"** in the title bar. The version is read from `package.json` at runtime. No hardcoded constants are used.

**Components:**
- `src/VersionDisplay.js` - Displays version via `getAppVersion()` from preload
- `main.js` - Reads version from `package.json`, compares with server's `latest.json` for updates
- `scripts/update-version.js` - Syncs VersionDisplay default state (runs before build if configured)

## Release Workflows

### Manual Workflow (Recommended for Custom VPS)

1. **Edit package.json:**
   ```json
   {
     "version": "1.0.2"
   }
   ```

2. **Build and upload:**
   ```bash
   npm run dist:portable
   ```
   Upload `DBOD-Launcher.exe` to your launcher-updates folder.

3. **Update latest.json on server:**
   ```json
   {
     "version": "1.0.2",
     "url": "https://your-server.com/launcher-updates/DBOD-Launcher.exe",
     "notes": "Bug fixes and improvements"
   }
   ```

That's it. The launcher will show the new version and users will get updates automatically.

### Bump Script Workflow (Optional)

If you use `scripts/bump-version.js`:

```bash
node scripts/bump-version.js patch   # 1.0.0 → 1.0.1
node scripts/bump-version.js minor   # 1.0.0 → 1.1.0
node scripts/bump-version.js major   # 1.0.0 → 2.0.0
```

Then build and publish as usual.

### Sync Version Display (if needed)

```bash
npm run update-version
```

## Server Structure

```
your-server.com/
├── launcher-updates/
│   ├── latest.json
│   └── DBOD-Launcher.exe
└── updates/
    ├── update-1.zip
    └── localize/
```

The launcher compares its `package.json` version with `latest.json` on startup. When a newer version exists, it prompts the user to update.
