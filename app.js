const express = require('express');

const app = express();
const port = 8080

//* List Route Handlers

app.get('/lists', (req, res)=>{
    res.send('hello world!')
});

app.post('/lists', (req, res)=>{

})

app.patch('/lists/:id', (req, res)=>{
    
})

app.delete('/lists/:id', (req, res)=>{
    
})


app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})
