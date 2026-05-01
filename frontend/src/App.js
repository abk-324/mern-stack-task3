import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  };

  const addTask = () => {
    if (!text) return;

    axios
      .post("http://localhost:5000/add", {
        text: text,
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setText("");
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/delete/${id}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  const updateTask = (id) => {
    axios
      .put(`http://localhost:5000/update/${id}`, {
        text: editText,
      })
      .then((res) => {
        setTasks(
          tasks.map((task) =>
            task._id === id ? res.data : task
          )
        );

        setEditingId(null);
        setEditText("");
      });
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="container">

        <div className="top-bar">
          <h1>🌌 Cosmic MERN To-Do</h1>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter your mission..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button onClick={addTask}>
            Add
          </button>
        </div>

        <ul>
          {tasks.map((task) => (
            <li key={task._id}>

              {editingId === task._id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />

                  <button onClick={() => updateTask(task._id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{task.text}</span>

                  <div>

                    <button
                      onClick={() => {
                        setEditingId(task._id);
                        setEditText(task.text);
                      }}
                    >
                      Edit
                    </button>

                    <button onClick={() => deleteTask(task._id)}>
                      Delete
                    </button>

                  </div>
                </>
              )}

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;

