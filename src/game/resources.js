const RESOURCE_KEYS = ['coherence','integrity','entropy','biosphere','health','energy','knowledge','trust','ethics','compute','qubits','history','culture','economy','technology'];
const MAX = { entropy: 150 };
function clampValue(key, value) { const max = MAX[key] ?? 100; return Math.max(0, Math.min(max, Math.round((Number(value)||0)*10)/10)); }
function clampResources(resources) { for (const k of RESOURCE_KEYS) resources[k] = clampValue(k, resources[k]); return resources; }
function applyEffects(resources, effects = {}) { for (const [k,v] of Object.entries(effects)) if (RESOURCE_KEYS.includes(k)) resources[k] = clampValue(k, (resources[k] ?? 0) + Number(v)); return resources; }
function initialResources(){ return clampResources({coherence:76,integrity:86,entropy:18,biosphere:72,health:66,energy:54,knowledge:25,trust:62,ethics:64,compute:56,qubits:35,history:42,culture:38,economy:46,technology:18}); }
module.exports = { RESOURCE_KEYS, clampValue, clampResources, applyEffects, initialResources };
