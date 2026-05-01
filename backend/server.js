const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/todoDB")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// Task Schema
const TaskSchema = new mongoose.Schema({
    text: String
});

const Task = mongoose.model("Task", TaskSchema);


// GET all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
});


// ADD task
app.post("/add", async (req, res) => {
    const newTask = new Task({
        text: req.body.text
    });

    await newTask.save();

    res.send(newTask);
});


// UPDATE task
app.put("/update/:id", async (req, res) => {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        { text: req.body.text },
        { new: true }
    );

    res.send(updatedTask);
});


// DELETE task
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    await Task.findByIdAndDelete(id);

    res.send({
        message: "Task deleted"
    });
});


// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});