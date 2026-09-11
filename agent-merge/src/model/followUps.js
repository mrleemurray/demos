const followUpsByScenario = Object.freeze({
  prototype: Object.freeze([
    Object.freeze({
      id: 'deploy-vscode-experiment',
      name: 'Deploy VS Code experiment',
      description:
        'Roll out the Agent Merge experiment to 10% of VS Code Insiders.',
      fileName: 'deploy-vscode-experiment.followup.md',
      path: '.github/follow-ups/deploy-vscode-experiment.followup.md',
      triggerType: 'event',
      event: 'pull_request.merged',
      eventLabel: 'Pull request merged',
      sourceLabel: 'GitHub webhook',
      delay: '7d',
      timingLabel: '1 week after merge',
      statusLabel: 'Waiting for pull request merge',
      instructions: [
        '## Task',
        '',
        'Deploy the Agent Merge experiment to 10% of VS Code Insiders.',
        '',
        '## Completion',
        '',
        'Record the treatment and control identifiers on the pull request.',
        'Emit experiment.deployed with the experiment identifier when rollout completes.',
      ].join('\n'),
    }),
    Object.freeze({
      id: 'stop-vscode-experiment',
      name: 'Stop experiment and report results',
      description:
        'End the experiment, gather its results, and present a summary on the pull request.',
      fileName: 'stop-vscode-experiment.followup.md',
      path: '.github/follow-ups/stop-vscode-experiment.followup.md',
      triggerType: 'event',
      event: 'experiment.deployed',
      eventLabel: 'Experiment deployed',
      sourceLabel: 'Experiment service webhook',
      delay: '5d',
      timingLabel: '5 days after deployment',
      statusLabel: 'Waiting for experiment deployment',
      instructions: [
        '## Task',
        '',
        'Stop the experiment associated with this pull request.',
        '',
        '## Report',
        '',
        'Compare treatment and control data for adoption, successful merges, interventions, and time to merge.',
        'Post a concise results summary with links to the source data on the pull request.',
      ].join('\n'),
    }),
  ]),
  secure: Object.freeze([
    Object.freeze({
      id: 'verify-credential-rollout',
      name: 'Verify credential rollout',
      description:
        'Review rollout health after the security fix reaches production.',
      fileName: 'verify-credential-rollout.followup.md',
      path: '.github/follow-ups/verify-credential-rollout.followup.md',
      triggerType: 'event',
      event: 'release.deployed',
      eventLabel: 'Release deployed',
      sourceLabel: 'Release webhook',
      delay: '1d',
      timingLabel: '1 day after deployment',
      statusLabel: 'Waiting for release deployment',
      instructions: [
        '## Task',
        '',
        'Review credential-store failures and fallback usage after deployment.',
        '',
        '## Report',
        '',
        'Compare the results with the previous release.',
        'Post a security-owner summary on the pull request.',
      ].join('\n'),
    }),
  ]),
  regular: Object.freeze([
    Object.freeze({
      id: 'review-loading-telemetry',
      name: 'Review loading telemetry',
      description:
        'Check whether the loading-state change improved session stability.',
      fileName: 'review-loading-telemetry.followup.md',
      path: '.github/follow-ups/review-loading-telemetry.followup.md',
      triggerType: 'event',
      event: 'release.deployed',
      eventLabel: 'Release deployed',
      sourceLabel: 'Release webhook',
      delay: '7d',
      timingLabel: '1 week after deployment',
      statusLabel: 'Waiting for release deployment',
      instructions: [
        '## Task',
        '',
        'Compare session-selection stability before and after the release.',
        '',
        '## Report',
        '',
        'Identify regressions or meaningful changes in loading duration.',
        'Post the findings and recommended next steps on the pull request.',
      ].join('\n'),
    }),
  ]),
})

export function createScenarioFollowUpTemplates(id) {
  return (followUpsByScenario[id] ?? []).map(followUp => ({
    ...followUp,
  }))
}

function getFollowUpId(name) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'follow-up'
  )
}

export function getFollowUpFileName(name) {
  return `${getFollowUpId(name)}.followup.md`
}

export function createFollowUp(draft, existingFollowUps) {
  const baseId = draft.id ?? getFollowUpId(draft.name)
  const existingIds = new Set(existingFollowUps.map(followUp => followUp.id))
  let id = baseId
  let suffix = 2

  while (existingIds.has(id)) {
    id = `${baseId}-${suffix}`
    suffix++
  }

  return {
    ...draft,
    id,
    fileName: `${id}.followup.md`,
    path: `.github/follow-ups/${id}.followup.md`,
  }
}

export function serializeFollowUp(followUp) {
  const trigger = followUp.triggerType === 'time'
    ? [
        '  type: time',
        `  date: ${followUp.scheduledDate}`,
        `  time: ${followUp.scheduledTime}`,
        `  timezone: ${followUp.timeZone}`,
      ]
    : [
        '  type: event',
        `  source: ${followUp.sourceLabel}`,
        `  event: ${followUp.event}`,
        `  delay: ${followUp.delay}`,
      ]

  return [
    '---',
    'version: 1',
    `id: ${followUp.id}`,
    `name: ${followUp.name}`,
    'trigger:',
    ...trigger,
    '---',
    '',
    followUp.instructions.trim(),
    '',
  ].join('\n')
}
