import assert from 'node:assert/strict'
import { afterEach, suite, test } from 'vitest'
import { createApp, nextTick } from 'vue'
import AgentMergeCard from './AgentMergeCard.vue'
import { getScenario } from '../model/scenarios.js'

suite('AgentMergeCard', () => {
  let app
  let container

  afterEach(() => {
    app?.unmount()
    container?.remove()
    app = undefined
    container = undefined
  })

  function mountCard(scenarioId = 'prototype') {
    container = document.createElement('div')
    document.body.append(container)
    app = createApp(AgentMergeCard, { scenario: getScenario(scenarioId) })
    app.mount(container)
  }

  function getElement(selector) {
    const element = container.querySelector(selector)
    assert.ok(element, `Expected ${selector} to be rendered`)
    return element
  }

  test('renders the active blockers and accessible disclosure state', () => {
    mountCard()

    const disclosure = getElement('.agent-merge-disclosure')
    const bodyId = disclosure.getAttribute('aria-controls')

    assert.deepEqual(
      {
        label: getElement('.agent-merge').getAttribute('aria-label'),
        expanded: disclosure.getAttribute('aria-expanded'),
        disclosureLabel: disclosure.getAttribute('aria-label'),
        bodyExists: Boolean(container.querySelector(`#${bodyId}`)),
        comments: container.querySelectorAll('.review-comment').length,
        checks: [...container.querySelectorAll('.failed-check')].map((item) =>
          item.textContent.trim(),
        ),
      },
      {
        label: 'Agent Merge: 1 Review Comment and 1 Failing Check',
        expanded: 'true',
        disclosureLabel:
          'Collapse Agent Merge details: 1 Review Comment and 1 Failing Check',
        bodyExists: true,
        comments: 1,
        checks: ['Linux Unit Tests'],
      },
    )
  })

  test('collapses and restores details from the disclosure', async () => {
    mountCard()
    const disclosure = getElement('.agent-merge-disclosure')

    disclosure.click()
    await nextTick()
    const collapsed = {
      expanded: disclosure.getAttribute('aria-expanded'),
      body: container.querySelector('.agent-merge-body'),
      messageToggle: container.querySelector('.agent-merge-message-toggle'),
    }

    disclosure.click()
    await nextTick()

    assert.deepEqual(
      {
        collapsed,
        restored: {
          expanded: disclosure.getAttribute('aria-expanded'),
          body: Boolean(container.querySelector('.agent-merge-body')),
        },
      },
      {
        collapsed: {
          expanded: 'false',
          body: null,
          messageToggle: null,
        },
        restored: {
          expanded: 'true',
          body: true,
        },
      },
    )
  })

  test('switches to the agent message and collapses with Escape', async () => {
    mountCard('secure')
    const toggle = getElement('.agent-merge-message-toggle')

    toggle.click()
    await nextTick()
    const messageState = {
      pressed: toggle.getAttribute('aria-pressed'),
      label: toggle.getAttribute('aria-label'),
      message: getElement('.agent-message').textContent.trim(),
      details: container.querySelector('.agent-merge-details'),
    }

    toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    assert.deepEqual(
      {
        messageState,
        collapsed: {
          expanded: getElement('.agent-merge-disclosure').getAttribute('aria-expanded'),
          body: container.querySelector('.agent-merge-body'),
        },
      },
      {
        messageState: {
          pressed: 'true',
          label: 'Show merge details',
          message:
            'Fix the failing CI check only. Do not address review feedback, resolve conflicts, or merge.',
          details: null,
        },
        collapsed: {
          expanded: 'false',
          body: null,
        },
      },
    )
  })
})
