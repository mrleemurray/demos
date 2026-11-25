const storefrontProducts = [
  { name: 'Canvas tote', price: 28, category: 'Accessories', icon: 'package', color: 'blue' },
  { name: 'Desk lamp', price: 64, category: 'Home', icon: 'lightbulb', color: 'peach' },
  { name: 'Ceramic mug', price: 18, category: 'Home', icon: 'beaker', color: 'purple' },
]

function packageFile(name, scripts) {
  return {
    name: 'package.json', language: 'JSON',
    content: JSON.stringify({ name, private: true, type: 'module', scripts }, null, 2),
  }
}

export const exampleProjects = ['weather-station', 'task-api', 'release-notes']

const projects = {
  'vscode-docs': {
    folder: 'docs/getstarted',
    command: 'npm run docs:check',
    output: ['Checking documentation links...', 'All command references resolved.', 'Documentation build complete.'],
    files: [
      { name: 'commands.md', language: 'Markdown', inFolder: true, additions: 12, deletions: 2,
        content: '# Working with commands\n\n## Find a command\n\nOpen the Command Palette and type a few words from the action name.\n\n## Keep your place\n\nKeyboard focus returns to the view you were using after a command completes.\n\n## Related guides\n\n- Keyboard shortcuts\n- Navigating the workbench\n- Working across projects' },
      { name: 'navigation.md', language: 'Markdown', inFolder: true, content: '# Keyboard navigation\n\nUse Tab to move between controls and arrow keys within a list.\n\nPress Escape to dismiss a picker without changing your project.' },
      { name: 'README.md', language: 'Markdown', content: '# VS Code documentation\n\nGuides and examples for the workbench experience.' },
      packageFile('vscode-docs', { 'docs:check': 'node scripts/check-links.js' }),
    ],
  },
  'vscode-markdown': {
    folder: 'src/features',
    command: 'npm run watch',
    output: ['Markdown extension compiled.', 'Preview server ready.', 'Watching completion providers for changes.'],
    files: [
      { name: 'linkCompletion.ts', language: 'TypeScript', inFolder: true, additions: 24, deletions: 4,
        content: `export interface LinkTarget {
  label: string;
  path: string;
}

export function completeLinks(
  targets: LinkTarget[],
  prefix: string,
): LinkTarget[] {
  return targets.filter(target =>
    target.label.toLowerCase().startsWith(prefix.toLowerCase())
  );
}

export const links = [
  { label: 'Getting started', path: './getting-started.md' },
  { label: 'API reference', path: './api.md' },
];` },
      { name: 'preview.json', language: 'JSON', inFolder: true, content: '{\n  "scrollSync": true,\n  "openLinks": "editor"\n}' },
      { name: 'README.md', language: 'Markdown', content: '# Markdown extension\n\nLink completion and synchronized previews for Markdown projects.' },
      packageFile('vscode-markdown', { watch: 'tsc --watch', test: 'node --test' }),
    ],
  },
  'markdown-language-service': {
    folder: 'src',
    command: 'npm test',
    output: ['Link resolution: 18 tests passed.', 'Heading references: 12 tests passed.', 'All language-service tests passed.'],
    files: [
      { name: 'resolveLink.ts', language: 'TypeScript', inFolder: true, additions: 18, deletions: 3,
        content: `export interface DocumentLink {
  source: string;
  target: string;
  heading?: string;
}

export function resolveLink(link: DocumentLink): string {
  const target = new URL(link.target, link.source);
  if (link.heading) {
    target.hash = link.heading;
  }
  return target.toString();
}

export const example = {
  source: 'file:///docs/index.md',
  target: './guide.md',
  heading: 'installation',
};` },
      { name: 'links.test.ts', language: 'TypeScript', inFolder: true, content: "import { resolveLink } from './resolveLink';\n\nconst target = resolveLink({\n  source: 'file:///docs/index.md',\n  target: './guide.md',\n});\n\nconsole.assert(target.endsWith('/guide.md'));" },
      { name: 'README.md', language: 'Markdown', content: '# Markdown language service\n\nShared link and heading analysis used by Markdown tooling.' },
      packageFile('markdown-language-service', { test: 'node --test', build: 'tsc' }),
    ],
  },
  'weather-station': {
    folder: 'weather',
    command: 'python -m weather.forecast',
    output: ['Coastal station connected.', 'Temperature: 18.4 C | Wind: 12 km/h', 'Next observation in 60 seconds.'],
    files: [
      { name: 'forecast.py', language: 'Python', inFolder: true, additions: 18, deletions: 2,
        content: `from dataclasses import dataclass

@dataclass
class Observation:
    temperature: float
    wind_speed: float
    condition: str

def describe(observation: Observation) -> str:
    return f"{observation.condition}: {observation.temperature} C"

coast = Observation(18.4, 12.0, "Partly cloudy")
print(describe(coast))` },
      { name: 'stations.json', language: 'JSON', inFolder: true, content: JSON.stringify([{ id: 'coast', interval: 60 }, { id: 'hill', interval: 120 }], null, 2) },
      { name: 'README.md', language: 'Markdown', content: '# Weather station\n\nLocal observations and short-range forecasts.\n\nRun `python -m weather.forecast` to print the latest conditions.' },
    ],
    worktreeExamples: [
      { branch: 'feature/hourly-forecast', title: 'Add an hourly forecast', detail: 'Hourly observations and forecast summaries are ready to review.', file: 'forecast.py',
        content: `from dataclasses import dataclass

@dataclass
class HourlyForecast:
    hour: str
    temperature: float
    rain_probability: float

def next_hours():
    return [
        HourlyForecast("12:00", 18.4, 0.10),
        HourlyForecast("13:00", 19.2, 0.15),
        HourlyForecast("14:00", 19.8, 0.25),
    ]

for forecast in next_hours():
    print(f"{forecast.hour}: {forecast.temperature} C")` },
      { branch: 'fix/sensor-timeout', title: 'Handle a missing sensor reading', detail: 'Keep the last good reading when a station takes too long to respond.', file: 'forecast.py',
        content: `from dataclasses import dataclass

@dataclass
class Reading:
    station: str
    temperature: float
    stale: bool = False

def recover_reading(last: Reading) -> Reading:
    return Reading(last.station, last.temperature, stale=True)

coast = Reading("coast", 18.4)
recovered = recover_reading(coast)
print(f"Last known temperature: {recovered.temperature} C")` },
    ],
  },
  'task-api': {
    folder: 'cmd/server',
    command: 'go run ./cmd/server',
    output: ['Task API listening on :8080', 'GET /health 200', 'GET /tasks 200 | 3 tasks'],
    files: [
      { name: 'main.go', language: 'Go', inFolder: true, additions: 24, deletions: 3,
        content: `package main

import (
    "encoding/json"
    "net/http"
)

type Task struct {
    ID string
    Title string
    Done bool
}

func tasks(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode([]Task{
        {ID: "1", Title: "Ship the API", Done: false},
        {ID: "2", Title: "Write the docs", Done: true},
    })
}

func main() {
    http.HandleFunc("/tasks", tasks)
    http.ListenAndServe(":8080", nil)
}` },
      { name: 'go.mod', language: 'Go', content: 'module example.local/task-api\n\ngo 1.23' },
      { name: 'README.md', language: 'Markdown', content: '# Task API\n\nA small Go service for project tasks.\n\n- GET /health\n- GET /tasks\n\nRun `go run ./cmd/server`.' },
    ],
    worktreeExamples: [
      { branch: 'feature/task-filters', title: 'Filter tasks by completion', detail: 'The API now supports separate lists for active and completed tasks.', file: 'main.go',
        content: `package main

import (
    "encoding/json"
    "net/http"
)

type Task struct {
    Title string
    Done bool
}

func tasks(w http.ResponseWriter, r *http.Request) {
    completed := r.URL.Query().Get("done") == "true"
    json.NewEncoder(w).Encode(Task{
        Title: "Filtered task",
        Done: completed,
    })
}

func main() {
    http.HandleFunc("/tasks", tasks)
    http.ListenAndServe(":8080", nil)
}` },
      { branch: 'fix/health-check', title: 'Make the health check lightweight', detail: 'Return a small health response without loading the task list.', file: 'main.go',
        content: `package main

import "net/http"

func health(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("ok"))
}

func main() {
    http.HandleFunc("/health", health)
    http.ListenAndServe(":8080", nil)
}` },
    ],
  },
  'release-notes': {
    folder: 'releases',
    command: 'npm run build',
    output: ['Collecting release notes...', 'Published 3 release pages.', 'Preview available at /releases/'],
    files: [
      { name: 'release.md', language: 'Markdown', inFolder: true, additions: 12, deletions: 0,
        content: '# Product updates\n\n## Version 1.8\n\n### New\n- Saved filters for project tasks\n- Faster dashboard loading\n\n### Fixed\n- Keyboard navigation in the date picker\n- Reconnecting after a network interruption\n\n## Up next\n\nPreparing the next major release.' },
      { name: 'contributors.json', language: 'JSON', inFolder: true, content: JSON.stringify({ teams: ['Platform', 'Design', 'Documentation'] }, null, 2) },
      { name: 'README.md', language: 'Markdown', content: '# Release notes\n\nEditorial drafts for product announcements.\n\nEach release can be prepared in its own linked worktree.' },
      packageFile('release-notes', { build: 'eleventy' }),
    ],
    worktreeExamples: [
      { branch: 'release/2.0', title: 'Prepare the version 2 announcement', detail: 'The major-release draft covers the redesigned dashboard and migration steps.', file: 'release.md',
        content: '# Introducing version 2.0\n\n## A fresh dashboard\n\nYour projects, tasks, and reports in one place.\n\n## Migration guide\n\n1. Export your saved filters.\n2. Update to version 2.\n3. Import your settings.\n\n## Availability\n\nThe rollout begins next week.' },
      { branch: 'release/1.8.1', title: 'Write the maintenance release notes', detail: 'Document the health-check and offline-recovery fixes.', file: 'release.md',
        content: '# Version 1.8.1\n\nA focused maintenance update.\n\n## Fixes\n\n- Health checks no longer load task data.\n- Offline recovery preserves unsent edits.\n- Screen readers announce restored connections.\n\nNo migration is required.' },
    ],
  },
  vscode: {
    folder: 'src/vs/workbench',
    command: 'npm run watch',
    output: ['[watch] Workbench compilation complete.', '[watch] Watching for file changes.'],
    files: [
      {
        name: 'commandPalette.ts', language: 'TypeScript', inFolder: true, additions: 34, deletions: 12,
        content: `export interface QuickPickItem {
  id: string;
  label: string;
  keybinding?: string;
}

export function filterCommands(
  commands: QuickPickItem[],
  search: string,
): QuickPickItem[] {
  const query = search.trim().toLowerCase();

  return commands.filter(command =>
    command.label.toLowerCase().includes(query)
  );
}

export const commands: QuickPickItem[] = [
  { id: 'workbench.action.files.openFile', label: 'Open File' },
  { id: 'workbench.action.showCommands', label: 'Show All Commands' },
];`,
      },
      {
        name: 'quickInput.css', language: 'CSS', inFolder: true, additions: 18, deletions: 7,
        content: `.quick-input-widget {
  max-width: 600px;
  padding: 8px;
  border-radius: 8px;
  background: var(--vscode-editorWidget-background);
}

.quick-input-list .monaco-list-row {
  display: flex;
  align-items: center;
  min-height: 28px;
  padding: 0 8px;
}

.quick-input-list .keybinding {
  margin-left: auto;
  opacity: 0.7;
}`,
      },
      {
        name: 'README.md', language: 'Markdown', additions: 4, deletions: 1,
        content: `# VS Code Workbench

Making everyday development feel lighter.

## Current work
- Refine the command palette layout
- Preserve keyboard focus across sidebar changes
- Cover workspace restoration

## Development
Run \`npm run watch\` to compile the workbench.`,
      },
      packageFile('vscode', { watch: 'gulp watch', test: './scripts/test.sh' }),
    ],
  },
  'field-notes': {
    folder: 'notes',
    command: 'npm run build',
    output: ['Writing 12 notes to _site/', 'Build complete in 0.4s.'],
    files: [
      {
        name: 'journal.md', language: 'Markdown', inFolder: true, additions: 12, deletions: 1,
        content: `# Weekend field notes

A small notebook for walks, experiments, and things worth keeping.

## Saturday / Along the coast

The path opens up just past the old lighthouse.
Bring the camera next time, especially around sunset.

## Things to make

- [x] Print a pocket-sized trail map
- [ ] Try the sourdough recipe again
- [ ] Put together a small photo journal

## Reading list

- The design of everyday things
- A field guide to local birds

## Next outing

Take the northern trail and stop at the lookout.`,
      },
      {
        name: 'garden.md', language: 'Markdown', inFolder: true, additions: 7, deletions: 0,
        content: `# Notes from the garden

## The kitchen patch

- Rosemary is doing well by the wall
- Move the basil somewhere with more morning sun
- Sow another row of rocket

## This month's experiment

Start a few tomato seedlings in reused paper pots.
Keep a record of what sprouts first.

## Supplies

- [ ] Potting mix
- [ ] Plant labels
- [x] Watering can`,
      },
      {
        name: 'README.md', language: 'Markdown', additions: 2, deletions: 0,
        content: `# Field notes

An unhurried collection of little discoveries.

## Notebooks
- [Weekend journal](notes/journal.md)
- [In the garden](notes/garden.md)

Run \`npm run build\` to publish the notes.`,
      },
      packageFile('field-notes', { dev: 'eleventy --serve', build: 'eleventy' }),
    ],
  },
  storefront: {
    folder: 'src/components',
    command: 'npm run dev',
    output: ['VITE ready in 148ms', 'Local: http://localhost:3000/'],
    products: storefrontProducts,
    files: [
      {
        name: 'CollectionGrid.tsx', language: 'TypeScript React', inFolder: true, additions: 64, deletions: 9,
        content: `import { products } from './products';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function CollectionGrid() {
  return (
    <section className="collection-grid">
      {products.map(product => (
        <article key={product.name}>
          <div className="product-art" />
          <h2>{product.name}</h2>
          <p>{currency.format(product.price)}</p>
          <button>Add to bag</button>
        </article>
      ))}
    </section>
  );
}`,
      },
      {
        name: 'products.ts', language: 'TypeScript', inFolder: true, additions: 18, deletions: 0,
        content: `export const products = ${JSON.stringify(storefrontProducts.map(({ name, price, category }) => ({ name, price, category })), null, 2)};`,
      },
      {
        name: 'README.md', language: 'Markdown', additions: 4, deletions: 1,
        content: `# Everyday essentials

Thoughtful pieces for home, work, and the way between.

## Storefront
- Responsive product collections
- Category filters and sorting
- A quick, accessible checkout

Run \`npm run dev\` to start the storefront.`,
      },
      packageFile('storefront', { dev: 'vite --port 3000', build: 'vite build' }),
    ],
  },
}

function genericProject(project) {
  return {
    folder: 'src',
    command: '',
    output: [],
    files: [
      {
        name: 'space.ts', language: 'TypeScript', inFolder: true, additions: 28, deletions: 8,
        content: `export interface Collection {
  id: string;
  name: string;
  workAreas: WorkArea[];
  activeWorkAreaId: string | null;
}

export function createCollection(options: CollectionOptions): Collection {
  const area = createWorkArea(options.startIn);
  return {
    id: crypto.randomUUID(),
    name: options.name,
    workAreas: [area],
    activeWorkAreaId: area.id,
  };
}

// A Collection brings related work areas together.`,
      },
      {
        name: 'index.ts', language: 'TypeScript', inFolder: true, additions: 10, deletions: 6,
        content: `import { createCollection } from './space';

const personal = createCollection({
  name: 'Personal',
  description: 'Just for the joy of it',
  startIn: 'editor',
  color: 'peach',
});

export default personal;`,
      },
      {
        name: 'README.md', language: 'Markdown', additions: 4, deletions: 4,
        content: `# ${project}

A little room for your next idea.

## Getting started

npm install
npm run dev

## Make yourself at home

Open an Agents work area in this Collection to explore a task.`,
      },
      packageFile(project, { dev: 'vite', build: 'vite build' }),
    ],
  }
}

const editorFiles = new Set([
  ...genericProject('').files.map(file => file.name),
  ...Object.values(projects).flatMap(project => project.files.map(file => file.name)),
])

export function isEditorFile(name) {
  return editorFiles.has(name)
}

export function getProjectContent(project, branch) {
  const name = project.replace(/[/\\]+$/, '').split(/[/\\]/).at(-1).toLowerCase()
  const profile = Object.hasOwn(projects, name) ? projects[name] : genericProject(project)
  const example = profile.worktreeExamples?.find(example => example.branch === branch)
  return example ? { ...profile, files: profile.files.map(file => file.name === example.file ? { ...file, content: example.content } : file) } : profile
}
