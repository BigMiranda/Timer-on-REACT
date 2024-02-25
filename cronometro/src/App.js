import React, {Component} from 'react';
import './App.css'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      timer:{
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      },
      timerInput: "00:00:00",
      isRunning: false      
    }

    this.timerInterval = null;

    this.mudaTimerInput = this.mudaTimerInput.bind(this);
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  validateInputTime(){
    let state = this.state;
    let { hours, minutes, seconds, milliseconds } = this.state.timer;
    
    hours = state.timerInput.substring(0,2);
    minutes = state.timerInput.substring(3,5);
    seconds = state.timerInput.substring(6,8);

    if(state.timerInput.length == 12){
      milliseconds = state.timerInput.substring(9,11);
    }else{
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
    }if (hours >= 100) {
      hours = 99;
    }

    state.timer = { hours, minutes, seconds, milliseconds };
    this.setState(state);
  }

  updateTimer = () => {
    let state = this.state;
    let { hours, minutes, seconds, milliseconds } = this.state.timer;

    milliseconds -= 1;
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

    if(milliseconds <= 0 && seconds <= 0 && minutes <= 0 && hours <= 0){
      this.resetTimer();
    }

    state.timerInput = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
    state.timer = { hours, minutes, seconds, milliseconds };
    this.setState(state);
  };

  mudaTimerInput(e) {
    e.preventDefault(); // Impede a ação padrão do evento
    const key = String.fromCharCode(e.keyCode);
    if (key >= '0' && key <= '9') { // Se a tecla pressionada for um número
      var newValue = this.state.timerInput;
      newValue = this.reWrite_inputTime(newValue, key);
      this.setState({ timerInput: newValue });
    }else if(e.keyCode == 8){ //Se a tecla pressionada for backspace
      var newValue = this.state.timerInput;
      newValue = this.reWrite_inputTime_Deleting(newValue);
      this.setState({ timerInput: newValue });
    }
    else{
      this.btnStrt_stopRef.focus();
    }
  }

  //Add at the end the char, moving the rest to the left
  reWrite_inputTime(inputTimeAux, charAux){
    var lastPosition = 0;
    let newValue = inputTimeAux.slice();
    //00:00:00:000 or 00:00:00
    //Starts from 1 because 0 will be replaced
    for(var i = 1; i <= newValue.length - 1; i++){
      var charFor = newValue.charAt(i);

      if(charFor != ':'){
        newValue = newValue.substring(0, lastPosition) + charFor + newValue.substring(lastPosition+1);
        lastPosition = i;
      }
    }
    newValue = newValue.substring(0, newValue.length - 1) + charAux;
    return newValue;
  }

  //Move each char one digit to the right and adds zero at the leftmost one
  reWrite_inputTime_Deleting(inputTimeAux){
    var lastChar = "0";
    let newValue = inputTimeAux.slice();
    //00:00:00:000 or 00:00:00
    //Starts from 1 because 0 will be replaced
    for(var i = 0; i <= newValue.length - 1; i++){
      var charFor = newValue.charAt(i);

      if(charFor != ':'){
        newValue = newValue.substring(0, i) + lastChar + newValue.substring(i+1);
        lastChar = charFor;
      }
    }
    return newValue;
  }

  startStopTimer(){
    let state = this.state;
    if(this.state.isRunning){ //Está rodando, logo é uma Pausa
      clearInterval(this.timerInterval);
      state.isRunning = false;
    }else{ //Não está rodando, logo é um início ou reinício
      this.timerInterval = setInterval(this.updateTimer, 1);
      state.isRunning = true;
      this.validateInputTime();
    }
    this.setState(state);
  }

  resetTimer(){
    let state = this.state;
    state.timerInput = "00:00:00";
    clearInterval(this.timerInterval);
    state.timerInterval = null;
    state.isRunning = false;
    this.setState(state);
  }

  render(){
    const { hours, minutes, seconds, milliseconds, isRunning } = this.state;
    let timerElement;
    if (isRunning) {
      timerElement = (
        <a className='timerOutput'>
          {this.state.timerInput}
        </a>
      );
    } else {
      timerElement = (
        <input
          className='timerInput'
          type='text'
          value={this.state.timerInput}
          onKeyDown ={this.mudaTimerInput}
          readOnly
        />
      );
    }
    return (
      <div className='container'>
        {timerElement}
          <div className="butons">
            <button className='btn' id='btnStrt_stop' onClick={this.startStopTimer} 
            ref={(input) => { this.btnStrt_stopRef = input; }} // Referência para o input
          >
              {isRunning ? 'Parar' : 'Iniciar'}
            </button>
            <button className='btn' id='btnRst' onClick={this.resetTimer}>
              Zerar
            </button>
          </div>
      </div>
    );
  }
}

export default App;
