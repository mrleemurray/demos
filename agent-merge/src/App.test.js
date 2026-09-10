import assert from 'node:assert/strict'
import { afterEach, suite, test } from 'vitest'
import { createApp, nextTick } from 'vue'
import App from './App.vue'

suite('Agent Merge lab', () => {
  let app
  let container

  afterEach(() => {
    app?.unmount()
    container?.remove()
    app = undefined
    container = undefined
  })

  function mountApp() {
    container = document.createElement('div')
    document.body.append(container)
    app = createApp(App)
    app.mount(container)
  }

  function getElement(selector) {
    const element = container.querySelector(selector)
    assert.ok(element, `Expected ${selector} to be rendered`)
    return element
  }

  function getText(selector) {
    return getElement(selector).textContent.replace(/\s+/g, ' ').trim()
  }

  test('starts with an explorable Agent Merge state', () => {
    mountApp()

    assert.deepEqual(
      {
        theme: getElement('.prototype-app').getAttribute('data-theme'),
        density: getElement('.prototype-app').getAttribute('data-density'),
        externalControlPanel: Boolean(
          container.querySelector('.prototype-controls'),
        ),
        shellCount: getElement('.prototype-layout').children.length,
        status: getElement('.agent-merge').getAttribute('aria-label'),
        previewToggle: getElement('.workbench-agent-merge-toggle').getAttribute(
          'aria-pressed',
        ),
        policy: getText('.system-notice p'),
        sessions: {
          count: container.querySelectorAll('[data-session-id]').length,
          active: getText('.session-item[aria-current="page"] strong'),
        },
        titlebarSession: getElement('.session-picker span').textContent,
        sidebarHeading: getElement('.sessions-header h3').textContent,
        shellParts: {
          prototypeHeader: Boolean(container.querySelector('.prototype-header')),
          stageHeading: Boolean(container.querySelector('.stage-heading')),
          previewLabel: getElement('.prototype-stage').getAttribute('aria-label'),
          sessionsPart: Boolean(container.querySelector('.sessions-part')),
          changesPart: Boolean(container.querySelector('.changes-part')),
          customizations: Boolean(container.querySelector('.customizations')),
          agentHostStatus: Boolean(
            container.querySelector('.sessions-sidebar-footer'),
          ),
          activityBar: Boolean(container.querySelector('.activity-bar')),
          statusBar: Boolean(container.querySelector('.statusbar')),
        },
      },
      {
        theme: 'dark',
        density: 'comfortable',
        externalControlPanel: false,
        shellCount: 1,
        status: 'Agent Merge: 1 Review Comment and 1 Failing Check',
        previewToggle: 'true',
        policy:
          'It may handle reviews, CI, conflicts. Merge automatically when ready.',
        sessions: {
          count: 3,
          active: 'Prototype Agent Merge UX',
        },
        titlebarSession: 'Prototype Agent Merge UX',
        sidebarHeading: 'Sessions',
        shellParts: {
          prototypeHeader: false,
          stageHeading: false,
          previewLabel: 'Agent Merge preview',
          sessionsPart: true,
          changesPart: true,
          customizations: false,
          agentHostStatus: false,
          activityBar: false,
          statusBar: false,
        },
      },
    )
  })

  test('selects the CI-only security session from the Sessions sidebar', async () => {
    mountApp()

    getElement('[data-session-id="secure"]').click()
    await nextTick()

    assert.deepEqual(
      {
        activeSession: getText('.session-item[aria-current="page"] strong'),
        titlebarSession: getElement('.session-picker span').textContent,
        previewToggle: getElement('.workbench-agent-merge-toggle').getAttribute(
          'aria-pressed',
        ),
        status: getElement('.agent-merge').getAttribute('aria-label'),
        policy: getText('.system-notice p'),
        announcement: getElement('[aria-live="polite"]').textContent,
      },
      {
        activeSession: 'security: harden credential storage',
        titlebarSession: 'security: harden credential storage',
        previewToggle: 'true',
        status: 'Agent Merge: 1 Review Comment and 1 Failing Check',
        policy: 'It may handle CI. Leave the pull request open.',
        announcement:
          'Previewing Sensitive security fix. 1 Review Comment and 1 Failing Check. Agent Merge is enabled.',
      },
    )
  })

  test('selects a regular PR with Agent Merge off from the Sessions sidebar', async () => {
    mountApp()

    getElement('[data-session-id="regular"]').click()
    await nextTick()

    assert.deepEqual(
      {
        activeSession: getText('.session-item[aria-current="page"] strong'),
        previewToggle: getElement('.workbench-agent-merge-toggle').getAttribute(
          'aria-pressed',
        ),
        card: Boolean(container.querySelector('.agent-merge')),
        notice: getText('.agent-merge-disabled-note strong'),
        announcement: getElement('[aria-live="polite"]').textContent,
      },
      {
        activeSession: 'sessions: refine loading state',
        previewToggle: 'false',
        card: false,
        notice: 'Agent Merge is off for this session.',
        announcement:
          'Previewing Regular pull request. 1 Review Comment. Agent Merge is disabled.',
      },
    )
  })

  test('toggles Agent Merge from the pull request changes surface', async () => {
    mountApp()

    getElement('.workbench-agent-merge-toggle').click()
    await nextTick()
    const disabledState = {
      previewPressed: getElement('.workbench-agent-merge-toggle').getAttribute(
        'aria-pressed',
      ),
      card: container.querySelector('.agent-merge'),
      notice: getElement('.agent-merge-disabled-note strong').textContent,
    }

    getElement('.workbench-agent-merge-toggle').click()
    await nextTick()

    assert.deepEqual(
      {
        disabledState,
        enabledState: {
          previewPressed: getElement('.workbench-agent-merge-toggle').getAttribute(
            'aria-pressed',
          ),
          card: Boolean(container.querySelector('.agent-merge')),
        },
      },
      {
        disabledState: {
          previewPressed: 'false',
          card: null,
          notice: 'Agent Merge is off for this session.',
        },
        enabledState: {
          previewPressed: 'true',
          card: true,
        },
      },
    )
  })
})
