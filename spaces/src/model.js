import { isSpaceImage, themes } from './appearance.js'
import { exampleProjects, getProjectContent, isEditorFile } from './projectContent.js'

export const storageKey = 'vscode-spaces-exploration-v1'
export const legacyBackupKey = `${storageKey}-multi-window-backup`
export const migrationBackupKey = `${storageKey}-before-window-management`
export const worktreeMigrationBackupKey = `${storageKey}-before-worktrees`
export const sessionWorktreeMigrationBackupKey = `${storageKey}-before-session-worktrees`
export const colors = ['blue', 'peach', 'purple', 'green', 'pink']

function worktreeIdentity(space, project, path) {
  return `${space.id}:worktree:${encodeURIComponent(project)}:${encodeURIComponent(path)}`
}

function projectPath(project) {
  return /[/\\]/.test(project) ? project.replace(/[/\\]+$/, '') || project : `~/Projects/${project}`
}

function ensureWorktree(space, project, branch = 'main', { linked = false } = {}) {
  const path = linked ? `${projectPath(project)}/.worktrees/${branch}` : projectPath(project)
  const existing = space.worktrees.find(tree => tree.project === project && tree.path === path)
  if (existing) return existing
  const name = linked ? branch.split('/').at(-1) : 'Main checkout'
  const tree = { id: worktreeIdentity(space, project, path), project, name, branch, path, kind: linked ? 'worktree' : 'project' }
  space.worktrees.push(tree)
  return tree
}

function createSessionWorktree(space, area, session) {
  const slug = session.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'task'
  const tree = ensureWorktree(space, area.project, `session/${slug}-${encodeURIComponent(session.id)}`, { linked: true })
  tree.name = session.title.trim().slice(0, 40) || 'Session worktree'
  return tree
}

function migrateSessionWorktrees(state) {
  for (const space of state.spaces) {
    const assigned = new Set()
    for (const area of space.windows.filter(area => area.kind === 'agents')) {
      for (const session of area.sessions) {
        const previous = getWorktree(space, session.worktreeId)
        let tree = previous
        const location = JSON.stringify([area.project, previous.path])
        if (!isLinkedWorktree(previous) || assigned.has(location)) {
          tree = createSessionWorktree(space, area, session)
          session.worktreeId = tree.id
          for (const editor of space.windows.filter(editor => editor.kind === 'editor')) {
            if (editor.project === area.project && editor.sessionContext?.sourceWindowId === area.id &&
              editor.sessionContext.sessionId === session.id && getWorktree(space, editor.worktreeId).path === previous.path) {
              editor.worktreeId = tree.id
              editor.branch = tree.branch
            }
          }
        }
        assigned.add(JSON.stringify([area.project, tree.path]))
      }
    }
  }
  state.version = 5
  return state
}

function initializeWorktrees(state, seedSessions = false) {
  for (const space of state.spaces) {
    space.worktrees ??= []
    if (!Array.isArray(space.worktrees)) throw new Error('Saved collections have an invalid worktree catalog.')
    for (const area of space.windows) {
      const tree = space.worktrees.find(tree => tree.id === area.worktreeId && tree.project === area.project)
        || ensureWorktree(space, area.project, area.branch || 'main')
      area.worktreeId = tree.id
      for (const session of area.sessions) {
        if (!space.worktrees.some(tree => tree.id === session.worktreeId && tree.project === area.project)) session.worktreeId = tree.id
      }
    }
    for (const project of new Set(space.windows.map(area => area.project))) {
      if (project === 'vscode') {
        ensureWorktree(space, project, 'ui/command-palette', { linked: true })
        ensureWorktree(space, project, 'fix/keyboard-focus', { linked: true })
      } else if (project === 'storefront') {
        ensureWorktree(space, project, 'feature/collection-page', { linked: true })
      }
    }
    if (seedSessions) {
      const examples = { 'vscode-1': 'ui/command-palette', 'vscode-2': 'fix/keyboard-focus', 'vscode-3': 'test/workspace-restoration', 'shop-1': 'feature/collection-page' }
      for (const area of space.windows) for (const session of area.sessions) {
        if (examples[session.id]) session.worktreeId = ensureWorktree(space, area.project, examples[session.id], { linked: true }).id
      }
    }
  }
  return migrateSessionWorktrees(state)
}

export function getWorktree(space, id) {
  const tree = space.worktrees.find(tree => tree.id === id)
  if (!tree) throw new Error('Worktree not found in this Collection.')
  return tree
}

export function isLinkedWorktree(tree) {
  return tree.kind === 'worktree'
}

export function sessionWorktree(space, area, session) {
  return getWorktree(space, session?.worktreeId ?? area.worktreeId)
}

export function openWorktreeCount(space) {
  const ids = new Set(space.windows.flatMap(area => [area.worktreeId, ...area.sessions.map(session => session.worktreeId)]))
  return [...ids].filter(id => isLinkedWorktree(getWorktree(space, id))).length
}

export function reconcileWorktreeReferences(state) {
  const catalog = state.spaces.flatMap(space => space.worktrees)
  for (const space of state.spaces) for (const area of space.windows) {
    for (const owner of [area, ...area.sessions]) {
      if (space.worktrees.some(tree => tree.id === owner.worktreeId && tree.project === area.project)) continue
      const source = catalog.find(tree => tree.id === owner.worktreeId && tree.project === area.project)
      if (!source) throw new Error('A work area refers to an unavailable worktree.')
      const existing = space.worktrees.find(tree => tree.project === source.project && tree.path === source.path)
      const tree = existing || { ...source, id: worktreeIdentity(space, source.project, source.path) }
      if (!existing) space.worktrees.push(tree)
      owner.worktreeId = tree.id
    }
  }
  return state
}

function makeWindow(id, project, kind, sessions = []) {
  return { id, project, kind, branch: 'main', draft: '', sessions, activeFile: getProjectContent(project).files[0].name, selectedSessionId: sessions[0]?.id ?? null, sidebarVisible: true, sessionContext: null }
}

function sampleSessions(prefix) {
  return [
    { id: `${prefix}-1`, title: 'Make the command palette feel lighter', status: 'review', detail: 'Refined the spacing, simplified the search field, and aligned the results list. Ready for a look.', time: '12 min ago' },
    { id: `${prefix}-2`, title: 'Fix keyboard focus in the sidebar', status: 'working', detail: 'Checking focus order and Escape behavior across the sidebar controls.', time: '24 min ago' },
    { id: `${prefix}-3`, title: 'Add tests for workspace restoration', status: 'done', detail: 'Added coverage for restoring the last active workspace and preserving open files.', time: '1 hour ago' },
  ]
}

export function createState() {
  const state = {
    version: 5,
    activeSpaceId: 'work',
    spaces: [
      {
        id: 'work', name: 'Work', description: 'The day job', color: 'blue', image: null, theme: 'dark',
        startingWindowKind: 'agents', activeWindowId: 'work-agents',
        windows: [makeWindow('work-agents', 'vscode', 'agents', sampleSessions('vscode'))],
      },
      {
        id: 'personal', name: 'Personal', description: 'Just for the joy of it', color: 'peach', image: null, theme: 'dark',
        startingWindowKind: 'editor', activeWindowId: 'personal-editor',
        windows: [makeWindow('personal-editor', 'field-notes', 'editor')],
      },
      {
        id: 'side-gig', name: 'Side gig', description: 'Something on the side', color: 'purple', image: null, theme: 'dark',
        startingWindowKind: 'agents', activeWindowId: 'side-agents',
        windows: [makeWindow('side-agents', 'storefront', 'agents', [
          { id: 'shop-1', title: 'Build the new collection page', status: 'review', detail: 'The responsive collection grid and category filters are ready to review.', time: '32 min ago' },
        ])],
      },
    ],
  }
  return initializeWorktrees(state, true)
}

export function activeSpace(state) {
  const space = state.spaces.find(item => item.id === state.activeSpaceId)
  if (!space) throw new Error('The active collection does not exist.')
  return space
}

export function selectSpace(state, id) {
  if (!state.spaces.some(space => space.id === id)) throw new Error('Collection not found.')
  state.activeSpaceId = id
}

export function activeWindow(state) {
  const space = activeSpace(state)
  return space.windows.find(window => window.id === space.activeWindowId)
}

export function activeSessions(area) {
  return area.sessions.filter(session => session.status !== 'done')
}

export function markSessionDone(space, areaId, sessionId) {
  const area = space.windows.find(area => area.id === areaId && area.kind === 'agents')
  const session = area?.sessions.find(session => session.id === sessionId)
  if (!session) throw new Error('Choose an existing Agents session.')
  session.status = 'done'
  if (area.selectedSessionId === session.id) area.selectedSessionId = activeSessions(area)[0]?.id ?? null
  return session
}

export function selectWindow(state, id) {
  const space = activeSpace(state)
  if (!space.windows.some(window => window.id === id)) throw new Error('Work area not found in this Collection.')
  space.activeWindowId = id
}

export function getProjectBranches(state, project) {
  const trees = state.spaces.flatMap(space => space.worktrees.filter(tree => tree.project === project))
  const folder = activeSpace(state).worktrees.find(tree => tree.project === project && tree.kind === 'project')
    || trees.find(tree => tree.kind === 'project')
  const examples = getProjectContent(project).worktreeExamples || []
  return [...new Set([folder?.branch || 'main', ...trees.map(tree => tree.branch), ...examples.map(example => example.branch)])]
}

export function addWindow(state, project, kind, { worktreeId, branch } = {}) {
  if (!project.trim()) throw new Error('Enter a workspace or project name.')
  if (!['editor', 'agents'].includes(kind)) throw new Error('Choose Editor or Agents.')
  if (branch !== undefined && (kind !== 'editor' || worktreeId !== undefined || typeof branch !== 'string' || !branch.trim())) {
    throw new Error('Choose a branch for the project folder or an existing worktree for an Editor.')
  }
  const space = activeSpace(state)
  const tree = worktreeId ? getWorktree(space, worktreeId) : ensureWorktree(space, project.trim())
  if (tree.project !== project.trim()) throw new Error('Choose a worktree belonging to the selected project.')
  if (branch !== undefined) {
    for (const collection of state.spaces) {
      for (const folder of collection.worktrees.filter(folder => folder.kind === 'project' && folder.path === tree.path)) {
        folder.branch = branch.trim()
        for (const area of collection.windows.filter(area => area.worktreeId === folder.id)) area.branch = folder.branch
      }
    }
  }
  const window = makeWindow(crypto.randomUUID(), project.trim(), kind)
  window.worktreeId = tree.id
  window.branch = tree.branch
  space.windows.push(window)
  space.activeWindowId = window.id
  return window
}

export function addSession(space, areaId, title) {
  const area = space.windows.find(area => area.id === areaId && area.kind === 'agents')
  if (!area || !title.trim()) throw new Error('Choose an Agents work area and enter a task.')
  const session = {
    id: crypto.randomUUID(), title: title.trim(), status: 'preview', time: 'Just now', detail: '',
  }
  session.worktreeId = createSessionWorktree(space, area, session).id
  area.sessions.unshift(session)
  area.selectedSessionId = session.id
  area.draft = ''
  return session
}

function agentsForProject(space, project) {
  return space.windows.find(area => area.kind === 'agents' && area.project === project)
    || addWindow({ spaces: [space], activeSpaceId: space.id }, project, 'agents')
}

export function addSessionToCollection(state, sourceId, targetSpaceId, title) {
  const sourceSpace = state.spaces.find(space => space.windows.some(area => area.id === sourceId && area.kind === 'agents'))
  const targetSpace = state.spaces.find(space => space.id === targetSpaceId)
  const source = sourceSpace?.windows.find(area => area.id === sourceId)
  if (!source || !targetSpace || !title.trim()) throw new Error('Choose an available Collection and enter a task.')
  const destination = sourceSpace === targetSpace ? source : agentsForProject(targetSpace, source.project)
  const session = addSession(targetSpace, destination.id, title)
  source.draft = ''
  return { area: destination, session }
}

export function moveSession(state, sourceId, sessionId, targetSpaceId) {
  const sourceSpace = state.spaces.find(space => space.windows.some(area => area.id === sourceId && area.kind === 'agents'))
  const targetSpace = state.spaces.find(space => space.id === targetSpaceId)
  const source = sourceSpace?.windows.find(area => area.id === sourceId)
  const session = source?.sessions.find(session => session.id === sessionId)
  if (!session || !targetSpace || targetSpace === sourceSpace) throw new Error('Choose an existing session and a different Collection.')
  const tree = getWorktree(sourceSpace, session.worktreeId)
  if (targetSpace.windows.some(area => area.kind === 'agents' && area.project === source.project &&
    area.sessions.some(item => getWorktree(targetSpace, item.worktreeId).path === tree.path))) {
    throw new Error('This worktree already belongs to a session in the destination Collection.')
  }
  const destination = agentsForProject(targetSpace, source.project)
  source.sessions.splice(source.sessions.indexOf(session), 1)
  if (source.selectedSessionId === session.id) source.selectedSessionId = activeSessions(source)[0]?.id ?? null
  destination.sessions.unshift(session)
  if (!destination.selectedSessionId && session.status !== 'done') destination.selectedSessionId = session.id
  const companions = sourceSpace.windows.filter(area => area.kind === 'editor' &&
    area.sessionContext?.sourceWindowId === source.id && area.sessionContext.sessionId === session.id)
  for (const editor of companions) {
    const index = sourceSpace.windows.indexOf(editor)
    sourceSpace.windows.splice(index, 1)
    if (sourceSpace.activeWindowId === editor.id) sourceSpace.activeWindowId = source.id
    editor.sessionContext.sourceWindowId = destination.id
    targetSpace.windows.push(editor)
  }
  reconcileWorktreeReferences(state)
  return destination
}

function makeSpace(values, startingWindowKind) {
  return { ...values, id: crypto.randomUUID(), startingWindowKind, windows: [], worktrees: [], activeWindowId: null }
}

export function loadWorkstreamExamples(state) {
  const examples = [
    { name: 'VS Code experience', description: 'Workbench changes across the app and documentation', color: 'blue',
      projects: [
        { project: 'vscode', tasks: ['Refine command navigation', 'Keep focus stable across views'] },
        { project: 'vscode-docs', tasks: ['Document the new command workflow', 'Update keyboard navigation examples'] },
      ] },
    { name: 'Markdown tooling', description: 'Markdown features across the extension and language service', color: 'purple',
      projects: [
        { project: 'vscode-markdown', tasks: ['Add workspace link completion', 'Keep preview navigation in sync'] },
        { project: 'markdown-language-service', tasks: ['Resolve links across folders', 'Cover renamed heading references'] },
      ] },
  ]
  let count = 0
  for (const { projects, ...values } of examples) {
    if (state.spaces.some(space => space.name.toLowerCase() === values.name.toLowerCase())) continue
    const space = makeSpace({ ...values, theme: 'dark', image: null }, 'agents')
    state.spaces.push(space)
    const context = { ...state, activeSpaceId: space.id }
    for (const { project, tasks } of projects) {
      addWindow(context, project, 'editor')
      const agents = addWindow(context, project, 'agents')
      for (const title of tasks) addSession(space, agents.id, title)
    }
    space.activeWindowId = space.windows.find(area => area.kind === 'agents').id
    count++
  }
  return count
}

export function loadExampleProjects(state) {
  const space = activeSpace(state)
  const activeId = space.activeWindowId
  let count = 0
  for (const project of exampleProjects) {
    if (space.windows.some(area => area.project === project)) continue
    const profile = getProjectContent(project)
    addWindow(state, project, 'editor')
    const agents = addWindow(state, project, 'agents')
    agents.sessions = profile.worktreeExamples.map((example, index) => ({
      id: crypto.randomUUID(), title: example.title, detail: example.detail,
      status: index === 0 ? 'review' : 'working', time: index === 0 ? '12 min ago' : '24 min ago',
      worktreeId: ensureWorktree(space, project, example.branch, { linked: true }).id,
    }))
    agents.selectedSessionId = agents.sessions[0].id
    count++
  }
  space.activeWindowId = activeId
  return count
}

export function closeWindow(state, id) {
  const space = activeSpace(state)
  const index = space.windows.findIndex(window => window.id === id)
  if (index === -1) throw new Error('Work area not found in this Collection.')
  space.windows.splice(index, 1)
  if (space.activeWindowId === id) space.activeWindowId = space.windows[Math.max(0, index - 1)]?.id ?? null
}

export function moveWindow(state, id, targetSpaceId) {
  const source = activeSpace(state)
  const target = state.spaces.find(space => space.id === targetSpaceId)
  if (!target || target === source) throw new Error('Choose a different Collection.')
  const window = source.windows.find(item => item.id === id)
  if (!window) throw new Error('Work area not found in this Collection.')
  closeWindow(state, id)
  target.windows.push(window)
  target.activeWindowId = window.id
  reconcileWorktreeReferences(state)
}

export function openSessionInEditor(state, sessionId, { forceNew = false, editorId } = {}) {
  const source = activeWindow(state)
  if (!source || source.kind !== 'agents') throw new Error('Open a session from an Agents work area.')
  const session = source.sessions.find(item => item.id === sessionId)
  if (!session) throw new Error('Session not found.')
  const space = activeSpace(state)
  const checkout = sessionWorktree(space, source, session)
  const existing = editorId !== undefined ? space.windows.find(window => window.id === editorId && window.kind === 'editor') : space.windows.find(window =>
    window.kind === 'editor' && window.project === source.project &&
    getWorktree(space, window.worktreeId).path === checkout.path &&
    window.sessionContext?.sessionId === sessionId && window.sessionContext.sourceWindowId === source.id,
  )
  if (editorId !== undefined && !existing) throw new Error('Editor work area not found in this Collection.')
  const editor = existing && (editorId !== undefined || !forceNew)
    ? existing : addWindow(state, source.project, 'editor', { worktreeId: checkout.id })
  editor.project = source.project
  editor.worktreeId = checkout.id
  editor.branch = checkout.branch
  editor.sessionContext = { sessionId, sourceWindowId: source.id, title: session.title }
  space.activeWindowId = editor.id
  return editor
}

export function spaceNameError(state, name, id) {
  if (!name.trim()) return 'Give your collection a name.'
  if (name.trim().length > 40) return 'Use 40 characters or fewer.'
  if (state.spaces.some(space => space.id !== id && space.name.toLowerCase() === name.trim().toLowerCase())) {
    return 'A collection with this name already exists.'
  }
  return ''
}

export function saveSpace(state, details) {
  const error = spaceNameError(state, details.name, details.id)
  if (error) throw new Error(error)
  if (!colors.includes(details.color)) throw new Error('Choose a supported collection color.')
  const existing = details.id ? state.spaces.find(space => space.id === details.id) : undefined
  if (details.id && !existing) throw new Error('Collection not found.')
  const theme = details.theme === undefined ? existing?.theme ?? 'dark' : details.theme
  const image = details.image === undefined ? existing?.image ?? null : details.image
  if (!themes.some(option => option.id === theme)) throw new Error('Choose a supported color theme.')
  if (!isSpaceImage(image)) throw new Error('Choose a valid Collection image.')
  const values = { name: details.name.trim(), description: details.description.trim(), color: details.color, theme, image }
  if (existing) {
    Object.assign(existing, values)
    return existing
  }
  if (!['editor', 'agents'].includes(details.windowKind)) throw new Error('Choose Editor or Agents.')
  const space = makeSpace(values, details.windowKind)
  state.spaces.push(space)
  state.activeSpaceId = space.id
  addWindow(state, values.name, details.windowKind)
  return space
}

export function removeSpace(state, id) {
  if (state.spaces.length === 1) throw new Error('Keep at least one collection.')
  const index = state.spaces.findIndex(space => space.id === id)
  if (index === -1) throw new Error('Collection not found.')
  state.spaces.splice(index, 1)
  if (state.activeSpaceId === id) state.activeSpaceId = state.spaces[Math.max(0, index - 1)].id
}

export function activity(space) {
  const sessions = space.windows.flatMap(window => window.sessions)
  return {
    working: sessions.filter(session => session.status === 'working').length,
    review: sessions.filter(session => session.status === 'review').length,
    inputRequired: space.windows.reduce((count, window) => count + inputRequiredCount(window), 0),
  }
}

export function inputRequiredCount(window) {
  return window.sessions.filter(session => session.status === 'input' || session.status === 'review').length
}

export function restoreState(raw) {
  if (raw === null) return createState()
  const state = JSON.parse(raw)
  const ids = new Set()
  function uniqueId(id) {
    if (typeof id !== 'string' || !id || ids.has(id)) return false
    ids.add(id)
    return true
  }
  const text = value => typeof value === 'string'
  function validWindow(window) {
    return window && uniqueId(window.id) && text(window.project) && Boolean(window.project.trim()) &&
      ['editor', 'agents'].includes(window.kind) && text(window.branch) && text(window.draft) &&
      (window.sessionContext === undefined || window.sessionContext === null ||
        (window.kind === 'editor' && text(window.sessionContext.sessionId) &&
          text(window.sessionContext.sourceWindowId) && text(window.sessionContext.title))) &&
      (window.sidebarVisible === undefined || typeof window.sidebarVisible === 'boolean') &&
      isEditorFile(window.activeFile) &&
      Array.isArray(window.sessions) && window.sessions.every(session =>
        session && uniqueId(session.id) && text(session.title) && text(session.detail) && text(session.time) &&
        ['working', 'input', 'review', 'done', 'preview'].includes(session.status),
      ) &&
      (window.selectedSessionId === null || window.sessions.some(session => session.id === window.selectedSessionId))
  }
  const singleton = state?.version === 2
  const valid = [1, 2, 3, 4, 5].includes(state?.version) &&
    Array.isArray(state.spaces) && state.spaces.length > 0 &&
    state.spaces.every(space =>
      space && uniqueId(space.id) && text(space.name) && Boolean(space.name.trim()) &&
      text(space.description) && colors.includes(space.color) &&
      (space.theme === undefined || themes.some(option => option.id === space.theme)) &&
      (space.image === undefined || isSpaceImage(space.image)) &&
      (singleton
        ? space.windows === undefined && space.activeWindowId === undefined && validWindow(space.window)
        : space.window === undefined && Array.isArray(space.windows) && space.windows.every(validWindow) &&
          (space.windows.length === 0
            ? space.activeWindowId === null
            : space.windows.some(window => window.id === space.activeWindowId)) &&
          (state.version === 1 || ['editor', 'agents'].includes(space.startingWindowKind))),
    ) &&
    state.spaces.some(space => space.id === state.activeSpaceId)
  if (!valid) throw new Error('Saved collections have an unsupported or invalid format.')
  if (singleton) {
    state.spaces = state.spaces.map(({ window, ...space }) => ({
      ...space,
      startingWindowKind: window.kind,
      windows: [window],
      activeWindowId: window.id,
    }))
  } else if (state.version === 1) {
    for (const space of state.spaces) {
      space.startingWindowKind = space.windows.find(window => window.id === space.activeWindowId)?.kind ?? 'agents'
    }
  }
  for (const space of state.spaces) {
    space.theme ??= 'dark'
    space.image ??= null
    for (const window of space.windows) {
      window.sidebarVisible ??= true
      window.sessionContext ??= null
      if (window.sessions.some(session => session.id === window.selectedSessionId && session.status === 'done')) {
        window.selectedSessionId = activeSessions(window)[0]?.id ?? null
      }
    }
  }
  if (state.version < 4) return initializeWorktrees(state)
  for (const space of state.spaces) {
    if (!Array.isArray(space.worktrees) || !space.worktrees.every(tree =>
      tree && uniqueId(tree.id) && ['project', 'name', 'branch', 'path'].every(key => text(tree[key]) && Boolean(tree[key].trim())) &&
      (tree.kind === undefined || ['project', 'worktree'].includes(tree.kind)),
    )) throw new Error('Saved collections have an invalid worktree catalog.')
    for (const tree of space.worktrees) tree.kind ??= tree.path === projectPath(tree.project) ? 'project' : 'worktree'
    for (const area of space.windows) {
      for (const owner of [area, ...area.sessions]) {
        if (!space.worktrees.some(tree => tree.id === owner.worktreeId && tree.project === area.project)) {
          throw new Error('Saved collections have an invalid worktree reference.')
        }
      }
    }
  }
  if (state.version === 4) return migrateSessionWorktrees(state)
  for (const space of state.spaces) {
    const assigned = new Set()
    for (const area of space.windows.filter(area => area.kind === 'agents')) for (const session of area.sessions) {
      const tree = getWorktree(space, session.worktreeId)
      const location = JSON.stringify([area.project, tree.path])
      if (!isLinkedWorktree(tree) || assigned.has(location)) throw new Error('Saved sessions must have distinct linked worktrees.')
      assigned.add(location)
    }
  }
  return state
}
