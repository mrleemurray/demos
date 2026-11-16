# Demos

Collection of interactive prototypes and explorations.

## Live Demos

🚀 **[View all demos](https://demos.mrleemurray.com)**

- [Spaces](https://demos.mrleemurray.com/spaces/) - Slack-inspired contexts for Editor and Agents work areas
- [Agent Merge Lab](https://demos.mrleemurray.com/agent-merge/) - Standalone workbench for Agent Merge UX exploration
- [Chat Input Prototype](https://demos.mrleemurray.com/chat-input-prototype/) - VSCode-inspired chat interface
- [Gutter Tab](https://demos.mrleemurray.com/gutter-tab/) - Gutter tab behaviors exploration
- [Hat Stacker](https://demos.mrleemurray.com/hat-stacker/) - Catch and balance falling hats with the VS Code pet
- [Provider Info](https://demos.mrleemurray.com/provider-info/) - Rotating provider quality labels

## Projects

### spaces

A higher-level work context for VS Code. Choose **Start in Editor** or **Start in Agents** when creating a Space, then open associated work areas as needed. The only added navigation chrome is a Slack-inspired far-left Space rail: Editor work areas retain their Activity Bar, Explorer, tabs, and terminal, while Agents work areas retain their Sessions sidebar and chat.

The **top item** in the rail is the **Space switcher**. Its dropdown lists your Spaces, with actions to create and manage them. The icons **below the divider** are only the current Space's work areas: click one to focus it, or right-click or press **Shift+F10** to close it or move it to another Space. The **plus button** creates another work area in the current Space. The rail is icon-only; hover or keyboard focus reveals names and context.

Use the title bar's **Hide Spaces sidebar / Show Spaces sidebar** button to collapse or restore the far-left rail independently of Sessions/Explorer. The preference persists across Space changes and reloads. **Ctrl+Alt+1–9** continues to switch Spaces while the rail is hidden.

Adding a work area only asks for **Editor** or **Agents**. It reuses the active work area's project context, or the Space name when no work area is open.

Work area badges count **sessions needing input**, including **Needs review**. Each session counts once, regardless of how many requests it has. Working, completed, and preview sessions do not contribute, and no badge is shown at zero. The hover text and accessible description explain the count.

A Slack-style dot on the **Space switcher** indicates sessions needing input in **other Spaces**, not the current Space. Matching dots in the dropdown identify those Spaces; their accessible descriptions give the pending-session counts. The indicator updates as requests are resolved or you switch Spaces.

Switching Spaces replaces the work area icons below the switcher and returns to that Space's last-used work area. Use **Up/Down** to focus work area icons and **Enter** to select one. Closing the final work area leaves the Space available for opening another work area.

**Open in Editor** in an Agents session opens or focuses that session's companion Editor work area in the same Space. Its project, branch, and session association are retained, and the original Agents work area, session, and draft stay intact. The new Editor appears beneath the Space switcher; its tooltip and work area menu identify the associated session.

Create, rename, recolor, and remove Spaces, and preview sessions. State is saved in browser local storage. Work areas, files, sessions, and activity are simulated: no real VS Code instance, worktree, agent, account isolation, or filesystem access is involved.

Older single-area and multi-area demo data is migrated without discarding its current work areas. The source snapshot is backed up under `vscode-spaces-exploration-v1-before-window-management` before the migrated state is saved. The earlier `vscode-spaces-exploration-v1-multi-window-backup` snapshot is left untouched, not automatically restored. Persisted `windows` fields and storage keys retain their original names for compatibility; user-facing terminology is **work areas**.

**Tech:** Vue 3, Vite, Vitest, VS Code Codicons

```bash
cd spaces
npm install
npm run dev
npm test
npm run build
```

Use **Ctrl+Alt+1–9** to switch spaces, arrow keys in the switcher, **Escape** to dismiss menus/dialogs, and **Alt+F1** for concept and keyboard help.

### agent-merge

Standalone Agent Merge UX lab with mocked pull request scenarios, per-session controls, and an Agents Window shell.

**Tech:** Vue 3, Vite, Vitest, VS Code Codicons

```bash
cd agent-merge
npm install
npm run dev
```

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

### provider-info

AI provider icons that reveal a rotating ring of descriptive qualities on hover, focus, or activation.

**Tech:** Vue 3, Vite, VSCode Codicons

```bash
cd provider-info
npm install
npm run dev
```

### hat-stacker

Canvas mini game starring the VS Code pet. Catch every falling hat while counter-steering an increasingly tall and unstable stack.

**Tech:** Vanilla JavaScript, Canvas, Vite, Vitest

```bash
cd hat-stacker
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
