# Deployment Guide

This guide explains how to deploy the Quest Auto-Completer plugin for Revenge Cord.

## Prerequisites

- GitHub account
- Git installed
- Node.js 16+ and npm

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `QuestAutoCompleterPlugin`
3. Choose public (required for GitHub Pages)
4. Click "Create repository"

## Step 2: Clone and Setup

```bash
# Clone your new repository
git clone https://github.com/YOUR_USERNAME/QuestAutoCompleterPlugin.git
cd QuestAutoCompleterPlugin

# Copy plugin files into the repo
# Copy all files from this QuestAutoComplete folder
```

## Step 3: Build the Plugin

```bash
# Install dependencies
npm install

# Build the TypeScript
npm run build

# Your compiled plugin will be in dist/
```

## Step 4: Prepare for Deployment

1. Create directories if they don't exist:
```bash
mkdir -p quest-auto-completer
```

2. Copy the built files:
```bash
cp dist/index.js quest-auto-completer/
cp manifest.json quest-auto-completer/
```

3. Create `quest-auto-completer/package.json` in this directory:
```json
{
  "name": "quest-auto-completer",
  "version": "1.0.0"
}
```

## Step 5: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Quest Auto-Completer plugin"

# Push to main branch
git push origin main
```

## Step 6: Enable GitHub Pages

1. Go to your repository settings
2. Scroll to "GitHub Pages" section
3. Select "main" branch as source
4. Click "Save"
5. Wait a few minutes for GitHub Pages to build

## Step 7: Get the Plugin URL

Your plugin will be available at:
```
https://YOUR_USERNAME.github.io/QuestAutoCompleterPlugin/quest-auto-completer
```

## Step 8: Install in Revenge

1. Open Revenge Cord
2. Go to Settings → Plugins
3. Paste the URL from Step 7
4. Click Install

## Alternative: Using a Custom Domain

If you have a custom domain:

1. In repository settings → Pages
2. Enter your custom domain
3. Update DNS records as GitHub instructs
4. Plugin URL becomes:
```
https://yourdomain.com/QuestAutoCompleterPlugin/quest-auto-completer
```

## Updating the Plugin

To release a new version:

```bash
# Make your changes
npm run build

# Copy updated files
cp dist/index.js quest-auto-completer/
cp manifest.json quest-auto-completer/

# Update version in manifest.json
# Then commit and push
git add .
git commit -m "Version 1.1.0: Added new features"
git push origin main
```

Users will get the update automatically on their next Discord restart.

## Using GitHub Releases

For official releases:

```bash
# Create a tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

1. Go to Releases section on GitHub
2. Create release from the tag
3. Add release notes
4. Users can find your plugin on release pages

## Hosting Alternatives

### Using Netlify (Free)

1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repo
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy
6. Plugin URL: `https://your-site.netlify.app/quest-auto-completer`

### Using Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Vercel auto-detects the build
4. Deploy
5. Plugin URL: `https://your-project.vercel.app/quest-auto-completer`

### Using GitLab Pages

1. Push to GitLab instead
2. Enable Pages in Settings
3. URL: `https://gitlab.com/YOUR_USERNAME/QuestAutoCompleterPlugin/-/raw/main/quest-auto-completer`

## Directory Structure for Hosting

Ensure your hosting structure looks like:

```
your-domain/
└── quest-auto-completer/
    ├── manifest.json
    ├── index.js
    └── package.json
```

## Troubleshooting Deployment

### Plugin doesn't load

- Check manifest.json syntax (use [jsonlint.com](https://jsonlint.com))
- Ensure files are at correct URL path
- Check browser console for errors (F12 in Discord)

### GitHub Pages not building

- Check Actions tab for build errors
- Ensure your repo is public
- Check GitHub Pages is enabled

### URL access denied

- Your repository must be public
- Files must not have sensitive data
- GitHub Pages must be enabled

### CORS Errors

- Ensure your host allows cross-origin requests
- GitHub Pages and Vercel allow this by default
- Netlify may need configuration

## Security Considerations

1. **Never commit secrets** to your repository
2. **Keep dependencies updated**: `npm update`
3. **Review changes** before deployment
4. **Use HTTPS only** links when possible
5. **Add LICENSE** file (MIT recommended)

## Monitoring & Analytics

### GitHub Insights

- View traffic in repository Settings → Pages
- See which files are accessed

### Adding Custom Analytics

You can add analytics to your plugin page (optional):

```html
<!-- In a gh-pages index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

## Making Your Plugin Discoverable

1. **Add to Plugin Lists**: Submit to https://plugins-list.pages.dev/
2. **Create README** with installation instructions
3. **Add Topics** to your repo:
   - `revenge`
   - `discord`
   - `plugin`
   - `quest`

4. **Announce on Discord communities**:
   - Revenge community server
   - Python Discord community
   - Modding communities

## Version Management

Keep your `manifest.json` version in sync:

```json
{
  "version": "1.0.0"
}
```

Use semantic versioning:
- `1.0.0` - Major.Minor.Patch
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

## Rollback Procedure

If something breaks:

```bash
# View history
git log --oneline

# Revert to previous version
git revert <commit-hash>
git push origin main
```

---

You're all set! Your plugin is now available for the Revenge community. 🎉
