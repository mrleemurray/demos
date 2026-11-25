import assert from 'node:assert/strict'
import { afterEach, suite, test, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import SessionMenu from './SessionMenu.vue'

suite('Session context menu', () => {
  let app
  let container
  let picker
  let row

  afterEach(() => {
    app?.unmount()
    container?.remove()
    assert.equal(document.querySelector('.session-context-menu'), null)
  })

  function mount(props = {}) {
    container = document.createElement('div')
    document.body.append(container)
    app = createApp(SessionMenu, { theme: 'light', canMove: true, ...props })
    picker = app.mount(container)
    row = document.createElement('button')
    container.append(row)
  }

  async function settle() {
    await nextTick()
    await nextTick()
    await nextTick()
  }

  function menu() {
    const element = document.querySelector('.session-context-menu')
    assert.ok(element)
    return element
  }

  async function open() {
    await picker.open({ type: 'contextmenu', currentTarget: row, clientX: 120, clientY: 100 })
    await settle()
  }

  test('offers Editor opening and movement from a themed row context menu, restoring focus on Escape', async () => {
    const create = vi.fn()
    mount({ onCreate: create })
    await open()
    assert.equal(menu().dataset.theme, 'light')
    assert.equal(container.contains(menu()), false)
    assert.equal(menu().style.left, '120px')
    assert.equal(menu().style.top, '104px')
    assert.deepEqual([...menu().querySelectorAll('[role="menuitem"]')].map(item => item.textContent.trim()), ['Open in Editor', 'Open in Editor in new window', 'Move session…'])
    assert.equal(document.activeElement, menu().querySelector('[data-action="here"]'))
    menu().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    assert.equal(document.querySelector('.session-context-menu'), null)
    assert.equal(document.activeElement, row)
    assert.deepEqual(create.mock.calls, [])
    for (const destination of ['here', 'new-window']) {
      await open()
      menu().querySelector(`[data-action="${destination}"]`).click()
      await settle()
      assert.equal(document.querySelector('.session-context-menu'), null)
    }
    assert.deepEqual(create.mock.calls, [['here'], ['new-window']])
  })

  test('navigates the actions and restores row focus before requesting the Move dialog', async () => {
    const move = vi.fn(() => assert.equal(document.activeElement, row))
    mount({ onMove: move })
    await open()
    menu().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement.dataset.action, 'new-window')
    menu().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    assert.equal(document.activeElement.dataset.action, 'move')
    menu().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement.dataset.action, 'here')
    menu().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    assert.equal(document.activeElement.dataset.action, 'move')
    document.activeElement.click()
    await settle()
    assert.equal(move.mock.calls.length, 1)
    assert.equal(document.querySelector('.session-context-menu'), null)
  })

  test('skips movement when there is no other Collection', async () => {
    const move = vi.fn()
    mount({ canMove: false, onMove: move })
    await open()
    assert.equal(menu().querySelector('[data-action="move"]').disabled, true)
    menu().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    assert.equal(document.activeElement.dataset.action, 'new-window')
    menu().querySelector('[data-action="move"]').click()
    assert.equal(move.mock.calls.length, 0)
  })

  test('dismisses outside and on layout changes without treating row or menu interaction as outside', async () => {
    mount()
    await open()
    row.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    menu().dispatchEvent(new Event('pointerdown', { bubbles: true }))
    menu().dispatchEvent(new Event('scroll'))
    await settle()
    assert.ok(menu())
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await settle()
    assert.equal(document.querySelector('.session-context-menu'), null)
    await open()
    globalThis.dispatchEvent(new Event('resize'))
    await settle()
    assert.equal(document.querySelector('.session-context-menu'), null)
    await open()
    document.dispatchEvent(new Event('scroll'))
    await settle()
    assert.equal(document.querySelector('.session-context-menu'), null)
  })
})
