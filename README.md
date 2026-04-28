# Quest Auto-Completer

A Revenge Cord plugin that automatically completes Discord quests with a single tap.

## Features

- 🎯 **Auto-Complete All Quests** - Complete all available quests at once
- 📋 **Individual Quest Completion** - Complete specific quests manually
- 📊 **Progress Tracking** - View quest progress and details
- 🔄 **Refresh Button** - Update the quest list on demand
- 🎨 **User-Friendly UI** - Clean Discord-themed interface

## Installation

### For Revenge Cord:

1. Open Revenge Cord on your Discord mobile client
2. Navigate to **Settings → Plugins**
3. Paste the plugin URL in the plugin installer
4. The plugin will auto-update from the GitHub Pages hosting

### Manual Installation (Development):

1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile TypeScript
4. The compiled plugin will be in the `dist/` folder
5. Host the plugin files on a web server and use the URL in Revenge

## Usage

Once installed, you'll find the Quest Auto-Completer in your Revenge plugin settings:

### Complete All Quests
- Click the **"Complete All Quests"** button to auto-complete every available quest
- A toast notification will show how many quests were completed

### Complete Individual Quests
- Scroll through the available quests list
- Click **"Complete This Quest"** on any quest you want to complete
- The quest will be marked as complete immediately

### Refresh Quest List
- Click the **"Refresh Quests"** button to reload the quest list
- This is useful if new quests appear while the plugin is open

## How It Works

The plugin works by:

1. **Finding the Quests Module** - Uses Revenge's Metro module finding to locate the Discord quest system
2. **Reading Quest Data** - Retrieves all available quests from the Discord store
3. **Updating Progress** - Sets quest progress to 100% before completion
4. **Completing Quests** - Calls the quest completion function in Discord's internal modules
5. **Providing UI** - Shows a clean interface with all quest information and controls

## Configuration

The plugin automatically detects and works with Discord's quest system. No additional configuration is needed.

## Permissions Required

- Access to Metro modules (automatically granted by Revenge)
- Access to internal Discord quest functions (automatically granted by Revenge)

## Troubleshooting

### Quests Not Showing Up
- Try clicking "Refresh Quests" button
- Make sure you're connected to Discord
- Ensure Discord hasn't changed their quest system

### "Quest module not found" Error
- Discord may have updated their internal structure
- The plugin may need to be updated
- Check if there's a newer version available

### Complete All Button Not Working
- Some quests might already be completed (they're filtered out)
- Check if you have permission to complete quests
- Try completing quests individually instead

## Compatibility

- **Revenge Cord**: Version 250.10+ (September 28, 2024+)
- **Bunny Cord**: Compatible (based on pycord)
- **Discord Mobile**: Android & iOS

## Building from Source

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch for changes during development
npm run watch
```

The compiled plugin will be in the `dist/` folder.

## Project Structure

```
├── manifest.json          # Plugin metadata
├── package.json          # NPM configuration
├── tsconfig.json         # TypeScript configuration
├── src/
│   └── index.ts         # Main plugin code
└── dist/                # Compiled output (after build)
    └── index.js
```

## Development Notes

The plugin uses:
- **@vendetta/metro** - For finding Discord internal modules
- **@vendetta/ui/toasts** - For user notifications
- **React Native** - For the UI components

## Security & Safety

⚠️ **Important**: This plugin interacts with Discord's internal quest system. Use at your own discretion. The plugin:
- Does NOT require internet access beyond Discord
- Does NOT steal data or credentials
- Does NOT modify messages or user data
- Does NOT violate Discord's TOS more than Revenge itself

## License

MIT License - Feel free to modify and distribute

## Contributing

Found a bug or have a feature request? 

1. Test the issue thoroughly
2. Check if it's still present in the latest version
3. Document the steps to reproduce
4. Submit with details about your Revenge version

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Ensure Revenge is up to date
3. Try reinstalling the plugin
4. Check if Discord's quest system has changed

## Updates

The plugin will automatically check for updates when you restart Discord. You can manually update by reinstalling the plugin URL.

## Changelog

### Version 1.0.0
- Initial release
- Auto-complete all quests feature
- Individual quest completion
- Quest list with progress tracking
- Refresh functionality
- Discord-themed UI

## Credits

Created for Revenge Cord, a fork of BunnyCord/PyOnCord.

Inspired by other quality Revenge plugins and the Discord modding community.

---

**Note**: This plugin is a third-party modification. It is not affiliated with or endorsed by Discord Inc.
