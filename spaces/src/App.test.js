import assert from 'node:assert/strict'
import { afterEach, beforeEach, suite, test, vi } from 'vitest'
import { createApp, nextTick, reactive } from 'vue'
import App from './App.vue'
import SpaceSwitcher from './components/SpaceSwitcher.vue'
import { addWindow, createState, legacyBackupKey, migrationBackupKey, storageKey } from './model.js'

suite('Spaces interactions', () => {
  let app
  let container
  const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')

  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value() { this.setAttribute('open', '') },
    })
  })

  afterEach(() => {
    app?.unmount()
    container?.remove()
    vi.restoreAllMocks()
    if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
    else delete HTMLDialogElement.prototype.showModal
  })

  function mount(component = App, props) {
    container = document.createElement('div')
    document.body.append(container)
    app = createApp(component, props)
    app.mount(container)
  }

  function get(selector) {
    const element = container.querySelector(selector)
    assert.ok(element, `Expected ${selector}`)
    return element
  }

  async function settle() {
    await nextTick()
    await nextTick()
  }

  async function click(selector) {
    get(selector).click()
    await settle()
  }

  async function fill(selector, value) {
    const input = get(selector)
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()
  }

  async function submit(selector) {
    get(selector).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await settle()
  }

  function savedState() {
    return JSON.parse(localStorage.getItem(storageKey))
  }

  function spaceTrigger() {
    return get('.space-trigger')
  }

  async function switchSpace(name) {
    if (!container.querySelector('.space-switcher-menu')) {
      spaceTrigger().click()
      await settle()
    }
    await click(`[aria-label="Switch to ${name}"]`)
  }

  function legacySnapshot() {
    const state = createState()
    const { windows, activeWindowId, startingWindowKind, ...space } = state.spaces[0]
    const selected = { ...state.spaces[1].windows[0], draft: 'A saved thought', activeFile: 'README.md' }
    return JSON.stringify({
      version: 1, activeSpaceId: space.id,
      spaces: [{ ...space, windows: [windows[0], selected], activeWindowId: selected.id }],
    })
  }

  async function menuAction(label) {
    if (!container.querySelector('.space-menu')) {
      spaceTrigger().click()
      await settle()
    }
    const action = [...container.querySelectorAll('.menu-action')].find(button => button.textContent.trim().startsWith(label))
    assert.ok(action, `Expected menu action ${label}`)
    action.click()
    await settle()
  }

  async function focusWindow(id) {
    const option = [...container.querySelectorAll('.rail-window')].find(button => button.dataset.windowId === id)
    assert.ok(option, `Expected window ${id}`)
    option.click()
    await settle()
  }

  async function windowAction(id, label) {
    const option = [...container.querySelectorAll('.rail-window')].find(button => button.dataset.windowId === id)
    assert.ok(option, `Expected window ${id}`)
    option.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    await settle()
    await menuAction(label)
  }

  test('adds only a Space rail beside familiar Agents and Editor window layouts', async () => {
    mount()
    assert.doesNotMatch(container.textContent, /\bwindows?\b/i)
    const body = get('.workbench-body')
    assert.equal(body.children.length, 2)
    assert.ok(body.firstElementChild.matches('.space-rail'))
    assert.ok(body.lastElementChild.matches('.window-view'))
    assert.equal(container.querySelector('.concept-footer'), null)
    assert.equal(container.querySelector('.concept-badge'), null)
    assert.equal(get('.space-rail').firstElementChild, spaceTrigger())
    assert.equal(spaceTrigger().querySelector('.codicon-chevron-down'), null)
    assert.equal(container.querySelectorAll('.rail-window').length, 1)
    assert.equal(get('.rail-window').dataset.windowId, 'work-agents')
    assert.equal(get('.rail-windows').getAttribute('aria-label'), 'Work areas in Work')
    assert.equal(get('.rail-add').getAttribute('aria-label'), 'New work area')
    assert.equal(get('.rail-attention').textContent, '1')
    assert.equal(get('.rail-attention').getAttribute('aria-label'), '1 session needs input')
    assert.equal(get('.rail-window').getAttribute('aria-describedby'), get('.rail-attention').id)
    assert.equal(container.querySelector('.rail-window-options, .space-rail .codicon-ellipsis'), null)
    assert.equal(container.querySelector('.rail-space-caption'), null)
    get('.rail-window').dispatchEvent(new MouseEvent('mouseenter'))
    await settle()
    assert.ok(get('.rail-tooltip').textContent.includes('Agents · vscode'))
    assert.ok(get('.rail-tooltip').textContent.includes('1 session needs input'))
    get('.rail-window').dispatchEvent(new MouseEvent('mouseleave'))
    await settle()
    assert.equal(container.querySelector('.rail-tooltip'), null)
    assert.ok(get('.window-view .sessions-sidebar'))
    assert.ok(get('.window-view .agent-session-panel'))
    assert.equal(container.querySelector('.space-sidebar, .agents-home, .home-context'), null)
    assert.equal(container.querySelectorAll('.session-row').length, 3)
    await fill('[aria-label="Search sessions"]', 'keyboard')
    assert.equal(container.querySelectorAll('.session-row').length, 1)
    await switchSpace('Personal')
    assert.ok(get('.editor-activity-bar'))
    assert.ok(get('.file-explorer'))
    assert.ok(get('.editor-tabs'))
    assert.ok(get('.terminal-panel'))
    assert.equal(container.querySelector('.sessions-sidebar'), null)
    get('.editor-tab[aria-selected="true"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await settle()
    assert.ok(get('.editor-tab[aria-selected="true"]').textContent.includes('index.ts'))
    assert.equal(document.activeElement, get('.editor-tab[aria-selected="true"]'))
    await click('[aria-label="Toggle Primary Side Bar"]')
    assert.equal(container.querySelector('.file-explorer'), null)
    assert.ok(get('.editor-activity-bar'))
    await switchSpace('Work')
    assert.ok(get('.sessions-sidebar'))
    await switchSpace('Personal')
    assert.equal(container.querySelector('.file-explorer'), null)
    await click('[aria-label="Toggle Primary Side Bar"]')
    assert.ok(get('.file-explorer'))
  })

  test('counts input and review sessions once, excludes other states, and hides the badge at zero', async () => {
    const state = reactive(createState())
    const space = state.spaces[0]
    const area = space.windows[0]
    const review = area.sessions[0]
    area.sessions.push(
      ...Array.from({ length: 10 }, (_, index) => ({ ...review, id: `review-${index}` })),
      { ...review, id: 'pending-question', status: 'input' },
      { ...review, id: 'preview-only', status: 'preview' },
    )
    mount(SpaceSwitcher, { spaces: state.spaces, current: space })
    assert.equal(get('.rail-attention').textContent, '12')
    assert.equal(get('.rail-attention').getAttribute('aria-label'), '12 sessions need input')
    assert.equal(container.querySelector('.rail-window-options, .codicon-ellipsis'), null)
    get('.rail-window').dispatchEvent(new MouseEvent('mouseenter'))
    await settle()
    assert.ok(get('.rail-tooltip').textContent.includes('12 sessions need input'))
    for (const session of area.sessions) {
      if (session.id !== review.id && ['input', 'review'].includes(session.status)) session.status = 'done'
    }
    await settle()
    assert.equal(get('.rail-attention').textContent, '1')
    assert.equal(get('.rail-attention').getAttribute('aria-label'), '1 session needs input')
    assert.ok(get('.rail-tooltip').textContent.includes('1 session needs input'))
    review.status = 'done'
    await settle()
    assert.equal(container.querySelector('.rail-attention'), null)
    assert.equal(get('.rail-window').getAttribute('aria-describedby'), null)
    assert.ok(!get('.rail-tooltip').textContent.includes('needs input'))
    assert.ok(!get('.rail-tooltip').textContent.includes('sessions need input'))
    assert.ok(get('.space-trigger .space-notification'))
    spaceTrigger().focus()
    await settle()
    assert.ok(get('.rail-tooltip').textContent.includes('1 other Space has sessions needing input'))
    state.spaces[2].windows[0].sessions[0].status = 'done'
    await settle()
    assert.equal(container.querySelector('.space-trigger .space-notification'), null)
    assert.equal(spaceTrigger().getAttribute('aria-describedby'), null)
    assert.ok(!get('.rail-tooltip').textContent.includes('other Space'))
    state.spaces[2].windows[0].sessions[0].status = 'input'
    await settle()
    assert.ok(get('.space-trigger .space-notification'))
    assert.ok(get('.rail-tooltip').textContent.includes('1 other Space has sessions needing input'))
  })

  test('collapses the Spaces rail independently and remembers it across Space changes and reloads', async () => {
    mount()
    spaceTrigger().click()
    await settle()
    assert.ok(get('.space-switcher-menu'))
    get('.spaces-sidebar-toggle').focus()
    await click('[aria-label="Hide Spaces sidebar"]')
    assert.equal(get('.space-rail').style.display, 'none')
    assert.equal(container.querySelector('.space-switcher-menu'), null)
    assert.equal(get('.spaces-sidebar-toggle').getAttribute('aria-expanded'), 'false')
    assert.equal(get('.spaces-sidebar-toggle').getAttribute('aria-controls'), get('.space-rail').id)
    assert.ok(get('.sessions-sidebar'))
    assert.equal(get('[aria-label="Toggle Primary Side Bar"]').getAttribute('aria-pressed'), 'true')
    assert.equal(savedState().spaceRailVisible, false)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '2', ctrlKey: true, altKey: true, bubbles: true }))
    await settle()
    assert.equal(get('.window-view').getAttribute('aria-label'), 'field-notes editor work area')
    assert.equal(get('.space-rail').style.display, 'none')
    app.unmount()
    container.remove()
    mount()
    assert.equal(get('.space-rail').style.display, 'none')
    assert.ok(get('.file-explorer'))
    get('.spaces-sidebar-toggle').focus()
    await click('[aria-label="Show Spaces sidebar"]')
    assert.equal(get('.space-rail').style.display, '')
    assert.equal(get('.spaces-sidebar-toggle').getAttribute('aria-expanded'), 'true')
    assert.equal(document.activeElement, get('.spaces-sidebar-toggle'))
    assert.equal(get('.rail-window').dataset.windowId, 'personal-editor')
    assert.equal(savedState().spaceRailVisible, true)
  })

  test('indicates input in other Spaces, aggregates their work areas, and excludes the current Space', async () => {
    const state = createState()
    const questions = addWindow(state, 'questions', 'agents')
    questions.sessions.push({
      ...state.spaces[0].windows[0].sessions[0], id: 'cross-space-question', status: 'input',
    })
    questions.selectedSessionId = 'cross-space-question'
    state.spaces[0].activeWindowId = 'work-agents'
    state.spaces[2].windows[0].sessions[0].status = 'done'
    localStorage.setItem(storageKey, JSON.stringify(state))
    mount()
    assert.equal(container.querySelector('.space-trigger .space-notification'), null)
    assert.equal(spaceTrigger().getAttribute('aria-describedby'), null)
    await switchSpace('Personal')
    const dot = get('.space-trigger .space-notification')
    assert.equal(dot.getAttribute('aria-label'), '1 other Space has sessions needing input')
    assert.equal(spaceTrigger().getAttribute('aria-describedby'), dot.id)
    spaceTrigger().click()
    await settle()
    const workDot = get('[aria-label="Switch to Work"] .space-notification')
    assert.equal(workDot.getAttribute('aria-label'), '2 sessions need input')
    assert.equal(get('[aria-label="Switch to Work"]').getAttribute('aria-describedby'), workDot.id)
    assert.equal(get('[aria-label="Switch to Personal"]').querySelector('.space-notification'), null)
    assert.equal(get('[aria-label="Switch to Side gig"]').querySelector('.space-notification'), null)
    await switchSpace('Work')
    assert.equal(container.querySelector('.space-trigger .space-notification'), null)
    assert.equal(container.querySelectorAll('.rail-attention').length, 2)
  })

  test('switches between Spaces, restoring files and drafts independently', async () => {
    mount()
    await fill('#task-draft', 'Keep this idea in Work')
    await switchSpace('Personal')
    assert.equal(get('.window-view').getAttribute('aria-label'), 'field-notes editor work area')
    const readme = [...container.querySelectorAll('.file-explorer button')].find(button => button.textContent.includes('README.md'))
    readme.click()
    await settle()
    await switchSpace('Work')
    assert.equal(get('#task-draft').value, 'Keep this idea in Work')
    await switchSpace('Personal')
    assert.ok(get('.editor-tab[aria-selected="true"]').textContent.includes('README.md'))
    assert.equal(get('[role="status"]').textContent, 'Personal space. Editor work area. field-notes.')
  })

  test('separates Space menu navigation from window rail selection and context actions', async () => {
    mount()
    await click('[aria-label="Open session in Editor"]')
    spaceTrigger().click()
    await settle()
    assert.equal(spaceTrigger().getAttribute('aria-expanded'), 'true')
    assert.equal(document.activeElement.getAttribute('aria-checked'), 'true')
    assert.equal(get('.space-menu').getAttribute('aria-label'), 'Switch Space')
    assert.ok(get('.space-option[aria-checked="true"]').textContent.includes('2 work areas'))
    get('.space-menu').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement.getAttribute('aria-label'), 'Switch to Personal')
    document.activeElement.click()
    await settle()
    assert.equal(spaceTrigger().getAttribute('aria-label'), 'Switch Space, Personal')
    assert.equal(container.querySelectorAll('.rail-window').length, 1)
    assert.equal(get('.rail-window').dataset.windowId, 'personal-editor')
    assert.equal(document.activeElement, spaceTrigger())
    await switchSpace('Work')
    const agents = get('.rail-window[data-window-id="work-agents"]')
    agents.focus()
    agents.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.ok(document.activeElement.matches('.rail-window[aria-current="page"]'))
    const editor = document.activeElement
    await settle()
    assert.equal(container.querySelectorAll('.rail-tooltip').length, 1)
    assert.ok(get('.rail-tooltip').textContent.includes('Editor · vscode'))
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'F10', shiftKey: true, bubbles: true, cancelable: true }))
    await settle()
    assert.equal(container.querySelector('.rail-tooltip'), null)
    assert.equal(get('#window-menu').getAttribute('aria-label'), 'Work area actions')
    assert.ok(document.activeElement.textContent.includes('Move to another Space'))
    get('#window-menu').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    assert.equal(document.activeElement, editor)
    assert.equal(container.querySelector('#window-menu'), null)
    const activeId = savedState().spaces[0].activeWindowId
    agents.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    await settle()
    assert.ok(get('.window-menu-heading').textContent.includes('Agents · vscode'))
    assert.equal(savedState().spaces[0].activeWindowId, activeId)
    get('#window-menu').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    assert.equal(document.activeElement, agents)
  })

  test('dismisses the switcher on outside interaction and uses space shortcuts', async () => {
    mount()
    spaceTrigger().click()
    await settle()
    get('.session-toolbar').dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await settle()
    assert.equal(container.querySelector('.space-menu'), null)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '3', ctrlKey: true, altKey: true, bubbles: true }))
    await settle()
    assert.equal(spaceTrigger().getAttribute('aria-label'), 'Switch Space, Side gig')
    assert.equal(get('.rail-window').dataset.windowId, 'side-agents')
  })

  test('validates creation and opens exactly the chosen Editor window', async () => {
    mount()
    await menuAction('Create a space')
    await submit('.space-form')
    assert.equal(get('.field-error').textContent, 'Give your space a name.')
    await fill('#space-name', ' work ')
    await submit('.space-form')
    assert.ok(get('.field-error').textContent.includes('already exists'))
    await fill('#space-name', 'Weekend')
    await click('input[name="window-kind"][value="editor"]')
    await submit('.space-form')
    assert.equal(container.querySelector('dialog'), null)
    assert.equal(get('.window-view').getAttribute('aria-label'), 'Weekend editor work area')
    assert.ok(get('.file-explorer'))
    const space = savedState().spaces.at(-1)
    assert.equal(space.windows.length, 1)
    assert.equal(space.windows[0].kind, 'editor')
    assert.equal(space.startingWindowKind, 'editor')
    assert.equal(container.querySelector('.empty-space, .window-picker, .pair-button'), null)
  })

  test('creates a Space in Agents and restores its initial window across a reload', async () => {
    mount()
    await menuAction('Create a space')
    await fill('#space-name', 'Research')
    await click('input[name="window-kind"][value="agents"]')
    await submit('.space-form')
    const windowId = savedState().spaces.at(-1).windows[0].id
    assert.ok(get('.sessions-sidebar'))
    assert.equal(get('.window-view').getAttribute('aria-label'), 'Research agents work area')
    await fill('#task-draft', 'Keep this research idea')
    await switchSpace('Work')
    app.unmount()
    container.remove()
    mount()
    await switchSpace('Research')
    assert.equal(get('#task-draft').value, 'Keep this research idea')
    assert.equal(savedState().spaces.at(-1).windows[0].id, windowId)
    assert.equal(savedState().spaces.at(-1).windows[0].kind, 'agents')
  })

  test('edits a space and confirms its removal, with focus restored after dialogs', async () => {
    mount()
    await menuAction('Manage Space')
    assert.equal(container.querySelector('input[name="window-kind"]'), null)
    assert.ok(get('.managed-window-type').textContent.includes('Agents'))
    assert.ok(get('.managed-window-type').textContent.includes('1 open work area'))
    await fill('#space-name', 'Day job')
    await click('input[name="space-color"][value="purple"]')
    await submit('.space-form')
    assert.equal(spaceTrigger().getAttribute('aria-label'), 'Switch Space, Day job')
    assert.equal(get('.space-trigger .space-avatar').dataset.color, 'purple')
    assert.equal(document.activeElement, spaceTrigger())
    await menuAction('Manage Space')
    await click('.remove-space .text-button')
    assert.equal(savedState().spaces.length, 3)
    await click('.danger-button')
    assert.equal(savedState().spaces.length, 2)
    assert.equal(spaceTrigger().getAttribute('aria-label'), 'Switch Space, Personal')
  })

  test('dismisses Space dialogs and help with Escape in embedded browsers', async () => {
    mount()
    for (const action of ['Manage Space', 'New work area']) {
      if (action === 'New work area') await click('.rail-add')
      else await menuAction(action)
      get('dialog').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
      await settle()
      assert.equal(container.querySelector('dialog'), null)
      assert.equal(document.activeElement, spaceTrigger())
    }
    await menuAction('About Spaces')
    get('dialog').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await settle()
    assert.equal(container.querySelector('dialog'), null)
  })

  test('opens a session Editor in the same Space and focuses it from the rail without duplicating windows', async () => {
    mount()
    await fill('#task-draft', 'Keep my follow-up')
    const title = get('.session-title').textContent
    await click('[aria-label="Open session in Editor"]')
    const space = savedState().spaces[0]
    assert.equal(savedState().activeSpaceId, 'work')
    assert.equal(space.windows.length, 2)
    const editorId = space.activeWindowId
    assert.ok(get('.file-breadcrumb').textContent.includes(title))
    assert.equal(document.activeElement, get('.editor-tab[aria-selected="true"]'))
    assert.equal(container.querySelector('.window-picker, .pair-button'), null)
    assert.equal(container.querySelector('.space-menu'), null)
    assert.equal(container.querySelectorAll('.rail-window').length, 2)
    assert.ok(get('.rail-window[aria-current="page"]').getAttribute('aria-label').includes(title))
    await focusWindow('work-agents')
    assert.equal(get('#task-draft').value, 'Keep my follow-up')
    assert.equal(get('.session-title').textContent, title)
    await click('[aria-label="Open session in Editor"]')
    assert.equal(savedState().spaces[0].activeWindowId, editorId)
    assert.equal(savedState().spaces[0].windows.length, 2)
    await switchSpace('Personal')
    await switchSpace('Work')
    assert.ok(get('.file-breadcrumb').textContent.includes(title))
  })

  test('adds a work area using existing context without a project prompt, retaining move and close actions', async () => {
    mount()
    await click('.rail-add')
    assert.equal(get('dialog h2').textContent, 'New work area')
    assert.equal(get('.utility-form legend').textContent, 'Work area type')
    assert.equal(get('.utility-form .primary-button').textContent, 'Open work area')
    assert.equal(container.querySelector('#project-name'), null)
    assert.doesNotMatch(get('dialog').textContent, /workspace or project/i)
    assert.equal(document.activeElement, get('input[name="window-kind"]:checked'))
    await click('input[name="window-kind"][value="editor"]')
    await submit('.utility-form')
    const editorId = savedState().spaces[0].activeWindowId
    assert.equal(get('.window-view').getAttribute('aria-label'), 'vscode editor work area')
    assert.equal(savedState().spaces[0].windows.length, 2)
    await windowAction(editorId, 'Move to another Space')
    await submit('.utility-form')
    assert.equal(savedState().spaces[0].windows.length, 1)
    await switchSpace('Personal')
    assert.equal(get('.window-view').getAttribute('aria-label'), 'vscode editor work area')
    await windowAction(editorId, 'Close work area')
    assert.equal(get('.window-view').getAttribute('aria-label'), 'field-notes editor work area')
    assert.equal(document.activeElement, get('.rail-window[aria-current="page"]'))
    await windowAction('personal-editor', 'Close work area')
    assert.equal(get('#empty-space-title').textContent, 'No open work areas in Personal')
    assert.equal(savedState().spaces.find(space => space.id === 'personal').windows.length, 0)
    assert.equal(document.activeElement, spaceTrigger())
    await click('.rail-add')
    await submit('.utility-form')
    assert.equal(get('.window-view').getAttribute('aria-label'), 'Personal editor work area')
  })

  test('backs up legacy multi-window data and retains every current window and its selected context', () => {
    const raw = legacySnapshot()
    localStorage.setItem(storageKey, raw)
    localStorage.setItem(legacyBackupKey, 'Original archived snapshot')
    mount()
    assert.equal(localStorage.getItem(migrationBackupKey), raw)
    assert.equal(localStorage.getItem(legacyBackupKey), 'Original archived snapshot')
    assert.equal(savedState().version, 3)
    const space = savedState().spaces[0]
    const window = space.windows.find(item => item.id === space.activeWindowId)
    assert.equal(window.activeFile, 'README.md')
    assert.equal(window.draft, 'A saved thought')
    assert.equal(space.windows.length, 2)
    assert.ok(get('.editor-tab[aria-selected="true"]').textContent.includes('README.md'))
    assert.ok(get('.migration-notice').textContent.includes('backed up locally'))
  })

  test('preserves the original saved data if its migration backup fails, and retries before saving changes', async () => {
    const raw = legacySnapshot()
    localStorage.setItem(storageKey, raw)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError')
    })
    mount()
    assert.equal(localStorage.getItem(storageKey), raw)
    assert.equal(localStorage.getItem(migrationBackupKey), null)
    assert.equal(container.querySelector('.migration-notice'), null)
    assert.ok(get('.storage-error').textContent.includes('has not been overwritten'))
    write.mockRestore()
    await click('[aria-label="Toggle Primary Side Bar"]')
    assert.equal(localStorage.getItem(migrationBackupKey), raw)
    assert.equal(savedState().version, 3)
    assert.equal(container.querySelector('.storage-error'), null)
  })

  test('creates only a simulated session and persists it across a remount', async () => {
    mount()
    await fill('#task-draft', 'A task to preview')
    await submit('.task-composer')
    assert.equal(get('#task-draft').value, '')
    assert.ok(get('.session-row').textContent.includes('A task to preview'))
    await switchSpace('Personal')
    app.unmount()
    container.remove()
    mount()
    assert.equal(spaceTrigger().getAttribute('aria-label'), 'Switch Space, Personal')
    await switchSpace('Work')
    await click('.session-row')
    assert.ok(get('.sample-response').textContent.includes('No request has been sent'))
    assert.ok(get('.session-title').textContent.includes('A task to preview'))
    assert.equal(document.activeElement, get('.session-title'))
    await click('.new-session-button')
    assert.equal(document.activeElement, get('#task-draft'))
    assert.equal(get('.session-title').textContent, 'New session')
    await click('.session-row')
    await switchSpace('Personal')
    await switchSpace('Work')
    assert.ok(get('.session-title').textContent.includes('A task to preview'))
  })

  test('surfaces corrupt storage and persistence failures rather than silently losing changes', async () => {
    localStorage.setItem(storageKey, '{broken')
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount()
    assert.ok(get('.storage-error[role="alert"]').textContent.includes('could not be loaded'))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError')
    })
    await switchSpace('Personal')
    assert.ok(get('.storage-error').textContent.includes('lost on reload'))
    assert.equal(errorLog.mock.calls.length, 2)
  })

  test('removes document listeners when the prototype unmounts', () => {
    const added = vi.spyOn(document, 'addEventListener')
    const removed = vi.spyOn(document, 'removeEventListener')
    mount()
    const listeners = added.mock.calls.filter(([name]) => ['keydown', 'pointerdown'].includes(name))
    app.unmount()
    app = undefined
    for (const [name, listener] of listeners) {
      assert.ok(removed.mock.calls.some(call => call[0] === name && call[1] === listener))
    }
    assert.equal(container.childElementCount, 0)
  })
})
