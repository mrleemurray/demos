import assert from 'node:assert/strict'
import { suite, test } from 'vitest'
import { nextTick, reactive } from 'vue'
import { activeSessions, addSession, addWindow, closeWindow, createState, getWorktree, markSessionDone, moveSession, moveWindow, openSessionInEditor, selectWindow, storageKey } from './model.js'
import { createStateSync, mergeStateChanges } from './stateSync.js'

const clone = value => JSON.parse(JSON.stringify(value))

function storageFor(state) {
  let raw = JSON.stringify(state)
  return {
    getItem: () => raw,
    setItem(key, value) { assert.equal(key, storageKey); raw = value },
    read: () => JSON.parse(raw),
  }
}

suite('Independent window state', () => {
  test('preserves concurrent Editor drafts while a project folder changes branch', () => {
    const base = createState()
    const editor = addWindow(base, 'vscode', 'editor')
    const linked = addWindow(base, 'vscode', 'editor', { worktreeId: base.spaces[0].windows[0].sessions[0].worktreeId })
    const changed = clone(base)
    const edited = clone(base)
    const created = addWindow(changed, 'vscode', 'editor', { branch: 'fix/keyboard-focus' })
    edited.spaces[0].windows.find(area => area.id === editor.id).draft = 'Concurrent project Editor draft'
    edited.spaces[0].windows.find(area => area.id === linked.id).draft = 'Concurrent worktree Editor draft'
    for (const [local, remote] of [[changed, edited], [edited, changed]]) {
      const merged = mergeStateChanges(base, local, remote)
      const savedEditor = merged.spaces[0].windows.find(area => area.id === editor.id)
      const savedLinked = merged.spaces[0].windows.find(area => area.id === linked.id)
      assert.equal(savedEditor.branch, 'fix/keyboard-focus')
      assert.equal(savedEditor.draft, 'Concurrent project Editor draft')
      assert.equal(savedLinked.branch, linked.branch)
      assert.equal(savedLinked.draft, 'Concurrent worktree Editor draft')
      assert.ok(merged.spaces[0].windows.some(area => area.id === created.id))
    }
  })

  test('keeps completion and concurrent session or Editor edits without restoring a hidden selection', () => {
    const base = createState()
    const source = base.spaces[0].windows[0]
    const session = source.sessions[0]
    const editor = openSessionInEditor(base, session.id)
    selectWindow(base, source.id)
    const completed = clone(base)
    const edited = clone(base)
    markSessionDone(completed.spaces[0], source.id, session.id)
    edited.spaces[0].windows[0].sessions[0].detail = 'Keep the final session result'
    edited.spaces[0].windows.find(area => area.id === editor.id).draft = 'Keep concurrent Editor notes'
    for (const [local, remote] of [[completed, edited], [edited, completed]]) {
      const merged = mergeStateChanges(base, local, remote)
      const area = merged.spaces[0].windows[0]
      assert.equal(area.sessions.find(item => item.id === session.id).status, 'done')
      assert.equal(area.sessions.find(item => item.id === session.id).detail, 'Keep the final session result')
      assert.equal(area.sessions.length, 3)
      assert.equal(activeSessions(area).some(item => item.id === session.id), false)
      assert.equal(area.selectedSessionId, source.sessions[1].id)
      assert.equal(merged.spaces[0].windows.find(area => area.id === editor.id).draft, 'Keep concurrent Editor notes')
    }
  })

  test('keeps concurrent session and Editor edits when they move to another Collection', () => {
    const base = createState()
    const source = base.spaces[0].windows[0]
    const session = source.sessions[0]
    const editor = openSessionInEditor(base, session.id)
    selectWindow(base, source.id)
    const moved = clone(base)
    const edited = clone(base)
    const destination = moveSession(moved, source.id, session.id, 'personal')
    edited.spaces[0].windows.find(area => area.id === editor.id).draft = 'Concurrent Editor edit'
    edited.spaces[0].windows[0].sessions[0].detail = 'Updated session result'
    for (const [local, remote] of [[moved, edited], [edited, moved]]) {
      const merged = mergeStateChanges(base, local, remote)
      const area = merged.spaces[1].windows.find(area => area.id === destination.id)
      const savedEditor = merged.spaces[1].windows.find(area => area.id === editor.id)
      assert.equal(area.sessions.find(item => item.id === session.id).detail, 'Updated session result')
      assert.equal(savedEditor.draft, 'Concurrent Editor edit')
      assert.equal(savedEditor.sessionContext.sourceWindowId, destination.id)
      assert.equal(merged.spaces[0].windows[0].sessions.some(item => item.id === session.id), false)
    }
  })

  test('merges concurrent uses of the same project checkout without duplicate catalogs', () => {
    const base = createState()
    const local = clone(base)
    const remote = clone(base)
    const first = addWindow(local, 'shared-project', 'editor')
    const second = addWindow(remote, 'shared-project', 'editor')
    const result = mergeStateChanges(base, local, remote)
    assert.equal(result.spaces[0].worktrees.filter(tree => tree.project === 'shared-project').length, 1)
    assert.ok(result.spaces[0].windows.some(area => area.id === first.id))
    assert.ok(result.spaces[0].windows.some(area => area.id === second.id))
  })

  test('keeps a concurrent new session and its worktree when the Agents work area moves Collections', () => {
    const base = createState()
    const local = clone(base)
    const remote = clone(base)
    const created = addSession(local.spaces[0], 'work-agents', 'Concurrent task')
    const tree = getWorktree(local.spaces[0], created.worktreeId)
    moveWindow(remote, 'work-agents', 'personal')
    const result = mergeStateChanges(base, local, remote)
    const target = result.spaces.find(space => space.id === 'personal')
    const session = target.windows.find(area => area.id === 'work-agents').sessions.find(session => session.id === created.id)
    assert.equal(getWorktree(target, session.worktreeId).path, tree.path)
    assert.equal(getWorktree(target, session.worktreeId).branch, tree.branch)
    assert.notEqual(session.worktreeId, tree.id)
  })

  test('merges edits to different work areas and Collection appearance without overwriting either', () => {
    const base = createState()
    const local = clone(base)
    const remote = clone(base)
    local.spaces[0].windows[0].draft = 'A local draft'
    remote.spaces[1].windows[0].activeFile = 'README.md'
    remote.spaces[0].theme = 'light'
    const result = mergeStateChanges(base, local, remote)
    assert.equal(result.spaces[0].windows[0].draft, 'A local draft')
    assert.equal(result.spaces[1].windows[0].activeFile, 'README.md')
    assert.equal(result.spaces[0].theme, 'light')
  })

  test('preserves work-area edits when another window moves that work area to another Collection', () => {
    const base = createState()
    const moved = clone(base)
    const edited = clone(base)
    moveWindow(moved, 'work-agents', 'personal')
    edited.spaces[0].windows[0].draft = 'Keep this through the move'
    edited.spaces[0].windows[0].sessions[0].status = 'done'
    for (const [local, remote] of [[moved, edited], [edited, moved]]) {
      const result = mergeStateChanges(base, local, remote)
      assert.equal(result.spaces[0].windows.length, 0)
      const area = result.spaces[1].windows.find(item => item.id === 'work-agents')
      assert.equal(area.draft, 'Keep this through the move')
      assert.equal(area.sessions[0].status, 'done')
    }
  })

  test('retains concurrent additions and does not resurrect a work area closed elsewhere', () => {
    const base = createState()
    const local = clone(base)
    const remote = clone(base)
    const localArea = addWindow(local, 'local', 'editor')
    const remoteArea = addWindow(remote, 'remote', 'agents')
    const result = mergeStateChanges(base, local, remote)
    assert.deepEqual(new Set(result.spaces[0].windows.map(area => area.id)),
      new Set(['work-agents', localArea.id, remoteArea.id]))
    const closed = clone(base)
    closeWindow(closed, 'work-agents')
    const edited = clone(base)
    edited.spaces[0].windows[0].draft = 'Late edit'
    const reconciled = mergeStateChanges(base, edited, closed)
    assert.equal(reconciled.spaces[0].windows.length, 0)
    assert.equal(reconciled.spaces[0].activeWindowId, null)
  })

  test('keeps edits made while waiting for the storage lock and merges the latest saved data', async () => {
    const initial = createState()
    const state = reactive(clone(initial))
    const storage = storageFor(initial)
    let unlock
    let first = true
    const locks = { async request(name, callback) {
      assert.equal(name, storageKey)
      if (first) {
        first = false
        await new Promise(resolve => { unlock = resolve })
      }
      return callback()
    } }
    const sync = createStateSync(state, { storage, locks, events: new EventTarget(), onError: assert.fail })
    try {
      state.spaces[0].windows[0].draft = 'First'
      await nextTick()
      state.spaces[0].windows[0].draft = 'Latest typing'
      state.spaces[1].windows[0].activeFile = 'README.md'
      const remote = storage.read()
      remote.spaces[0].theme = 'light'
      storage.setItem(storageKey, JSON.stringify(remote))
      unlock()
      assert.equal(await sync.save(), true)
      assert.equal(storage.read().spaces[0].windows[0].draft, 'Latest typing')
      assert.equal(storage.read().spaces[1].windows[0].activeFile, 'README.md')
      assert.equal(state.spaces[0].theme, 'light')
    } finally { sync.dispose() }
  })

  test('applies remote edits without changing local navigation or writing an echo', async () => {
    const initial = createState()
    const state = reactive(clone(initial))
    const storage = storageFor(initial)
    const events = new EventTarget()
    let writes = 0
    const setItem = storage.setItem
    storage.setItem = (...args) => { writes++; setItem(...args) }
    const sync = createStateSync(state, {
      storage, events, locks: { request: async (name, callback) => callback() }, onError: assert.fail,
    })
    try {
      state.activeSpaceId = 'personal'
      await sync.save()
      const remote = storage.read()
      remote.activeSpaceId = 'work'
      remote.spaces[0].windows[0].draft = 'Edited in another window'
      setItem(storageKey, JSON.stringify(remote))
      const before = writes
      const event = new Event('storage')
      Object.defineProperties(event, { key: { value: storageKey }, storageArea: { value: storage } })
      events.dispatchEvent(event)
      await nextTick()
      assert.equal(state.activeSpaceId, 'personal')
      assert.equal(state.spaces[0].windows[0].draft, 'Edited in another window')
      assert.equal(writes, before)
    } finally { sync.dispose() }
  })

  test('reports failed writes and retains the unsaved changes for retry', async () => {
    const state = reactive(createState())
    const storage = storageFor(state)
    const write = storage.setItem
    const errors = []
    storage.setItem = () => { throw new Error('Storage full') }
    const sync = createStateSync(state, {
      storage, events: new EventTarget(), locks: { request: async (name, callback) => callback() },
      onError: error => errors.push(error),
    })
    try {
      state.spaces[0].windows[0].draft = 'Do not lose this'
      assert.equal(await sync.save(), false)
      assert.ok(errors.length > 0)
      assert.equal(storage.read().spaces[0].windows[0].draft, '')
      storage.setItem = write
      assert.equal(await sync.save(), true)
      assert.equal(storage.read().spaces[0].windows[0].draft, 'Do not lose this')
    } finally { sync.dispose() }
  })
})
