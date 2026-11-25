import assert from 'node:assert/strict'
import { afterEach, beforeEach, suite, test, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
import FeatureTour from './FeatureTour.vue'

suite('Feature tour', () => {
  let app
  let container
  let target
  let props

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 42))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      return this.classList.contains('feature-tour-panel') ? new DOMRect(0, 0, 340, 260) : new DOMRect(40, 80, 160, 40)
    })
  })

  afterEach(() => {
    app?.unmount()
    container?.remove()
    target?.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    assert.equal(document.querySelector('.feature-tour'), null)
  })

  function mount(overrides = {}) {
    container = document.createElement('div')
    document.body.append(container)
    target = document.createElement('button')
    document.body.append(target)
    props = reactive({ theme: 'dark', paused: false, prepareStep: vi.fn(async () => {}) })
    app = createApp({
      render: () => h(FeatureTour, { ...props, resolveTarget: () => ({ element: target }), ...overrides }),
    })
    app.mount(container)
  }

  async function settle() {
    await nextTick()
    await nextTick()
  }

  function panel() { return document.querySelector('.feature-tour-panel') }

  async function next() {
    panel().querySelector('.primary-button').click()
    await settle()
  }

  test('explains the problem before hierarchy and walks through assignment and the existing features', async () => {
    const close = vi.fn()
    mount({ onClose: close })
    await settle()
    assert.equal(panel().getAttribute('aria-modal'), 'false')
    assert.equal(document.activeElement, panel())
    const spotlight = document.querySelector('.feature-tour-spotlight')
    assert.equal(spotlight.style.left, '34px')
    assert.equal(spotlight.style.top, '74px')
    assert.equal(panel().querySelector('.feature-tour-action'), null)
    assert.deepEqual(props.prepareStep.mock.calls, [['collections']])
    assert.ok(panel().textContent.includes('several repositories'))
    const titles = [panel().querySelector('h2').textContent]
    for (let i = 0; i < 4; i++) {
      await next()
      if (i === 0) {
        assert.deepEqual([...panel().querySelectorAll('.feature-tour-hierarchy li')].map(item => item.textContent),
          ['Collection', 'Projects and work areas', 'Session groups and sessions'])
        assert.ok(panel().textContent.includes('Profiles configure the editor'))
      }
      titles.push(panel().querySelector('h2').textContent)
    }
    assert.deepEqual(titles, ['Keep related work together', 'A context above session groups', 'Choose where sessions belong', 'Windows, your way', 'From session to Editor'])
    assert.deepEqual(props.prepareStep.mock.calls.map(([id]) => id), ['collections', 'work-areas', 'sessions', 'windows', 'editor'])
    assert.equal(panel().querySelector('.primary-button').textContent, 'Finish')
    panel().querySelector('.text-button').click()
    await settle()
    assert.equal(panel().querySelector('h2').textContent, 'Windows, your way')
    assert.deepEqual(props.prepareStep.mock.calls.at(-1), ['windows'])
    await next()
    await next()
    assert.equal(close.mock.calls.length, 1)
  })

  test('waits for automatic UI preparation without skipping steps or stealing focus after closing', async () => {
    let ready
    const prepareStep = vi.fn(() => new Promise(resolve => { ready = resolve }))
    mount({ prepareStep })
    await settle()
    assert.equal(panel().getAttribute('aria-busy'), 'true')
    assert.equal(panel().querySelector('.primary-button').disabled, true)
    panel().querySelector('.primary-button').click()
    assert.deepEqual(prepareStep.mock.calls, [['collections']])
    ready()
    await settle()
    assert.equal(panel().getAttribute('aria-busy'), 'false')
    assert.equal(document.activeElement, panel())
    await next()
    assert.deepEqual(prepareStep.mock.calls, [['collections'], ['work-areas']])
    assert.equal(panel().querySelector('.text-button').disabled, true)
    app.unmount()
    app = undefined
    target.focus()
    ready()
    await settle()
    assert.equal(document.activeElement, target)
  })

  test('handles missing targets, pauses for native dialogs, and cleans up keyboard and animation-frame listeners', async () => {
    const close = vi.fn()
    const added = vi.spyOn(document, 'addEventListener')
    const removed = vi.spyOn(document, 'removeEventListener')
    mount({ onClose: close })
    await settle()
    target.remove()
    requestAnimationFrame.mock.calls.at(-1)[0]()
    await settle()
    assert.equal(document.querySelector('.feature-tour-spotlight'), null)
    props.paused = true
    await settle()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
    assert.equal(close.mock.calls.length, 0)
    props.paused = false
    await settle()
    assert.deepEqual(props.prepareStep.mock.calls, [['collections'], ['collections']])
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
    assert.equal(close.mock.calls.length, 1)
    app.unmount()
    app = undefined
    assert.ok(cancelAnimationFrame.mock.calls.some(([id]) => id === 42))
    const listener = added.mock.calls.find(([name]) => name === 'keydown')[1]
    assert.ok(removed.mock.calls.some(([name, callback]) => name === 'keydown' && callback === listener))
  })
})
