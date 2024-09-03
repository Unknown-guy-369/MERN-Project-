//Creating a express Server
const express = require('express');
const cors = require('cors')

//Connect Database

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mern-project').then(
    console.log('MongoDB connected')
).catch((err)=>{
    console.log(err);
})

//Create Schema for database

const todoSchema = new mongoose.Schema({
    title:{
        required:true,
        type: String
    },
    description:String
})

//Create Model for database

const todomodel = mongoose.model('Todo',todoSchema);

//Create instance of server
const server = express();

//Middleware to parse JSON request

server.use(express.json());
server.use(cors())

//Port number
const Port = 8080;

//Start Server
server.listen(Port,(req,res)=>{
    console.log(`Server is running at http://localhost:${Port}`);
})

//Define route to Create item

server.post('/todo',async(req,res)=>{
    const {title,description} = req.body
    try{
        const newTodo = new todomodel({title,description})
        await newTodo.save()
        res.status(201).json(newTodo)
        console.log(newTodo);
        
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:err.message})
    }
})


//Define route to get all items

server.get('/todo',async (req,res)=>{
    try{
        const allTodo = await todomodel.find()
        res.json(allTodo)
    }catch{(err)=>{
        console.log(err)
        res.status(500).json({message:err.message})
    }
    }
})

//Define route to update item

server.put("/todo/:id",async (req,res)=>{
    
    try{
        const {title,description}=req.body
        const id = req.params.id
        const updatedTodo = await todomodel.findByIdAndUpdate(
        id,
        { title , description },
        { new : true} 
    )

        if(!updatedTodo){
             console.log('error in todo');
            return res.status(404).json({message:'Todo not found'})
        }
        res.json(updatedTodo)
    }catch{
        (err)=>{
            console.log(err);
        }
    }
})

// Delete item from database

server.delete("/todo/:id",async (req,res)=>{
    
    try{
        const {title,description}=req.body
        const id = req.params.id
        const updatedTodo = await todomodel.findByIdAndDelete(id)

        res.status(204).end()
    }
    catch{
        (err)=>{
            console.log(err);
        }
    }
})
