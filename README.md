# Demos

Collection of interactive prototypes and explorations.

## Live Demos

🚀 **[View all demos](https://demos.mrleemurray.com)**

- [Chat Input Prototype](https://demos.mrleemurray.com/chat-input-prototype/) - VSCode-inspired chat interface
- [Gutter Tab](https://demos.mrleemurray.com/gutter-tab/) - Gutter tab behaviors exploration

## Projects

### chat-input-prototype

VSCode-inspired chat interface with token tracking, animation controls, and message history.

**Tech:** Vue 3, Vite, VSCode Codicons

```bash
cd chat-input-prototype
npm install
npm run dev
```

### gutter-tab

Explorations for gutter tab behaviors and interactions.

**Tech:** Vue 3, Vite

```bash
cd gutter-tab
npm install
npm run dev
```

## Deployment

All demos are automatically deployed to `demos.mrleemurray.com` via GitHub Actions when changes are pushed to the `main` branch.

- Push to `main` → Automatic deployment
- Each project is deployed to its own path (e.g., `/chat-input-prototype/`, `/gutter-tab/`)
- The root path serves an index page listing all available demos

### Manual deployment

```bash
# Trigger workflow manually from GitHub Actions tab
# Or push to main branch
git push origin main
```

## Adding a New Demo

1. Create your project folder in the root directory
2. Configure `vite.config.js` with `base: '/your-project-name/'`
3. Add build steps to `.github/workflows/deploy-demos.yml`
4. Update the root index.html card list (auto-generated during deployment)
