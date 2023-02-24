const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 3000

app.use(cors());
app.use(express.json());

let mongodbURI = `mongodb+srv://siddhujaykay2:shiine1984@synergy.en8nmpm.mongodb.net/main?retryWrites=true&w=majority`

mongoose.connect(mongodbURI,{
    useNewUrlParser: true
})

function addCRUD(apiEndpoint,schema){
    app.post(`/api/${apiEndpoint}/add`,async (req,res)=>{
        console.log('Adding data!')
        const item = new schema(req.body)
        try{
            await item.save()
            res.send({success:true})
        }catch(err) {console.log(err)}
    })
  
    app.post(`/api/${apiEndpoint}/read`,async (req,res)=>{
        schema.find(req.body,(err,result)=>{
            if(err) res.send(err)
            res.send(result)
        })
    })
    
    app.post(`/api/${apiEndpoint}/update`,async (req,res)=>{
        let id = req.body.id
        delete req.body.id

        try{
            await schema.findOneAndUpdate(id,req.body)
            res.send({sucess:true})
        }
        catch(err){
            console.log(err);
        }
    })
    app.post(`/api/${apiEndpoint}/delete`,async (req,res)=>{
        try{
            await schema.findOneAndDelete(req.body)
            res.send({sucess:true})
        }
        catch(err){
            console.log(err);
        }
    })
}
const User = require('./models/User')

addCRUD('users', User)

app.get("/",(req,res)=>{
    res.send("<h1> Welcome to the backend!</h1>"); 
})


const server = app.listen(PORT,()=>{
    console.log(`Started listening on | http://localhost:${PORT}`);
})

const io = require('socket.io')(server,{
    cors:{
        pingTimeOut:60000,
        origin: '*'
    }
})

let people = {}
io.on('connection',(socket)=>{
    socket.on('add-user',(user_id)=>{
        people[user_id] = socket.id
    })
    socket.on('sendMessage',(message)=>{
        if (message.to in people){
            let sendSocket = people[message.to]
            socket.to(sendSocket).emit('receiveMessage',message)
        }
    })

})