const eras = require('../data/eras.json');
function getEra(index){ return eras[Math.max(0, Math.min(index, eras.length-1))]; }
function eraIndexByName(name){ return eras.findIndex(e => e.name.toLowerCase() === String(name).toLowerCase()); }
function canAdvance(state){ const r=state.resources; return state.progress >= 100 && r.integrity > 25 && r.coherence > 25 && r.entropy < 125; }
module.exports = { eras, getEra, eraIndexByName, canAdvance };
