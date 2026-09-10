export const autonomyLevels = Object.freeze([
  Object.freeze({
    value: 0,
    label: 'Nothing',
    description: 'Create a standard pull request and keep every action with you.',
    configuration: Object.freeze({
      enabled: false,
      addressReviews: false,
      fixCI: false,
      resolveConflicts: false,
      mergePullRequest: 'never',
    }),
  }),
  Object.freeze({
    value: 1,
    label: 'Monitor',
    description: 'Watch reviews and checks without changing the pull request.',
    configuration: Object.freeze({
      enabled: true,
      addressReviews: false,
      fixCI: false,
      resolveConflicts: false,
      mergePullRequest: 'never',
    }),
  }),
  Object.freeze({
    value: 2,
    label: 'Repair',
    description: 'Address review comments and fix failing checks.',
    configuration: Object.freeze({
      enabled: true,
      addressReviews: true,
      fixCI: true,
      resolveConflicts: false,
      mergePullRequest: 'never',
    }),
  }),
  Object.freeze({
    value: 3,
    label: 'Prepare',
    description: 'Handle reviews, checks, and conflicts, then leave merge to you.',
    configuration: Object.freeze({
      enabled: true,
      addressReviews: true,
      fixCI: true,
      resolveConflicts: true,
      mergePullRequest: 'never',
    }),
  }),
  Object.freeze({
    value: 4,
    label: 'Full merge',
    description: 'Handle every blocker and merge the pull request when ready.',
    configuration: Object.freeze({
      enabled: true,
      addressReviews: true,
      fixCI: true,
      resolveConflicts: true,
      mergePullRequest: 'always',
    }),
  }),
])

export const agentRoles = Object.freeze([
  Object.freeze({
    id: 'none',
    label: 'No Agent Merge',
    icon: 'codicon-person',
    description: 'Keep all pull request work with you.',
    configuration: autonomyLevels[0].configuration,
  }),
  Object.freeze({
    id: 'observer',
    label: 'Observer',
    icon: 'codicon-eye',
    description: 'Monitor reviews and checks without making changes.',
    configuration: autonomyLevels[1].configuration,
  }),
  Object.freeze({
    id: 'contributor',
    label: 'Contributor',
    icon: 'codicon-tools',
    description: 'Address review comments and fix failing checks.',
    configuration: autonomyLevels[2].configuration,
  }),
  Object.freeze({
    id: 'maintainer',
    label: 'Maintainer',
    icon: 'codicon-shield',
    description: 'Handle reviews, checks, and merge conflicts.',
    configuration: autonomyLevels[3].configuration,
  }),
  Object.freeze({
    id: 'mergeOwner',
    label: 'Merge owner',
    icon: 'codicon-git-merge',
    description: 'Handle every blocker and merge when ready.',
    configuration: autonomyLevels[4].configuration,
  }),
])

export function inferAgentMergeAutonomyLevel(configuration) {
  if (!configuration.enabled) {
    return 0
  }
  if (configuration.mergePullRequest !== 'never') {
    return 4
  }
  if (configuration.resolveConflicts) {
    return 3
  }
  if (configuration.addressReviews || configuration.fixCI) {
    return 2
  }
  return 1
}

export function resolveAgentMergeAutonomyLevel(value) {
  const level = autonomyLevels.find(candidate => candidate.value === Number(value))
  if (!level) {
    throw new Error(`Unsupported autonomy level: ${value}`)
  }
  return level
}

export function inferAgentMergeRole(configuration) {
  return agentRoles[inferAgentMergeAutonomyLevel(configuration)].id
}

export function resolveAgentMergeRole(id) {
  const role = agentRoles.find(candidate => candidate.id === id)
  if (!role) {
    throw new Error(`Unsupported Agent Merge role: ${id}`)
  }
  return role
}
