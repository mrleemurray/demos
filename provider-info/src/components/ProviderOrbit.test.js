import assert from 'node:assert/strict'
import { afterEach, suite, test } from 'vitest'
import { createApp, nextTick } from 'vue'
import ProviderOrbit from './ProviderOrbit.vue'

const provider = {
  id: 'copilot',
  name: 'GitHub Copilot',
  icon: 'copilot',
  qualities: ['powerful', 'proactive', 'flexible'],
}

suite('ProviderOrbit', () => {
  let app
  let container

  afterEach(() => {
    app?.unmount()
    container?.remove()
    app = undefined
    container = undefined
  })

  function mountProvider() {
    container = document.createElement('div')
    document.body.append(container)
    app = createApp(ProviderOrbit, { provider })
    app.mount(container)
  }

  function getElement(selector) {
    const element = container.querySelector(selector)
    assert.ok(element, `Expected ${selector} to be rendered`)
    return element
  }

  test('renders the provider, orbit copy, and accessible description', () => {
    mountProvider()

    const button = getElement('button')
    const descriptionId = button.getAttribute('aria-describedby')

    assert.equal(
      getElement(`#${getElement('.provider-orbit').getAttribute('aria-labelledby')}`).textContent,
      'GitHub Copilot',
    )
    assert.equal(container.querySelector('.provider-name'), null)
    assert.equal(getElement('.provider-ring-shell').getAttribute('aria-hidden'), 'true')
    assert.match(
      getElement('.provider-ring').textContent,
      /POWERFUL.*PROACTIVE.*FLEXIBLE.*POWERFUL.*PROACTIVE.*FLEXIBLE/,
    )
    const textPaths = [...container.querySelectorAll('textPath')]
    assert.deepEqual(
      textPaths.map((textPath) => ({
        text: textPath.textContent.trim(),
        textLength: textPath.getAttribute('textLength'),
        lengthAdjust: textPath.getAttribute('lengthAdjust'),
      })),
      [
        {
          text: 'POWERFUL \u2022 PROACTIVE \u2022 FLEXIBLE \u2022 POWERFUL \u2022 PROACTIVE \u2022 FLEXIBLE \u2022',
          textLength: '421',
          lengthAdjust: 'spacing',
        },
      ],
    )
    assert.equal(
      getElement(`#${descriptionId}`).textContent,
      'GitHub Copilot: powerful, proactive, flexible.',
    )
    assert.equal(button.getAttribute('aria-pressed'), 'false')
    assert.equal(button.getAttribute('aria-label'), 'Keep GitHub Copilot details visible')
  })

  test('pins and unpins the provider details on activation', async () => {
    mountProvider()
    const button = getElement('button')
    const orbit = getElement('.provider-orbit')

    button.click()
    await nextTick()

    assert.equal(orbit.classList.contains('is-pinned'), true)
    assert.equal(button.getAttribute('aria-pressed'), 'true')
    assert.equal(button.getAttribute('aria-label'), 'Let GitHub Copilot details follow focus')

    button.click()
    await nextTick()

    assert.equal(orbit.classList.contains('is-pinned'), false)
    assert.equal(button.getAttribute('aria-pressed'), 'false')
  })

  test('clears a pinned orbit with Escape', async () => {
    mountProvider()
    const button = getElement('button')
    const orbit = getElement('.provider-orbit')

    button.click()
    await nextTick()
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    assert.equal(orbit.classList.contains('is-pinned'), false)
    assert.equal(button.getAttribute('aria-pressed'), 'false')
  })
})
