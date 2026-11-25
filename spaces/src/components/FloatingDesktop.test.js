import assert from 'node:assert/strict'
import { afterEach, beforeEach, suite, test, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
import FloatingDesktop from './FloatingDesktop.vue'
import { addWindow, createState } from '../model.js'

const layoutKey = 'vscode-collections-floating-layout-v1'

suite('Floating desktop', () => {
  let app
  let container
  let space
  let spaces
  let desktop
  let editorId
  let size
  let close

  beforeEach(() => {
    localStorage.clear()
    size = { width: 1200, height: 760 }
    for (const [property, axis] of [['clientWidth', 'width'], ['clientHeight', 'height']]) {
      const original = Object.getOwnPropertyDescriptor(Element.prototype, property).get
      vi.spyOn(Element.prototype, property, 'get').mockImplementation(function () {
        return this.classList.contains('floating-canvas') ? size[axis] : original.call(this)
      })
    }
    const state = createState()
    editorId = addWindow(state, 'vscode', 'editor').id
    state.spaces[0].activeWindowId = 'work-agents'
    spaces = reactive(state.spaces)
    space = spaces[0]
    close = vi.fn()
  })

  afterEach(() => {
    app?.unmount()
    container?.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  async function mount() {
    container = document.createElement('div')
    document.body.append(container)
    app = createApp({
      render: () => h(FloatingDesktop, {
        ref: instance => { desktop = instance },
        spaces, initialWindowIds: space.windows.map(area => area.id), initialActiveWindowId: space.activeWindowId, reducedMotion: true,
        onSelect: id => {
          const owner = spaces.find(space => space.windows.some(area => area.id === id))
          if (owner) owner.activeWindowId = id
        },
        onClose: close,
      }, {
        default: ({ window: area }) => h('textarea', {
          value: area.draft, 'aria-label': `Draft ${area.id}`,
          onInput: event => { area.draft = event.target.value },
        }),
      }),
    })
    app.mount(container)
    await settle()
  }

  async function settle() {
    await nextTick()
    await nextTick()
  }

  function get(selector) {
    const element = container.querySelector(selector)
    assert.ok(element, `Expected ${selector}`)
    return element
  }

  function frame(id = 'work-agents') {
    return get(`.floating-window[data-window-id="${id}"]`)
  }

  function pointer(target, type, x, y) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 })
    Object.defineProperty(event, 'pointerId', { value: 1 })
    target.dispatchEvent(event)
  }

  test('moves and resizes windows without replacing their content and keeps them inside a resized desktop', async () => {
    await mount()
    const area = frame()
    const draft = area.querySelector('textarea')
    pointer(area.querySelector('.floating-drag-handle'), 'pointerdown', 100, 100)
    pointer(globalThis, 'pointermove', 200, 160)
    pointer(globalThis, 'pointerup', 200, 160)
    await settle()
    assert.equal(area.style.left, '124px')
    assert.equal(area.style.top, '80px')
    assert.equal(area.querySelector('textarea') === draft, true)
    assert.equal(document.activeElement, area)
    const resizeHandle = area.querySelector('.floating-resize-handle')
    assert.equal(resizeHandle.childElementCount, 0)
    pointer(resizeHandle, 'pointerdown', 500, 500)
    pointer(globalThis, 'pointermove', 340, 380)
    pointer(globalThis, 'pointerup', 340, 380)
    await settle()
    assert.equal(area.style.width, '740px')
    assert.equal(area.style.height, '480px')
    assert.equal(area.style.left, '124px')
    assert.deepEqual(JSON.parse(localStorage.getItem(layoutKey)).windows['work-agents'], {
      x: 124, y: 80, width: 740, height: 480, minimized: false, maximized: false,
    })
    size = { width: 600, height: 420 }
    globalThis.dispatchEvent(new Event('resize'))
    await settle()
    assert.equal(area.style.left, '0px')
    assert.equal(area.style.top, '0px')
    assert.equal(area.style.width, '600px')
    assert.equal(area.style.height, '420px')
  })

  test('supports keyboard movement, resizing, and maximize/restore without changing the saved restore bounds', async () => {
    await mount()
    const area = frame()
    const title = area.querySelector('.floating-drag-handle')
    title.focus()
    title.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    title.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true, cancelable: true }))
    await settle()
    assert.equal(area.style.left, '48px')
    assert.equal(area.style.height, '624px')
    assert.equal(document.activeElement, title)
    const restore = { left: area.style.left, top: area.style.top, width: area.style.width, height: area.style.height }
    title.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await settle()
    assert.equal(area.style.left, '0px')
    assert.equal(area.style.width, '1200px')
    assert.equal(area.style.height, '760px')
    title.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await settle()
    assert.deepEqual({ left: area.style.left, top: area.style.top, width: area.style.width, height: area.style.height }, restore)
    assert.ok(get('[role="status"]').textContent.includes('size 900 by 624'))
  })

  test('minimizes and restores the same window, raises focused windows, and persists minimized state', async () => {
    await mount()
    const editor = frame(editorId)
    const draft = editor.querySelector('textarea')
    editor.querySelector('[aria-label^="Minimize window:"]').click()
    await settle()
    assert.equal(editor.style.display, 'none')
    assert.equal(draft.isConnected, true)
    assert.equal(document.activeElement, frame())
    app.unmount()
    container.remove()
    await mount()
    const restoredEditor = frame(editorId)
    assert.equal(restoredEditor.style.display, 'none')
    await desktop.openWindow(editorId)
    await settle()
    assert.equal(restoredEditor.style.display, '')
    assert.equal(space.activeWindowId, editorId)
    assert.ok(Number(restoredEditor.style.zIndex) > Number(frame().style.zIndex))
    assert.equal(document.activeElement, restoredEditor)
    restoredEditor.querySelector('[aria-label^="Close window:"]').click()
    assert.deepEqual(close.mock.calls, [[editorId]])
  })

  test('has no desktop bottom bar and keeps minimized windows keyboard-restorable', async () => {
    await mount()
    assert.equal(container.querySelector('.floating-taskbar, [role="toolbar"][aria-label="Open work areas"]'), null)
    frame(editorId).querySelector('[aria-label^="Minimize window:"]').click()
    await settle()
    frame().querySelector('[aria-label^="Minimize window:"]').click()
    await settle()
    const restore = get('.floating-empty button')
    assert.equal(restore.textContent, 'Restore window')
    assert.equal(document.activeElement, restore)
    restore.click()
    await settle()
    assert.equal(frame().style.display, '')
    assert.equal(frame(editorId).style.display, 'none')
    assert.equal(document.activeElement, frame())
  })

  test('reports invalid and unsaved layouts without replacing saved data until a successful interaction', async () => {
    localStorage.setItem(layoutKey, '{broken')
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    await mount()
    assert.ok(get('[role="alert"]').textContent.includes('could not be loaded'))
    assert.equal(localStorage.getItem(layoutKey), '{broken')
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError')
    })
    const title = frame().querySelector('.floating-drag-handle')
    title.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    await settle()
    assert.ok(get('[role="alert"]').textContent.includes('could not be saved'))
    assert.equal(error.mock.calls.length, 2)
    assert.equal(localStorage.getItem(layoutKey), '{broken')
    write.mockRestore()
    title.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    await settle()
    assert.equal(container.querySelector('[role="alert"]'), null)
    assert.equal(JSON.parse(localStorage.getItem(layoutKey)).version, 3)
  })

  test('closes only desktop windows, persists the closed state, and explicitly reopens saved work areas', async () => {
    await mount()
    frame(editorId).querySelector('[aria-label^="Close window:"]').click()
    await settle()
    assert.equal(container.querySelector(`.floating-window[data-window-id="${editorId}"]`), null)
    assert.ok(space.windows.some(area => area.id === editorId))
    app.unmount()
    container.remove()
    await mount()
    assert.equal(container.querySelector(`.floating-window[data-window-id="${editorId}"]`), null)
    await desktop.openWindow(editorId)
    assert.ok(frame(editorId))
    await desktop.openWindow('personal-editor')
    assert.equal(frame('personal-editor').dataset.spaceId, 'personal')
    assert.equal(container.querySelectorAll('.floating-window').length, 3)
  })

  test('cascades new windows from the focused window rather than reusing an overlapping default position', async () => {
    localStorage.setItem(layoutKey, JSON.stringify({
      version: 2,
      windows: { 'work-agents': { x: 64, y: 48, width: 900, height: 600, minimized: false, maximized: false } },
      openWindowIds: ['work-agents'], activeWindowId: 'work-agents',
    }))
    await mount()
    const source = frame()
    const original = source.getAttribute('style')
    await desktop.openWindow('personal-editor')
    const personal = frame('personal-editor')
    assert.equal(personal.style.left, '104px')
    assert.equal(personal.style.top, '76px')
    assert.equal(source.getAttribute('style').replace(/z-index: \d+;/, ''), original.replace(/z-index: \d+;/, ''))
    await desktop.openWindow('side-agents')
    assert.equal(frame('side-agents').style.left, '144px')
    assert.equal(frame('side-agents').style.top, '104px')
    const saved = JSON.parse(localStorage.getItem(layoutKey))
    assert.equal(saved.windows['personal-editor'].x, 104)
    assert.equal(saved.windows['side-agents'].y, 104)
  })

  test('wraps cascading windows at desktop edges and relocates colliding saved windows without moving visible ones', async () => {
    localStorage.setItem(layoutKey, JSON.stringify({
      version: 2,
      windows: {
        'work-agents': { x: 300, y: 160, width: 900, height: 600, minimized: false, maximized: false },
        'personal-editor': { x: 300, y: 160, width: 900, height: 600, minimized: false, maximized: false },
      },
      openWindowIds: ['work-agents'], activeWindowId: 'work-agents',
    }))
    await mount()
    await desktop.openWindow('personal-editor')
    const reopened = frame('personal-editor')
    assert.equal(reopened.style.left, '24px')
    assert.equal(reopened.style.top, '20px')
    assert.equal(frame().style.left, '300px')
    assert.equal(frame().style.top, '160px')
    for (let index = 0; index < 8; index++) {
      const area = addWindow({ activeSpaceId: space.id, spaces }, 'another-project', 'editor')
      await settle()
      await desktop.openWindow(area.id)
      const origins = [...container.querySelectorAll('.floating-window')].map(element => `${element.style.left}:${element.style.top}`)
      assert.equal(new Set(origins).size, origins.length)
      const layout = JSON.parse(localStorage.getItem(layoutKey)).windows[area.id]
      assert.ok(layout.x >= 0 && layout.x + layout.width <= size.width)
      assert.ok(layout.y >= 0 && layout.y + layout.height <= size.height)
    }
  })

  test('retains the last-used work area across Collections and an empty-desktop reload without reopening it automatically', async () => {
    await mount()
    await desktop.openWindow('personal-editor')
    desktop.closeWindow('work-agents')
    desktop.closeWindow(editorId)
    desktop.closeWindow('personal-editor')
    await settle()
    assert.equal(container.querySelectorAll('.floating-window').length, 0)
    assert.equal(JSON.parse(localStorage.getItem(layoutKey)).lastUsedWindowId, 'personal-editor')
    app.unmount()
    container.remove()
    await mount()
    assert.equal(container.querySelectorAll('.floating-window').length, 0)
    const opened = await desktop.openLastWindow('work-agents')
    assert.equal(opened, 'personal-editor')
    assert.equal(container.querySelectorAll('.floating-window').length, 1)
    assert.equal(document.activeElement, frame('personal-editor'))
    assert.equal(space.windows.length, 2)
  })

  test('uses the supplied last-used fallback when a remembered work area was deleted', async () => {
    localStorage.setItem(layoutKey, JSON.stringify({
      version: 2, windows: {}, openWindowIds: [], activeWindowId: null, lastUsedWindowId: 'deleted',
    }))
    await mount()
    assert.equal(container.querySelectorAll('.floating-window').length, 0)
    assert.equal(await desktop.openLastWindow(editorId), editorId)
    assert.equal(container.querySelectorAll('.floating-window').length, 1)
    assert.ok(frame(editorId))
  })

  test('retains the physical frame and maximized bounds when switching content and can reopen the previous work area independently', async () => {
    await mount()
    const source = frame()
    const other = frame(editorId)
    const frameId = source.dataset.frameId
    source.querySelector('.floating-drag-handle').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()
    const geometry = JSON.parse(localStorage.getItem(layoutKey)).windows['work-agents']
    desktop.switchWindow('work-agents', 'personal-editor')
    await settle()
    assert.ok(frame('personal-editor') === source)
    assert.ok(frame(editorId) === other)
    assert.equal(source.style.width, '1200px')
    assert.equal(source.dataset.frameId, frameId)
    assert.deepEqual(JSON.parse(localStorage.getItem(layoutKey)).windows['personal-editor'], geometry)
    await desktop.openWindow('work-agents')
    assert.notEqual(frame().dataset.frameId, frameId)
    assert.equal(frame().style.width, '900px')
    assert.equal(frame().style.left, '24px')
    assert.equal(frame().style.top, '20px')
    assert.ok(frame('personal-editor') === source)
    assert.equal(container.querySelectorAll('.floating-window').length, 3)
    assert.equal(close.mock.calls.length, 0)
  })

  test('migrates explicit version 2 windows without reopening closed work areas', async () => {
    const geometry = { x: 200, y: 80, width: 700, height: 500, minimized: false, maximized: false }
    localStorage.setItem(layoutKey, JSON.stringify({
      version: 2, windows: { 'work-agents': geometry }, openWindowIds: ['work-agents'], activeWindowId: 'work-agents',
    }))
    await mount()
    const saved = JSON.parse(localStorage.getItem(layoutKey))
    assert.equal(saved.version, 3)
    assert.deepEqual(saved.openWindowIds, ['work-agents'])
    assert.deepEqual(saved.windows['work-agents'], geometry)
    assert.equal(saved.frameIds['work-agents'], frame().dataset.frameId)
    assert.equal(container.querySelectorAll('.floating-window').length, 1)
  })

  test('migrates geometry without opening windows from other Collections and backs up the old layout', async () => {
    const raw = JSON.stringify({
      version: 1,
      windows: {
        'work-agents': { x: 200, y: 80, width: 700, height: 500, minimized: false, maximized: false },
        'personal-editor': { x: 20, y: 20, width: 800, height: 500, minimized: false, maximized: false },
      },
    })
    localStorage.setItem(layoutKey, raw)
    await mount()
    assert.equal(frame().style.left, '200px')
    assert.equal(frame().style.width, '700px')
    assert.equal(container.querySelector('.floating-window[data-window-id="personal-editor"]'), null)
    assert.equal(localStorage.getItem(`${layoutKey}-before-explicit-windows`), raw)
    assert.deepEqual(JSON.parse(localStorage.getItem(layoutKey)).openWindowIds, space.windows.map(area => area.id))
  })

  test('removes its global interaction listeners on unmount', async () => {
    const added = vi.spyOn(globalThis, 'addEventListener')
    const removed = vi.spyOn(globalThis, 'removeEventListener')
    await mount()
    const listeners = added.mock.calls.filter(([name]) => ['resize', 'pointermove', 'pointerup', 'pointercancel', 'blur'].includes(name))
    app.unmount()
    app = undefined
    for (const [name, callback] of listeners) {
      assert.ok(removed.mock.calls.some(([type, handler]) => type === name && handler === callback))
    }
    assert.equal(container.childElementCount, 0)
  })
})
