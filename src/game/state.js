const { initialResources } = require('./resources');
const { getEra } = require('./eras');
function createState(){
  return {
    tick:0,
    chapter:'Operator Initiation',
    onboarding:{ secondsRemaining:600, complete:false, oraStep:0 },
    eraIndex:0,
    era:getEra(0),
    progress:0,
    status:'running',
    won:false,
    lost:false,
    stats:{ commandsRun:0, patchesCompiled:0, eventsResolved:0, upgradesPurchased:0, maxEntropy:18 },
    achievements:{},
    rewards:[],
    logs:['ORA: Welcome, operator. I am your scripted initiation assistant. Start with STATUS.','DEVS Gaia Kernel online. Stylized V initialized.'],
    resources:initialResources(),
    upgrades:{},
    currentEvent:null,
    lastEventTick:0,
    lastEraName:'Origin Protocol'
  };
}
module.exports = { createState };
