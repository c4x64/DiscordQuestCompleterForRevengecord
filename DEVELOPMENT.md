# Development Guide

This guide helps you develop and test the Quest Auto-Completer plugin.

## Environment Setup

### Prerequisites
- Node.js 16+ (check with `node --version`)
- npm 7+ (check with `npm --version`)
- Git
- A Revenge Cord installation on Android

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/QuestAutoCompleterPlugin.git
cd QuestAutoCompleterPlugin

# Install dependencies
npm install

# Verify setup
npm run build
```

## Development Workflow

### 1. Local Development

```bash
# Watch TypeScript files for changes
npm run watch

# Or build once
npm run build
```

As you edit files in `src/`, the changes are automatically compiled to `dist/`.

### 2. Testing in Revenge

#### Option A: Local File Testing

1. Build the plugin:
```bash
npm run build
```

2. In Revenge Settings → Developer Settings:
   - Enable Developer Mode
   - Copy your local file path or use a local server

3. Paste the path in the plugin loader

#### Option B: GitHub Pages Testing

1. Commit and push your changes:
```bash
git add .
git commit -m "Development: Testing feature X"
git push origin main
```

2. Wait ~1 minute for GitHub Pages to rebuild

3. Install from: `https://YOUR_USERNAME.github.io/QuestAutoCompleterPlugin/quest-auto-completer`

#### Option C: Local HTTP Server

```bash
# Install http-server globally
npm install -g http-server

# From your build directory
cd dist
http-server -p 8000

# Use http://localhost:8000/index.js in Revenge
# From Discord mobile, use your computer's IP: http://192.168.1.X:8000/index.js
```

## Debugging

### Console Logging

All logs go to the Revenge console. Access it via:

**In Revenge Settings:**
- Settings → Revenge → Developer → Evaluate JavaScript

**Add logs to your code:**
```typescript
console.log("[QuestAutoComplete] Debug message:", data);
console.error("[QuestAutoComplete] Error:", error);
console.warn("[QuestAutoComplete] Warning:", warning);
```

### Viewing Logs

1. Open Revenge settings
2. Go to Developer section
3. Use the JavaScript console to run:
```javascript
// View recent logs
console.log("Your logs appear here");
```

### Common Issues & Solutions

#### Plugin doesn't load

**Symptoms**: Plugin doesn't appear in settings after installation

**Solutions**:
```javascript
// Check if module loading works
const test = findByProps("getQuests");
console.log("Module found:", !!test);
```

- Verify manifest.json is valid JSON
- Check the URL is accessible
- Clear Revenge cache: Settings → Storage → Clear App Data

#### Quests not showing up

**Symptoms**: "No available quests" message

**Solutions**:
```typescript
// Add debug logging
const questsModule = findQuestsModule();
console.log("Quest Module:", questsModule);
const quests = questsModule?.getQuests() || [];
console.log("All quests:", quests);
```

- Make sure you have active quests in Discord
- Refresh the quest list manually
- Check if Discord changed their internal API

#### Crashes when completing quests

**Symptoms**: Plugin crashes or Revenge freezes

**Solutions**:
```typescript
// Add error handling
try {
  questsModule.completeQuest(quest.id);
} catch (e) {
  console.error("[QuestAutoComplete] Completion failed:", e);
  showToast({
    content: `Error: ${e.message}`,
    source: "QuestAutoComplete",
  });
}
```

## Code Structure

### Key Files

```
src/
├── index.ts          # Main entry point
└── settings.tsx      # UI settings component

dist/
├── index.js         # Compiled main code
└── settings.js      # Compiled settings
```

### Module Finding

The plugin uses Vendetta's Metro module finder:

```typescript
import { findByProps } from "@vendetta/metro";

// Find a module with specific exports
const module = findByProps("getQuests", "completeQuest");
```

### React Native Components

Used for the UI:
```typescript
import { React, ReactNative as RN } from "@vendetta/metro/common";

const { View, Text, TouchableOpacity, ScrollView } = RN;
```

## Making Changes

### Adding a New Feature

1. **Edit the TypeScript**:
```typescript
// In src/settings.tsx
function MyNewFeature() {
  // Your feature code
}
```

2. **Compile**:
```bash
npm run build
```

3. **Test in Revenge**:
   - Reinstall the plugin from your test URL
   - Test the feature
   - Check console for errors

4. **Commit**:
```bash
git add .
git commit -m "Feature: Add my new feature"
git push origin main
```

### Bug Fixes

```bash
# Create a feature branch
git checkout -b fix/quest-completion-bug

# Make fixes
npm run build

# Test thoroughly

# Commit
git commit -m "Fix: Resolve quest completion issue"

# Push
git push origin fix/quest-completion-bug

# Create pull request on GitHub
```

## Testing Checklist

Before releasing a new version:

- [ ] TypeScript compiles without errors
- [ ] Plugin installs successfully
- [ ] Plugin appears in Revenge settings
- [ ] All quest buttons work
- [ ] Settings toggle properly
- [ ] No console errors
- [ ] Works offline
- [ ] Works with multiple accounts
- [ ] Performance is acceptable

## Performance Optimization

### Monitor Memory Usage

```typescript
// Check if your code is leaking memory
let refCount = 0;

onLoad: () => {
  refCount++;
  console.log(`Load count: ${refCount}`);
}
```

### Reduce Rendering

```typescript
// Use React.memo to prevent unnecessary re-renders
const QuestItem = React.memo(({ quest }) => {
  return (/* JSX */);
});
```

### Optimize State Updates

```typescript
// Use batch updates
React.useState(() => {
  // Heavy operation
  return { quests, completed };
});
```

## Testing with Different Scenarios

### Test With No Quests
```javascript
// Manually set empty quests
module.getQuests = () => [];
```

### Test With Many Quests
```javascript
// Create dummy quests
const dummyQuests = Array(50).fill(null).map((_, i) => ({
  id: `quest-${i}`,
  name: `Test Quest ${i}`,
  // ... other fields
}));
```

### Test With Long Quest Names
- Ensure UI wraps text properly
- No text overflow
- UI remains responsive

## TypeScript Tips

### Type Safety

```typescript
// Always type your functions
function handleQuestCompletion(quest: Quest): boolean {
  // TypeScript will catch errors
}

// Use interfaces for complex objects
interface QuestStore {
  getQuests: () => Quest[];
  completeQuest: (questId: string) => void;
}
```

### Avoiding 'any'

```typescript
// Instead of
function process(data: any) {}

// Use
function process(data: Quest[]) {}
```

## Lint & Format

### Enable ESLint (optional)

```bash
npm install --save-dev eslint typescript-eslint

# Run linter
npm run lint
```

### Format with Prettier (optional)

```bash
npm install --save-dev prettier

# Format code
prettier --write src/**/*.{ts,tsx}
```

## Debugging in Production

### Enable Verbose Logging

```typescript
const DEBUG = true; // Set to false in production

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[QuestAutoComplete] ${message}`, data);
  }
}
```

### Send Telemetry (Advanced)

```typescript
// Report errors to external service
async function reportError(error: Error) {
  try {
    await fetch("https://your-server.com/errors", {
      method: "POST",
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
      }),
    });
  } catch (e) {
    console.error("Failed to report error:", e);
  }
}
```

## Release Process

1. **Update Version**:
```json
{
  "version": "1.1.0"
}
```

2. **Build**:
```bash
npm run build
```

3. **Test**:
   - Run through testing checklist
   - Test on actual device
   - Test edge cases

4. **Commit & Tag**:
```bash
git add .
git commit -m "Release: v1.1.0"
git tag -a v1.1.0 -m "Version 1.1.0"
git push origin main --tags
```

5. **Create Release Notes**:
   - Go to GitHub Releases
   - Create new release from tag
   - Write changelog
   - Publish

## Resources

- [Revenge Documentation](https://github.com/revenge-mod/revenge)
- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vendetta Metro API](https://github.com/vendetta-mod/vendetta)

## Getting Help

1. Check existing issues on GitHub
2. Search Discord modding communities
3. Open a new GitHub issue with:
   - Revenge version
   - Error message
   - Steps to reproduce
   - Screenshots if applicable

---

Happy developing! 🚀
