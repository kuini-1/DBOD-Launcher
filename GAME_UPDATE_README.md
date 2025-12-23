# Game Update System

This launcher now includes a complete game update system that downloads and extracts game updates with the specified folder structure.

## Folder Structure

The update system expects the following folder structure in the zip file:

```
main folder/
├── pack/
│   └── (game files)
└── localize/
    └── pack/
        └── (localization files)
```

## How It Works

1. **Download**: Downloads the update zip file from the specified URL
2. **Extract**: Extracts the zip file to the launcher directory
3. **Verify**: Checks that the required folder structure exists
4. **Install**: Moves files to their final locations (customizable)

## Testing the Update System

### Step 1: Install Dependencies

```bash
npm install
```

This will install the new dependencies:
- `adm-zip`: For zip file extraction
- `axios`: For HTTP downloads
- `fs-extra`: For enhanced file system operations

### Step 2: Create a Test Update

Run the test script to create a sample update:

```bash
node test-game-update.js
```

This will create `test-game-update.zip` with the correct folder structure.

### Step 3: Host the Test File

You need to host the zip file on a web server. Options:

1. **Local HTTP Server** (Python):
   ```bash
   python -m http.server 8000
   ```
   Then access: `http://localhost:8000/test-game-update.zip`

2. **Node.js Server**:
   ```bash
   npx http-server -p 8000
   ```

3. **Online Hosting**: Upload to any file hosting service

### Step 4: Update the URL

Edit `src/App.js` and change the update URL (around line 50):

```javascript
const updateUrl = 'http://localhost:8000/test-game-update.zip';
```

### Step 5: Build and Test

```bash
npm run build
npm start
```

### Step 6: Test the Update

1. Click the "Update Game" button
2. Watch the progress bar
3. Check the status messages
4. Verify files are extracted to the launcher directory

## Expected Results

After a successful update, you should see:

- ✅ "Game update completed successfully" message
- 📁 `pack/` folder in the launcher directory
- 📁 `localize/pack/` folder in the launcher directory
- 📄 Sample files in both folders

## Troubleshooting

### Common Issues

1. **"Failed to download game update"**
   - Check the URL is accessible
   - Verify the file exists on the server
   - Check network connectivity

2. **"Invalid update folder structure"**
   - Ensure the zip file has the correct folder structure
   - Use the test script to create a valid update

3. **"Update files not found"**
   - Check file permissions
   - Verify the launcher has write access to its directory

### Debug Mode

To see detailed logs, run in development mode:

```bash
npm run dev:electron
```

This will open DevTools where you can see console logs and errors.

## Customization

### Changing Update URL

Edit `src/App.js` line ~50:

```javascript
const updateUrl = 'https://your-server.com/your-update.zip';
```

### Modifying Folder Structure

Edit `main.js` in the `extract-game-update` function to change the expected structure.

### Adding More Update Steps

Add new IPC handlers in `main.js` and expose them in `preload.js`.

## Production Deployment

For production:

1. Host your update files on a reliable server
2. Use HTTPS URLs for security
3. Implement version checking
4. Add rollback functionality
5. Consider delta updates for efficiency

## File Locations

- **Launcher Directory**: Where the launcher executable is located
- **Extracted Files**: Same directory as the launcher
- **Temporary Files**: Automatically cleaned up after extraction

The update system is designed to be robust and handle various error conditions while providing clear feedback to the user. 