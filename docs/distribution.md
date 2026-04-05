# Distribution & Release Guide

## Version Management

Current version: **0.1.0**

To update version:
1. Edit `package.json` - update `version` field
2. Edit `electron/package.json` - update `version` field
3. Edit `cli/monkon.js` - update `version` in program definition
4. Edit `scripts/monkon.rb` - update `version` field

---

## Building for Release

### 1. Build Electron App

```bash
cd electron
npm run build
```

This creates:
- `dist/monkon-0.1.0.dmg` - DMG installer for macOS
- `dist/monkon-0.1.0.zip` - ZIP archive

### 2. Create Release on GitHub

```bash
# Tag the release
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0

# Or use GitHub CLI
gh release create v0.1.0 -t "monkon v0.1.0" -n "Release notes..."
```

### 3. Upload Artifacts

```bash
# Upload DMG and ZIP files
gh release upload v0.1.0 dist/monkon-0.1.0.dmg
gh release upload v0.1.0 dist/monkon-0.1.0.zip
```

---

## Homebrew Setup

### 1. Create Homebrew Tap

```bash
# Create tap repository
mkdir -p ../homebrew-monkon
cd ../homebrew-monkon
git init

# Create formula directory
mkdir -p Formula
cp ../monkon/scripts/monkon.rb Formula/
```

### 2. Update Formula

Before releasing, update `monkon.rb`:

```bash
# Get SHA256 of release tarball
curl -sL https://github.com/UmutKavil/monkon/archive/refs/tags/v0.1.0.tar.gz | \
  openssl dgst -sha256 | awk '{print $2}'

# Update sha256 in monkon.rb
# Update url to match release tag
```

### 3. Test Installation

```bash
brew install --build-from-source homebrew-monkon/monkon
```

### 4. Commit and Push

```bash
git add Formula/monkon.rb
git commit -m "Update monkon to v0.1.0"
git push origin main
```

---

## DMG Installer

The Electron builder automatically creates a DMG installer.

### Manual DMG Creation

```bash
# Create DMG from built app
hdiutil create -volname "monkon" \
  -srcfolder dist/monkon.app \
  -ov -format UDZO dist/monkon-0.1.0.dmg
```

### DMG Contents

```
dmg/
├── monkon.app/          (Electron app)
├── Applications/ → /Applications  (symlink)
└── README.txt          (Installation instructions)
```

---

## Release Checklist

- [ ] Update version in all files
- [ ] Update CHANGELOG.md
- [ ] Run `npm run build` (Electron)
- [ ] Test DMG and ZIP installers locally
- [ ] Create GitHub release with tag
- [ ] Upload artifacts (DMG, ZIP, etc)
- [ ] Update Homebrew tap
- [ ] Test Homebrew installation
- [ ] Announce release

---

## Auto-Update Mechanism

For future releases, monkon can auto-update using `electron-updater`:

### Setup

```bash
npm install electron-updater
```

### In main.js

```javascript
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();
```

### In package.json

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "UmutKavil",
      "repo": "monkon"
    }
  }
}
```

---

## Release Notes Template

```markdown
# monkon v0.1.0

## ✨ Features
- [list of new features]

## 🐛 Bug Fixes
- [list of fixes]

## 📦 Download
- [DMG Link]
- [ZIP Link]
- [Homebrew Instructions]

## 🙏 Thanks
- Contributors and testers

## 📝 Changelog
- Full changelog: [CHANGELOG.md](CHANGELOG.md)
```

---

## Continuous Delivery (CI/CD)

### GitHub Actions Setup

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - name: Build
        run: |
          npm install
          npm run build
      - name: Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist/*
```

---

## Security & Code Signing

For production releases, sign the app:

```bash
# Create certificate (one time)
# Security > Code Signing Certificates

# In electron-builder.yml
"certificateFile": "path/to/cert.p12",
"certificatePassword": "password"
```

---

## Monitoring

After release:
- Monitor GitHub issues for bugs
- Track download statistics
- Gather user feedback
- Plan next version

---

## Support

For issues:
- GitHub Issues: https://github.com/UmutKavil/monkon/issues
- Discussions: https://github.com/UmutKavil/monkon/discussions

---

**Good luck with the release! 🎉**
