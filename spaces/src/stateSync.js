import { watch } from 'vue'
import { activeSessions, reconcileWorktreeReferences, restoreState, storageKey } from './model.js'

const copy = value => JSON.parse(JSON.stringify(value))
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right)

function entities(state) {
  const spaces = []
  const windows = []
  const sessions = []
  const worktrees = []
  for (const { windows: areas, worktrees: checkouts, ...space } of state.spaces) {
    spaces.push({ id: space.id, parent: null, value: space })
    for (const tree of checkouts) worktrees.push({ id: tree.id, parent: space.id, value: tree })
    for (const { sessions: tasks, ...area } of areas) {
      windows.push({ id: area.id, parent: space.id, value: area })
      for (const session of tasks) sessions.push({ id: session.id, parent: area.id, value: session })
    }
  }
  return { spaces, windows, sessions, worktrees }
}

function mergeEntities(base, local, remote) {
  const before = new Map(base.map(item => [item.id, item]))
  const after = new Map(local.map(item => [item.id, item]))
  const result = remote.filter(item => !before.has(item.id) || after.has(item.id)).map(copy)
  const insertions = []
  for (const item of local) {
    const previous = before.get(item.id)
    const existing = result.find(entry => entry.id === item.id)
    if (!previous) {
      if (existing && equal(existing, item)) continue
      if (existing) throw new Error('A work item with this identity already exists.')
      insertions.push(copy(item))
    } else if (existing) {
      for (const key of new Set([...Object.keys(previous.value), ...Object.keys(item.value)])) {
        if (!equal(previous.value[key], item.value[key])) {
          if (key in item.value) existing.value[key] = copy(item.value[key])
          else delete existing.value[key]
        }
      }
      if (previous.parent !== item.parent) {
        result.splice(result.indexOf(existing), 1)
        insertions.push({ ...existing, parent: item.parent })
      }
    }
  }
  for (const item of insertions) {
    const index = local.findIndex(entry => entry.id === item.id)
    const next = local.slice(index + 1).find(entry => entry.parent === item.parent &&
      result.some(saved => saved.id === entry.id && saved.parent === item.parent))
    const position = next ? result.findIndex(entry => entry.id === next.id) : result.length
    result.splice(position, 0, item)
  }
  return result
}

function repairSelection(state) {
  if (!state.spaces.length) throw new Error('Keep at least one Collection.')
  if (!state.spaces.some(space => space.id === state.activeSpaceId)) state.activeSpaceId = state.spaces[0].id
  for (const space of state.spaces) {
    if (!space.windows.some(area => area.id === space.activeWindowId)) space.activeWindowId = space.windows[0]?.id ?? null
    for (const area of space.windows) {
      const sessions = activeSessions(area)
      if (!sessions.some(session => session.id === area.selectedSessionId)) {
        area.selectedSessionId = area.selectedSessionId === null ? null : sessions[0]?.id ?? null
      }
    }
  }
  return reconcileWorktreeReferences(state)
}

export function mergeStateChanges(base, local, remote) {
  const before = entities(base)
  const after = entities(local)
  const latest = entities(remote)
  const merged = Object.fromEntries(Object.keys(before).map(kind =>
    [kind, mergeEntities(before[kind], after[kind], latest[kind])],
  ))
  const result = {
    version: 5,
    activeSpaceId: base.activeSpaceId === local.activeSpaceId ? remote.activeSpaceId : local.activeSpaceId,
    spaces: merged.spaces.map(space => ({
      ...space.value,
      worktrees: merged.worktrees.filter(tree => tree.parent === space.id).map(tree => tree.value),
      windows: merged.windows.filter(area => area.parent === space.id).map(area => ({
        ...area.value,
        sessions: merged.sessions.filter(session => session.parent === area.id).map(session => session.value),
      })),
    })),
  }
  if (new Set(result.spaces.map(space => space.name.toLowerCase())).size !== result.spaces.length) {
    throw new Error('Another window saved a Collection with this name. Choose a different name.')
  }
  return restoreState(JSON.stringify(repairSelection(result)))
}

function keepLocalSelection(incoming, local) {
  const result = copy(incoming)
  result.activeSpaceId = local.activeSpaceId
  for (const space of result.spaces) {
    const previous = local.spaces.find(item => item.id === space.id)
    if (previous) space.activeWindowId = previous.activeWindowId
  }
  return repairSelection(result)
}

export function createStateSync(state, {
  beforeSave = () => {},
  onSaved = () => {},
  onError,
  storage = localStorage,
  locks = navigator.locks,
  events = globalThis,
  recoverCorrupt = false,
}) {
  let baseline = copy(state)
  let observed = JSON.stringify(state)
  let dirty = false
  let running
  let refreshPending = false
  let disposed = false

  function apply(next) {
    observed = JSON.stringify(next)
    Object.assign(state, next)
  }

  function refresh() {
    if (disposed) return
    if (running) {
      refreshPending = true
      return
    }
    try {
      const remote = restoreState(storage.getItem(storageKey))
      const local = copy(state)
      const changed = !equal(baseline, local)
      const next = keepLocalSelection(mergeStateChanges(baseline, local, remote), local)
      baseline = keepLocalSelection(remote, baseline)
      apply(next)
      if (changed) {
        dirty = true
        save()
      }
    } catch (error) {
      onError(error)
    }
  }

  function write(base, submitted) {
    beforeSave()
    const remote = recoverCorrupt ? base : restoreState(storage.getItem(storageKey))
    const merged = mergeStateChanges(base, submitted, remote)
    storage.setItem(storageKey, JSON.stringify(merged))
    recoverCorrupt = false
    return merged
  }

  function save() {
    dirty = true
    if (running) return running
    if (!locks) {
      try {
        beforeSave()
        storage.setItem(storageKey, JSON.stringify(state))
        baseline = copy(state)
        observed = JSON.stringify(state)
        dirty = false
        onSaved()
        return Promise.resolve(true)
      } catch (error) {
        onError(error)
        return Promise.resolve(false)
      }
    }
    running = (async () => {
      while (dirty && !disposed) {
        dirty = false
        const base = baseline
        const submitted = copy(state)
        try {
          const committed = await locks.request(storageKey, () => write(base, submitted))
          const local = copy(state)
          if (!equal(local, submitted)) dirty = true
          baseline = keepLocalSelection(committed, submitted)
          apply(keepLocalSelection(mergeStateChanges(submitted, local, committed), local))
          onSaved()
        } catch (error) {
          onError(error)
          return false
        }
      }
      return true
    })().finally(() => {
      running = undefined
      if (refreshPending) {
        refreshPending = false
        refresh()
      }
    })
    return running
  }

  const stop = watch(state, () => {
    const serialized = JSON.stringify(state)
    if (serialized !== observed) {
      observed = serialized
      save()
    }
  }, { deep: true })
  const storageChanged = event => {
    if (event.key === storageKey && event.storageArea === storage) refresh()
  }
  events.addEventListener('storage', storageChanged)

  return {
    save,
    refresh,
    dispose() {
      disposed = true
      stop()
      events.removeEventListener('storage', storageChanged)
    },
  }
}
