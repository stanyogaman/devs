const OBJECTIVE_SETS = {
  initiation: [
    { id: 'init-status', title: 'Run STATUS command', hint: 'Open the console and type STATUS.', test: s => s.stats.commandsRun >= 1 },
    { id: 'init-stable', title: 'Keep coherence above 70', hint: 'Use QEC or STABILIZE if coherence dips.', test: s => s.resources.coherence >= 70 },
    { id: 'init-patch', title: 'Compile a safe patch', hint: 'Use words like validate, ethics, monitor, audit.', test: s => s.stats.patchesCompiled >= 1 }
  ],
  core: [
    { id: 'core-event', title: 'Resolve a timeline event', hint: 'Choose a response that preserves ethics and trust.', test: s => s.stats.eventsResolved >= 1 },
    { id: 'core-upgrade', title: 'Upgrade one OS module', hint: 'Install a module from the tycoon panel.', test: s => Object.keys(s.upgrades).length >= 1 },
    { id: 'core-entropy', title: 'Keep entropy below 80', hint: 'COOL, QEC, and ethical choices slow collapse.', test: s => s.resources.entropy < 80 }
  ],
  final: [
    { id: 'final-quantum', title: 'Reach Quantum Threshold', hint: 'Advance eras without collapse.', test: s => s.era.name === 'Quantum Threshold' || s.eraIndex >= 8 },
    { id: 'final-coherence', title: 'Quantum coherence > 60', hint: 'Use QEC and Quantum Core carefully.', test: s => s.resources.coherence > 60 },
    { id: 'final-ethics', title: 'Ethics > 50 and entropy < 70', hint: 'Avoid exploitative choices.', test: s => s.resources.ethics > 50 && s.resources.entropy < 70 }
  ]
};
function getActiveObjectives(state) {
  const pool = state.chapter === 'Operator Initiation' ? OBJECTIVE_SETS.initiation : state.eraIndex >= 7 ? OBJECTIVE_SETS.final : OBJECTIVE_SETS.core;
  return pool.slice(0, 3).map(objective => ({ ...objective, complete: objective.test(state) }));
}
module.exports = { getActiveObjectives };
