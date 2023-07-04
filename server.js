//declare variables
const express = require("express");
const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
require('dotenv').config();
const TodoTask = require("./models/todotask");

//set middleware
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.DB_CONNECTION, 
    {useNewUrlParser: true},)
    .then(() => console.log('Connected to db!'))
    .catch((err) => { console.error(err); });

// GET METHOD
app.get('/', async (req, res) => {
        TodoTask.find({}) 
        .then(tasks => {
            res.render("index.ejs", {
                todoTasks: tasks
            })
        })
        .catch(err => {
            console.log(err);
    });
});
    
// POST METHOD
app.post('/', async (req, res) =>{
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch(err) {
        if(err) return res.status(500).send(err)
        res.redirect('/')
    }
});

// UPDATE METHOD
app
    .route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({})
        .then(tasks => {
            res.render("edit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post(async (req, res) => {
        const id = req.params.id;
       try{
            await TodoTask.findByIdAndUpdate(   id, {
                    title: req.body.title,
                    content: req.body.content
                });
                res.redirect('/')
            } catch(err) {
                if(err) return res.status(500).send(err)
                res.redirect('/')
            };
         
        });

// DELETE METHOD
app
    .route('/remove/:id')
    .get((req, res) => {
       const id = req.params.id
       TodoTask.findByIdAndRemove(id)
       .then(() =>{
        res.redirect('/')
       }) 
       .catch(err => {
        console.log(err);
    })
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))