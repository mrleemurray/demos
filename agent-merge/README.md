# Agent Merge Lab

A standalone Vue prototype environment for exploring Agent Merge UX without coupling experiments to the production Agents Window.

The lab starts after an agent finishes a feature. The user can move the work through commit, branch publication, and pull request creation before configuring Agent Merge in a focused two-step modal. A global prototype switch shows or hides the PR-specific settings action in Changes without affecting the handling designs or command-center controls. All data and presentation stay local to the demo.

## Development

```bash
npm install
npm run dev
```

Run the focused component tests and production build with:

```bash
npm test
npm run build
```

## Prototype surfaces

- Three completed-feature profiles selected directly from the Sessions sidebar: full-control prototype, CI-only security fix, and a regular pull request without Agent Merge
- A Changes action that progresses through Commit Changes, Publish Branch, and Create Pull Request, then opens a standalone session-level Configure/Update Agent Merge settings dialog
- A chat-led Create Pull Request prompt that appears once the branch is published
- A two-step pull request dialog for PR details and post-creation handling
- A global PR settings in Changes switch that preserves status and session state while showing or hiding the post-creation Configure/Update action and standalone settings dialog
- External prototype controls for comparing permissions, autonomy-scale, and role-based Agent Merge setup, with detailed role cards in the pull request dialog and a rich icon-and-description role dropdown in the status overlay
- Shared Agent Merge settings across all three handling designs, including VS Code-style permission checkboxes
- Per-session Agent Merge authorization presets and merge policy reflected after pull request creation
- Retained per-session repository, pull request, and Agent Merge state while navigating between sessions
- Synchronized Agent Merge status in the conversation, Sessions list, and command center
- A reusable status surface with full controls in the command center and a compact read-only preview after a one-second hover over inactive Agent Merge sessions
- A viewport-fitted shell with internal chat scrolling
- An Agents Window shell with its title bar, Sessions sidebar, Sessions Part, Changes auxiliary surface, and Agent Merge disclosure
- Keyboard-operable session selection and screen-reader state

## Project structure

```text
src/
├── App.vue
├── App.test.js
├── style.css
├── model/
│   ├── agentMergeHandling.js
│   └── scenarios.js
└── components/
    ├── AgentMergeHandlingControls.vue
    ├── AgentMergeCard.vue
    ├── AgentMergeCard.test.js
    ├── AgentMergeStatusWidget.vue
    ├── AgentMergeWorkbench.vue
    └── CreatePullRequestDialog.vue
```

Add new experiment states in `src/model/scenarios.js`. Keep reusable interaction ideas in focused components so competing UX directions can be swapped without rebuilding the shell.
