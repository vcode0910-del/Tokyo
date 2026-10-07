const WebSocket=require("ws");
const wss=new WebSocket.Server({host:"0.0.0.0",port:8787});
const rooms=new Map();
const send=(ws,m)=>ws.readyState===WebSocket.OPEN&&ws.send(JSON.stringify(m));
wss.on("connection",ws=>{
 ws.on("message",raw=>{
  let m;try{m=JSON.parse(raw)}catch{return}
  if(m.type==="join"){
   ws.room=m.room;ws.role=m.role;
   if(!rooms.has(m.room))rooms.set(m.room,new Set());
   rooms.get(m.room).add(ws);send(ws,{type:"ready"});return;
  }
  if(!ws.room)return;
  for(const peer of rooms.get(ws.room)||[])if(peer!==ws)send(peer,m);
 });
 ws.on("close",()=>{
  if(ws.room&&rooms.has(ws.room)){rooms.get(ws.room).delete(ws);if(!rooms.get(ws.room).size)rooms.delete(ws.room)}
 });
});
console.log("Phone Mirror signaling server listening on port 8787");