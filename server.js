require('dotenv').config();
const express=require('express'); const http=require('http'); const {Server}=require('socket.io');
const {GameEngine}=require('./src/game/engine'); const {runCommand}=require('./src/game/commands');
const app=express(); const server=http.createServer(app); const io=new Server(server,{cors:{origin:'*'}}); const engine=new GameEngine();
app.use(express.json({limit:'64kb'})); app.use(express.static('public'));
app.get('/api/state',(req,res)=>res.json(engine.publicState()));
io.on('connection',socket=>{socket.emit('state',engine.publicState()); socket.on('command',input=>{const message=runCommand(engine,socket.id,input); io.emit('toast',message); io.emit('state',engine.publicState());}); socket.on('choice',p=>{io.emit('toast',engine.choose(p.eventId,Number(p.choiceIndex)).message); io.emit('state',engine.publicState());}); socket.on('patch',text=>{io.emit('toast',engine.submitPatch(text).message); io.emit('state',engine.publicState());});});
setInterval(()=>{engine.tick(); io.emit('state',engine.publicState());},2000);
const PORT=process.env.PORT||3000; server.listen(PORT,()=>console.log(`DEVS: Gaia Kernel listening on http://localhost:${PORT}`));
