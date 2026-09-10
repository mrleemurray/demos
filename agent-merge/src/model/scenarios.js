export const repositoryStates = Object.freeze({
  uncommitted: 'uncommitted',
  committed: 'committed',
  published: 'published',
})

const prePullRequestActions = Object.freeze({
  [repositoryStates.uncommitted]: Object.freeze({
    kind: 'commit',
    label: 'Commit changes',
    icon: 'codicon-git-commit',
    sessionIcon: 'codicon-source-control',
    sessionLabel: 'Changes ready to commit',
    announcement: 'Feature work is complete. Changes are ready to commit.',
    nextState: repositoryStates.committed,
    opensPullRequest: false,
  }),
  [repositoryStates.committed]: Object.freeze({
    kind: 'publish',
    label: 'Publish branch',
    icon: 'codicon-cloud-upload',
    sessionIcon: 'codicon-git-commit',
    sessionLabel: 'Changes committed',
    announcement: 'Changes committed. The branch is ready to publish.',
    nextState: repositoryStates.published,
    opensPullRequest: false,
  }),
  [repositoryStates.published]: Object.freeze({
    kind: 'create-pull-request',
    label: 'Create pull request',
    icon: 'codicon-git-pull-request',
    sessionIcon: 'codicon-repo-push',
    sessionLabel: 'Branch published',
    chatPrompt:
      'The branch is published. Would you like me to create a pull request?',
    announcement: 'Branch published. Ready to create a pull request.',
    nextState: undefined,
    opensPullRequest: true,
  }),
})

export function getPrePullRequestAction(state) {
  const action = prePullRequestActions[state]
  if (!action) {
    throw new Error(`Unsupported repository state: ${state}`)
  }
  return action
}

export const scenarios = [
  {
    id: 'prototype',
    label: 'Prototype feature',
    description: 'Completed prototype ready to create with full Agent Merge control.',
    title: 'Prototype Agent Merge UX',
    pullRequestNumber: 333964,
    pullRequestUrl: 'https://github.com/microsoft/vscode/pull/333964',
    pullRequestDescription:
      'Adds a focused prototype for exploring Agent Merge setup and post-creation controls.',
    branch: 'prototype/agent-merge-ux',
    baseBranch: 'main',
    baseBranches: ['main', 'release/1.109'],
    repositoryState: repositoryStates.uncommitted,
    relativeTime: 'now',
    timestamp: '9:41 AM',
    agentMerge: {
      enabled: true,
      addressReviews: true,
      fixCI: true,
      resolveConflicts: true,
      mergePullRequest: 'always',
    },
    request: 'Build the Agent Merge UX prototype.',
    completion:
      'I finished the Agent Merge UX prototype and added focused tests. Everything is ready for review.',
    comments: [
      {
        author: 'copilot-pull-request-reviewer',
        file: 'agentMergeActions.ts',
        path: 'src/vs/sessions/contrib/providers/agentHost/browser/agentMergeActions.ts',
        line: 214,
        body: 'Keep the full-control state visible while the prototype is being evaluated.',
      },
    ],
    checks: ['Linux Unit Tests'],
    conflicting: false,
    behind: false,
    agentMessage:
      'Address reviews, fix CI, resolve conflicts if needed, and merge when all checks pass.',
    response:
      'I addressed the review feedback and fixed the failing test. I can merge automatically when the new checks pass.',
    changedFiles: [
      { name: 'agentMergeActions.ts', additions: 18, deletions: 4 },
      { name: 'agentMerge.ts', additions: 7, deletions: 2 },
    ],
  },
  {
    id: 'secure',
    label: 'Sensitive security fix',
    description: 'Agent Merge may fix CI, while review, conflicts, and merge stay human-controlled.',
    title: 'security: harden credential storage',
    pullRequestNumber: 334102,
    pullRequestUrl: 'https://github.com/microsoft/vscode/pull/334102',
    pullRequestDescription:
      'Hardens credential storage while preserving the reviewed trust boundary.',
    branch: 'security/harden-credential-storage',
    baseBranch: 'main',
    baseBranches: ['main', 'release/1.109'],
    repositoryState: repositoryStates.committed,
    relativeTime: '12m',
    timestamp: '10:03 AM',
    agentMerge: {
      enabled: true,
      addressReviews: false,
      fixCI: true,
      resolveConflicts: false,
      mergePullRequest: 'never',
    },
    request:
      'Fix the failing security test without changing the reviewed trust boundary.',
    completion:
      'I completed the security fix and added coverage without changing the reviewed trust boundary.',
    comments: [
      {
        author: 'security-reviewer',
        file: 'credentialStore.ts',
        path: 'src/vs/platform/credentials/common/credentialStore.ts',
        line: 142,
        body: 'Changes to the trust boundary require security-owner approval.',
      },
    ],
    checks: ['Security Unit Tests'],
    conflicting: false,
    behind: false,
    agentMessage:
      'Fix the failing CI check only. Do not address review feedback, resolve conflicts, or merge.',
    response:
      'I fixed the failing security test. The review feedback and final merge remain with the security owner.',
    changedFiles: [
      { name: 'credentialStore.ts', additions: 5, deletions: 2 },
      { name: 'credentialStore.test.ts', additions: 14, deletions: 1 },
    ],
  },
  {
    id: 'regular',
    label: 'Regular feature',
    description: 'Completed feature ready for a regular pull request without Agent Merge.',
    title: 'sessions: refine loading state',
    pullRequestNumber: 334220,
    pullRequestUrl: 'https://github.com/microsoft/vscode/pull/334220',
    pullRequestDescription:
      'Refines session loading behavior while keeping the selected session stable.',
    branch: 'sessions/refine-loading-state',
    baseBranch: 'main',
    baseBranches: ['main', 'release/1.109'],
    repositoryState: repositoryStates.published,
    relativeTime: '34m',
    timestamp: '11:18 AM',
    agentMerge: {
      enabled: false,
      addressReviews: false,
      fixCI: false,
      resolveConflicts: false,
      mergePullRequest: 'never',
    },
    request: 'Refine the session loading state while keeping the selection stable.',
    completion:
      'I finished the loading-state refinement and added coverage for stable session selection.',
    comments: [
      {
        author: 'octocat',
        file: 'sessionsList.ts',
        path: 'src/vs/sessions/browser/sessionsList.ts',
        line: 287,
        body: 'Can the selected session remain stable while its loading state changes?',
      },
    ],
    checks: [],
    conflicting: false,
    behind: false,
    agentMessage:
      'Address the review feedback after Agent Merge is enabled and permissions are selected.',
    response: 'The pull request is open and waiting for review.',
    changedFiles: [
      { name: 'sessionsList.ts', additions: 11, deletions: 3 },
      { name: 'sessionsList.test.ts', additions: 20, deletions: 0 },
    ],
  },
]

export function createScenarioSettings(id) {
  const scenario = getScenario(id)
  return {
    scenarioId: scenario.id,
    ...scenario.agentMerge,
  }
}

export function createScenarioPullRequestDetails(id) {
  const scenario = getScenario(id)
  return {
    title: scenario.title,
    description: scenario.pullRequestDescription,
    baseBranch: scenario.baseBranch,
  }
}

export function getScenario(id) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0]
}

export function getAgentMergeStatus(
  scenario,
  settings,
  pullRequestCreated,
) {
  if (!pullRequestCreated) {
    return {
      kind: 'unavailable',
      label: 'No pull request',
    }
  }

  if (!settings.enabled) {
    return {
      kind: 'disabled',
      label: 'Agent Merge off',
    }
  }

  const pendingWork = [
    settings.addressReviews && scenario.comments.length > 0 && 'reviews',
    settings.fixCI && scenario.checks.length > 0 && 'checks',
    settings.resolveConflicts && scenario.conflicting && 'conflicts',
  ].filter(Boolean)

  if (pendingWork.length > 1) {
    return {
      kind: 'working',
      label: 'Addressing feedback',
    }
  }

  switch (pendingWork[0]) {
    case 'reviews':
      return {
        kind: 'working',
        label: 'Addressing review comments',
      }
    case 'checks':
      return {
        kind: 'working',
        label: 'Fixing failing checks',
      }
    case 'conflicts':
      return {
        kind: 'working',
        label: 'Resolving merge conflicts',
      }
  }

  if (settings.mergePullRequest !== 'never') {
    return {
      kind: 'monitoring',
      label: 'Waiting to merge',
    }
  }

  return {
    kind: 'monitoring',
    label: 'Monitoring pull request',
  }
}

export function formatAgentMergeStatus(scenario) {
  const events = []
  if (scenario.comments.length > 0) {
    events.push(
      `${scenario.comments.length} Review ${
        scenario.comments.length === 1 ? 'Comment' : 'Comments'
      }`,
    )
  }
  if (scenario.checks.length > 0) {
    events.push(
      `${scenario.checks.length} Failing ${
        scenario.checks.length === 1 ? 'Check' : 'Checks'
      }`,
    )
  }
  if (scenario.conflicting) {
    events.push('Merge Conflicts')
  }
  if (scenario.behind) {
    events.push('Behind Base Branch')
  }
  if (events.length === 0) {
    return 'No Pending Feedback'
  }
  if (events.length === 1) {
    return events[0]
  }
  if (events.length === 2) {
    return `${events[0]} and ${events[1]}`
  }
  return `${events.slice(0, -1).join(', ')}, and ${events.at(-1)}`
}
