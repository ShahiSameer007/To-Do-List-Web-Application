# 📝 Full Stack To-Do List Web App

A modern full-stack To-Do List application built using **Node.js, Express, MongoDB, and Vanilla JavaScript**.
This app allows users to manage tasks efficiently with advanced features like filtering, history tracking, and undo functionality.

---

## 🚀 Features

* ✅ Add, update, delete tasks
* 📂 Category-based task organization
* 🔄 Task status tracking (Pending, Completed, Cancelled)
* 🎯 Filters (All / Pending / Completed / Cancelled)
* 🕒 Task History with timestamps
* ♻️ Undo functionality (for Clear All)
* 🧹 Clear All Tasks option
* 🎨 Clean and responsive UI

---

## 🛠 Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ShahiSameer007/To-Do-List-Web-Application.git
cd To-Do-List-Web-Application
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

> ⚠️ Note: `node_modules` is not included in this repository.
> Running `npm install` will automatically install all required dependencies.

---

### 3️⃣ Start MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

---

### 4️⃣ Run the server

```bash
node server.js
```

or (if you have nodemon):

```bash
nodemon server.js
```

---

### 5️⃣ Open in browser

```
http://localhost:5000
```

---

## 📁 Project Structure

```
📦 To-Do App
 ┣ 📂 node_modules (ignored)
 ┣ 📜 server.js
 ┣ 📜 package.json
 ┣ 📜 index.html
 ┣ 📜 style.css
 ┣ 📜 script.js
```

---

## 🧠 How It Works

* Frontend sends requests using `fetch()`
* Backend (Express) handles API routes
* MongoDB stores task data
* UI updates dynamically based on responses

---

## 📌 Important Notes

* `node_modules` folder is excluded using `.gitignore`
* Make sure MongoDB is running before starting the server
* Default port: **5000**

---

## 🔮 Future Improvements

* 🔐 User authentication (login/signup)
* ☁️ Cloud deployment (Render / Vercel / MongoDB Atlas)
* 📱 Mobile responsive improvements
* 📊 Task analytics dashboard

---

## 👨‍💻 Author

**Sameer Shahi**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
