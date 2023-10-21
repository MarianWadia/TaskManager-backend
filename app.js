const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database/mongoose');
require('dotenv').config();
const List = require('./database/models/listsModel')
const Task = require('./database/models/tasksModel');



const app = express();
const port = 8080

//CONNECT TO DB
connectDB; 

//* List Route Handlers
app.use(bodyParser.json());

// * enable cors middleware

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/lists', (req, res)=>{
    List.find().then((lists)=>{
        res.status(202).send(lists);
    }).catch((err)=>{
        console.log('error returning lists');
        res.send(err);
    })
});

app.post('/lists', (req, res)=>{
    const {title} = req.body;
    List.create({title: title}).then((list)=>{
        res.status(200).send({list, message: 'List created successfully'})
    }).catch((err)=>{
        console.log('error creating new list');
        res.status(402).send(err);
    })
})

app.get('/lists/:id', (req, res)=>{
    const {id} = req.params;
    List.findById(id).then((list)=>{
        if(list){
            res.status(202).send(list);
        }else{
            res.status(404).send('List not found');
        }
        
    }).catch((error)=>{
        console.log('error getting list');
        res.status(500).send(error);
    })
})


app.patch('/lists/:id', (req, res)=>{
    const {id} = req.params;
    const {title} = req.body;
    List.findByIdAndUpdate({_id: id}, {title: title}, { new: true })
        .then((updatedList)=>{
            if (!updatedList) {
                return res.status(404).json({ message: 'List not found' });
            }
            return res.status(202).json({ updatedList, message: 'List updated successfully' });
    }).catch((error)=>{
        console.log('error updating the list');
        res.status(500).send(error);
    })
})

app.delete('/lists/:id', (req, res)=>{
    const {id} = req.params;
    List.deleteOne({_id: id}).then((result)=>{
        if(result.deletedCount===1){
            res.status(200).send('Task deleted successfully!');
        }else{
            res.status(200).send('Task not found');
        }
    }).catch((error)=>{
        console.log('error getting list');
        res.status(500).send(error);
    })
})

// *TASKS Route Handler

app.get('/lists/:listId/tasks', (req, res) => {
    const {listId} = req.params
    Task.find({_listId: listId}).then((tasks)=>{
        if(tasks.length>0){
            res.status(200).send(tasks)
        }else if(tasks.length===0){
            res.send({message: 'No tasks added to this list yet.'})
        }
    })
})

app.get('/lists/:listId/tasks/:taskId', async (req, res) => {
    try {
        const {listId, taskId} = req.params
        const list = await List.findById({_id: listId})
        if(!list) {
            res.status(404).send({message: "List not found"})
        }else{
            Task.findById({_id: taskId}).then((task)=>{
                if(task){
                    res.status(200).send(task)
                }else{
                    res.status(404).send({message: 'Task not found'})
                }
            })
        }
    } catch (error) {
        console.log('error creating task');
        res.status(500).send(error);
    }
})


app.post('/lists/:listId/tasks', async (req, res) => {
    try {
        const { listId } = req.params;
        const { title } = req.body;
        const list = await List.findById({_id: listId})
        if(!list) {
            res.status(404).send({message: "List not found"})
        }else{
            const newTask = await Task.create({title: title, _listId: listId});
            if(newTask){
                res.status(202).send({newTask, message: "Task created successfully"})
            }else{
                res.status(400).send({message: "Task creation failed"})
            }
        }
    } catch (error) {
        console.log('error creating task');
        res.status(500).send(error);
    }
})

app.patch('/lists/:listId/tasks/:taskId', async (req, res) => {
    try {
        const { listId, taskId} = req.params;
        const { title } = req.body;
        const list = await List.findById({_id: listId})
        if(!list) {
            res.status(404).send({message: "List not found"})
        }else{
            const updatedTask = await Task.findOneAndUpdate({_id: taskId}, {title: title}, { new: true });
            console.log(updatedTask);
            if(updatedTask){
                res.status(200).send({updatedTask, message: "Task updated successfully"})
            }else{
                res.status(400).send({message: "Failed to update task"})
            }
        }
    } catch (error) {
        console.log('error updating task');
        res.status(500).send(error);
    }
})

app.delete('/lists/:listId/tasks/:taskId', async (req, res) => {
    try {
        const { listId, taskId} = req.params;
        const list = await List.findById({_id: listId})
        if(!list) {
            res.status(404).send({message: "List not found"})
        }else{
            const deletedTask = await Task.findByIdAndDelete({_id: taskId});
            console.log(deletedTask);
            if(deletedTask){
                res.status(200).send({message: "Task deleted successfully"})
            }else{
                res.status(400).send({message: "Failed to delete task"})
            }
        }
    } catch (error) {
        console.log('error deleting task');
        res.status(500).send(error);
    }
})


app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})
