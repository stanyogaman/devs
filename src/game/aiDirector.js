require('dotenv').config();
const enabled = process.env.AI_DIRECTOR_ENABLED === 'true' && !!process.env.OPENAI_API_KEY;
function validMission(m){ return m && typeof m.id==='string' && typeof m.title==='string' && typeof m.description==='string' && Array.isArray(m.choices); }
async function generateAIMission(gameState){
 if(!enabled) return null;
 const body={model:process.env.OPENAI_MODEL||'gpt-4o-mini',response_format:{type:'json_object'},messages:[{role:'system',content:'Return one safe educational DEVS Gaia Kernel mission JSON with id,title,description,choices.'},{role:'user',content:JSON.stringify({era:gameState.era.name,resources:gameState.resources})}]};
 const res=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify(body)});
 const data=await res.json(); let parsed=null; try{parsed=JSON.parse(data.choices?.[0]?.message?.content||'{}')}catch{} return validMission(parsed)?parsed:null;
}
module.exports={generateAIMission,validMission};
