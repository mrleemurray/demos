import assert from 'node:assert/strict'
import { suite, test } from 'vitest'
import {
  activeSessions, activeSpace, activeWindow, addSession, addSessionToCollection, addWindow, closeWindow, createState, markSessionDone, moveSession, moveWindow,
  openSessionInEditor, removeSpace, restoreState, saveSpace, selectSpace, selectWindow,
  getProjectBranches, getWorktree, loadExampleProjects, loadWorkstreamExamples, openWorktreeCount,
} from './model.js'
import { exampleProjects, getProjectContent } from './projectContent.js'

suite('Collections model', () => {
  test('opens a branch on the shared project folder without changing linked worktrees', () => {
    const state = createState()
    const folderEditor = addWindow(state, 'vscode', 'editor')
    folderEditor.draft = 'Keep the project Editor draft'
    const session = state.spaces[0].windows[0].sessions[0]
    const linkedEditor = addWindow(state, 'vscode', 'editor', { worktreeId: session.worktreeId })
    const peer = addWindow({ ...state, activeSpaceId: 'personal' }, 'vscode', 'editor')
    const linkedBefore = structuredClone(linkedEditor)
    const sessions = structuredClone(state.spaces[0].windows[0].sessions)
    const treeCount = state.spaces[0].worktrees.length
    const created = addWindow(state, 'vscode', 'editor', { branch: 'fix/keyboard-focus' })
    const folder = getWorktree(state.spaces[0], created.worktreeId)
    assert.equal(created.worktreeId, folderEditor.worktreeId)
    assert.equal(folder.kind, 'project')
    assert.equal(folder.path, '~/Projects/vscode')
    assert.equal(folder.branch, 'fix/keyboard-focus')
    assert.equal(folderEditor.branch, folder.branch)
    assert.equal(folderEditor.draft, 'Keep the project Editor draft')
    assert.equal(peer.branch, folder.branch)
    assert.equal(getWorktree(state.spaces[1], peer.worktreeId).branch, folder.branch)
    assert.deepEqual(linkedEditor, linkedBefore)
    assert.deepEqual(state.spaces[0].windows[0].sessions, sessions)
    assert.equal(state.spaces[0].worktrees.length, treeCount)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    const before = JSON.stringify(state)
    assert.throws(() => addWindow(state, 'vscode', 'editor', { branch: 'main', worktreeId: folder.id }), /branch.*or.*worktree/)
    assert.throws(() => addWindow(state, 'vscode', 'agents', { branch: 'main' }), /Editor/)
    assert.throws(() => addWindow(state, 'new-project', 'editor', { branch: ' ' }), /branch/)
    assert.equal(JSON.stringify(state), before)
  })

  test('offers example branches that are not checked out and can open them on the project folder', () => {
    const state = createState()
    assert.equal(state.spaces[0].worktrees.some(tree => tree.project === 'weather-station'), false)
    assert.ok(getProjectBranches(state, 'weather-station').includes('feature/hourly-forecast'))
    const editor = addWindow(state, 'weather-station', 'editor', { branch: 'feature/hourly-forecast' })
    const folder = getWorktree(state.spaces[0], editor.worktreeId)
    assert.equal(folder.kind, 'project')
    assert.equal(folder.branch, 'feature/hourly-forecast')
    assert.equal(folder.path, '~/Projects/weather-station')
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
  })

  test('marks sessions done without deleting their history, worktrees, Editors, or drafts', () => {
    const state = createState()
    const source = activeWindow(state)
    const session = source.sessions[1]
    const editor = openSessionInEditor(state, session.id)
    editor.draft = 'Keep the Editor notes'
    source.draft = 'Keep the unfinished task'
    const savedEditor = structuredClone(editor)
    const worktrees = structuredClone(state.spaces[0].worktrees)
    const original = structuredClone(session)
    const selected = source.selectedSessionId
    markSessionDone(state.spaces[0], source.id, session.id)
    assert.equal(source.selectedSessionId, selected)
    assert.deepEqual(session, { ...original, status: 'done' })
    assert.deepEqual(activeSessions(source).map(session => session.id), [selected])
    markSessionDone(state.spaces[0], source.id, selected)
    assert.equal(source.selectedSessionId, null)
    assert.equal(activeSessions(source).length, 0)
    assert.equal(source.sessions.length, 3)
    assert.equal(source.draft, 'Keep the unfinished task')
    assert.deepEqual(editor, savedEditor)
    assert.deepEqual(state.spaces[0].worktrees, worktrees)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    assert.throws(() => markSessionDone(state.spaces[0], source.id, 'missing'), /existing Agents session/)
  })

  test('restores a saved completed selection to an active session rather than a hidden row', () => {
    const state = createState()
    const source = activeWindow(state)
    source.sessions[0].status = 'done'
    const restored = restoreState(JSON.stringify(state))
    assert.equal(restored.spaces[0].windows[0].selectedSessionId, source.sessions[1].id)
    source.sessions[1].status = 'done'
    assert.equal(restoreState(JSON.stringify(state)).spaces[0].windows[0].selectedSessionId, null)
  })

  test('assigns a new session to a different Collection without moving the source or its existing sessions', () => {
    const state = createState()
    const source = activeWindow(state)
    source.draft = 'Task intended for another workstream'
    const sessions = JSON.stringify(source.sessions)
    const { area, session } = addSessionToCollection(state, source.id, 'personal', source.draft)
    assert.equal(area.project, source.project)
    assert.equal(area.kind, 'agents')
    assert.equal(area.sessions[0].id, session.id)
    assert.equal(getWorktree(state.spaces[1], session.worktreeId).kind, 'worktree')
    assert.equal(source.draft, '')
    assert.equal(JSON.stringify(source.sessions), sessions)
    assert.equal(state.activeSpaceId, 'work')
    const next = addSessionToCollection(state, source.id, 'personal', 'Another task')
    assert.equal(next.area.id, area.id)
    assert.notEqual(next.session.worktreeId, session.worktreeId)
    assert.equal(state.spaces[1].windows.filter(item => item.kind === 'agents').length, 1)
    const before = JSON.stringify(state)
    assert.throws(() => addSessionToCollection(state, source.id, 'missing', 'Task'), /available Collection/)
    assert.equal(JSON.stringify(state), before)
    assert.deepEqual(restoreState(before), state)
  })

  test('moves just one session and its companion Editor to the same project in another Collection', () => {
    const state = createState()
    const source = activeWindow(state)
    const session = source.sessions[0]
    const originalPath = getWorktree(state.spaces[0], session.worktreeId).path
    const editor = openSessionInEditor(state, session.id)
    editor.draft = 'Keep Editor edits'
    editor.activeFile = 'README.md'
    editor.sidebarVisible = false
    selectWindow(state, source.id)
    source.draft = 'Keep the source composer'
    const destination = addWindow({ ...state, activeSpaceId: 'personal' }, source.project, 'agents')
    const existing = addSession(state.spaces[1], destination.id, 'Do not disturb this session')
    const targetCount = state.spaces[1].windows.length
    const moved = moveSession(state, source.id, session.id, 'personal')
    assert.equal(moved.id, destination.id)
    assert.equal(state.spaces[0].windows[0].id, source.id)
    assert.equal(source.sessions.length, 2)
    assert.equal(source.selectedSessionId, source.sessions[0].id)
    assert.equal(source.draft, 'Keep the source composer')
    assert.equal(moved.selectedSessionId, existing.id)
    assert.equal(moved.sessions[0].id, session.id)
    assert.equal(getWorktree(state.spaces[1], moved.sessions[0].worktreeId).path, originalPath)
    assert.equal(state.spaces[1].windows.length, targetCount + 1)
    const movedEditor = state.spaces[1].windows.find(item => item.id === editor.id)
    assert.equal(movedEditor.sessionContext.sourceWindowId, destination.id)
    assert.equal(movedEditor.activeFile, 'README.md')
    assert.equal(movedEditor.draft, 'Keep Editor edits')
    assert.equal(movedEditor.sidebarVisible, false)
    assert.equal(movedEditor.worktreeId, moved.sessions[0].worktreeId)
    assert.equal(state.activeSpaceId, 'work')
    const before = JSON.stringify(state)
    assert.throws(() => moveSession(state, source.id, 'missing', 'personal'), /existing session/)
    assert.equal(JSON.stringify(state), before)
    selectWindow({ ...state, activeSpaceId: 'personal' }, destination.id)
    assert.equal(openSessionInEditor({ ...state, activeSpaceId: 'personal' }, session.id), movedEditor)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
  })

  test('loads workstream examples with multiple repositories without changing or duplicating existing work', () => {
    const state = createState()
    const original = JSON.stringify(state)
    assert.equal(loadWorkstreamExamples(state), 2)
    assert.equal(state.activeSpaceId, 'work')
    assert.deepEqual(state.spaces.slice(0, 3), JSON.parse(original).spaces)
    const workstreams = state.spaces.slice(3)
    assert.deepEqual(workstreams.map(space => space.name), ['VS Code experience', 'Markdown tooling'])
    for (const space of workstreams) {
      assert.equal(new Set(space.windows.map(area => area.project)).size, 2)
      assert.equal(space.windows.length, 4)
      const agents = space.windows.filter(area => area.kind === 'agents')
      assert.ok(agents.every(area => area.sessions.length === 2))
      assert.equal(new Set(agents.flatMap(area => area.sessions.map(session => getWorktree(space, session.worktreeId).path))).size, 4)
    }
    const saved = JSON.stringify(state)
    assert.equal(loadWorkstreamExamples(state), 0)
    assert.equal(JSON.stringify(state), saved)
    assert.deepEqual(restoreState(saved), state)
  })

  test('creates distinct worktrees for every new session, including repeated task titles', () => {
    const state = createState()
    const source = activeWindow(state)
    const before = source.sessions.map(session => session.worktreeId)
    const first = addSession(state.spaces[0], source.id, '  Build this feature  ')
    const second = addSession(state.spaces[0], source.id, 'Build this feature')
    const firstTree = getWorktree(state.spaces[0], first.worktreeId)
    const secondTree = getWorktree(state.spaces[0], second.worktreeId)
    assert.equal(firstTree.kind, 'worktree')
    assert.equal(secondTree.kind, 'worktree')
    assert.notEqual(firstTree.path, secondTree.path)
    assert.notEqual(firstTree.branch, secondTree.branch)
    assert.equal(firstTree.name, 'Build this feature')
    assert.deepEqual(source.sessions.slice(2).map(session => session.worktreeId), before)
    assert.throws(() => addSession(state.spaces[0], 'missing', 'Task'), /Agents work area/)
    assert.throws(() => addSession(state.spaces[0], source.id, ' '), /enter a task/)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
  })

  test('gives each linked-worktree session its own Editor and reuses only that session’s Editor', () => {
    const state = createState()
    const source = activeWindow(state)
    const session = source.sessions[0]
    const checkout = getWorktree(state.spaces[0], session.worktreeId)
    checkout.branch = 'main'
    const unassociated = addWindow(state, source.project, 'editor', { worktreeId: checkout.id })
    selectWindow(state, source.id)
    const first = openSessionInEditor(state, session.id)
    assert.notEqual(first.id, unassociated.id)
    first.draft = 'Session one draft'
    first.activeFile = 'README.md'
    const secondSession = addSession(state.spaces[0], source.id, 'A second worktree task')
    selectWindow(state, source.id)
    const second = openSessionInEditor(state, secondSession.id)
    assert.notEqual(second.id, first.id)
    assert.notEqual(second.id, unassociated.id)
    assert.notEqual(first.worktreeId, second.worktreeId)
    selectWindow(state, source.id)
    assert.equal(openSessionInEditor(state, session.id), first)
    selectWindow(state, source.id)
    assert.equal(openSessionInEditor(state, secondSession.id), second)
    assert.equal(state.spaces[0].windows.length, 4)
    assert.equal(first.sessionContext.sessionId, session.id)
    assert.equal(second.sessionContext.sessionId, secondSession.id)
    assert.equal(first.draft, 'Session one draft')
    assert.equal(first.activeFile, 'README.md')
    assert.equal(unassociated.sessionContext, null)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
  })

  test('loads distinct worktree examples on demand without resetting saved projects or duplicating them', () => {
    const state = createState()
    const original = JSON.stringify(state.spaces[0].windows)
    assert.equal(loadExampleProjects(state), 3)
    assert.equal(state.activeSpaceId, 'work')
    assert.equal(state.spaces[0].activeWindowId, 'work-agents')
    assert.equal(JSON.stringify(state.spaces[0].windows.slice(0, 1)), original)
    for (const project of exampleProjects) {
      const editors = state.spaces[0].windows.filter(area => area.project === project && area.kind === 'editor')
      const agents = state.spaces[0].windows.find(area => area.project === project && area.kind === 'agents')
      const trees = state.spaces[0].worktrees.filter(tree => tree.project === project)
      assert.equal(editors.length, 1)
      assert.equal(trees.filter(tree => tree.kind === 'project').length, 1)
      assert.equal(trees.filter(tree => tree.kind === 'worktree').length, 2)
      assert.ok(agents.sessions.every(session => getWorktree(state.spaces[0], session.worktreeId).kind === 'worktree'))
      const linked = trees.find(tree => tree.kind === 'worktree')
      const profile = getProjectContent(project)
      assert.notEqual(profile.files[0].content, getProjectContent(project, linked.branch).files[0].content)
    }
    const saved = JSON.stringify(state)
    assert.equal(loadExampleProjects(state), 0)
    assert.equal(JSON.stringify(state), saved)
    assert.deepEqual(restoreState(saved), state)
  })

  for (const sharedKind of ['project', 'worktree']) {
    test(`migrates shared ${sharedKind} session folders without losing content or associated Editor state`, () => {
      const state = createState()
      state.version = 4
      const space = state.spaces[0]
      const source = space.windows[0]
      const shared = space.worktrees.find(tree => tree.kind === sharedKind)
      source.sessions[0].worktreeId = shared.id
      source.sessions[1].worktreeId = shared.id
      source.draft = 'Keep the source draft'
      const editor = addWindow(state, source.project, 'editor', { worktreeId: shared.id })
      editor.sessionContext = { sessionId: source.sessions[1].id, sourceWindowId: source.id, title: source.sessions[1].title }
      editor.draft = 'Keep the Editor draft'
      editor.activeFile = 'README.md'
      const sessions = source.sessions.map(({ worktreeId, ...session }) => session)
      const migrated = restoreState(JSON.stringify(state))
      const nextSpace = migrated.spaces[0]
      const nextSource = nextSpace.windows[0]
      assert.equal(migrated.version, 5)
      assert.deepEqual(nextSource.sessions.map(({ worktreeId, ...session }) => session), sessions)
      assert.equal(new Set(nextSource.sessions.map(session => getWorktree(nextSpace, session.worktreeId).path)).size, 3)
      assert.ok(nextSource.sessions.every(session => getWorktree(nextSpace, session.worktreeId).kind === 'worktree'))
      if (sharedKind === 'worktree') assert.equal(nextSource.sessions[0].worktreeId, shared.id)
      const nextEditor = nextSpace.windows.find(area => area.id === editor.id)
      assert.equal(nextEditor.worktreeId, nextSource.sessions[1].worktreeId)
      assert.equal(nextEditor.draft, editor.draft)
      assert.equal(nextEditor.activeFile, editor.activeFile)
      assert.equal(nextEditor.sessionContext.sessionId, source.sessions[1].id)
      assert.equal(nextSource.draft, source.draft)
      assert.equal(nextSpace.activeWindowId, space.activeWindowId)
      assert.deepEqual(restoreState(JSON.stringify(migrated)), migrated)
    })
  }

  test('rejects local or shared session checkouts in current-version saved data rather than silently rewriting them', () => {
    for (const worktreeId of [createState().spaces[0].windows[0].worktreeId, createState().spaces[0].windows[0].sessions[1].worktreeId]) {
      const state = createState()
      state.spaces[0].windows[0].sessions[0].worktreeId = worktreeId
      assert.throws(() => restoreState(JSON.stringify(state)), /distinct linked worktrees/)
    }
  })

  test('restores project-specific file selections and continues accepting legacy placeholder tabs', () => {
    const state = createState()
    state.spaces[0].windows[0].activeFile = 'quickInput.css'
    state.spaces[1].windows[0].activeFile = 'garden.md'
    state.spaces[2].windows[0].activeFile = 'CollectionGrid.tsx'
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    state.spaces[1].windows[0].activeFile = 'space.ts'
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    state.spaces[1].windows[0].activeFile = 'unknown-file.md'
    assert.throws(() => restoreState(JSON.stringify(state)), /unsupported or invalid format/)
  })

  test('keeps custom projects usable when their names match object prototype properties', () => {
    const state = createState()
    const editor = addWindow(state, '__proto__', 'editor')
    assert.equal(editor.activeFile, 'space.ts')
    assert.equal(activeWindow(restoreState(JSON.stringify(state))).project, '__proto__')
  })

  test('does not turn a normal project branch into a linked worktree during migration', () => {
    const state = createState()
    state.spaces[0].windows[0].sessions = []
    state.spaces[0].windows[0].selectedSessionId = null
    const area = addWindow(state, 'plain-project', 'editor')
    area.branch = 'feature/topic'
    const raw = JSON.stringify(state, (key, value) =>
      ['worktrees', 'worktreeId'].includes(key) ? undefined : key === 'version' ? 3 : value)
    const migrated = restoreState(raw)
    const space = migrated.spaces[0]
    const editor = space.windows.find(item => item.id === area.id)
    const checkout = getWorktree(space, editor.worktreeId)
    assert.equal(checkout.path, '~/Projects/plain-project')
    assert.equal(checkout.branch, 'feature/topic')
    assert.equal(editor.branch, 'feature/topic')
    assert.equal(openWorktreeCount(space), 0)
  })

  test('counts linked worktrees independently of branch names and excludes the project folder', () => {
    const state = createState()
    const space = state.spaces[0]
    const source = space.windows[0]
    source.sessions = []
    source.selectedSessionId = null
    assert.equal(openWorktreeCount(space), 0)
    const tree = space.worktrees.find(tree => tree.kind === 'worktree')
    tree.branch = 'main'
    addWindow(state, 'vscode', 'editor', { worktreeId: tree.id })
    assert.equal(openWorktreeCount(space), 1)
    for (const collection of state.spaces) for (const entry of collection.worktrees) delete entry.kind
    assert.equal(openWorktreeCount(restoreState(JSON.stringify(state)).spaces[0]), 1)
  })

  test('migrates version 3 without changing existing context and adds shared checkout references', () => {
    const state = createState()
    state.spaces[0].windows[0].draft = 'Preserve this legacy draft'
    const legacy = JSON.stringify(state, (key, value) =>
      ['worktrees', 'worktreeId'].includes(key) ? undefined : key === 'version' ? 3 : value)
    const migrated = restoreState(legacy)
    const context = JSON.stringify(migrated, (key, value) =>
      ['worktrees', 'worktreeId'].includes(key) ? undefined : key === 'version' ? 3 : value)
    assert.deepEqual(JSON.parse(context), JSON.parse(legacy))
    const space = migrated.spaces[0]
    assert.equal(getWorktree(space, space.windows[0].worktreeId).branch, 'main')
    assert.ok(space.windows[0].sessions.every(session => getWorktree(space, session.worktreeId).kind === 'worktree'))
    assert.ok(space.worktrees.some(tree => tree.branch === 'ui/command-palette'))
  })

  test('hands each session’s exact worktree to its own Editor', () => {
    const state = createState()
    const space = state.spaces[0]
    const source = activeWindow(state)
    const session = source.sessions[0]
    const first = openSessionInEditor(state, session.id)
    assert.equal(first.worktreeId, session.worktreeId)
    const next = source.sessions[1]
    selectWindow(state, source.id)
    const second = openSessionInEditor(state, next.id)
    assert.notEqual(first.id, second.id)
    assert.equal(second.worktreeId, next.worktreeId)
    assert.equal(second.branch, getWorktree(space, next.worktreeId).branch)
    assert.notEqual(first.worktreeId, next.worktreeId)
  })

  test('opens a selected existing checkout and rejects a worktree from another project', () => {
    const state = createState()
    const tree = state.spaces[0].worktrees.find(tree => tree.branch === 'fix/keyboard-focus')
    const area = addWindow(state, 'vscode', 'editor', { worktreeId: tree.id })
    assert.equal(area.worktreeId, tree.id)
    assert.equal(area.branch, tree.branch)
    const snapshot = JSON.stringify(state)
    assert.throws(() => addWindow(state, 'different', 'editor', { worktreeId: tree.id }), /selected project/)
    assert.equal(JSON.stringify(state), snapshot)
  })

  test('restores each Collection’s last-used window and independent context', () => {
    const state = createState()
    const workWindow = activeWindow(state)
    workWindow.draft = 'Keep this thought'
    selectSpace(state, 'personal')
    const personalWindow = activeWindow(state)
    personalWindow.activeFile = 'README.md'
    selectSpace(state, 'work')
    assert.equal(activeWindow(state), workWindow)
    assert.equal(activeWindow(state).draft, 'Keep this thought')
    selectSpace(state, 'personal')
    assert.equal(activeWindow(state), personalWindow)
    assert.equal(activeWindow(state).activeFile, 'README.md')
    assert.throws(() => selectSpace(state, 'missing'), /not found/)
  })

  test('uses the creation choice for the starting window without imposing a window limit', () => {
    const state = createState()
    for (const windowKind of ['editor', 'agents']) {
      const space = saveSpace(state, { name: `  Weekend ${windowKind}  `, description: '  Small ideas  ', color: 'green', windowKind })
      assert.equal(state.activeSpaceId, space.id)
      assert.equal(space.name, `Weekend ${windowKind}`)
      assert.equal(space.description, 'Small ideas')
      assert.equal(space.startingWindowKind, windowKind)
      assert.equal(space.windows.length, 1)
      assert.equal(activeWindow(state).kind, windowKind)
      assert.equal(activeWindow(state).project, space.name)
      assert.deepEqual(activeWindow(state).sessions, [])
      addWindow(state, 'Another project', windowKind === 'agents' ? 'editor' : 'agents')
      assert.equal(space.windows.length, 2)
    }
  })

  test('editing collection identity preserves its window type, draft, and sessions', () => {
    const state = createState()
    const window = activeWindow(state)
    window.draft = 'Keep this thought'
    saveSpace(state, { id: 'work', name: 'Day job', description: 'Still work', color: 'purple', windowKind: 'editor' })
    assert.equal(activeWindow(state), window)
    assert.equal(activeSpace(state).startingWindowKind, 'agents')
    assert.equal(window.kind, 'agents')
    assert.equal(window.draft, 'Keep this thought')
    assert.equal(window.sessions.length, 3)
  })

  test('persists appearance independently and preserves it when updating only Collection details', () => {
    const state = createState()
    const originalWindow = activeWindow(state)
    const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0u0AAAAASUVORK5CYII='
    saveSpace(state, { id: 'work', name: 'Work', description: 'Custom appearance', color: 'purple', theme: 'light', image })
    assert.equal(activeSpace(state).theme, 'light')
    assert.equal(activeSpace(state).image, image)
    assert.equal(activeWindow(state), originalWindow)
    assert.equal(state.spaces[1].theme, 'dark')
    assert.equal(state.spaces[1].image, null)
    saveSpace(state, { id: 'work', name: 'Day job', description: '', color: 'blue' })
    assert.equal(activeSpace(state).theme, 'light')
    assert.equal(activeSpace(state).image, image)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    saveSpace(state, { id: 'work', name: 'Day job', description: '', color: 'blue', image: null })
    assert.equal(activeSpace(state).image, null)
  })

  test('rejects invalid theme and image inputs without changing a Collection', () => {
    const state = createState()
    const original = JSON.stringify(state)
    for (const values of [
      { theme: 'missing' }, { theme: null }, { image: 'https://example.com/image.png' },
      { image: 'data:image/svg+xml;base64,c3Zn' }, { image: 'data:image/png;base64,' },
      { image: `data:image/png;base64,${'a'.repeat(100000)}` },
    ]) {
      assert.throws(() => saveSpace(state, { id: 'work', name: 'Work', description: '', color: 'blue', ...values }))
      assert.equal(JSON.stringify(state), original)
    }
  })

  test('rejects invalid names and window types without mutating state', () => {
    const state = createState()
    const before = JSON.stringify(state)
    for (const name of ['', '   ', ' work ', 'x'.repeat(41)]) {
      assert.throws(() => saveSpace(state, { name, description: '', color: 'blue', windowKind: 'editor' }))
    }
    for (const windowKind of [undefined, 'terminal', '']) {
      assert.throws(() => saveSpace(state, { name: 'Weekend', description: '', color: 'green', windowKind }), /Editor or Agents/)
    }
    assert.equal(JSON.stringify(state), before)
    saveSpace(state, { id: 'work', name: 'Work', description: 'Still work', color: 'purple' })
    assert.equal(activeSpace(state).color, 'purple')
  })

  test('deleting an active space selects a remaining space and protects the last one', () => {
    const state = createState()
    removeSpace(state, 'work')
    assert.equal(state.activeSpaceId, 'personal')
    removeSpace(state, 'side-gig')
    assert.throws(() => removeSpace(state, 'personal'), /at least one/)
    assert.equal(state.spaces.length, 1)
  })

  test('round-trips remembered windows, drafts, pending-input sessions, and new collections', () => {
    const state = createState()
    state.spaces[0].windows[0].draft = 'A saved thought'
    state.spaces[0].windows[0].sidebarVisible = false
    state.spaces[0].windows[0].sessions[1].status = 'input'
    saveSpace(state, { name: 'New context', description: '', color: 'pink', windowKind: 'editor' })
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    assert.deepEqual(restoreState(null), createState())
  })

  test('restores older saved windows with their native sidebars visible', () => {
    const state = createState()
    for (const space of state.spaces) {
      delete space.theme
      delete space.image
      for (const window of space.windows) delete window.sidebarVisible
    }
    assert.deepEqual(restoreState(JSON.stringify(state)), createState())
  })

  test('preserves all existing multi-window data and its last-used window during migration', () => {
    const state = createState()
    state.version = 1
    const selected = { ...createState().spaces[1].windows[0], id: 'selected-editor', draft: 'Keep my draft', activeFile: 'README.md', sidebarVisible: false }
    state.spaces[0].windows.push(selected)
    state.spaces[0].activeWindowId = selected.id
    state.spaces[2].windows = []
    state.spaces[2].activeWindowId = null
    const raw = JSON.stringify(state)
    const migrated = restoreState(raw)
    assert.equal(migrated.version, 5)
    assert.equal(migrated.activeSpaceId, 'work')
    const { worktreeId, ...selectedContext } = selected
    const { worktreeId: migratedWorktreeId, ...migratedContext } = activeWindow(migrated)
    assert.deepEqual(migratedContext, selectedContext)
    assert.ok(migratedWorktreeId)
    assert.equal(migrated.spaces[0].windows.length, 2)
    assert.equal(migrated.spaces[2].windows.length, 0)
    assert.equal(migrated.spaces[2].activeWindowId, null)
    assert.equal(JSON.stringify(state), raw)
    state.spaces[0].activeWindowId = 'missing'
    assert.throws(() => restoreState(JSON.stringify(state)), /invalid format/)
  })

  test('migrates singleton Collections without changing their window, files, sessions, or draft', () => {
    const original = createState()
    original.spaces[0].windows[0].draft = 'Keep this thought'
    const singleton = {
      ...original, version: 2,
      spaces: original.spaces.map(({ windows, activeWindowId, startingWindowKind, ...space }) => ({
        ...space, window: windows[0],
      })),
    }
    assert.deepEqual(restoreState(JSON.stringify(singleton)), original)
  })

  test('opens or reuses a session-specific Editor in the same Collection without duplicating the session', () => {
    const state = createState()
    const agents = activeWindow(state)
    agents.draft = 'Keep my follow-up'
    agents.branch = 'session-worktree'
    const originalSessions = JSON.stringify(agents.sessions)
    const session = agents.sessions[0]
    const editor = openSessionInEditor(state, session.id)
    assert.equal(state.activeSpaceId, 'work')
    assert.equal(activeWindow(state), editor)
    assert.equal(editor.project, agents.project)
    assert.equal(editor.worktreeId, session.worktreeId)
    assert.equal(editor.branch, activeSpace(state).worktrees.find(tree => tree.id === session.worktreeId).branch)
    assert.deepEqual(editor.sessionContext, { sessionId: session.id, sourceWindowId: agents.id, title: session.title })
    assert.equal(JSON.stringify(agents.sessions), originalSessions)
    assert.equal(agents.draft, 'Keep my follow-up')
    selectWindow(state, agents.id)
    assert.equal(openSessionInEditor(state, session.id), editor)
    assert.equal(activeSpace(state).windows.length, 2)
    selectWindow(state, agents.id)
    assert.notEqual(openSessionInEditor(state, agents.sessions[1].id).id, editor.id)
    assert.equal(activeSpace(state).windows.length, 3)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    assert.throws(() => openSessionInEditor(state, session.id), /Agents work area/)
  })

  test('moves window state, closes windows independently, and keeps an empty Collection usable', () => {
    const state = createState()
    const window = addWindow(state, 'website', 'editor')
    window.activeFile = 'README.md'
    moveWindow(state, window.id, 'personal')
    assert.equal(state.activeSpaceId, 'work')
    assert.equal(activeSpace(state).windows.length, 1)
    selectSpace(state, 'personal')
    assert.equal(activeWindow(state), window)
    assert.equal(window.activeFile, 'README.md')
    assert.throws(() => moveWindow(state, window.id, 'personal'), /different Collection/)
    closeWindow(state, window.id)
    assert.equal(activeWindow(state).id, 'personal-editor')
    closeWindow(state, 'personal-editor')
    assert.equal(activeWindow(state), undefined)
    assert.equal(activeSpace(state).activeWindowId, null)
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    assert.equal(addWindow(state, 'fresh-project', 'agents'), activeWindow(state))
    assert.throws(() => closeWindow(state, 'missing'), /not found/)
    assert.throws(() => selectWindow(state, 'work-agents'), /not found/)
    assert.throws(() => addWindow(state, ' ', 'editor'), /workspace/)
  })

  test('can explicitly open another Editor without reusing or modifying a session companion', () => {
    const state = createState()
    const source = activeWindow(state)
    const sessionId = source.sessions[0].id
    const first = openSessionInEditor(state, sessionId)
    first.activeFile = 'README.md'
    const snapshot = JSON.stringify(first)
    selectWindow(state, source.id)
    const second = openSessionInEditor(state, sessionId, { forceNew: true })
    assert.notEqual(second.id, first.id)
    assert.equal(JSON.stringify(first), snapshot)
    assert.equal(activeSpace(state).windows.length, 3)
    assert.equal(second.sessionContext.sessionId, sessionId)
    assert.equal(source.sessions.length, 3)
  })

  test('updates a selected Editor project and session context without replacing its files or draft', () => {
    const state = createState()
    const source = activeWindow(state)
    source.branch = 'agent-branch'
    const editor = addWindow(state, 'Old project', 'editor')
    editor.activeFile = 'README.md'
    editor.draft = 'Keep this draft'
    editor.sidebarVisible = false
    selectWindow(state, source.id)
    const before = JSON.stringify(state)
    for (const editorId of [source.id, 'personal-editor', 'missing']) {
      assert.throws(() => openSessionInEditor(state, source.sessions[0].id, { editorId }), /Editor work area not found/)
      assert.equal(JSON.stringify(state), before)
    }
    const result = openSessionInEditor(state, source.sessions[0].id, { editorId: editor.id })
    assert.equal(result, editor)
    assert.equal(editor.project, source.project)
    assert.equal(editor.branch, activeSpace(state).worktrees.find(tree => tree.id === source.sessions[0].worktreeId).branch)
    assert.deepEqual(editor.sessionContext, { sourceWindowId: source.id, sessionId: source.sessions[0].id, title: source.sessions[0].title })
    assert.equal(editor.activeFile, 'README.md')
    assert.equal(editor.draft, 'Keep this draft')
    assert.equal(editor.sidebarVisible, false)
    assert.equal(activeSpace(state).windows.length, 2)
    assert.equal(activeWindow(state), editor)
  })

  test('rejects corrupt saved state, stale references, and duplicate identifiers', () => {
    assert.throws(() => restoreState('{broken'))
    assert.throws(() => restoreState('null'))
    for (const mutate of [
      state => { state.version = 6 },
      state => { state.spaces = [] },
      state => { state.activeSpaceId = 'missing' },
      state => { delete state.spaces[0].windows },
      state => { state.spaces[0].activeWindowId = 'missing' },
      state => { state.spaces[0].startingWindowKind = 'other' },
      state => { state.spaces[0].theme = 'missing' },
      state => { state.spaces[0].image = 'https://example.com/image.png' },
      state => { state.spaces[0].windows[0].kind = 'other' },
      state => { state.spaces[0].windows[0].sessions[0].status = 'other' },
      state => { state.spaces[0].windows[0].selectedSessionId = 'missing' },
      state => { state.spaces[0].windows[0].sidebarVisible = 'yes' },
      state => { state.spaces[1].windows[0].sessionContext = {} },
      state => { state.spaces[0].windows[0].worktreeId = 'missing' },
      state => { state.spaces[0].windows[0].sessions[0].worktreeId = 'missing' },
      state => { state.spaces[0].worktrees[0].path = '' },
      state => { state.spaces[0].worktrees[0].kind = 'invalid' },
      state => { state.spaces[1].id = state.spaces[0].id },
    ]) {
      const state = createState()
      mutate(state)
      assert.throws(() => restoreState(JSON.stringify(state)), /invalid (?:format|worktree)/)
    }
  })
})
