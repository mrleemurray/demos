import assert from 'node:assert/strict'
import { afterEach, suite, test } from 'vitest'
import { createApp, nextTick } from 'vue'
import AgentMergeCard from './AgentMergeCard.vue'
import { getAgentMergeStatus, getScenario } from '../model/scenarios.js'

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
    const scenario = getScenario(scenarioId)
    container = document.createElement('div')
    document.body.append(container)
    app = createApp(AgentMergeCard, {
      scenario,
      activity: getAgentMergeStatus(scenario, scenario.agentMerge, true),
      policyDescription: 'Agent Merge may act within the configured scope.',
    })
    app.mount(container)
  }

  function getElement(selector) {
    const element = container.querySelector(selector)
    assert.ok(element, `Expected ${selector} to be rendered`)
    return element
  }

  test('starts collapsed and reveals active blockers on demand', async () => {
    mountCard()

    const disclosure = getElement('.agent-merge-disclosure')
    const bodyId = disclosure.getAttribute('aria-controls')
    const initial = {
      label: getElement('.agent-merge').getAttribute('aria-label'),
      expanded: disclosure.getAttribute('aria-expanded'),
      disclosureLabel: disclosure.getAttribute('aria-label'),
      bodyExists: Boolean(container.querySelector(`#${bodyId}`)),
    }

    disclosure.click()
    await nextTick()

    assert.deepEqual(
      {
        initial,
        revealed: {
          expanded: disclosure.getAttribute('aria-expanded'),
          disclosureLabel: disclosure.getAttribute('aria-label'),
          bodyExists: Boolean(container.querySelector(`#${bodyId}`)),
          comments: container.querySelectorAll('.review-comment').length,
          checks: [...container.querySelectorAll('.failed-check')].map((item) =>
            item.textContent.trim(),
          ),
        },
      },
      {
        initial: {
          label:
            'Agent Merge: Addressing feedback. 1 Review Comment and 1 Failing Check',
          expanded: 'false',
          disclosureLabel:
            'Expand Agent Merge details: Addressing feedback. 1 Review Comment and 1 Failing Check',
          bodyExists: false,
        },
        revealed: {
          expanded: 'true',
          disclosureLabel:
            'Collapse Agent Merge details: Addressing feedback. 1 Review Comment and 1 Failing Check',
          bodyExists: true,
          comments: 1,
          checks: ['Linux Unit Tests'],
        },
      },
    )
  })

  test('expands and collapses details from the disclosure', async () => {
    mountCard()
    const disclosure = getElement('.agent-merge-disclosure')

    disclosure.click()
    await nextTick()
    const expanded = {
      expanded: disclosure.getAttribute('aria-expanded'),
      body: Boolean(container.querySelector('.agent-merge-body')),
    }

    disclosure.click()
    await nextTick()

    assert.deepEqual(
      {
        expanded,
        collapsed: {
          expanded: disclosure.getAttribute('aria-expanded'),
          body: container.querySelector('.agent-merge-body'),
          messageToggle: container.querySelector('.agent-merge-message-toggle'),
        },
      },
      {
        expanded: {
          expanded: 'true',
          body: true,
        },
        collapsed: {
          expanded: 'false',
          body: null,
          messageToggle: null,
        },
      },
    )
  })

  test('switches to the agent message and collapses with Escape', async () => {
    mountCard('secure')
    getElement('.agent-merge-disclosure').click()
    await nextTick()
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
