const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database/mongoose');
const List = require('./database/models/listsModel')
const Task = require('./database/models/tasksModel')


const app = express();
const port = 8080

//CONNECT TO DB
connectDB; 

//* List Route Handlers
app.use(bodyParser.json());

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


app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})
