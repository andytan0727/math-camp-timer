import React, { useState, useEffect, useRef } from "react";
import CircularProgressbar from "react-circular-progressbar";
import { Button, Icon } from "semantic-ui-react";
// import { delay } from "./utils/helpers";

import sound from "./assets/sound.wav";
import "./App.css";

let timer;
let curSec;
let expected;
let interval = 1000;
const audio = new Audio(sound);

const App = props => {
  const [percentage, setPercentage] = useState(null);
  const [time, setTime] = useState({
    sec: 0,
    min: 0
  });
  const [totalSec, setTotalSec] = useState(0);
  const [loopTimer, setLoopTimer] = useState(false);
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [stop, setStop] = useState(true);
  const timeInput = useRef(null);

  // -------------- utility functions --------------
  const InitializeTimer = value => {
    if (Number.isNaN(value)) {
      return;
    }

    curSec = 1;
    const timeSet = value.slice(-4);
    const sec = timeSet % 100;
    const min = ((timeSet - sec) % 10000) / 100;
    setTime({
      sec,
      min
    });
    setTotalSec(min * 60 + sec);
  };

  const resetTimer = () => {
    setTime({
      sec: 0,
      min: 0
    });
    curSec = 0;
    setPercentage(0);

    // Clear input
    timeInput.current.value = "";

    // Set all buttons to their original states
    setStart(false);
    setPause(false);
    setStop(true);
  };

  const timerLogic = () => {
    let dt = performance.now() - expected;

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

    expected += interval;
    timer = setTimeout(timerLogic, Math.max(0, interval - dt));
  };

  // -------------- Event handler --------------
  const handleClick = e => {
    timeInput.current.focus();
  };

  const handleKeyDownFocus = e => {
    if (e.keyCode === 65 && e.ctrlKey) {
      timeInput.current.focus();
    }
  };

  const handleOnChange = e => {
    InitializeTimer(e.target.value);
  };

  const handleLoopTimer = e => {
    setLoopTimer(prevLoop => !prevLoop);
  };

  const handleStartTimer = e => {
    const value = timeInput.current.value;
    // Clear possible existing timeout
    if (timer) {
      clearTimeout(timer);
    }

    if (value) {
      InitializeTimer(value);
      setStart(prevStarted => !prevStarted);
      setStop(false);

      expected = performance.now() + interval;
      timer = setTimeout(timerLogic, interval);
    }
  };

  const handlePauseTimer = e => {
    setPause(prevPause => !prevPause);
    clearTimeout(timer);
  };

  const handleResumeTimer = e => {
    if (start && pause) {
      setPause(prevPause => !prevPause);
      timerLogic();
    }
  };

  const handleStopTimer = e => {
    // Clear timer
    clearTimeout(timer);

    // reset timer
    resetTimer();
  };

  // update on time change
  useEffect(() => {
    if (Math.floor(percentage) >= 100) {
      audio.play();
      clearTimeout(timer);
      if (loopTimer) {
        InitializeTimer(timeInput.current.value);
        timerLogic();
      } else {
        resetTimer();
      }
    }
  }, [time]);

  // componentDidMount equivalent
  useEffect(() => {
    const circularProgress = document.querySelector(".circularProgress");
    circularProgress.addEventListener("click", handleClick);

    document.addEventListener("keydown", handleKeyDownFocus);

    return () => {
      circularProgress.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDownFocus);
    };
  }, []);

  return (
    <div className="App">
      <div className="mathCampText">
        <ul className="mathCampYear">
          <li>2</li>
          <li>0</li>
          <li>1</li>
          <li>9</li>
        </ul>
        <ul className="mathCampTitle">
          <li>数</li>
          <li>学</li>
          <li>营</li>
        </ul>
      </div>

      <div className="timer">
        <div className="circularProgress">
          <CircularProgressbar
            percentage={percentage}
            text={`${time.min}m ${time.sec}s`}
            background
            styles={{
              path: { stroke: `rgba(62, 152, 199, ${percentage / 100})` },
              text: { fontSize: "15px" },
              background: { fill: "white" },
              trail: { stroke: "#e8edf4" }
            }}
          />
        </div>
        <input
          ref={timeInput}
          type="number"
          onChange={handleOnChange}
          className="timeInput"
        />
        <div className="buttonGroup">
          <Button.Group size="massive">
            <Button
              // animated
              toggle
              active={loopTimer}
              onClick={handleLoopTimer}
            >
              {/* <Button.Content hidden>Loop</Button.Content> */}
              <Button.Content>
                <Icon name="circle notched" />
              </Button.Content>
            </Button>

            {!start ? (
              <Button
                // animated="vertical"
                color="teal"
                onClick={handleStartTimer}
              >
                {/* <Button.Content hidden>Start</Button.Content> */}
                <Button.Content>
                  <Icon name="play" />
                </Button.Content>
              </Button>
            ) : (
              <Button
                disabled={stop}
                // animated="fade"
                color="red"
                onClick={handleStopTimer}
              >
                {/* <Button.Content hidden>Stop</Button.Content> */}
                <Button.Content>
                  <Icon name="stop" />
                </Button.Content>
              </Button>
            )}

            {pause ? (
              <Button
                // animated="vertical"
                color="blue"
                onClick={handleResumeTimer}
              >
                {/* <Button.Content hidden>Resume</Button.Content> */}
                <Button.Content>
                  <Icon name="play" />
                </Button.Content>
              </Button>
            ) : (
              <Button disabled={!start} onClick={handlePauseTimer}>
                <Button.Content>
                  <Icon name="pause" />
                </Button.Content>
              </Button>
            )}
          </Button.Group>
        </div>
      </div>
    </div>
  );
};

export default App;
