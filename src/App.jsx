import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [fIndex, setFIndex] = useState(0);
  const [lIndex, setLIndex] = useState(10);
  const [newTodo, setNewTodo] = useState("");
  const [newc, setNewc] = useState("");
  const [progressValue, setProgressValue] = useState(0);

  // Fetch todos on component mount
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  // Reset first and last index when filter value changes
  useEffect(() => {
    setFIndex(0);
    setLIndex(10);
  }, [filter]);

  // Update progress value whenever indices or filtered todos change
  useEffect(() => {
    const filteredLength = filteredTodos.length;
    if (filteredLength > 0) {
      setProgressValue((100 / filteredLength) * (fIndex + 10));
    } else {
      setProgressValue(0);
    }
  }, [fIndex, lIndex, filter, todos]);
//Deleting todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => {
      if( todo.id !== id){
        return todo;
      }
    }
    ));
  };
//Adding new todo
  const addTodo = () => {
    if (newTodo.trim() === "") return;
    const newVal = {
      id: uuidv4(),
      title: newTodo,
      completed: newc === "true", // Convert string to boolean
    };
    setTodos([newVal, ...todos]);
    setNewTodo("");
  };
//filetring todo's based on selected value.
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const sdata = filteredTodos.slice(fIndex, lIndex);

  return (
    <div className="todo-app">

      {/* Add New Task */}
      <div className="add-task-container">
        
        <input
          type="text" className="addnew"
          placeholder="Add New Task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <label className="radio">
          Completed
        </label>
        <input
            type="radio"
            name="completed"
            value="true"
            onChange={(e) => setNewc(e.target.value)}
          />
        <label className="radio">
          Pending
        </label>
        <input
            type="radio"
            name="completed"
            value="false"
            onChange={(e) => setNewc(e.target.value)}
          />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="filter">Filter Tasks:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* To-Do List */}
      <ul className="todo-list">
        {sdata.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : "pending"}>
            {todo.title} 
            <button onClick={() => deleteTodo(todo.id)}> Delete </button>
          </li>
        ))}
      </ul>

      {/* Progress Bar */}
      <progress id="prog" value={progressValue} max={100}></progress>

      {/* Pagination Buttons */}
      <div className="pagination-buttons">
        <button
          onClick={() => {
            if (fIndex > 0) {
              setFIndex(fIndex - 10);
              setLIndex(lIndex - 10);
            }
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (lIndex < filteredTodos.length) {
              setFIndex(fIndex + 10);
              setLIndex(lIndex + 10);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
