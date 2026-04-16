let currentFilter = "pending";
let historyFilter = "all";
let lastCleared = [];

const API_URL = "http://localhost:5000/todos";

// ================= LOAD TODOS =================
async function loadTodos() {
    try {
        const res = await fetch(API_URL);
        const todos = await res.json();

        updateHeader(todos);
        loadHistory(todos);

        const list = document.getElementById("todoList");
        if (!list) return;

        list.innerHTML = "";

        todos
            .filter(todo => {
                if (currentFilter === "all") return true;
                if (currentFilter === "pending") return todo.status === "ongoing";
                return todo.status === currentFilter;
            })
            .forEach(todo => {

                const li = document.createElement("li");

                const left = document.createElement("div");
                left.classList.add("task-left");

                // COMPLETE BUTTON
                const completeBtn = document.createElement("button");
                completeBtn.textContent = "✓";
                completeBtn.classList.add("complete-btn");

                if (todo.status === "completed") {
                    completeBtn.classList.add("done");
                }

                completeBtn.onclick = async () => {
                    await fetch(`${API_URL}/${todo._id}`, {
                        method: "PUT"
                    });
                    loadTodos();
                };

                // TEXT
                const textWrapper = document.createElement("div");
                textWrapper.classList.add("task-text");

                const span = document.createElement("span");
                span.textContent = todo.task;

                if (todo.status === "completed") {
                    span.classList.add("completed");
                }

                // CATEGORY
                const badge = document.createElement("span");
                const category = (todo.category || "General").toLowerCase();

                badge.textContent = todo.category || "General";
                badge.classList.add("category-badge", category);

                textWrapper.appendChild(span);
                textWrapper.appendChild(badge);
                left.appendChild(textWrapper);

                // CANCEL
                const delBtn = document.createElement("button");
                delBtn.textContent = "✕";
                delBtn.classList.add("delete-btn");

                delBtn.onclick = async () => {
                    await fetch(`${API_URL}/${todo._id}`, {
                        method: "DELETE"
                    });
                    loadTodos();
                };

                // ACTIONS
                const actions = document.createElement("div");
                actions.style.display = "flex";
                actions.style.gap = "10px";

                actions.appendChild(completeBtn);
                actions.appendChild(delBtn);

                li.appendChild(left);
                li.appendChild(actions);

                list.appendChild(li);
            });

    } catch (err) {
        console.error("Error loading todos:", err);
    }
}

// ================= ADD TODO =================
async function addTodo() {
    const input = document.getElementById("taskInput");
    if (!input) return;

    const task = input.value.trim();
    const category = document.getElementById("categorySelect").value;

    if (!task) return;

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task, category })
        });

        input.value = "";
        loadTodos();

    } catch (err) {
        console.error("Error adding todo:", err);
    }
}

// ================= HEADER =================
function updateHeader(todos) {
    const countEl = document.getElementById("taskCount");
    const dateEl = document.getElementById("date");

    const ongoingEl = document.getElementById("ongoingCount");
    const processEl = document.getElementById("processCount");
    const completedEl = document.getElementById("completedCount");
    const cancelledEl = document.getElementById("cancelledCount");

    const pending = todos.filter(t => t.status === "ongoing").length;
    const completed = todos.filter(t => t.status === "completed").length;
    const cancelled = todos.filter(t => t.status === "cancelled").length;

    if (countEl) {
        countEl.textContent = `You Have ${pending} Tasks To Do`;
    }

    if (dateEl) {
        dateEl.textContent = new Date().toDateString();
    }

    if (ongoingEl && processEl && completedEl) {
        ongoingEl.textContent = pending;
        processEl.textContent = pending;
        completedEl.textContent = completed;
    }

    if (cancelledEl) {
        cancelledEl.textContent = cancelled;
    }
}

// ================= FILTER =================
function setFilter(filter, btn) {
    currentFilter = filter;

    document.querySelectorAll(".filters button").forEach(b => {
        b.classList.remove("active");
    });

    if (btn) btn.classList.add("active");

    loadTodos();
}

// ================= HISTORY =================
function toggleHistory() {
    document.getElementById("historyPopup").classList.toggle("hidden");
}

function loadHistory(todos) {
    const list = document.getElementById("historyList");
    if (!list) return;

    list.innerHTML = "";

    todos.forEach(todo => {
        if (!todo.history) return;

        todo.history.forEach(entry => {

            if (historyFilter !== "all" && entry.action !== historyFilter) return;

            const li = document.createElement("li");
            const time = new Date(entry.time).toLocaleString();

            li.textContent = `${todo.task} → ${entry.action} at ${time}`;
            list.appendChild(li);
        });
    });
}

function setHistoryFilter(filter, btn) {
    historyFilter = filter;

    document.querySelectorAll(".history-filters button").forEach(b => {
        b.classList.remove("active");
    });

    if (btn) btn.classList.add("active");

    loadTodos();
}

// ================= CLEAR HISTORY =================
async function clearHistory() {
    try {
        await fetch("http://localhost:5000/clear-history", {
            method: "DELETE"
        });
        loadTodos();
    } catch (err) {
        console.error("Error clearing history:", err);
    }
}

// ================= CLEAR ALL =================
async function clearAllTasks() {
    const confirmDelete = confirm("Delete ALL tasks?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(API_URL);
        lastCleared = await res.json();

        await fetch("http://localhost:5000/clear-all", {
            method: "DELETE"
        });

        loadTodos();
        showUndoClearAll();

    } catch (err) {
        console.error("Error clearing all tasks:", err);
    }
}

// ================= UNDO CLEAR ALL =================
function showUndoClearAll() {
    let undoBar = document.getElementById("undoBar");

    if (!undoBar) {
        undoBar = document.createElement("div");
        undoBar.id = "undoBar";

        undoBar.innerHTML = `
            <span>All tasks deleted</span>
            <button onclick="undoClearAll()">UNDO</button>
        `;

        document.body.appendChild(undoBar);
    }

    undoBar.style.display = "flex";

    Object.assign(undoBar.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#333",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "12px",
        gap: "15px",
        zIndex: "999999"
    });

    setTimeout(() => {
        undoBar.style.display = "none";
    }, 15000);
}

async function undoClearAll() {
    if (!lastCleared.length) return;

    try {
        for (let todo of lastCleared) {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: todo.task,
                    category: todo.category
                })
            });
        }

        lastCleared = [];
        loadTodos();

        document.getElementById("undoBar").style.display = "none";

    } catch (err) {
        console.error("Undo failed:", err);
    }
}

// ================= INIT =================
window.onload = () => {
    loadTodos();

    document.querySelectorAll(".filters button").forEach(btn => {
        if (btn.textContent.toLowerCase() === "pending") {
            btn.classList.add("active");
        }
    });
};