# Launcher Self-Update Guide using GitHub


# Bump version (patch, minor, or major)
npm run bump:patch
npm run bump:minor  
npm run bump:major

# Build without publishing
npm run dist:portable

# Publish to GitHub
npm run publish:github

# Automated publishing (when you push a tag)
git tag v1.0.1
git push origin v1.0.1


This guide explains how to set up automatic launcher updates using GitHub releases.

## 🚀 Quick Start

### Step 1: Set up GitHub Repository

1. **Create a GitHub repository** (if you haven't already):
   - Go to GitHub.com
   - Create a new repository named `DBOD-Launcher`
   - Make it public (required for electron-updater)

2. **Update the electron-builder.json configuration**:
   ```json
   {
     "publish": {
       "provider": "github",
       "owner": "your-github-username",
       "repo": "DBOD-Launcher",
       "private": false,
       "releaseType": "release"
     }
   }
   ```

### Step 2: Set up GitHub Token

1. **Create a GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Copy the token

2. **Set the token as environment variable**:
   ```bash
   # Windows (PowerShell)
   $env:GH_TOKEN="your-github-token-here"
   
   # Or set it permanently
   [Environment]::SetEnvironmentVariable("GH_TOKEN", "your-github-token-here", "User")
   ```

### Step 3: Build and Publish

```bash
# Build and publish to GitHub releases
npm run publish:github
```

## 📋 Detailed Steps

### 1. Repository Setup

Your GitHub repository should have this structure:
```
DBOD-Launcher/
├── src/
├── public/
├── main.js
├── package.json
├── electron-builder.json
└── README.md
```

### 2. Version Management

**IMPORTANT**: Always increment the version in `package.json` before publishing:

```json
{
  "name": "DBOD-Launcher",
  "version": "1.0.1",  // Increment this for each release
  "description": "Dragon Ball Online Launcher with Auto-Update"
}
```

### 3. Publishing Commands

```bash
# Build and publish portable version
npm run publish:github

# Build and publish Windows installer
npm run publish:github:win

# Build and publish all platforms
npm run publish:github:all
```

### 4. GitHub Release Structure

After publishing, your GitHub releases will look like:
```
v1.0.1
├── DBOD-Launcher.exe (portable)
├── DBOD-Launcher-1.0.1.exe (installer)
├── latest.yml (update metadata)
└── latest-mac.yml (if you publish for Mac)
```

## 🔧 Configuration Options

### electron-builder.json Configuration

```json
{
  "appId": "com.dbod.launcher",
  "productName": "DBOD Launcher",
  "publish": {
    "provider": "github",
    "owner": "your-github-username",
    "repo": "DBOD-Launcher",
    "private": false,
    "releaseType": "release",
    "vPrefixedTagName": true,
    "draft": false,
    "prerelease": false
  },
  "win": {
    "target": [
      {
        "target": "portable",
        "arch": ["x64"]
      },
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ],
    "icon": "public/Logo.ico"
  }
}
```

### Environment Variables

Set these environment variables for automated publishing:

```bash
# GitHub token (required)
GH_TOKEN=your-github-token

# GitHub username (optional, can be set in electron-builder.json)
GH_USERNAME=your-github-username

# GitHub repository (optional, can be set in electron-builder.json)
GH_REPO=DBOD-Launcher
```

## 🚀 Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Launcher

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: windows-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Publish to GitHub
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: npm run publish:github
```

## 📦 Release Process

### Manual Release Process:

1. **Update version** in `package.json`
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Bump version to 1.0.1"
   ```
3. **Create a tag**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
4. **Publish to GitHub**:
   ```bash
   npm run publish:github
   ```

### Automated Release Process:

1. **Update version** in `package.json`
2. **Commit and tag**:
   ```bash
   git add .
   git commit -m "Bump version to 1.0.1"
   git tag v1.0.1
   git push origin main
   git push origin v1.0.1
   ```
3. **GitHub Actions** will automatically build and publish

## 🔍 Testing Updates

### Test the Update Process:

1. **Install an older version** of your launcher
2. **Publish a new version** to GitHub
3. **Run the launcher** - it should detect and download the update
4. **Verify the update** installed correctly

### Debug Update Issues:

```javascript
// In main.js, add more logging
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('No updates available:', info);
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err);
});
```

## ⚠️ Important Notes

### Security Considerations:

1. **GitHub Token**: Keep your GitHub token secure
2. **Repository**: Make sure your repository is public (required for electron-updater)
3. **Code Signing**: Consider code signing for production releases

### Version Management:

1. **Always increment version** before publishing
2. **Use semantic versioning** (1.0.0, 1.0.1, 1.1.0, etc.)
3. **Tag releases** with version numbers (v1.0.1)

### Distribution:

1. **Users download** the initial launcher from your GitHub releases
2. **Auto-updates** will download from the same repository
3. **No server needed** - GitHub handles the distribution

## 🛠️ Troubleshooting

### Common Issues:

1. **"GitHub token not found"**
   ```bash
   # Set the token
   $env:GH_TOKEN="your-token"
   ```

2. **"Repository not found"**
   - Check the repository name in electron-builder.json
   - Ensure the repository is public
   - Verify your GitHub token has repo access

3. **"Update not detected"**
   - Check the version in package.json
   - Verify the GitHub release was created
   - Check the appId matches between releases

4. **"Download failed"**
   - Check GitHub release assets
   - Verify network connectivity
   - Check antivirus isn't blocking the download

### Debug Commands:

```bash
# Check current version
npm version

# Test build without publishing
npm run dist:portable

# Check GitHub token
echo $env:GH_TOKEN

# Test GitHub API access
curl -H "Authorization: token $env:GH_TOKEN" https://api.github.com/user
```

## 📈 Production Checklist

Before going live:

- [ ] GitHub repository is public
- [ ] GitHub token is set and has repo permissions
- [ ] electron-builder.json is configured correctly
- [ ] Version is incremented in package.json
- [ ] Code is committed and tagged
- [ ] Test update process with a test release
- [ ] Verify launcher detects and installs updates
- [ ] Test on clean Windows installation
- [ ] Check antivirus compatibility

## 🎯 Quick Commands Reference

```bash
# Build and publish portable version
npm run publish:github

# Build and publish Windows installer
npm run publish:github:win

# Build without publishing
npm run dist:portable

# Check for updates (in launcher)
# This happens automatically on startup

# Manual update check (in launcher)
# Use the "Check for Updates" button in the UI
```

Your launcher will now automatically check for updates on startup and notify users when new versions are available! 