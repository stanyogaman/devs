const events = require('../data/events.json');
function eventsForEra(eraName){ return events.filter(e => e.era === eraName); }
function getEvent(id){ return events.find(e => e.id === id); }
function validateChoice(event, idx){ return event && Number.isInteger(idx) && idx >= 0 && idx < event.choices.length; }
module.exports = { events, eventsForEra, getEvent, validateChoice };
