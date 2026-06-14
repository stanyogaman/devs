const ACHIEVEMENTS = [
  { id: 'operator-awake', title: 'Operator Awake', description: 'Complete the first initiation objective.', test: s => s.tick >= 2 },
  { id: 'first-choice', title: 'Timeline Steward', description: 'Resolve your first live event.', test: s => s.stats.eventsResolved >= 1 },
  { id: 'first-upgrade', title: 'Module Architect', description: 'Install your first OS module upgrade.', test: s => Object.keys(s.upgrades).length >= 1 },
  { id: 'entropy-handler', title: 'Entropy Handler', description: 'Bring entropy back below 45 after pressure rises.', test: s => s.resources.entropy < 45 && s.stats.maxEntropy >= 55 },
  { id: 'quantum-arrival', title: 'Quantum Arrival', description: 'Reach the Quantum Threshold without collapse.', test: s => s.era.name === 'Quantum Threshold' && !s.lost },
  { id: 'deus-ready', title: 'DEVS Ascendant', description: 'Unlock the DEVS Protocol era.', test: s => s.era.name === 'DEVS Protocol' || s.era.name === 'DEUS Kernel' }
];
function evaluateAchievements(state) {
  const unlocked = [];
  state.achievements ||= {};
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements[achievement.id] && achievement.test(state)) {
      state.achievements[achievement.id] = { ...achievement, unlockedAt: state.tick };
      unlocked.push(state.achievements[achievement.id]);
    }
  }
  return unlocked;
}
module.exports = { ACHIEVEMENTS, evaluateAchievements };
