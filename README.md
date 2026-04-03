# Dragon Ball Online Launcher

A compact, modern launcher for Dragon Ball Online with auto-update capabilities, language selection, and game launching functionality.

## Features

- 🎮 **Game Launching**: Launch Dragon Ball Online with custom parameters
- 🔄 **Auto-Update**: Automatic launcher updates with progress tracking
- 🌍 **Language Selection**: Download and switch between different language versions
- 🎨 **Modern UI**: Compact pink-themed interface using PrimeReact and Tailwind CSS
- 🔒 **Secure**: Electron v12 with secure configuration
- 📊 **Server Status**: Real-time server information display
- ⚡ **Fast**: Optimized build with webpack

## Tech Stack

- **Electron**: v12.0.0
- **Node.js**: v14
- **React**: v17.0.2
- **PrimeReact**: v10.9.6 (UI Components)
- **Tailwind CSS**: v3.3.0 (Styling)
- **electron-updater**: v4.6.5 (Auto-update)

## Project Structure

```
DBOD-Launcher/
├── docs/
│   ├── UPDATES_GUIDE.md  # Launcher and game update setup
│   └── VERSION_GUIDE.md  # Version display and release workflow
├── src/
│   ├── App.js          # Main launcher component
│   ├── index.js        # React entry point
│   └── index.css       # Tailwind CSS imports
├── public/
│   └── index.html      # HTML template
├── main.js             # Electron main process with auto-update
├── preload.js          # Secure IPC communication
├── electron-builder.json # Auto-update configuration
├── webpack.config.js   # Build configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies and scripts
```

## Development

### Prerequisites

- Node.js v14+
- [pnpm](https://pnpm.io/installation) 8.x (see `packageManager` in [package.json](package.json))

### Installation

```bash
pnpm install
```

### Available Scripts

- `pnpm start` - Build and start the launcher
- `pnpm run dev` - Start webpack dev server
- `pnpm run build` - Build for production
- `pnpm run watch` - Build in watch mode

### Development Workflow

1. **For production build and run:**
   ```bash
   pnpm start
   ```

2. **For development:**
   ```bash
   pnpm run dev
   ```

## Building

### Portable Executable (Recommended)

```bash
pnpm install
pnpm run build
pnpm run dist:portable
```

**Output**: `dist-electron/DBOD-Launcher.exe`

### Build Options

- `pnpm run dist:portable` - Single portable executable for game folder
- `pnpm run dist:win` - Windows installer
- `pnpm run dist` - All configured platforms

Copy `DBOD-Launcher.exe` to your game folder. The launcher creates `game-version.txt` and needs write permissions for updates. See [docs/UPDATES_GUIDE.md](docs/UPDATES_GUIDE.md) for update server setup.

## Features

### Compact Design
- Small 400x500 window size
- Pink gradient theme inspired by Dragon Ball aesthetics
- Minimal, focused interface

### Game Launching
- Launches Dragon Ball Online executable with custom parameters
- Configurable game path (`C:\Program Files\Dragon Ball Online\DBO.exe`)
- Language-specific launch parameters
- Process management and error handling

### Language Selection
- Dropdown selector for multiple languages
- Automatic download of language-specific versions
- Support for English, Spanish, French, German, Italian

### Auto-Update System
- Automatic update checks on startup
- Manual update checking
- Progress tracking during downloads
- Automatic installation and restart

### UI Components
- Compact card-based design
- Progress bars for updates
- Status messages and notifications
- Server status display
- Language selector dropdown

## Configuration

### Game Path
The launcher is configured to look for Dragon Ball Online at:
```
C:\Program Files\Dragon Ball Online\DBO.exe
```

### Launch Parameters
Default launch parameters include language selection:
- `-server main`
- `-language [selected]`
- `-username player`

### Supported Languages
- English
- Spanish
- French
- German
- Italian

### Auto-Update
Configured for GitHub releases. Update the `electron-builder.json` with your repository details.

## Security

The application uses secure Electron configuration:
- `nodeIntegration: false`
- `contextIsolation: true`
- `enableRemoteModule: false`
- Preload script for safe IPC communication

## Build Output

The build process creates a `dist/` folder containing:
- `index.html` - The main HTML file
- `bundle.js` - The compiled JavaScript bundle
- Font files for PrimeIcons

## Documentation

- [docs/UPDATES_GUIDE.md](docs/UPDATES_GUIDE.md) — Launcher and game update setup
- [docs/VERSION_GUIDE.md](docs/VERSION_GUIDE.md) — Version display and release workflow

## Notes

- Compatible with Node.js v14 and Electron v12
- Uses Tailwind CSS v3.3.0 for compatibility
- All dependencies are tested for Node v14 compatibility
- Auto-update requires GitHub releases setup
- Compact design optimized for small screens 