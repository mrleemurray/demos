# Agent Merge Lab

A standalone Vue prototype environment for exploring Agent Merge UX without coupling experiments to the production Agents Window.

The lab starts with current Agent Merge concepts—pull request blockers, repair turns, per-session authorization, and merge policy—but keeps all data and presentation local to the demo.

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

- Three session profiles selected directly from the Sessions sidebar: full-control prototype, CI-only security fix, and regular PR with Agent Merge off
- Per-session Agent Merge authorization and merge policy reflected in the conversation
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
│   └── scenarios.js
└── components/
    ├── AgentMergeCard.vue
    ├── AgentMergeCard.test.js
    └── AgentMergeWorkbench.vue
```

Add new experiment states in `src/model/scenarios.js`. Keep reusable interaction ideas in focused components so competing UX directions can be swapped without rebuilding the shell.
