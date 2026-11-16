import assert from 'node:assert/strict'
import { suite, test } from 'vitest'
import {
  activeSpace, activeWindow, addWindow, closeWindow, createState, moveWindow,
  openSessionInEditor, removeSpace, restoreState, saveSpace, selectSpace, selectWindow,
} from './model.js'

suite('Spaces model', () => {
  test('restores each Space’s last-used window and independent context', () => {
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

  test('editing space identity preserves its window type, draft, and sessions', () => {
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

  test('round-trips remembered windows, drafts, pending-input sessions, and new spaces', () => {
    const state = createState()
    state.spaceRailVisible = false
    state.spaces[0].windows[0].draft = 'A saved thought'
    state.spaces[0].windows[0].sidebarVisible = false
    state.spaces[0].windows[0].sessions[1].status = 'input'
    saveSpace(state, { name: 'New context', description: '', color: 'pink', windowKind: 'editor' })
    assert.deepEqual(restoreState(JSON.stringify(state)), state)
    assert.deepEqual(restoreState(null), createState())
  })

  test('restores older saved windows with their native sidebars visible', () => {
    const state = createState()
    delete state.spaceRailVisible
    for (const space of state.spaces) {
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
    assert.equal(migrated.version, 3)
    assert.equal(migrated.activeSpaceId, 'work')
    assert.deepEqual(activeWindow(migrated), selected)
    assert.equal(migrated.spaces[0].windows.length, 2)
    assert.equal(migrated.spaces[2].windows.length, 0)
    assert.equal(migrated.spaces[2].activeWindowId, null)
    assert.equal(JSON.stringify(state), raw)
    state.spaces[0].activeWindowId = 'missing'
    assert.throws(() => restoreState(JSON.stringify(state)), /invalid format/)
  })

  test('migrates singleton Spaces without changing their window, files, sessions, or draft', () => {
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

  test('opens or reuses a session-specific Editor in the same Space without duplicating the session', () => {
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
    assert.equal(editor.branch, agents.branch)
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

  test('moves window state, closes windows independently, and keeps an empty Space usable', () => {
    const state = createState()
    const window = addWindow(state, 'website', 'editor')
    window.activeFile = 'README.md'
    moveWindow(state, window.id, 'personal')
    assert.equal(state.activeSpaceId, 'work')
    assert.equal(activeSpace(state).windows.length, 1)
    selectSpace(state, 'personal')
    assert.equal(activeWindow(state), window)
    assert.equal(window.activeFile, 'README.md')
    assert.throws(() => moveWindow(state, window.id, 'personal'), /different Space/)
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

  test('rejects corrupt saved state, stale references, and duplicate identifiers', () => {
    assert.throws(() => restoreState('{broken'))
    assert.throws(() => restoreState('null'))
    for (const mutate of [
      state => { state.version = 4 },
      state => { state.spaceRailVisible = 'yes' },
      state => { state.spaces = [] },
      state => { state.activeSpaceId = 'missing' },
      state => { delete state.spaces[0].windows },
      state => { state.spaces[0].activeWindowId = 'missing' },
      state => { state.spaces[0].startingWindowKind = 'other' },
      state => { state.spaces[0].windows[0].kind = 'other' },
      state => { state.spaces[0].windows[0].sessions[0].status = 'other' },
      state => { state.spaces[0].windows[0].selectedSessionId = 'missing' },
      state => { state.spaces[0].windows[0].sidebarVisible = 'yes' },
      state => { state.spaces[1].windows[0].sessionContext = {} },
      state => { state.spaces[1].id = state.spaces[0].id },
    ]) {
      const state = createState()
      mutate(state)
      assert.throws(() => restoreState(JSON.stringify(state)), /invalid format/)
    }
  })
})
