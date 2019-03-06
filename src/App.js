import React, { useState, useEffect } from "react";
import CircularProgressbar from "react-circular-progressbar";
import { Button } from "semantic-ui-react";
import "./App.css";

const App = props => {
  const [percentage, setPercentage] = useState(0);

  const handleClick = e => {
    console.log("clicked");
  };

  useEffect(() => {
    const circularProgress = document.querySelector(".circularProgress");
    circularProgress.addEventListener("click", handleClick);

    return () => {
      circularProgress.removeEventListener("click", handleClick);
    };
  }, []);

  // componentDidUpdate
  useEffect(() => {
    let timer = setTimeout(() => {
      setPercentage(prevState => prevState + 1);
    }, 250);
    if (percentage === 100) clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="App">
      <div className="circularProgress">
        <CircularProgressbar percentage={percentage} text={`${percentage}%`} />
        <Button content="Start" />
        <input dir="rtl" id="foo" />
      </div>
    </div>
  );
};

export default App;
