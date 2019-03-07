import React, { useState, useEffect, useRef } from "react";
import CircularProgressbar from "react-circular-progressbar";
import { Button } from "semantic-ui-react";
// import { delay } from "./utils/helpers";

import sound from "./assets/sound.wav";
import "./App.css";

let timer;
let curSec;
const audio = new Audio(sound);

const App = props => {
  const [percentage, setPercentage] = useState(0);
  const [time, setTime] = useState({
    sec: 0,
    min: 0
  });
  const [totalSec, setTotalSec] = useState(0);
  const [pause, setPause] = useState(false);
  const [loopTimer, setLoopTimer] = useState(true);
  const [playSound, setPlaySound] = useState(false);
  const timeInput = useRef(null);

  // -------------- utility functions --------------
  const InitializeTimer = value => {
    if (Number.isNaN(value)) {
      return;
    }

    curSec = 1;
    const sec = value % 100;
    const min = ((value - sec) % 10000) / 100;
    setTime({
      sec,
      min
    });
    setTotalSec(min * 60 + sec);
  };

  // const startTimer = async e => {
  //   curSec = curSec ? curSec : 1;
  //   console.log(`curSec: ${curSec}`);
  //   setPercentage(0);

  // for (let curSec = 1; curSec <= totalSec; curSec++) {
  //   // await delay(200);
  //   // setPercentage((curSec / totalSec) * 100);
  //   timers.push(
  //     setTimeout(() => {
  //       setPercentage((curSec / totalSec) * 100);
  //     }, curSec * 200)
  //   );
  //   console.log(`curSec: ${curSec}`);
  // }
  // };

  // -------------- Event handler --------------
  const handleClick = e => {
    console.log("clicked");
  };

  const handleOnChange = e => {
    InitializeTimer(e.target.value);
  };

  const handleLoopTimer = e => {
    setLoopTimer(prevLoop => !prevLoop);
  };

  const handleStartTimer = e => {
    InitializeTimer(timeInput.current.value);
    setPercentage(0);
  };

  const handlePauseTimer = e => {
    console.log("Paused!");
    setPause(prevPause => !prevPause);
    clearTimeout(timer);
  };

  const handleResumeTimer = e => {
    console.log("Resume");
    setPause(prevPause => !prevPause);
    setPercentage(0);
  };

  const handleStopTimer = e => {
    // Set time, curSec, and percent run to 0
    setTime({
      sec: 0,
      min: 0
    });
    curSec = 0;
    setPercentage(0);

    // Clear input
    timeInput.current.value = "";

    // Clear timer
    clearTimeout(timer);
  };

  useEffect(() => {
    const circularProgress = document.querySelector(".circularProgress");
    circularProgress.addEventListener("click", handleClick);

    return () => {
      circularProgress.removeEventListener("click", handleClick);
    };
  }, []);

  // Percentage change
  // Main timer logic
  useEffect(() => {
    console.log(`min: ${time.min}, sec: ${time.sec}`);

    timer = setTimeout(() => {
      setPercentage((curSec / totalSec) * 100);

      setTime(prevTime => {
        if (prevTime.sec > 0) {
          return {
            min: prevTime.min,
            sec: prevTime.sec - 1
          };
        } else if (prevTime.min === 0 && prevTime.sec === 0) {
          return {
            min: 0,
            sec: 0
          };
        } else {
          return {
            min: prevTime.min - 1,
            sec: 59
          };
        }
      });

      curSec++;
    }, 200);
  }, [percentage]);

  useEffect(() => {
    if (Math.floor(percentage) >= 100) {
      audio.play();
      clearTimeout(timer);
      if (loopTimer) {
        InitializeTimer(timeInput.current.value);
        setPercentage(0);
      }
    }
  }, [time]);

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
        <div className="inputSpan">
          <span>{time.min}</span>
          <span>:</span>
          <span>{time.sec}</span>
        </div>
        <input
          ref={timeInput}
          onChange={handleOnChange}
          className="timeInput"
        />

        <Button.Group size="massive">
          <Button
            content="Loop"
            color={loopTimer ? "green" : "grey"}
            onClick={handleLoopTimer}
          />
          <Button.Or />
          <Button content="Start" onClick={handleStartTimer} />
          <Button.Or />
          {pause ? (
            <Button content="Resume" onClick={handleResumeTimer} />
          ) : (
            <Button content="Pause" onClick={handlePauseTimer} />
          )}
          <Button.Or />
          <Button content="Stop" color="red" onClick={handleStopTimer} />


        </Button.Group>
      </div>
    </div>
  );
};

export default App;
