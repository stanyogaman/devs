const { initialResources } = require('./resources');
const { getEra } = require('./eras');
function createState(){ return { tick:0, eraIndex:0, era:getEra(0), progress:0, status:'running', won:false, lost:false, logs:['DEVS Gaia Kernel online. Stylized V initialized.'], resources:initialResources(), upgrades:{}, currentEvent:null, lastEventTick:0 }; }
module.exports = { createState };
