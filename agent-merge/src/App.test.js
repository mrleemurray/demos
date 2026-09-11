import assert from 'node:assert/strict'
import { afterEach, suite, test, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import App from './App.vue'

suite('Agent Merge lab', () => {
  let app
  let container

  afterEach(() => {
    vi.useRealTimers()
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

  async function openCreatePullRequestDialog(
    triggerSelector = '.repository-action',
  ) {
    for (let actionCount = 0; actionCount < 2; actionCount++) {
      if (getText('.changes-repository-action') === 'Create pull request') {
        break
      }
      assert.ok(
        ['Commit changes', 'Publish branch'].includes(
          getText('.changes-repository-action'),
        ),
      )
      getElement('.changes-repository-action').click()
      await nextTick()
      await nextTick()
    }
    assert.equal(getText('.changes-repository-action'), 'Create pull request')
    const trigger = getElement(triggerSelector)
    trigger.click()
    await nextTick()
    await nextTick()
    return trigger
  }

  async function continueToHandlingStep() {
    assert.equal(getText('.primary-button'), 'Continue')
    getElement('.primary-button').click()
    await nextTick()
    await nextTick()
  }

  async function setFieldValue(selector, value, eventName = 'input') {
    const field = getElement(selector)
    field.value = value
    field.dispatchEvent(new Event(eventName, { bubbles: true }))
    await nextTick()
  }

  async function selectHandlingVariant(variant) {
    getElement(`input[name="handlingVariant"][value="${variant}"]`).click()
    await nextTick()
    await nextTick()
  }

  function getAgentMergeDialogSettings() {
    return {
      mode: getElement('input[name="pullRequestMode"]:checked').value,
      addressReviews: getElement('input[name="addressReviews"]').checked,
      fixCI: getElement('input[name="fixCI"]').checked,
      resolveConflicts: getElement('input[name="resolveConflicts"]').checked,
      mergePullRequest: getElement('select[name="mergePullRequest"]').value,
    }
  }

  function getAgentMergeSurfaceStatus() {
    const commandCenterTrigger = getElement('.agent-merge-status-trigger')
    const sessionItem = getElement('.session-item[aria-current="page"]')
    const sessionStatus = getElement('[data-agent-merge-surface="session"]')
    const sessionStatusLabel = getElement('[data-agent-merge-status-label]')

    return {
      commandCenter: {
        label: getText('.command-center-status'),
        state: commandCenterTrigger.getAttribute('data-agent-merge-state'),
        accessibleLabel: commandCenterTrigger.getAttribute('aria-label'),
      },
      sessionList: {
        label: getText(
          '.session-item[aria-current="page"] .session-details-row',
        ),
        state: sessionItem.getAttribute('data-agent-merge-state'),
      },
      session: {
        label: getText('[data-agent-merge-status-label]'),
        state: sessionStatus.getAttribute('data-agent-merge-state'),
        accessibleLabel: sessionStatusLabel.getAttribute('aria-label'),
      },
    }
  }

  test('starts after feature completion and before pull request creation', () => {
    mountApp()

    assert.deepEqual(
      {
        theme: getElement('.prototype-app').getAttribute('data-theme'),
        variantControls: {
          selected: getElement('input[name="handlingVariant"]:checked').value,
          pullRequestSettingsVisible: Boolean(
            container.querySelector(
              'input[name="showChangesPullRequestSettings"]',
            ),
          ),
          options: Array.from(
            container.querySelectorAll('.variant-switcher label'),
            option => option.textContent.trim(),
          ),
          outsideWorkbench: !getElement('.prototype-layout').contains(
            getElement('.prototype-variant-controls'),
          ),
        },
        newButton: {
          label: getText('.new-session-label'),
          shortcut: getText('.new-session-shortcut'),
          accessibleLabel: getElement(
            '.new-session-button',
          ).getAttribute('aria-label'),
          iconCount: getElement('.new-session-button').querySelectorAll(
            '.codicon',
          ).length,
        },
        commandCenter: {
          project: getText('.project-picker-title'),
          accessibleLabel:
            getElement('.project-picker').getAttribute('aria-label'),
          openInVSCodePresent: Boolean(
            container.querySelector('[aria-label="Open in VS Code"]'),
          ),
        },
        request: getText('.chat-request'),
        completion: getText('.chat-response > p:first-of-type'),
        responseLabel: getElement('.chat-response').getAttribute('aria-label'),
        agentAuthorRows: container.querySelectorAll('.response-heading').length,
        chatRepositoryAction: Boolean(
          container.querySelector('.repository-action'),
        ),
        pullRequestMentioned: container.textContent.includes('#333964'),
        agentMergeCard: Boolean(container.querySelector('.agent-merge')),
        agentMergeSettingsAction: Boolean(
          container.querySelector('.workbench-agent-merge-settings'),
        ),
        sessions: {
          count: container.querySelectorAll('[data-session-id]').length,
          active: getText('.session-item[aria-current="page"] strong'),
          state: getText(
            '.session-item[aria-current="page"] .session-details-row',
          ),
          iconCounts: Array.from(
            container.querySelectorAll('[data-session-id]'),
            session => session.querySelectorAll('.codicon').length,
          ),
        },
        changes: {
          branch: getText('.pull-request-heading strong'),
          hasTarget: document.querySelector('.pull-request-heading span') !== null,
          action: getText('.changes-repository-action'),
          label: getElement('.changes-part').getAttribute('aria-label'),
        },
        announcement: getElement('[aria-live="polite"]').textContent,
      },
      {
        theme: 'dark',
        variantControls: {
          selected: 'permissions',
          pullRequestSettingsVisible: false,
          options: ['Permissions', 'Autonomy scale', 'Roles'],
          outsideWorkbench: true,
        },
        newButton: {
          label: 'New',
          shortcut: '⌘ N',
          accessibleLabel: 'New Session, Command N',
          iconCount: 0,
        },
        commandCenter: {
          project: 'vscode',
          accessibleLabel: 'Show Workspace: vscode',
          openInVSCodePresent: false,
        },
        request: 'Build the Agent Merge UX prototype.',
        completion:
          'I finished the Agent Merge UX prototype and added focused tests. Everything is ready for review.',
        responseLabel: 'Agent response',
        agentAuthorRows: 0,
        chatRepositoryAction: false,
        pullRequestMentioned: false,
        agentMergeCard: false,
        agentMergeSettingsAction: false,
        sessions: {
          count: 3,
          active: 'Prototype Agent Merge UX',
          state: 'Changes ready to commit·now',
          iconCounts: [1, 1, 1],
        },
        changes: {
          branch: 'prototype/agent-merge-ux',
          hasTarget: false,
          action: 'Commit changes',
          label: 'Feature changes',
        },
        announcement:
          'Previewing Prototype feature. Feature work is complete. Changes are ready to commit.',
      },
    )
  })

  test('toggles the right-side Changes panel from the title bar', async () => {
    mountApp()

    const detailsToggle = getElement('.details-toggle')
    const initial = {
      label: detailsToggle.getAttribute('aria-label'),
      pressed: detailsToggle.getAttribute('aria-pressed'),
      controls: detailsToggle.getAttribute('aria-controls'),
      panelLabel: getElement('#changes-part').getAttribute('aria-label'),
    }

    detailsToggle.click()
    await nextTick()
    const hidden = {
      label: detailsToggle.getAttribute('aria-label'),
      pressed: detailsToggle.getAttribute('aria-pressed'),
      panelPresent: Boolean(container.querySelector('#changes-part')),
    }

    detailsToggle.click()
    await nextTick()
    const restored = {
      label: detailsToggle.getAttribute('aria-label'),
      pressed: detailsToggle.getAttribute('aria-pressed'),
      panelLabel: getElement('#changes-part').getAttribute('aria-label'),
    }

    assert.deepEqual(
      { initial, hidden, restored },
      {
        initial: {
          label: 'Hide Details',
          pressed: 'true',
          controls: 'changes-part',
          panelLabel: 'Feature changes',
        },
        hidden: {
          label: 'Show Details',
          pressed: 'false',
          panelPresent: false,
        },
        restored: {
          label: 'Hide Details',
          pressed: 'true',
          panelLabel: 'Feature changes',
        },
      },
    )
  })

  test('progresses through commit, publish, and pull request readiness', async () => {
    mountApp()

    const getRepositoryState = () => ({
      prompt: container.querySelector('.repository-action-question')
        ?.textContent.replace(/\s+/g, ' ')
        .trim(),
      chatAction: container.querySelector('.repository-action')
        ?.textContent.replace(/\s+/g, ' ')
        .trim(),
      changesAction: getText('.changes-repository-action'),
      actionKind: getElement('.changes-repository-action').getAttribute(
        'data-repository-action',
      ),
      sessionState: getText(
        '.session-item[aria-current="page"] .session-details-row',
      ),
      sessionIcon: Array.from(
        getElement(
          '.session-item[aria-current="page"] .session-status-icon .codicon',
        ).classList,
      ).find(className => className !== 'codicon'),
      dialogPresent: Boolean(container.querySelector('[role="dialog"]')),
      announcement: getElement('[aria-live="polite"]').textContent,
    })

    const initial = getRepositoryState()
    getElement('.changes-repository-action').click()
    await nextTick()
    await nextTick()
    const committed = getRepositoryState()
    getElement('.changes-repository-action').click()
    await nextTick()
    await nextTick()
    const published = getRepositoryState()

    assert.deepEqual(
      { initial, committed, published },
      {
        initial: {
          prompt: undefined,
          chatAction: undefined,
          changesAction: 'Commit changes',
          actionKind: 'commit',
          sessionState: 'Changes ready to commit·now',
          sessionIcon: 'codicon-source-control',
          dialogPresent: false,
          announcement:
            'Previewing Prototype feature. Feature work is complete. Changes are ready to commit.',
        },
        committed: {
          prompt: undefined,
          chatAction: undefined,
          changesAction: 'Publish branch',
          actionKind: 'publish',
          sessionState: 'Changes committed·now',
          sessionIcon: 'codicon-git-commit',
          dialogPresent: false,
          announcement:
            'Previewing Prototype feature. Changes committed. The branch is ready to publish.',
        },
        published: {
          prompt:
            'The branch is published. Would you like me to create a pull request?',
          chatAction: 'Create pull request',
          changesAction: 'Create pull request',
          actionKind: 'create-pull-request',
          sessionState: 'Branch published·now',
          sessionIcon: 'codicon-repo-push',
          dialogPresent: false,
          announcement:
            'Previewing Prototype feature. Branch published. Ready to create a pull request.',
        },
      },
    )
  })

  test('retains independent workflow state across session navigation', async () => {
    mountApp()

    await openCreatePullRequestDialog()
    await setFieldValue(
      'input[name="pullRequestTitle"]',
      'Retained Agent Merge state',
    )
    await continueToHandlingStep()
    getElement('input[name="fixCI"]').click()
    await nextTick()
    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    getElement('[data-session-id="secure"]').click()
    await nextTick()
    await nextTick()
    const prototypeWhileInactive = {
      state: getText(
        '[data-session-id="prototype"] .session-details-row',
      ),
      agentMergeState: getElement(
        '[data-session-id="prototype"]',
      ).getAttribute('data-agent-merge-state'),
      repositoryState: getElement(
        '[data-session-id="prototype"]',
      ).getAttribute('data-repository-state'),
    }

    assert.equal(getText('.changes-repository-action'), 'Publish branch')
    getElement('.changes-repository-action').click()
    await nextTick()
    await nextTick()

    getElement('[data-session-id="regular"]').click()
    await nextTick()
    await nextTick()
    const secureWhileInactive = {
      state: getText('[data-session-id="secure"] .session-details-row'),
      repositoryState: getElement(
        '[data-session-id="secure"]',
      ).getAttribute('data-repository-state'),
    }

    getElement('[data-session-id="prototype"]').click()
    await nextTick()
    await nextTick()
    const restoredPrototype = {
      createdMessagePresent: Boolean(
        container.querySelector('.pull-request-created-message'),
      ),
      status: getText('[data-agent-merge-status-label]'),
      settingsAction: getText('.workbench-agent-merge-settings'),
      expanded: getElement('.agent-merge-disclosure').getAttribute(
        'aria-expanded',
      ),
    }
    getElement('.agent-merge-disclosure').click()
    await nextTick()
    const retainedPullRequestTitle = getText('.pull-request-pill')

    getElement('[data-session-id="secure"]').click()
    await nextTick()
    await nextTick()
    const restoredSecure = {
      action: getText('.changes-repository-action'),
      repositoryState: getElement(
        '[data-session-id="secure"]',
      ).getAttribute('data-repository-state'),
    }

    assert.deepEqual(
      {
        prototypeWhileInactive,
        secureWhileInactive,
        restoredPrototype,
        retainedPullRequestTitle,
        restoredSecure,
      },
      {
        prototypeWhileInactive: {
          state: '#333964 · Addressing review comments·now',
          agentMergeState: 'working',
          repositoryState: 'published',
        },
        secureWhileInactive: {
          state: 'Branch published·12m',
          repositoryState: 'published',
        },
        restoredPrototype: {
          createdMessagePresent: true,
          status: 'Addressing review comments',
          settingsAction: 'Update Agent Merge Settings',
          expanded: 'false',
        },
        retainedPullRequestTitle:
          '#333964 Retained Agent Merge state',
        restoredSecure: {
          action: 'Create pull request',
          repositoryState: 'published',
        },
      },
    )
  })

  test('shows a compact status preview for inactive Agent Merge sessions', async () => {
    mountApp()

    await openCreatePullRequestDialog()
    await continueToHandlingStep()
    getElement('.primary-button').click()
    await nextTick()
    await nextTick()
    getElement('[data-session-id="secure"]').click()
    await nextTick()
    await nextTick()

    const inactiveSession = getElement('[data-session-id="prototype"]')
    const inactiveSessionContainer = inactiveSession.parentElement
    const initial = {
      hasPopup: inactiveSession.getAttribute('aria-haspopup'),
      expanded: inactiveSession.getAttribute('aria-expanded'),
      overlayPresent: Boolean(
        container.querySelector('.session-status-hover-widget'),
      ),
    }

    vi.useFakeTimers()
    inactiveSessionContainer.dispatchEvent(new MouseEvent('mouseenter'))
    await nextTick()
    await vi.advanceTimersByTimeAsync(999)
    await nextTick()
    const beforeDelay = {
      expanded: inactiveSession.getAttribute('aria-expanded'),
      overlayPresent: Boolean(
        container.querySelector('.session-status-hover-widget'),
      ),
    }
    await vi.advanceTimersByTimeAsync(1)
    await nextTick()
    const overlay = getElement('.session-status-hover-widget')
    const hoverState = {
      expanded: inactiveSession.getAttribute('aria-expanded'),
      role: getElement('.agent-merge-status-overlay').getAttribute('role'),
      title: getText(
        `#${getElement('.agent-merge-status-overlay').getAttribute(
          'aria-labelledby',
        )}`,
      ),
      titleArea: getText('.status-overlay-heading'),
      description: getText('.status-overlay-description'),
      pullRequest: getElement(
        '.status-overlay-pull-request',
      ).getAttribute('aria-label'),
      permissionsPresent: Boolean(
        overlay.querySelector('.status-overlay-permissions'),
      ),
      footerPresent: Boolean(
        overlay.querySelector('.status-overlay-footer'),
      ),
      activeSession: getText('.session-item[aria-current="page"] strong'),
    }

    inactiveSessionContainer.dispatchEvent(
      new MouseEvent('mouseleave', { relatedTarget: document.body }),
    )
    await nextTick()
    const afterHover = {
      expanded: inactiveSession.getAttribute('aria-expanded'),
      overlayPresent: Boolean(
        container.querySelector('.session-status-hover-widget'),
      ),
    }

    inactiveSession.focus()
    await nextTick()
    await nextTick()
    const keyboardOverlay = getElement('.agent-merge-status-overlay')
    getElement('.status-overlay-pull-request').focus()
    await nextTick()
    const keyboardState = {
      expanded: inactiveSession.getAttribute('aria-expanded'),
      overlayPresent: Boolean(
        container.querySelector('.session-status-hover-widget'),
      ),
    }

    keyboardOverlay.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await nextTick()
    await nextTick()

    assert.deepEqual(
      {
        initial,
        beforeDelay,
        hoverState,
        afterHover,
        keyboardState,
        afterEscape: {
          expanded: inactiveSession.getAttribute('aria-expanded'),
          overlayPresent: Boolean(
            container.querySelector('.session-status-hover-widget'),
          ),
          focusRestored: document.activeElement === inactiveSession,
        },
      },
      {
        initial: {
          hasPopup: 'dialog',
          expanded: 'false',
          overlayPresent: false,
        },
        beforeDelay: {
          expanded: 'false',
          overlayPresent: false,
        },
        hoverState: {
          expanded: 'true',
          role: 'dialog',
          title: 'Addressing feedback',
          titleArea: 'Addressing feedback',
          description:
            'Open this session to view details or change Agent Merge settings.',
          pullRequest:
            'Open pull request #333964: Prototype Agent Merge UX. main from prototype/agent-merge-ux.',
          permissionsPresent: false,
          footerPresent: false,
          activeSession: 'security: harden credential storage',
        },
        afterHover: {
          expanded: 'false',
          overlayPresent: false,
        },
        keyboardState: {
          expanded: 'true',
          overlayPresent: true,
        },
        afterEscape: {
          expanded: 'false',
          overlayPresent: false,
          focusRestored: true,
        },
      },
    )
  })

  test('opens pull request creation from Changes and restores focus', async () => {
    mountApp()
    const trigger = await openCreatePullRequestDialog(
      '.changes-repository-action',
    )
    const dialog = getElement('[role="dialog"]')
    const opened = {
      title: getText(`#${dialog.getAttribute('aria-labelledby')}`),
      focusedControl: document.activeElement.getAttribute('name'),
    }

    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await nextTick()
    await nextTick()

    assert.deepEqual(
      {
        opened,
        closed: {
          dialogPresent: Boolean(container.querySelector('[role="dialog"]')),
          focusRestored: document.activeElement === trigger,
        },
      },
      {
        opened: {
          title: 'Create pull request',
          focusedControl: 'pullRequestTitle',
        },
        closed: {
          dialogPresent: false,
          focusRestored: true,
        },
      },
    )
  })

  test('opens an accessible pull request configuration dialog and restores focus on cancel', async () => {
    mountApp()
    await openCreatePullRequestDialog()

    const dialog = getElement('[role="dialog"]')
    const detailsStep = {
      modal: dialog.getAttribute('aria-modal'),
      closeButtonPresent: Boolean(
        dialog.querySelector('[aria-label="Close Create Pull Request"]'),
      ),
      title: getText(`#${dialog.getAttribute('aria-labelledby')}`),
      description: getText(`#${dialog.getAttribute('aria-describedby')}`),
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      focusedControl: document.activeElement.getAttribute('name'),
      pullRequestTitle: getElement('input[name="pullRequestTitle"]').value,
      pullRequestDescription: getElement(
        'textarea[name="pullRequestDescription"]',
      ).value,
      baseBranch: getElement('select[name="pullRequestBaseBranch"]').value,
      sourceBranch: getText('.source-branch'),
    }

    await continueToHandlingStep()
    const handlingStep = {
      description: getText(`#${dialog.getAttribute('aria-describedby')}`),
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      completedStepIcon: getElement(
        '.dialog-steps li.complete .codicon',
      ).className,
      creationModeLabel: getElement('.creation-mode').getAttribute('aria-label'),
      branchSummary: getText('.branch-summary'),
      focusedControl: document.activeElement.getAttribute('name'),
      settings: getAgentMergeDialogSettings(),
    }

    getElement('.back-button').click()
    await nextTick()
    await nextTick()
    const returnedToDetails = {
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      focusedControl: document.activeElement.getAttribute('name'),
    }

    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await nextTick()
    await nextTick()

    assert.deepEqual(
      {
        detailsStep,
        handlingStep,
        returnedToDetails,
        cancelled: {
          dialogPresent: Boolean(container.querySelector('[role="dialog"]')),
          focusRestored: document.activeElement.classList.contains(
            'repository-action',
          ),
        },
      },
      {
        detailsStep: {
          modal: 'true',
          closeButtonPresent: false,
          title: 'Create pull request',
          description: 'Review the pull request details.',
          currentStep: '1 Details',
          focusedControl: 'pullRequestTitle',
          pullRequestTitle: 'Prototype Agent Merge UX',
          pullRequestDescription:
            'Adds a focused prototype for exploring Agent Merge setup and post-creation controls.',
          baseBranch: 'main',
          sourceBranch: 'From prototype/agent-merge-ux',
        },
        handlingStep: {
          description:
            'Choose what happens after the pull request is created.',
          currentStep: '2 Handling',
          completedStepIcon: 'codicon codicon-check',
          creationModeLabel: 'Pull request behavior',
          branchSummary: 'main ← prototype/agent-merge-ux',
          focusedControl: 'pullRequestMode',
          settings: {
            mode: 'agentMerge',
            addressReviews: true,
            fixCI: true,
            resolveConflicts: true,
            mergePullRequest: 'always',
          },
        },
        returnedToDetails: {
          currentStep: '1 Details',
          focusedControl: 'pullRequestTitle',
        },
        cancelled: {
          dialogPresent: false,
          focusRestored: true,
        },
      },
    )
  })

  test('shows pull request settings in Changes only for active pull requests', async () => {
    mountApp()

    const beforePullRequest = {
      settingVisible: Boolean(
        container.querySelector(
          'input[name="showChangesPullRequestSettings"]',
        ),
      ),
      handlingDesignPresent: Boolean(
        container.querySelector('.handling-variant-control'),
      ),
    }

    await openCreatePullRequestDialog()
    const creationDetails = {
      steps: getText('.dialog-steps'),
      primaryAction: getText('.primary-button'),
    }
    await continueToHandlingStep()
    const creationHandling = {
      handlingVariant: getElement(
        '.create-pr-dialog',
      ).getAttribute('data-handling-variant'),
      settings: getAgentMergeDialogSettings(),
      primaryAction: getText('.primary-button'),
    }
    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    const settingsUiToggle = getElement(
      'input[name="showChangesPullRequestSettings"]',
    )
    const afterPullRequestCreation = {
      role: settingsUiToggle.getAttribute('role'),
      label: getText('.prototype-settings-toggle'),
      checked: settingsUiToggle.checked,
      pullRequest: getText('.pull-request-heading strong'),
      settingsAction: getText('.workbench-agent-merge-settings'),
    }

    settingsUiToggle.click()
    await nextTick()
    await nextTick()
    getElement('.agent-merge-status-trigger').click()
    await nextTick()
    const controlsWhileChangesSettingIsOff = {
      pullRequest: getText('.pull-request-heading strong'),
      settingsActionPresent: Boolean(
        container.querySelector('.workbench-agent-merge-settings'),
      ),
      handlingDesignPresent: Boolean(
        container.querySelector('.handling-variant-control'),
      ),
      triggerLabel: getElement(
        '.agent-merge-status-trigger',
      ).getAttribute('aria-label'),
      handlingVariant: getElement(
        '.agent-merge-status-overlay',
      ).getAttribute('data-handling-variant'),
      description: getText('.status-overlay-description'),
      permissionsPresent: Boolean(
        container.querySelector('.status-overlay-permissions'),
      ),
      footerPresent: Boolean(
        container.querySelector('.status-overlay-footer'),
      ),
    }

    getElement('.agent-merge-status-trigger').click()
    await nextTick()
    getElement('[data-session-id="secure"]').click()
    await nextTick()
    await nextTick()
    const inactivePullRequest = {
      settingVisible: Boolean(
        container.querySelector(
          'input[name="showChangesPullRequestSettings"]',
        ),
      ),
      handlingDesignPresent: Boolean(
        container.querySelector('.handling-variant-control'),
      ),
    }

    getElement('[data-session-id="prototype"]').click()
    await nextTick()
    await nextTick()
    const restoredToggle = getElement(
      'input[name="showChangesPullRequestSettings"]',
    )
    const returnedToActivePullRequest = {
      checked: restoredToggle.checked,
      pullRequest: getText('.pull-request-heading strong'),
      settingsActionPresent: Boolean(
        container.querySelector('.workbench-agent-merge-settings'),
      ),
      handlingDesignPresent: Boolean(
        container.querySelector('.handling-variant-control'),
      ),
    }

    restoredToggle.click()
    await nextTick()
    await nextTick()
    const restored = {
      checked: restoredToggle.checked,
      settingsAction: getText('.workbench-agent-merge-settings'),
    }

    getElement('.workbench-agent-merge-settings').click()
    await nextTick()
    await nextTick()
    const settingsDialogOpened = getElement(
      '.create-pr-dialog',
    ).getAttribute('data-dialog-mode')
    restoredToggle.click()
    await nextTick()
    await nextTick()
    const hiddenWhileConfiguring = {
      dialogPresent: Boolean(container.querySelector('[role="dialog"]')),
      settingsActionPresent: Boolean(
        container.querySelector('.workbench-agent-merge-settings'),
      ),
    }

    assert.deepEqual(
      {
        beforePullRequest,
        creationDetails,
        creationHandling,
        afterPullRequestCreation,
        controlsWhileChangesSettingIsOff,
        inactivePullRequest,
        returnedToActivePullRequest,
        restored,
        settingsDialogOpened,
        hiddenWhileConfiguring,
      },
      {
        beforePullRequest: {
          settingVisible: false,
          handlingDesignPresent: true,
        },
        creationDetails: {
          steps: '1 Details 2 Handling',
          primaryAction: 'Continue',
        },
        creationHandling: {
          handlingVariant: 'permissions',
          settings: {
            mode: 'agentMerge',
            addressReviews: true,
            fixCI: true,
            resolveConflicts: true,
            mergePullRequest: 'always',
          },
          primaryAction: 'Create pull request',
        },
        afterPullRequestCreation: {
          role: 'switch',
          label: 'PR settings in Changes',
          checked: true,
          pullRequest: '#333964',
          settingsAction: 'Update Agent Merge Settings',
        },
        controlsWhileChangesSettingIsOff: {
          pullRequest: '#333964',
          settingsActionPresent: false,
          handlingDesignPresent: true,
          triggerLabel:
            'Agent Merge status: Addressing feedback. Show details and controls.',
          handlingVariant: 'permissions',
          description:
            'Control what the agent may change while it works on this pull request.',
          permissionsPresent: true,
          footerPresent: true,
        },
        inactivePullRequest: {
          settingVisible: false,
          handlingDesignPresent: true,
        },
        returnedToActivePullRequest: {
          checked: false,
          pullRequest: '#333964',
          settingsActionPresent: false,
          handlingDesignPresent: true,
        },
        restored: {
          checked: true,
          settingsAction: 'Update Agent Merge Settings',
        },
        settingsDialogOpened: 'agent-merge-settings',
        hiddenWhileConfiguring: {
          dialogPresent: false,
          settingsActionPresent: false,
        },
      },
    )
  })

  test('presents pull request follow ups in the Sessions automations group', async () => {
    mountApp()

    const beforePullRequest = {
      variantSelectorPresent: Boolean(
        container.querySelector('input[name="followUpVariant"]'),
      ),
      location: getElement('.sessions-sidebar').contains(
        getElement('.follow-ups-surface'),
      ),
      heading: getText('.follow-ups-heading'),
      headingIcon: getElement(
        '.follow-ups-heading .codicon-calendar',
      ).className,
      expanded: getElement(
        '.follow-ups-heading-button',
      ).getAttribute('aria-expanded'),
      createActionPresent: Boolean(
        container.querySelector('.follow-ups-create-action'),
      ),
      configuredCount:
        container.querySelectorAll('.follow-up-automation').length,
    }

    await openCreatePullRequestDialog()
    await continueToHandlingStep()
    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    const automationsPrompt = {
      location: getElement('.sessions-sidebar').contains(
        getElement('.follow-ups-surface'),
      ),
      inChanges: Boolean(
        container.querySelector('.changes-part .follow-ups-surface'),
      ),
      inTranscript: Boolean(
        container.querySelector('.chat-transcript .follow-ups-surface'),
      ),
      heading: getText('.follow-ups-heading'),
      action: getText('.follow-ups-create-action'),
      configuredCount:
        container.querySelectorAll('.follow-up-automation').length,
    }
    const automationsHeading = getElement('.follow-ups-heading-button')
    automationsHeading.click()
    await nextTick()
    const collapsed = {
      expanded: automationsHeading.getAttribute('aria-expanded'),
      contentHidden: getElement('.follow-ups-content').hidden,
      chevron: getElement(
        '.follow-ups-heading-button > .codicon:first-child',
      ).className,
    }
    automationsHeading.click()
    await nextTick()
    const expanded = {
      expanded: automationsHeading.getAttribute('aria-expanded'),
      contentHidden: getElement('.follow-ups-content').hidden,
      chevron: getElement(
        '.follow-ups-heading-button > .codicon:first-child',
      ).className,
    }

    const createTrigger = getElement('.follow-ups-create-action')
    createTrigger.click()
    await nextTick()
    await nextTick()
    const createDialog = getElement('.create-follow-up-dialog')
    const progressiveInputs = {
      triggerType: getElement(
        'input[name="followUpTriggerType"]:checked',
      ).value,
      eventFieldsPresent: Boolean(
        container.querySelector('[data-trigger-fields="event"]'),
      ),
      timeFieldsPresent: Boolean(
        container.querySelector('[data-trigger-fields="time"]'),
      ),
      eventIcon: getElement(
        'input[name="followUpTriggerType"][value="event"]',
      ).parentElement.querySelector('.codicon').className,
      delayFieldPresent: Boolean(
        container.querySelector('input[name="followUpDelay"]'),
      ),
      outputFilePresent: Boolean(
        container.querySelector('.follow-up-output-file'),
      ),
      summaryFieldPresent: Boolean(
        container.querySelector('input[name="followUpDescription"]'),
      ),
      instructionTabs: Array.from(
        container.querySelectorAll('[role="tab"]'),
        tab => ({
          label: tab.textContent.trim(),
          selected: tab.getAttribute('aria-selected'),
        }),
      ),
      oneInstructionPerLinePresent:
        createDialog.textContent.includes('one instruction per line'),
    }
    const initialFieldFocused =
      document.activeElement ===
      getElement('input[name="followUpName"]')
    const manualTab = getElement('[data-instruction-mode="manual"]')
    manualTab.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      }),
    )
    await nextTick()
    await nextTick()
    const uploadTab = getElement('[data-instruction-mode="upload"]')
    const tabKeyboardNavigation = {
      uploadSelected: uploadTab.getAttribute('aria-selected'),
      uploadFocused: document.activeElement === uploadTab,
    }
    uploadTab.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
      }),
    )
    await nextTick()
    await nextTick()
    tabKeyboardNavigation.manualSelected =
      manualTab.getAttribute('aria-selected')
    tabKeyboardNavigation.manualFocused =
      document.activeElement === manualTab
    const sourceSelect = getElement('select[name="followUpSource"]')
    const eventSelect = getElement('select[name="followUpEvent"]')
    const eventDropdowns = {
      sourceElement: sourceSelect.tagName,
      selectedSource: sourceSelect.value,
      sourceOptions: Array.from(sourceSelect.options, option => option.value),
      eventElement: eventSelect.tagName,
      selectedEvent: eventSelect.value,
      eventOptions: Array.from(eventSelect.options, option => ({
        label: option.textContent.trim(),
        value: option.value,
      })),
    }
    await setFieldValue(
      'select[name="followUpSource"]',
      'Release webhook',
      'change',
    )
    const releaseEvents = {
      selectedEvent: eventSelect.value,
      options: Array.from(eventSelect.options, option => option.value),
    }
    await setFieldValue(
      'select[name="followUpSource"]',
      'GitHub webhook',
      'change',
    )
    await setFieldValue(
      'select[name="followUpEvent"]',
      'pull_request.merged',
      'change',
    )
    const creation = {
      role: createDialog.getAttribute('role'),
      modal: createDialog.getAttribute('aria-modal'),
      title: getText(`#${createDialog.getAttribute('aria-labelledby')}`),
      description: getText(
        `#${createDialog.getAttribute('aria-describedby')}`,
      ),
      name: getElement('input[name="followUpName"]').value,
      source: getElement('select[name="followUpSource"]').value,
      event: getElement('select[name="followUpEvent"]').value,
      instructions: getElement(
        'textarea[name="followUpInstructions"]',
      ).value,
      focused: initialFieldFocused,
    }
    getElement('.create-follow-up-dialog .primary-button').click()
    await nextTick()
    await nextTick()

    const firstAutomation = getElement('.follow-up-automation:first-child')
    const automations = {
      location: getElement('.sessions-sidebar').contains(
        getElement('.follow-ups-surface'),
      ),
      count: container.querySelectorAll('.follow-up-automation').length,
      names: Array.from(
        container.querySelectorAll('.follow-up-automation strong'),
        element => element.textContent.trim(),
      ),
      statuses: Array.from(
        container.querySelectorAll(
          '.follow-up-automation-content > span',
        ),
        element => element.textContent.trim(),
      ),
      accessibleLabels: Array.from(
        container.querySelectorAll('.follow-up-automation'),
        element => element.getAttribute('aria-label'),
      ),
      createAnotherAction: getText('.follow-ups-create-action'),
      createdItemFocused: document.activeElement === firstAutomation,
    }

    firstAutomation.click()
    await nextTick()
    await nextTick()
    const dialog = getElement('.follow-up-dialog')
    const details = {
      role: dialog.getAttribute('role'),
      modal: dialog.getAttribute('aria-modal'),
      title: getText(`#${dialog.getAttribute('aria-labelledby')}`),
      description: getText(
        `#${dialog.getAttribute('aria-describedby')}`,
      ),
      status: getText('.follow-up-status'),
      trigger: {
        label: getText('.follow-up-definition > div:first-child strong'),
        metadata: getText(
          '.follow-up-definition > div:first-child dd span',
        ),
      },
      delay: {
        label: getText('.follow-up-definition > div:nth-child(2) strong'),
        value: getText('.follow-up-definition > div:nth-child(2) dd span'),
      },
      file: getText('.follow-up-definition code'),
      pullRequest: {
        title: getText('.follow-up-pull-request strong'),
        branch: getText('.follow-up-pull-request span span'),
      },
      instructions: getText('.follow-up-instructions pre'),
      markdown: getText('.follow-up-markdown pre'),
      focused: document.activeElement === dialog,
    }
    dialog.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      }),
    )
    const reverseFocusWrapped =
      document.activeElement === dialog.querySelector('.secondary-button')
    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
    )
    const forwardFocusWrapped =
      document.activeElement ===
      dialog.querySelector('header button')
    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await nextTick()
    await nextTick()
    const focusRestored = document.activeElement === firstAutomation

    getElement('[data-session-id="secure"]').click()
    await nextTick()
    await nextTick()
    const withoutActivePullRequest = {
      location: getElement('.sessions-sidebar').contains(
        getElement('.follow-ups-surface'),
      ),
      heading: getText('.follow-ups-heading'),
      createActionPresent: Boolean(
        container.querySelector('.follow-ups-create-action'),
      ),
      configuredCount:
        container.querySelectorAll('.follow-up-automation').length,
    }

    getElement('[data-session-id="prototype"]').click()
    await nextTick()
    await nextTick()
    const restored = {
      location: getElement('.sessions-sidebar').contains(
        getElement('.follow-ups-surface'),
      ),
      createAction: getText('.follow-ups-create-action'),
      names: Array.from(
        container.querySelectorAll('.follow-up-automation strong'),
        element => element.textContent.trim(),
      ),
    }

    assert.deepEqual(
      {
        beforePullRequest,
        automationsPrompt,
        collapsed,
        expanded,
        progressiveInputs,
        tabKeyboardNavigation,
        eventDropdowns,
        releaseEvents,
        creation,
        automations,
        details,
        reverseFocusWrapped,
        forwardFocusWrapped,
        focusRestored,
        withoutActivePullRequest,
        restored,
      },
      {
        beforePullRequest: {
          variantSelectorPresent: false,
          location: true,
          heading: 'Automations',
          headingIcon: 'codicon codicon-calendar',
          expanded: 'true',
          createActionPresent: false,
          configuredCount: 0,
        },
        automationsPrompt: {
          location: true,
          inChanges: false,
          inTranscript: false,
          heading: 'Automations',
          action: 'Create Follow Up',
          configuredCount: 0,
        },
        collapsed: {
          expanded: 'false',
          contentHidden: true,
          chevron: 'codicon codicon-chevron-right',
        },
        expanded: {
          expanded: 'true',
          contentHidden: false,
          chevron: 'codicon codicon-chevron-down',
        },
        progressiveInputs: {
          triggerType: 'event',
          eventFieldsPresent: true,
          timeFieldsPresent: false,
          eventIcon: 'codicon codicon-zap',
          delayFieldPresent: false,
          outputFilePresent: false,
          summaryFieldPresent: false,
          instructionTabs: [
            { label: 'Write Instructions', selected: 'true' },
            { label: 'Upload Markdown', selected: 'false' },
          ],
          oneInstructionPerLinePresent: false,
        },
        tabKeyboardNavigation: {
          uploadSelected: 'true',
          uploadFocused: true,
          manualSelected: 'true',
          manualFocused: true,
        },
        eventDropdowns: {
          sourceElement: 'SELECT',
          selectedSource: 'GitHub webhook',
          sourceOptions: [
            'GitHub webhook',
            'Experiment service webhook',
            'Release webhook',
          ],
          eventElement: 'SELECT',
          selectedEvent: 'pull_request.merged',
          eventOptions: [
            {
              label: 'Pull request opened',
              value: 'pull_request.opened',
            },
            {
              label: 'Pull request ready for review',
              value: 'pull_request.ready_for_review',
            },
            {
              label: 'Pull request merged',
              value: 'pull_request.merged',
            },
            {
              label: 'Pull request closed',
              value: 'pull_request.closed',
            },
          ],
        },
        releaseEvents: {
          selectedEvent: 'release.published',
          options: [
            'release.published',
            'release.deployed',
            'release.rolled_back',
          ],
        },
        creation: {
          role: 'dialog',
          modal: 'true',
          title: 'Create Follow Up',
          description:
            'Schedule a future job for pull request #333964.',
          name: 'Deploy VS Code experiment',
          source: 'GitHub webhook',
          event: 'pull_request.merged',
          instructions:
            '## Task\n\nDeploy the Agent Merge experiment to 10% of VS Code Insiders.\n\n## Completion\n\nRecord the treatment and control identifiers on the pull request.\nEmit experiment.deployed with the experiment identifier when rollout completes.',
          focused: true,
        },
        automations: {
          location: true,
          count: 1,
          names: ['Deploy VS Code experiment'],
          statuses: ['Waiting for pull request merge'],
          accessibleLabels: [
            'Deploy VS Code experiment. Waiting for pull request merge. 1 week after merge.',
          ],
          createAnotherAction: 'New Follow Up',
          createdItemFocused: true,
        },
        details: {
          role: 'dialog',
          modal: 'true',
          title: 'Deploy VS Code experiment',
          description:
            'Deploy the Agent Merge experiment to 10% of VS Code Insiders.',
          status: 'Waiting for pull request merge',
          trigger: {
            label: 'Event based',
            metadata: 'GitHub webhook · pull_request.merged',
          },
          delay: {
            label: '1 week after merge',
            value: '7d',
          },
          file:
            '.github/follow-ups/deploy-vscode-experiment.followup.md',
          pullRequest: {
            title: '#333964 Prototype Agent Merge UX',
            branch: 'main ← prototype/agent-merge-ux',
          },
          instructions:
            '## Task Deploy the Agent Merge experiment to 10% of VS Code Insiders. ## Completion Record the treatment and control identifiers on the pull request. Emit experiment.deployed with the experiment identifier when rollout completes.',
          markdown:
            '--- version: 1 id: deploy-vscode-experiment name: Deploy VS Code experiment trigger: type: event source: GitHub webhook event: pull_request.merged delay: 7d --- ## Task Deploy the Agent Merge experiment to 10% of VS Code Insiders. ## Completion Record the treatment and control identifiers on the pull request. Emit experiment.deployed with the experiment identifier when rollout completes.',
          focused: true,
        },
        reverseFocusWrapped: true,
        forwardFocusWrapped: true,
        focusRestored: true,
        withoutActivePullRequest: {
          location: true,
          heading: 'Automations',
          createActionPresent: false,
          configuredCount: 0,
        },
        restored: {
          location: true,
          createAction: 'New Follow Up',
          names: ['Deploy VS Code experiment'],
        },
      },
    )
  })

  test('optionally configures a time-based Follow Up from an uploaded Markdown file in the pull request dialog', async () => {
    mountApp()

    await openCreatePullRequestDialog()
    await continueToHandlingStep()

    const beforeConfiguration = {
      checked: getElement('input[name="configureFollowUp"]').checked,
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      stepCount: container.querySelectorAll('.dialog-steps li').length,
      editorPresent: Boolean(container.querySelector('.follow-up-editor')),
      primaryAction: getText('.primary-button'),
    }

    getElement('input[name="configureFollowUp"]').click()
    await nextTick()
    await nextTick()

    const optedInHandling = {
      checked: getElement('input[name="configureFollowUp"]').checked,
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      steps: Array.from(
        container.querySelectorAll('.dialog-steps li'),
        item => item.textContent.replace(/\s+/g, ' ').trim(),
      ),
      editorPresent: Boolean(container.querySelector('.follow-up-editor')),
      optionDescription: getText('.follow-up-option-copy > span'),
      primaryAction: getText('.primary-button'),
    }

    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    const eventConfiguration = {
      description: getText(
        `#${getElement('.create-pr-dialog').getAttribute('aria-describedby')}`,
      ),
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      completedSteps: Array.from(
        container.querySelectorAll('.dialog-steps li.complete'),
        item => item.textContent.replace(/\s+/g, ' ').trim(),
      ),
      editorPresent: Boolean(container.querySelector('.follow-up-editor')),
      handlingPresent: Boolean(container.querySelector('.handling-step')),
      focusedControl: document.activeElement.getAttribute('name'),
      selectedTrigger: getElement(
        'input[name="followUpTriggerType"]:checked',
      ).value,
      eventFieldsPresent: Boolean(
        container.querySelector('[data-trigger-fields="event"]'),
      ),
      timeFieldsPresent: Boolean(
        container.querySelector('[data-trigger-fields="time"]'),
      ),
      manualTabSelected: getElement(
        '[data-instruction-mode="manual"]',
      ).getAttribute('aria-selected'),
      primaryAction: getText('.primary-button'),
    }

    getElement(
      'input[name="followUpTriggerType"][value="time"]',
    ).click()
    await nextTick()
    const timeConfiguration = {
      selectedTrigger: getElement(
        'input[name="followUpTriggerType"]:checked',
      ).value,
      eventFieldsPresent: Boolean(
        container.querySelector('[data-trigger-fields="event"]'),
      ),
      timeFieldsPresent: Boolean(
        container.querySelector('[data-trigger-fields="time"]'),
      ),
      createDisabled: getElement('.primary-button').disabled,
    }

    await setFieldValue('input[name="followUpDate"]', '2026-09-18')
    await setFieldValue('input[name="followUpTime"]', '09:30')
    await setFieldValue(
      'select[name="followUpTimeZone"]',
      'UTC',
      'change',
    )

    getElement('.back-button').click()
    await nextTick()
    await nextTick()
    const returnedToHandling = {
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      checked: getElement('input[name="configureFollowUp"]').checked,
      editorPresent: Boolean(container.querySelector('.follow-up-editor')),
      focusedControl: document.activeElement.getAttribute('name'),
      primaryAction: getText('.primary-button'),
    }

    getElement('.primary-button').click()
    await nextTick()
    await nextTick()
    const restoredFollowUp = {
      currentStep: getText('.dialog-steps [aria-current="step"]'),
      selectedTrigger: getElement(
        'input[name="followUpTriggerType"]:checked',
      ).value,
      scheduledDate: getElement('input[name="followUpDate"]').value,
      scheduledTime: getElement('input[name="followUpTime"]').value,
      timeZone: getElement('select[name="followUpTimeZone"]').value,
      focusedControl: document.activeElement.getAttribute('name'),
      createDisabled: getElement('.primary-button').disabled,
    }

    getElement('[data-instruction-mode="upload"]').click()
    await nextTick()
    const uploadInput = getElement('input[name="followUpFile"]')
    const markdownFile = new File(
      ['# Verify rollout\n\nSummarize the experiment results.'],
      'experiment-results.md',
      { type: 'text/markdown' },
    )
    Object.defineProperty(uploadInput, 'files', {
      configurable: true,
      value: [markdownFile],
    })
    uploadInput.dispatchEvent(new Event('change', { bubbles: true }))
    await new Promise(resolve => setTimeout(resolve, 20))
    await nextTick()

    const uploadConfiguration = {
      uploadTabSelected: getElement(
        '[data-instruction-mode="upload"]',
      ).getAttribute('aria-selected'),
      manualInputPresent: Boolean(
        container.querySelector('textarea[name="followUpInstructions"]'),
      ),
      uploadedFile: getText('.follow-up-uploaded-file code'),
      fileSharesPickerRow:
        getElement('.follow-up-file-picker').parentElement ===
        getElement('.follow-up-uploaded-file').parentElement,
      uploadErrorPresent: Boolean(
        container.querySelector('.follow-up-upload-error'),
      ),
      createDisabled: getElement('.primary-button').disabled,
    }

    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    const createdAutomation = getElement('.follow-up-automation')
    createdAutomation.click()
    await nextTick()
    await nextTick()
    const createdDialog = getElement('.follow-up-dialog')

    assert.deepEqual(
      {
        beforeConfiguration,
        optedInHandling,
        eventConfiguration,
        timeConfiguration,
        returnedToHandling,
        restoredFollowUp,
        uploadConfiguration,
        created: {
          description: getText(
            `#${createdDialog.getAttribute('aria-describedby')}`,
          ),
          status: getText('.follow-up-status'),
          timing: getText(
            '.follow-up-definition > div:nth-child(2) strong',
          ),
          timeZone: getText(
            '.follow-up-definition > div:nth-child(2) dd span',
          ),
          instructionSource: getText(
            '.follow-up-instructions-heading span',
          ),
          instructions: getText('.follow-up-instructions pre'),
          markdown: getText('.follow-up-markdown pre'),
        },
      },
      {
        beforeConfiguration: {
          checked: false,
          currentStep: '2 Handling',
          stepCount: 2,
          editorPresent: false,
          primaryAction: 'Create pull request',
        },
        optedInHandling: {
          checked: true,
          currentStep: '2 Handling',
          steps: ['Details', '2 Handling', '3 Follow Up'],
          editorPresent: false,
          optionDescription: 'Set up a future job on the next step.',
          primaryAction: 'Continue',
        },
        eventConfiguration: {
          description:
            'Choose when the follow up runs and what it should do.',
          currentStep: '3 Follow Up',
          completedSteps: ['Details', 'Handling'],
          editorPresent: true,
          handlingPresent: false,
          focusedControl: 'followUpName',
          selectedTrigger: 'event',
          eventFieldsPresent: true,
          timeFieldsPresent: false,
          manualTabSelected: 'true',
          primaryAction: 'Create pull request',
        },
        timeConfiguration: {
          selectedTrigger: 'time',
          eventFieldsPresent: false,
          timeFieldsPresent: true,
          createDisabled: true,
        },
        returnedToHandling: {
          currentStep: '2 Handling',
          checked: true,
          editorPresent: false,
          focusedControl: 'configureFollowUp',
          primaryAction: 'Continue',
        },
        restoredFollowUp: {
          currentStep: '3 Follow Up',
          selectedTrigger: 'time',
          scheduledDate: '2026-09-18',
          scheduledTime: '09:30',
          timeZone: 'UTC',
          focusedControl: 'followUpName',
          createDisabled: false,
        },
        uploadConfiguration: {
          uploadTabSelected: 'true',
          manualInputPresent: false,
          uploadedFile: 'experiment-results.md',
          fileSharesPickerRow: true,
          uploadErrorPresent: false,
          createDisabled: false,
        },
        created: {
          description: 'Summarize the experiment results.',
          status: 'Scheduled',
          timing: '2026-09-18 at 09:30 UTC',
          timeZone: 'UTC',
          instructionSource: 'Uploaded from experiment-results.md',
          instructions:
            '# Verify rollout Summarize the experiment results.',
          markdown:
            '--- version: 1 id: deploy-vscode-experiment name: Deploy VS Code experiment trigger: type: time date: 2026-09-18 time: 09:30 timezone: UTC --- # Verify rollout Summarize the experiment results.',
        },
      },
    )
  })

  test('creates a pull request with the full-control Agent Merge preset', async () => {
    mountApp()
    await openCreatePullRequestDialog()

    await setFieldValue(
      'input[name="pullRequestTitle"]',
      'Agent Merge creation flow',
    )
    await setFieldValue(
      'textarea[name="pullRequestDescription"]',
      'Explores a two-step pull request flow.',
    )
    await setFieldValue(
      'select[name="pullRequestBaseBranch"]',
      'release/1.109',
      'change',
    )
    await continueToHandlingStep()

    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    const agentMergeCardInitialState = {
      expanded: getElement('.agent-merge-disclosure').getAttribute(
        'aria-expanded',
      ),
      bodyPresent: Boolean(container.querySelector('.agent-merge-body')),
    }
    getElement('.agent-merge-disclosure').click()
    await nextTick()

    assert.deepEqual(
      {
        dialogPresent: Boolean(container.querySelector('[role="dialog"]')),
        duplicateConfirmation: Boolean(
          container.querySelector('.completed-action'),
        ),
        createdMessage: getText('.pull-request-created-message p'),
        createdMessageIcon: getElement(
          '.pull-request-created-message .codicon',
        ).classList.contains('codicon-git-pull-request'),
        createdMessageFocused:
          document.activeElement === getElement('.pull-request-created-message'),
        pullRequestTitle: getText('.pull-request-pill'),
        targetBranch: getText('.pull-request-heading span'),
        featureCompleteLabelPresent:
          container.textContent.includes('Feature complete'),
        agentMergeCardInitialState,
        sessionListIconCount: getElement(
          '.session-item[aria-current="page"]',
        ).querySelectorAll('.codicon').length,
        policy: getText('.agent-merge-policy'),
        status: getElement('.agent-merge').getAttribute('aria-label'),
        surfaceStatus: getAgentMergeSurfaceStatus(),
        changesLabel: getElement('.changes-part').getAttribute('aria-label'),
        settingsAction: getText('.workbench-agent-merge-settings'),
        announcement: getElement('[aria-live="polite"]').textContent,
      },
      {
        dialogPresent: false,
        duplicateConfirmation: false,
        createdMessage:
          'Created pull request #333964 from prototype/agent-merge-ux into release/1.109.',
        createdMessageIcon: true,
        createdMessageFocused: true,
        pullRequestTitle: '#333964 Agent Merge creation flow',
        targetBranch: 'release/1.109 ← prototype/agent-merge-ux',
        featureCompleteLabelPresent: false,
        agentMergeCardInitialState: {
          expanded: 'false',
          bodyPresent: false,
        },
        sessionListIconCount: 1,
        policy:
          'It may handle reviews, CI, conflicts. Merge automatically when ready.',
        status:
          'Agent Merge: Addressing feedback. 1 Review Comment and 1 Failing Check',
        surfaceStatus: {
          commandCenter: {
            label: 'Addressing feedback',
            state: 'working',
            accessibleLabel:
              'Agent Merge status: Addressing feedback. Show details and controls.',
          },
          sessionList: {
            label: '#333964 · Addressing feedback·now',
            state: 'working',
          },
          session: {
            label: 'Addressing feedback',
            state: 'working',
            accessibleLabel: 'Agent Merge status: Addressing feedback',
          },
        },
        changesLabel: 'Pull request changes',
        settingsAction: 'Update Agent Merge Settings',
        announcement:
          'Pull request 333964 created. Agent Merge status: Addressing feedback.',
      },
    )
  })

  test('switches Agent Merge handling designs over shared settings', async () => {
    mountApp()
    await openCreatePullRequestDialog()
    await continueToHandlingStep()

    const dialog = getElement('[role="dialog"]')
    const permissionsVariant = {
      variant: dialog.getAttribute('data-handling-variant'),
      checkboxCount: dialog.querySelectorAll(
        '.agent-merge-permissions .permission-checkbox',
      ).length,
      checkedVisualCount: dialog.querySelectorAll(
        '.permission-checkbox input:checked + .vscode-checkbox',
      ).length,
      settings: getAgentMergeDialogSettings(),
    }

    await selectHandlingVariant('scale')
    const autonomyInput = getElement('input[name="agentMergeAutonomy"]')
    const scaleVariant = {
      variant: dialog.getAttribute('data-handling-variant'),
      value: autonomyInput.value,
      valueText: autonomyInput.getAttribute('aria-valuetext'),
      stopCount: dialog.querySelectorAll('.autonomy-stop').length,
      completedStopCount: dialog.querySelectorAll('.autonomy-stop.complete')
        .length,
      remainingStart: getElement('.autonomy-range').style.getPropertyValue(
        '--autonomy-progress',
      ),
      summary: {
        level: getText('.autonomy-level-summary strong'),
        description: getText('.autonomy-level-summary span'),
      },
    }

    await setFieldValue('input[name="agentMergeAutonomy"]', '2')
    const midpointScale = {
      completedStopCount: dialog.querySelectorAll('.autonomy-stop.complete')
        .length,
      remainingStart: getElement('.autonomy-range').style.getPropertyValue(
        '--autonomy-progress',
      ),
    }
    await selectHandlingVariant('roles')
    const rolesVariant = {
      variant: dialog.getAttribute('data-handling-variant'),
      optionCount: dialog.querySelectorAll(
        'input[name="agentMergeRole"]',
      ).length,
      selectedRole: getElement(
        'input[name="agentMergeRole"]:checked',
      ).value,
    }

    getElement('input[name="agentMergeRole"][value="maintainer"]').click()
    await nextTick()
    await selectHandlingVariant('permissions')
    const normalizedPermissions = getAgentMergeDialogSettings()

    assert.deepEqual(
      {
        permissionsVariant,
        scaleVariant,
        midpointScale,
        rolesVariant,
        normalizedPermissions,
      },
      {
        permissionsVariant: {
          variant: 'permissions',
          checkboxCount: 3,
          checkedVisualCount: 3,
          settings: {
            mode: 'agentMerge',
            addressReviews: true,
            fixCI: true,
            resolveConflicts: true,
            mergePullRequest: 'always',
          },
        },
        scaleVariant: {
          variant: 'scale',
          value: '4',
          valueText: 'Full merge',
          stopCount: 5,
          completedStopCount: 5,
          remainingStart: '100%',
          summary: {
            level: 'Full merge',
            description:
              'Handle every blocker and merge the pull request when ready.',
          },
        },
        midpointScale: {
          completedStopCount: 3,
          remainingStart: '50%',
        },
        rolesVariant: {
          variant: 'roles',
          optionCount: 5,
          selectedRole: 'contributor',
        },
        normalizedPermissions: {
          mode: 'agentMerge',
          addressReviews: true,
          fixCI: true,
          resolveConflicts: true,
          mergePullRequest: 'never',
        },
      },
    )
  })

  test('applies the handling design to the Agent Merge status overlay', async () => {
    mountApp()
    await openCreatePullRequestDialog()
    await continueToHandlingStep()
    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    getElement('.agent-merge-status-trigger').click()
    await nextTick()

    const overlay = getElement('.agent-merge-status-overlay')
    const permissionsVariant = {
      variant: overlay.getAttribute('data-handling-variant'),
      permissionCount: overlay.querySelectorAll(
        '.status-overlay-permissions input[type="checkbox"]',
      ).length,
      scalePresent: Boolean(overlay.querySelector('.autonomy-scale')),
      rolesPresent: Boolean(overlay.querySelector('.agent-role-selector')),
    }

    await selectHandlingVariant('scale')
    const autonomyInput = getElement(
      'input[name="status-agentMergeAutonomy"]',
    )
    const scaleVariant = {
      variant: overlay.getAttribute('data-handling-variant'),
      permissionControlsPresent: Boolean(
        overlay.querySelector('.status-overlay-permissions'),
      ),
      value: autonomyInput.value,
      valueText: autonomyInput.getAttribute('aria-valuetext'),
      stopCount: overlay.querySelectorAll('.autonomy-stop').length,
    }

    await setFieldValue(
      'input[name="status-agentMergeAutonomy"]',
      '2',
    )
    await selectHandlingVariant('roles')
    const roleTrigger = getElement('.role-select-trigger')
    const rolesVariant = {
      variant: overlay.getAttribute('data-handling-variant'),
      selectedRole: roleTrigger.getAttribute('data-selected-role'),
      description: getText('.selected-role-description'),
      expanded: roleTrigger.getAttribute('aria-expanded'),
      popupType: roleTrigger.getAttribute('aria-haspopup'),
      nativeSelectPresent: Boolean(
        overlay.querySelector('select[name="status-agentMergeRole"]'),
      ),
      roleCardsPresent: Boolean(
        overlay.querySelector(
          'input[type="radio"][name="status-agentMergeRole"]',
        ),
      ),
    }

    roleTrigger.click()
    await nextTick()
    const selectedRoleOption = getElement(
      '.role-select-option[aria-selected="true"]',
    )
    const roleOptions = {
      listboxLabel: getElement('.role-select-options').getAttribute(
        'aria-label',
      ),
      optionCount: overlay.querySelectorAll(
        '.role-select-option[role="option"]',
      ).length,
      titles: Array.from(
        overlay.querySelectorAll('.role-select-option strong'),
        option => option.textContent,
      ),
      descriptionsPresent: Array.from(
        overlay.querySelectorAll('.role-select-option'),
        option => Boolean(option.querySelector('.role-select-copy > span')),
      ),
      iconsPresent: Array.from(
        overlay.querySelectorAll('.role-select-option'),
        option => Boolean(option.querySelector(':scope > .codicon')),
      ),
      selectedRole:
        selectedRoleOption.getAttribute('data-agent-role'),
      activeDescendant:
        roleTrigger.getAttribute('aria-activedescendant') ===
        selectedRoleOption.id,
      focusRemainsOnTrigger:
        document.activeElement === roleTrigger,
    }

    roleTrigger.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      }),
    )
    await nextTick()
    const nextRoleOption = getElement(
      '.role-select-option[data-agent-role="maintainer"]',
    )
    const arrowNavigation = {
      activeRole: nextRoleOption.getAttribute('data-agent-role'),
      active: nextRoleOption.classList.contains('active'),
      focusRemainsOnTrigger:
        document.activeElement === roleTrigger,
    }
    roleTrigger.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      }),
    )
    await nextTick()
    const roleSelection = {
      expanded: roleTrigger.getAttribute('aria-expanded'),
      selectedRole: roleTrigger.getAttribute('data-selected-role'),
      description: getText('.selected-role-description'),
      focusRestored: document.activeElement === roleTrigger,
    }
    await selectHandlingVariant('permissions')
    const normalizedPermissions = {
      addressReviews: getElement(
        'input[name="status-addressReviews"]',
      ).checked,
      fixCI: getElement('input[name="status-fixCI"]').checked,
      resolveConflicts: getElement(
        'input[name="status-resolveConflicts"]',
      ).checked,
      mergePullRequest: getElement(
        'select[name="status-mergePullRequest"]',
      ).value,
    }

    assert.deepEqual(
      {
        permissionsVariant,
        scaleVariant,
        rolesVariant,
        roleOptions,
        arrowNavigation,
        roleSelection,
        normalizedPermissions,
      },
      {
        permissionsVariant: {
          variant: 'permissions',
          permissionCount: 3,
          scalePresent: false,
          rolesPresent: false,
        },
        scaleVariant: {
          variant: 'scale',
          permissionControlsPresent: false,
          value: '4',
          valueText: 'Full merge',
          stopCount: 5,
        },
        rolesVariant: {
          variant: 'roles',
          selectedRole: 'contributor',
          description: 'Address review comments and fix failing checks.',
          expanded: 'false',
          popupType: 'listbox',
          nativeSelectPresent: false,
          roleCardsPresent: false,
        },
        roleOptions: {
          listboxLabel: 'Agent roles',
          optionCount: 5,
          titles: [
            'No Agent Merge',
            'Observer',
            'Contributor',
            'Maintainer',
            'Merge owner',
          ],
          descriptionsPresent: [true, true, true, true, true],
          iconsPresent: [true, true, true, true, true],
          selectedRole: 'contributor',
          activeDescendant: true,
          focusRemainsOnTrigger: true,
        },
        arrowNavigation: {
          activeRole: 'maintainer',
          active: true,
          focusRemainsOnTrigger: true,
        },
        roleSelection: {
          expanded: 'false',
          selectedRole: 'maintainer',
          description: 'Handle reviews, checks, and merge conflicts.',
          focusRestored: true,
        },
        normalizedPermissions: {
          addressReviews: true,
          fixCI: true,
          resolveConflicts: true,
          mergePullRequest: 'never',
        },
      },
    )
  })

  test('opens Agent Merge status controls and keeps settings synchronized', async () => {
    mountApp()
    await openCreatePullRequestDialog()
    await continueToHandlingStep()
    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    const trigger = getElement('.agent-merge-status-trigger')
    trigger.click()
    await nextTick()
    await nextTick()

    const overlay = getElement('.agent-merge-status-overlay')
    const reviewPermission = getElement('input[name="status-addressReviews"]')
    const mergePolicy = getElement('select[name="status-mergePullRequest"]')
    const initialState = {
      triggerExpanded: trigger.getAttribute('aria-expanded'),
      triggerControlsOverlay:
        trigger.getAttribute('aria-controls') === overlay.id,
      role: overlay.getAttribute('role'),
      modal: overlay.getAttribute('aria-modal'),
      title: getText(`#${overlay.getAttribute('aria-labelledby')}`),
      description: getText(`#${overlay.getAttribute('aria-describedby')}`),
      pullRequest: getElement('.status-overlay-pull-request').getAttribute(
        'aria-label',
      ),
      triggerFocused: document.activeElement === trigger,
      permissionCount: overlay.querySelectorAll(
        '.status-overlay-permissions input',
      ).length,
      reviewPermission: reviewPermission.checked,
      mergePolicy: mergePolicy.value,
    }

    reviewPermission.checked = false
    reviewPermission.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    const afterPermissionChange = getAgentMergeSurfaceStatus()

    getElement('.status-overlay-toggle').click()
    await nextTick()
    const afterDisabling = {
      surfaceStatus: getAgentMergeSurfaceStatus(),
      permissionsDisabled: getElement(
        '.status-overlay-permissions',
      ).hasAttribute('disabled'),
      reviewPermissionDisabled: reviewPermission.disabled,
      mergePolicyDisabled: mergePolicy.disabled,
      toggleLabel: getText('.status-overlay-toggle'),
      announcement: getElement('[aria-live="polite"]').textContent,
    }

    overlay.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await nextTick()
    await nextTick()

    assert.deepEqual(
      {
        initialState,
        afterPermissionChange,
        afterDisabling,
        closed: {
          overlayPresent: Boolean(
            container.querySelector('.agent-merge-status-overlay'),
          ),
          triggerExpanded: trigger.getAttribute('aria-expanded'),
          focusRestored: document.activeElement === trigger,
        },
      },
      {
        initialState: {
          triggerExpanded: 'true',
          triggerControlsOverlay: true,
          role: 'dialog',
          modal: 'false',
          title: 'Addressing feedback',
          description:
            'Control what the agent may change while it works on this pull request.',
          pullRequest:
            'Open pull request #333964: Prototype Agent Merge UX. main from prototype/agent-merge-ux.',
          triggerFocused: true,
          permissionCount: 3,
          reviewPermission: true,
          mergePolicy: 'always',
        },
        afterPermissionChange: {
          commandCenter: {
            label: 'Fixing failing checks',
            state: 'working',
            accessibleLabel:
              'Agent Merge status: Fixing failing checks. Show details and controls.',
          },
          sessionList: {
            label: '#333964 · Fixing failing checks·now',
            state: 'working',
          },
          session: {
            label: 'Fixing failing checks',
            state: 'working',
            accessibleLabel: 'Agent Merge status: Fixing failing checks',
          },
        },
        afterDisabling: {
          surfaceStatus: {
            commandCenter: {
              label: 'Agent Merge off',
              state: 'disabled',
              accessibleLabel:
                'Agent Merge status: Agent Merge off. Show details and controls.',
            },
            sessionList: {
              label: '#333964 · Agent Merge off·now',
              state: 'disabled',
            },
            session: {
              label: 'Agent Merge off',
              state: 'disabled',
              accessibleLabel: 'Agent Merge status: Agent Merge off',
            },
          },
          permissionsDisabled: true,
          reviewPermissionDisabled: true,
          mergePolicyDisabled: true,
          toggleLabel: 'Enable Agent Merge',
          announcement:
            'Pull request 333964 created. Agent Merge status: Agent Merge off.',
        },
        closed: {
          overlayPresent: false,
          triggerExpanded: 'false',
          focusRestored: true,
        },
      },
    )
  })

  test('uses the CI-only preset for the completed security fix', async () => {
    mountApp()

    getElement('[data-session-id="secure"]').click()
    await nextTick()
    await openCreatePullRequestDialog()
    await continueToHandlingStep()
    const dialogSettings = getAgentMergeDialogSettings()

    getElement('.primary-button').click()
    await nextTick()
    await nextTick()
    getElement('.agent-merge-disclosure').click()
    await nextTick()

    assert.deepEqual(
      {
        request: getText('.chat-request'),
        dialogSettings,
        policy: getText('.agent-merge-policy'),
        surfaceStatus: getAgentMergeSurfaceStatus(),
      },
      {
        request:
          'Fix the failing security test without changing the reviewed trust boundary.',
        dialogSettings: {
          mode: 'agentMerge',
          addressReviews: false,
          fixCI: true,
          resolveConflicts: false,
          mergePullRequest: 'never',
        },
        policy: 'It may handle CI. Leave the pull request open.',
        surfaceStatus: {
          commandCenter: {
            label: 'Fixing failing checks',
            state: 'working',
            accessibleLabel:
              'Agent Merge status: Fixing failing checks. Show details and controls.',
          },
          sessionList: {
            label: '#334102 · Fixing failing checks·12m',
            state: 'working',
          },
          session: {
            label: 'Fixing failing checks',
            state: 'working',
            accessibleLabel: 'Agent Merge status: Fixing failing checks',
          },
        },
      },
    )
  })

  test('creates a regular pull request without Agent Merge', async () => {
    mountApp()

    getElement('[data-session-id="regular"]').click()
    await nextTick()
    await openCreatePullRequestDialog()
    await continueToHandlingStep()
    const dialogState = {
      mode: getElement('input[name="pullRequestMode"]:checked').value,
      permissionsPresent: Boolean(
        container.querySelector('.agent-merge-permissions'),
      ),
      permissionsDisabled: getElement(
        '.agent-merge-permissions',
      ).hasAttribute('disabled'),
      fixCIDisabled: getElement('input[name="fixCI"]').disabled,
    }

    getElement('.primary-button').click()
    await nextTick()
    await nextTick()

    assert.deepEqual(
      {
        dialogState,
        activeSession: getText('.session-item[aria-current="page"] strong'),
        card: Boolean(container.querySelector('.agent-merge')),
        subtitle: getText('.agent-merge-session-status p'),
        diffCounts: [...container.querySelectorAll('.change-count')].map(
          count => ({
            label: count.getAttribute('aria-label'),
            additions: count
              .querySelector('.change-count-additions')
              .textContent.trim(),
            deletions: count
              .querySelector('.change-count-deletions')
              .textContent.trim(),
          }),
        ),
        surfaceStatus: getAgentMergeSurfaceStatus(),
        settingsAction: {
          label: getText('.workbench-agent-merge-settings'),
          accessibleLabel: getElement(
            '.workbench-agent-merge-settings',
          ).getAttribute('aria-label'),
          popupType: getElement(
            '.workbench-agent-merge-settings',
          ).getAttribute('aria-haspopup'),
        },
        announcement: getElement('[aria-live="polite"]').textContent,
      },
      {
        dialogState: {
          mode: 'standard',
          permissionsPresent: true,
          permissionsDisabled: true,
          fixCIDisabled: true,
        },
        activeSession: 'sessions: refine loading state',
        card: false,
        subtitle: "You're in control of reviews, checks, and merging.",
        diffCounts: [
          {
            label: '11 additions, 3 deletions',
            additions: '+11',
            deletions: '−3',
          },
          {
            label: '20 additions, 0 deletions',
            additions: '+20',
            deletions: '−0',
          },
        ],
        surfaceStatus: {
          commandCenter: {
            label: 'Agent Merge off',
            state: 'disabled',
            accessibleLabel:
              'Agent Merge status: Agent Merge off. Show details and controls.',
          },
          sessionList: {
            label: '#334220 · Agent Merge off·34m',
            state: 'disabled',
          },
          session: {
            label: 'Agent Merge off',
            state: 'disabled',
            accessibleLabel: 'Agent Merge status: Agent Merge off',
          },
        },
        settingsAction: {
          label: 'Configure Agent Merge',
          accessibleLabel:
            'Configure Agent Merge for this session',
          popupType: 'dialog',
        },
        announcement:
          'Pull request 334220 created. Agent Merge status: Agent Merge off.',
      },
    )

    const settingsAction = getElement(
      '.workbench-agent-merge-settings',
    )
    settingsAction.click()
    await nextTick()
    await nextTick()

    const settingsDialog = getElement('.agent-merge-settings-dialog')
    const selectedMode = getElement(
      '.agent-merge-settings-dialog input[name="pullRequestMode"]:checked',
    )
    assert.deepEqual(
      {
        actionExpanded: settingsAction.getAttribute('aria-expanded'),
        title: getText(
          `#${settingsDialog.getAttribute('aria-labelledby')}`,
        ),
        description: getText(
          `#${settingsDialog.getAttribute('aria-describedby')}`,
        ),
        role: settingsDialog.getAttribute('role'),
        modal: settingsDialog.getAttribute('aria-modal'),
        dialogMode: settingsDialog.getAttribute('data-dialog-mode'),
        pullRequest: getText(
          '.agent-merge-settings-dialog .branch-summary strong',
        ),
        creationStepsPresent: Boolean(
          settingsDialog.querySelector('.dialog-steps'),
        ),
        selectedMode: selectedMode.value,
        selectedModeFocused: document.activeElement === selectedMode,
        permissionsDisabled: getElement(
          '.agent-merge-settings-dialog .agent-merge-permissions',
        ).hasAttribute('disabled'),
        saveAction: getText(
          '.agent-merge-settings-dialog .primary-button',
        ),
      },
      {
        actionExpanded: 'true',
        title: 'Configure Agent Merge',
        description: 'Choose how Agent Merge handles this pull request.',
        role: 'dialog',
        modal: 'true',
        dialogMode: 'agent-merge-settings',
        pullRequest: '#334220 sessions: refine loading state',
        creationStepsPresent: false,
        selectedMode: 'standard',
        selectedModeFocused: true,
        permissionsDisabled: true,
        saveAction: 'Save settings',
      },
    )

    getElement(
      '.agent-merge-settings-dialog input[name="pullRequestMode"][value="agentMerge"]',
    ).click()
    await nextTick()
    getElement(
      '.agent-merge-settings-dialog .primary-button',
    ).click()
    await nextTick()
    await nextTick()

    assert.deepEqual(
      {
        surfaceStatus: getAgentMergeSurfaceStatus(),
        settingsAction: getText('.workbench-agent-merge-settings'),
        dialogPresent: Boolean(
          container.querySelector('.agent-merge-settings-dialog'),
        ),
        focusRestored: document.activeElement === settingsAction,
      },
      {
        surfaceStatus: {
          commandCenter: {
            label: 'Monitoring pull request',
            state: 'monitoring',
            accessibleLabel:
              'Agent Merge status: Monitoring pull request. Show details and controls.',
          },
          sessionList: {
            label: '#334220 · Monitoring pull request·34m',
            state: 'monitoring',
          },
          session: {
            label: 'Monitoring pull request',
            state: 'monitoring',
            accessibleLabel: 'Agent Merge status: Monitoring pull request',
          },
        },
        settingsAction: 'Update Agent Merge Settings',
        dialogPresent: false,
        focusRestored: true,
      },
    )
  })
})
