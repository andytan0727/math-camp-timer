import React, { useState, useEffect } from "react";
import CircularProgressbar from "react-circular-progressbar";
import { Button } from "semantic-ui-react";
import { delay } from "./utils/helpers";
import "./App.css";

const App = props => {
  const [percentage, setPercentage] = useState(0);
  const [time, setTime] = useState({
    sec: 0,
    min: 0
  });
  const [totalSec, setTotalSec] = useState(0);
  const [pause, setPause] = useState(false);

  const handleClick = e => {
    console.log("clicked");
  };

  const handleOnChange = e => {
    const value = Number(e.target.value);

    if (!Number.isNaN(value)) {
      const sec = value % 100;
      const min = ((value - sec) % 10000) / 100;
      setTime({
        sec,
        min
      });
      setTotalSec(min * 60 + sec);
    }
  };

  const startTimer = async e => {
    e.preventDefault();

    for (let curSec = 1; curSec <= totalSec; curSec++) {
      await delay(200);
      setPercentage((curSec / totalSec) * 100);
    }
  };

  useEffect(() => {
    const circularProgress = document.querySelector(".circularProgress");
    circularProgress.addEventListener("click", handleClick);

    return () => {
      circularProgress.removeEventListener("click", handleClick);
    };
  }, []);

  // time change
  useEffect(() => {
    console.log(`min: ${time.min}, sec: ${time.sec}`);
    console.log(totalSec);
    if (time.sec > 0) {
      setTime(prevTime => ({
        min: prevTime.min,
        sec: prevTime.sec - 1
      }));
    } else if (time.min === 0 && time.sec === 0) {
      setTime({
        min: 0,
        sec: 0
      });
    } else {
      setTime(prevTime => ({
        min: prevTime.min - 1,
        sec: 59
      }));
    }
  }, [percentage]);

  // componentDidUpdate (percentage)
  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     setPercentage(prevState => prevState + 1);
  //   }, 250);
  //   if (percentage === 100) clearTimeout(timer);
  // }, [percentage]);

  return (
    <div className="App">
      <div className="circularProgress">
        <CircularProgressbar
          percentage={percentage}
          text={`${time.min}m ${time.sec}s`}
          // text={`${percentage}%`}
        />
      </div>
      <div className="buttonGroup">
        <input
          className="timeInput"
          // value={`${time.min}m ${time.sec}s`}
          onChange={handleOnChange}
        />
        <Button.Group size="massive">
          <Button content="Loop" color="green" />
          <Button.Or />
          <Button content="Start" onClick={startTimer} />
          <Button.Or />
          <Button
            content="Pause"
            onClick={() => {
              alert("Paused!");
            }}
          />
          <Button.Or />
          <Button content="Stop" />
        </Button.Group>
      </div>
    </div>
  );
};

export default App;
