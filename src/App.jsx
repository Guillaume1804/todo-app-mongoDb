import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  console.log('tasks:', tasks)
  const [newTask, setNewTask] = useState("");
  console.log('newTask:', newTask)

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
  const response = await axios.get("http://localhost:8080/api/tasks");
  setTasks(response.data);
};

const addTask = async () => {
  if (newTask.trim()) {
    const response = await axios.post("http://localhost:8080/api/tasks", {
      title: newTask,
      completed: false,
    });
    setTasks([...tasks, response.data]);
    setNewTask("");
  }
};

const deleteTask = async (id) => {
  await axios.delete(`http://localhost:8080/api/tasks/${id}`);
  setTasks(tasks.filter(task => task._id !== id));
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <div className="flex mb-4">
          <input
            type="text"
            className="border p-2 flex-grow"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
          <button
            className="bg-blue-500 text-white p-2 ml-2 rounded"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center mb-2">
              <span>{task.title}</span>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
