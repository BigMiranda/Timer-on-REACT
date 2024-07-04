import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      },
      timerInput: "00:50:00:000",
      isRunning: false,
      showMilliseconds: false
    };

    this.timerInterval = null;

    this.mudaTimerInput = this.mudaTimerInput.bind(this);
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.handleShowMillisecondsChange = this.handleShowMillisecondsChange.bind(this);
  }

  validateInputTime() {
    let state = this.state;
    let { hours, minutes, seconds, milliseconds } = this.state.timer;

    hours = state.timerInput.substring(0, 2);
    minutes = state.timerInput.substring(3, 5);
    seconds = state.timerInput.substring(6, 8);

    if (state.timerInput.length == 12) {
      milliseconds = state.timerInput.substring(9, 12);
    } else {
      milliseconds = 0;
    }

    if (milliseconds >= 1000) {
      milliseconds = 1000 - milliseconds;
      seconds++;
    }
    if (seconds >= 60) {
      seconds = 60 - seconds;
      minutes++;
    }
    if (minutes >= 60) {
      minutes = 60 - minutes;
      hours++;
    }
    if (hours >= 100) {
      hours = 99;
    }

    state.timer = { hours, minutes, seconds, milliseconds };
    this.setState(state);
  }

  updateTimer = () => {
    let state = this.state;
    let { hours, minutes, seconds, milliseconds } = this.state.timer;

    milliseconds -= 10;
    if (milliseconds < 0) {
      milliseconds = 999;
      seconds--;
    }
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    if (minutes < 0) {
      minutes = 59;
      hours--;
    }

    if (milliseconds <= 0 && seconds <= 0 && minutes <= 0 && hours <= 0) {
      this.resetTimer();
    }

    state.timerInput = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
    state.timer = { hours, minutes, seconds, milliseconds };
    this.setState(state);
    document.title = state.timerInput.substring(0, 8);
  };

  mudaTimerInput(e) {
    e.preventDefault();
    const key = String.fromCharCode(e.keyCode);
    if (key >= '0' && key <= '9') {
      var newValue = this.state.timerInput;
      newValue = this.reWrite_inputTime(newValue, key);
      this.setState({ timerInput: newValue });
    } else if (e.keyCode == 8) {
      var newValue = this.state.timerInput;
      newValue = this.reWrite_inputTime_Deleting(newValue);
      this.setState({ timerInput: newValue });
    } else if (e.keyCode == 32 || e.keyCode == 13) {
      this.startStopTimer();
    } else {
      this.btnStrt_stopRef.focus();
    }
  }

  reWrite_inputTime(inputTimeAux, charAux) {
    var lastPosition = 0;
    let newValue = inputTimeAux.slice();
    for (var i = 1; i <= newValue.length - 1; i++) {
      var charFor = newValue.charAt(i);

      if (charFor != ':') {
        newValue = newValue.substring(0, lastPosition) + charFor + newValue.substring(lastPosition + 1);
        lastPosition = i;
      }
    }
    newValue = newValue.substring(0, newValue.length - 1) + charAux;
    return newValue;
  }

  reWrite_inputTime_Deleting(inputTimeAux) {
    var lastChar = "0";
    let newValue = inputTimeAux.slice();
    for (var i = 0; i <= newValue.length - 1; i++) {
      var charFor = newValue.charAt(i);

      if (charFor != ':') {
        newValue = newValue.substring(0, i) + lastChar + newValue.substring(i + 1);
        lastChar = charFor;
      }
    }
    return newValue;
  }

  startStopTimer() {
    let state = this.state;
    if (this.state.isRunning) {
      clearInterval(this.timerInterval);
      state.isRunning = false;
    } else {
      this.timerInterval = setInterval(this.updateTimer, 10);
      state.isRunning = true;
      this.validateInputTime();
    }
    this.setState(state);
  }

  resetTimer() {
    let state = this.state;
    state.timerInput = "00:00:00:000";
    clearInterval(this.timerInterval);
    state.timerInterval = null;
    state.isRunning = false;
    this.setState(state);
  }

  handleShowMillisecondsChange(e) {
    this.setState({ showMilliseconds: e.target.value === 'yes' });
  }

  render() {
    const isRunning = this.state.isRunning;
    const showMilliseconds = this.state.showMilliseconds;
    let timerElement;
    let timerInputValue = this.state.timerInput;
    if (!showMilliseconds) {
      timerInputValue = timerInputValue.substring(0, 8);
    }

    if (isRunning) {
      timerElement = (
        <a className='timerOutput'>
          {timerInputValue}
        </a>
      );
    } else {
      timerElement = (
        <input
          className='timerInput'
          type='text'
          value={timerInputValue}
          onKeyDown={this.mudaTimerInput}
          readOnly
        />
      );
    }
    return (
      <div className='container'>
        {timerElement}
        <div className="butons">
          <button className='btn' id='btnStrt_stop' onClick={this.startStopTimer}
            ref={(input) => { this.btnStrt_stopRef = input; }}>
            {isRunning ? 'Parar' : 'Iniciar'}
          </button>
          <button className='btn' id='btnRst' onClick={this.resetTimer}>
            Zerar
          </button>
        </div>
        <div className="options">
          <label className="radioOption" id="radioYes">
            <input type="radio" value="yes" checked={showMilliseconds} onChange={this.handleShowMillisecondsChange} />
            Mostrar milésimos
          </label>
          <label className="radioOption" id="radioNo">
            <input type="radio" value="no" checked={!showMilliseconds} onChange={this.handleShowMillisecondsChange} />
            Não mostrar milésimos
          </label>
        </div>
      </div>
    );
  }
}

export default App;
