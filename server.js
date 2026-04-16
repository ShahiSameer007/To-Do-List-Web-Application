const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/todoDB")
.then(() => console.log("Connected to MongoDB successfully "))
.catch(err => console.log(err));

// ================= SCHEMA =================

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["ongoing", "completed", "cancelled"],
        default: "ongoing"
    },
    category: {
        type: String,
        default: "General"
    },
    history: [
        {
            action: String, // created, completed, cancelled, reopened
            time: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Todo = mongoose.model("Todo", todoSchema);

// ================= ROUTES =================

// GET all todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE todo
app.post("/todos", async (req, res) => {
    try {
        const { task, category } = req.body;

        if (!task || !task.trim()) {
            return res.status(400).json({ error: "Task is required" });
        }

        const newTodo = new Todo({
            task,
            category: category || "General",
            history: [{ action: "created" }]
        });

        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CANCEL task (instead of delete)
app.delete("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        todo.status = "cancelled";

        todo.history.push({
            action: "cancelled"
        });

        await todo.save();

        res.json({ message: "Task cancelled ❌" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TOGGLE complete
app.put("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        const newStatus = todo.status === "completed" ? "ongoing" : "completed";

        todo.status = newStatus;

        todo.history.push({
            action: newStatus === "completed" ? "completed" : "reopened"
        });

        await todo.save();

        res.json(todo);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CLEAR ALL HISTORY
app.delete("/clear-history", async (req, res) => {
    try {
        await Todo.updateMany({}, { $set: { history: [] } });
        res.json({ message: "History cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE ALL TODOS
app.delete("/clear-all", async (req, res) => {
    try {
        await Todo.deleteMany({});
        res.json({ message: "All tasks deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= START SERVER =================

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});