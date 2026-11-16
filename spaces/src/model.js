export const storageKey = 'vscode-spaces-exploration-v1'
export const legacyBackupKey = `${storageKey}-multi-window-backup`
export const migrationBackupKey = `${storageKey}-before-window-management`
export const colors = ['blue', 'peach', 'purple', 'green', 'pink']

function makeWindow(id, project, kind, sessions = []) {
  return { id, project, kind, branch: 'main', draft: '', sessions, activeFile: 'space.ts', selectedSessionId: sessions[0]?.id ?? null, sidebarVisible: true, sessionContext: null }
}

function sampleSessions(prefix) {
  return [
    { id: `${prefix}-1`, title: 'Make the command palette feel lighter', status: 'review', detail: 'Refined the spacing, simplified the search field, and aligned the results list. Ready for a look.', time: '12 min ago' },
    { id: `${prefix}-2`, title: 'Fix keyboard focus in the sidebar', status: 'working', detail: 'Checking focus order and Escape behavior across the sidebar controls.', time: '24 min ago' },
    { id: `${prefix}-3`, title: 'Add tests for workspace restoration', status: 'done', detail: 'Added coverage for restoring the last active workspace and preserving open files.', time: '1 hour ago' },
  ]
}

export function createState() {
  return {
    version: 3,
    spaceRailVisible: true,
    activeSpaceId: 'work',
    spaces: [
      {
        id: 'work', name: 'Work', description: 'The day job', color: 'blue',
        startingWindowKind: 'agents', activeWindowId: 'work-agents',
        windows: [makeWindow('work-agents', 'vscode', 'agents', sampleSessions('vscode'))],
      },
      {
        id: 'personal', name: 'Personal', description: 'Just for the joy of it', color: 'peach',
        startingWindowKind: 'editor', activeWindowId: 'personal-editor',
        windows: [makeWindow('personal-editor', 'field-notes', 'editor')],
      },
      {
        id: 'side-gig', name: 'Side gig', description: 'Something on the side', color: 'purple',
        startingWindowKind: 'agents', activeWindowId: 'side-agents',
        windows: [makeWindow('side-agents', 'storefront', 'agents', [
          { id: 'shop-1', title: 'Build the new collection page', status: 'review', detail: 'The responsive collection grid and category filters are ready to review.', time: '32 min ago' },
        ])],
      },
    ],
  }
}

export function activeSpace(state) {
  const space = state.spaces.find(item => item.id === state.activeSpaceId)
  if (!space) throw new Error('The active space does not exist.')
  return space
}

export function selectSpace(state, id) {
  if (!state.spaces.some(space => space.id === id)) throw new Error('Space not found.')
  state.activeSpaceId = id
}

export function activeWindow(state) {
  const space = activeSpace(state)
  return space.windows.find(window => window.id === space.activeWindowId)
}

export function selectWindow(state, id) {
  const space = activeSpace(state)
  if (!space.windows.some(window => window.id === id)) throw new Error('Work area not found in this Space.')
  space.activeWindowId = id
}

export function addWindow(state, project, kind) {
  if (!project.trim()) throw new Error('Enter a workspace or project name.')
  if (!['editor', 'agents'].includes(kind)) throw new Error('Choose Editor or Agents.')
  const window = makeWindow(crypto.randomUUID(), project.trim(), kind)
  const space = activeSpace(state)
  space.windows.push(window)
  space.activeWindowId = window.id
  return window
}

export function closeWindow(state, id) {
  const space = activeSpace(state)
  const index = space.windows.findIndex(window => window.id === id)
  if (index === -1) throw new Error('Work area not found in this Space.')
  space.windows.splice(index, 1)
  if (space.activeWindowId === id) space.activeWindowId = space.windows[Math.max(0, index - 1)]?.id ?? null
}

export function moveWindow(state, id, targetSpaceId) {
  const source = activeSpace(state)
  const target = state.spaces.find(space => space.id === targetSpaceId)
  if (!target || target === source) throw new Error('Choose a different Space.')
  const window = source.windows.find(item => item.id === id)
  if (!window) throw new Error('Work area not found in this Space.')
  closeWindow(state, id)
  target.windows.push(window)
  target.activeWindowId = window.id
}

export function openSessionInEditor(state, sessionId) {
  const source = activeWindow(state)
  if (!source || source.kind !== 'agents') throw new Error('Open a session from an Agents work area.')
  const session = source.sessions.find(item => item.id === sessionId)
  if (!session) throw new Error('Session not found.')
  const space = activeSpace(state)
  const existing = space.windows.find(window =>
    window.kind === 'editor' && window.sessionContext?.sessionId === sessionId &&
    window.sessionContext.sourceWindowId === source.id,
  )
  if (existing) {
    space.activeWindowId = existing.id
    return existing
  }
  const editor = addWindow(state, source.project, 'editor')
  editor.branch = source.branch
  editor.sessionContext = { sessionId, sourceWindowId: source.id, title: session.title }
  return editor
}

export function spaceNameError(state, name, id) {
  if (!name.trim()) return 'Give your space a name.'
  if (name.trim().length > 40) return 'Use 40 characters or fewer.'
  if (state.spaces.some(space => space.id !== id && space.name.toLowerCase() === name.trim().toLowerCase())) {
    return 'A space with this name already exists.'
  }
  return ''
}

export function saveSpace(state, details) {
  const error = spaceNameError(state, details.name, details.id)
  if (error) throw new Error(error)
  if (!colors.includes(details.color)) throw new Error('Choose a supported space color.')
  const values = { name: details.name.trim(), description: details.description.trim(), color: details.color }
  if (details.id) {
    const space = state.spaces.find(item => item.id === details.id)
    if (!space) throw new Error('Space not found.')
    Object.assign(space, values)
    return space
  }
  if (!['editor', 'agents'].includes(details.windowKind)) throw new Error('Choose Editor or Agents.')
  const window = makeWindow(crypto.randomUUID(), values.name, details.windowKind)
  const space = {
    ...values,
    id: crypto.randomUUID(),
    startingWindowKind: details.windowKind,
    windows: [window],
    activeWindowId: window.id,
  }
  state.spaces.push(space)
  state.activeSpaceId = space.id
  return space
}

export function removeSpace(state, id) {
  if (state.spaces.length === 1) throw new Error('Keep at least one space.')
  const index = state.spaces.findIndex(space => space.id === id)
  if (index === -1) throw new Error('Space not found.')
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
      ['space.ts', 'index.ts', 'README.md', 'package.json'].includes(window.activeFile) &&
      Array.isArray(window.sessions) && window.sessions.every(session =>
        session && uniqueId(session.id) && text(session.title) && text(session.detail) && text(session.time) &&
        ['working', 'input', 'review', 'done', 'preview'].includes(session.status),
      ) &&
      (window.selectedSessionId === null || window.sessions.some(session => session.id === window.selectedSessionId))
  }
  const singleton = state?.version === 2
  const valid = [1, 2, 3].includes(state?.version) &&
    (state.spaceRailVisible === undefined || typeof state.spaceRailVisible === 'boolean') &&
    Array.isArray(state.spaces) && state.spaces.length > 0 &&
    state.spaces.every(space =>
      space && uniqueId(space.id) && text(space.name) && Boolean(space.name.trim()) &&
      text(space.description) && colors.includes(space.color) &&
      (singleton
        ? space.windows === undefined && space.activeWindowId === undefined && validWindow(space.window)
        : space.window === undefined && Array.isArray(space.windows) && space.windows.every(validWindow) &&
          (space.windows.length === 0
            ? space.activeWindowId === null
            : space.windows.some(window => window.id === space.activeWindowId)) &&
          (state.version === 1 || ['editor', 'agents'].includes(space.startingWindowKind))),
    ) &&
    state.spaces.some(space => space.id === state.activeSpaceId)
  if (!valid) throw new Error('Saved spaces have an unsupported or invalid format.')
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
  state.version = 3
  state.spaceRailVisible ??= true
  for (const space of state.spaces) {
    for (const window of space.windows) {
      window.sidebarVisible ??= true
      window.sessionContext ??= null
    }
  }
  return state
}
