export const scenarios = [
  {
    id: 'prototype',
    label: 'Prototype pull request',
    description: 'Agent Merge has full control to repair and merge this low-risk prototype.',
    title: 'Prototype Agent Merge UX',
    pullRequestNumber: 333964,
    pullRequestUrl: 'https://github.com/microsoft/vscode/pull/333964',
    branch: 'prototype/agent-merge-ux',
    baseBranch: 'main',
    relativeTime: 'now',
    timestamp: '9:41 AM',
    agentMergeLabel: 'Full control',
    agentMerge: {
      enabled: true,
      addressReviews: true,
      fixCI: true,
      resolveConflicts: true,
      mergePullRequest: 'always',
    },
    request:
      'Build the Agent Merge UX prototype and take the pull request through merge.',
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
      { name: 'agentMergeActions.ts', changeCount: '+18 −4' },
      { name: 'agentMerge.ts', changeCount: '+7 −2' },
    ],
  },
  {
    id: 'secure',
    label: 'Sensitive security fix',
    description: 'Agent Merge may fix CI, while review, conflicts, and merge stay human-controlled.',
    title: 'security: harden credential storage',
    pullRequestNumber: 334102,
    pullRequestUrl: 'https://github.com/microsoft/vscode/pull/334102',
    branch: 'security/harden-credential-storage',
    baseBranch: 'main',
    relativeTime: '12m',
    timestamp: '10:03 AM',
    agentMergeLabel: 'CI fixes only',
    agentMerge: {
      enabled: true,
      addressReviews: false,
      fixCI: true,
      resolveConflicts: false,
      mergePullRequest: 'never',
    },
    request:
      'Fix the failing security test without changing the reviewed trust boundary.',
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
      { name: 'credentialStore.ts', changeCount: '+5 −2' },
      { name: 'credentialStore.test.ts', changeCount: '+14 −1' },
    ],
  },
  {
    id: 'regular',
    label: 'Regular pull request',
    description: 'A normal pull request where Agent Merge has not been enabled.',
    title: 'sessions: refine loading state',
    pullRequestNumber: 334220,
    pullRequestUrl: 'https://github.com/microsoft/vscode/pull/334220',
    branch: 'sessions/refine-loading-state',
    baseBranch: 'main',
    relativeTime: '34m',
    timestamp: '11:18 AM',
    agentMergeLabel: 'Agent Merge off',
    agentMerge: {
      enabled: false,
      addressReviews: false,
      fixCI: false,
      resolveConflicts: false,
      mergePullRequest: 'never',
    },
    request: 'Open a regular pull request for the session loading-state refinement.',
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
      { name: 'sessionsList.ts', changeCount: '+11 −3' },
      { name: 'sessionsList.test.ts', changeCount: '+20 −0' },
    ],
  },
]

export function createDefaultSettings() {
  return createScenarioSettings(scenarios[0].id)
}

export function createScenarioSettings(id) {
  const scenario = getScenario(id)
  return {
    scenarioId: scenario.id,
    ...scenario.agentMerge,
  }
}

export function getScenario(id) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0]
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
