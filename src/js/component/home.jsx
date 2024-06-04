import React from "react";
import TaskManager from "./Tasks";

//include images into your bundle

//create your first component
const Home = () => {
  return (
    <div className="container text-center">
      <TaskManager />
    </div>
  );
};

export default Home;
