const missions = require('../data/missions.json');
function activeMissions(state){ return missions.filter(m => m.era === state.era.name || m.era === 'Any').map(m => ({...m, complete:Object.entries(m.requirements).every(([k,v]) => (state.resources[k]||0) >= v)})); }
module.exports = { missions, activeMissions };
