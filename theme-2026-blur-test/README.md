# 2026 Theme Blur Effects Test App

A standalone web app for testing the CSS blur effects in VS Code's 2026 themes.

## Features

- **Theme switcher**: Toggle between Dark and Light 2026 themes
- **Blur toggle**: Enable/disable blur effects to compare with solid backgrounds
- **Draggable overlays**: All overlay widgets can be dragged by their handle
- **VS Code Codicons**: Uses the official VS Code icon font
- **Keyboard shortcuts**: Quick access to common actions
- **Syntax highlighting**: Extended code sample with TypeScript/React

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Toggle theme (dark/light) |
| `B` | Toggle blur effects on/off |
| `R` | Reset overlay positions |

## Dragging Overlays

Each overlay widget has a small drag handle at the top (with a gripper icon). Click and drag the handle to move overlays around the screen and test blur effects over different background colors.

Positions are saved to localStorage and persist between sessions. Use the "Reset Positions" button or press `R` to restore default positions.

## UI Elements Demonstrated

This app simulates the following VS Code UI elements with blur effects:

1. **Quick Input (Command Palette)** - 40px blur with saturation
2. **Context Menu** - 20px blur with saturation
3. **Suggest Widget (Autocomplete)** - 20px blur with saturation
4. **Hover Widget** - 20px blur
5. **Notification Toast** - 20px blur with saturation
6. **Dialog** - 40px blur with saturation
7. **Debug Toolbar** - 40px blur with saturation
8. **Find Widget** - 20px blur with saturation
9. **Parameter Hints** - 20px blur with saturation
10. **Inline Chat** - 20px blur with saturation
11. **Breadcrumb Picker** - 20px blur with saturation
12. **Sticky Scroll** - 40px blur with saturation
13. **Minimap** - 40px blur

## Local Development

1. Navigate to this directory:
   ```bash
   cd theme-2026-blur-test
   ```

2. Start a local server (any static file server works):
   ```bash
   # Using Python
   python3 -m http.server 8080

   # Using Node.js (npx)
   npx serve

   # Using PHP
   php -S localhost:8080
   ```

3. Open http://localhost:8080 in your browser

## Deploying to GitHub Pages

1. Create a new GitHub repository
2. Push these files to the repository
3. Enable GitHub Pages in repository settings (Settings → Pages)
4. Select the branch and root folder to deploy

## Browser Support

The blur effects use `backdrop-filter` which is supported in:
- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 79+

The app includes `-webkit-backdrop-filter` for Safari compatibility.

## Files

- `index.html` - Main HTML structure simulating VS Code layout with codicons
- `styles.css` - Theme colors, blur effects, and draggable overlay styles
- `script.js` - Theme switching, blur toggle, and drag functionality

## Dependencies

- [VS Code Codicons](https://github.com/microsoft/vscode-codicons) - Loaded from CDN (`unpkg.com/@vscode/codicons`)

## Notes

- The blur effect uses `color-mix()` for transparent backgrounds which requires modern browsers
- The test app is designed for desktop viewing (1024px+ width recommended)
- Drag overlays by their gripper handle to test blur over different colors
- Overlay positions are saved to localStorage
