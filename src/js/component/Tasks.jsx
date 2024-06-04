import React, { useState, useEffect } from "react";

const TaskManager = () => {
  const [inputByUser, setInputByUser] = useState("");
  const [tasks, setTasks] = useState([]);

  async function createUser() {
    try {
      const response = await fetch("https://playground.4geeks.com/todo/users/gacm2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      console.log("User created", userData);
    } catch (e) {
      console.log(e);
    }
  }

  async function getInfo() {
    try {
      const response = await fetch("https://playground.4geeks.com/todo/users/gacm2");
      const infoData = await response.json();
      setTasks(infoData.todos);
    } catch (e) {
      console.log("Error fetching tasks:", e);
    }
  }

  async function userEraserraw() {
    try {
      const response = await fetch("https://playground.4geeks.com/todo/users/gacm2", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok to delete the user");
      }

      console.log("User deleted successfully");
    } catch (e) {
      console.log(e);
    }
  }

  async function userCreatorAndSyncer(){
    await createUser().then(() => getInfo());
  }

  async function userDeleter() {
    await userEraserraw();
    setTasks([]);
  }

  async function taskSaverToAPI(task){
    try{
      const response = await fetch(`https://playground.4geeks.com/todo/todos/gacm2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
      });
      console.log(task.id)
      
      

      if (!response.ok){
        throw new Error("Task was not sent successfully")
      }
      
      const data = await response.json()

      console.log("Task sent succesfully");

      return data

    }catch(e){
      console.log(e)
    }
  }

  async function taskDeleterForAPI(id){

    try{
      const response = await fetch (`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if(!response.ok){
        throw new Error("Task was not deleted successfully")
      }

      console.log("Task deleted sucessfully")

    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    createUser().then(() => getInfo());
  }, []);

  const pressEvent = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return alert("Enter your task!");
      }

      const newTask = {
        label: inputByUser,
        is_done: false,
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      };  

      

      taskSaverToAPI(newTask).then((data) => {
        
        setTasks((prevTasks) => [...prevTasks, data]);
        setInputByUser("");
      });
    }
  };

  const taskAdder = (event) => {
    setInputByUser(event.target.value);
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    console.log(taskToDelete)
    taskDeleterForAPI(taskToDelete.id).then(() => {
      const updatedTasks = tasks.filter((task, i) => task.id !== taskToDelete.id);
      setTasks(updatedTasks);
    })
  };

  return (
    <div>
      <h1 className="m-4">TASKS MANAGER</h1>
      <div className="card mt-3 align-items-center">
        <div className="mt-3">
          <input
            type="text"
            className="form-control"
            value={inputByUser}
            onChange={taskAdder}
            placeholder="Enter your task"
            onKeyDown={pressEvent}
          />
        </div>
        <div className="tasks-section mt-3 mx-1">
          {tasks.length === 0 ? (
            <span>Enter your tasks</span>
          ) : (
            tasks.map((task, index) => (
              <div
                key={index}
                className="task justify-content-between text-start container d-flex my-2"
              >
                <p>{task.label}</p>
                <button
                  className="btn btn-danger m-1 delete"
                  onClick={() => deleteTask(index)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="card-footer">
        <p>Total number of tasks {tasks.length}</p>
      </div>
      <button className="btn btn-danger m-4" onClick={userDeleter}>Delete all tasks and user</button>
      <button className="btn btn-success m-4" onClick={userCreatorAndSyncer}>Create new user</button>
    </div>
  );
};

export default TaskManager;