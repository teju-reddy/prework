// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
//var pattern = [2, 2, 8, 3, 4, 3, 2, 5, 1, 2, 8, 4, 6, 7, 8];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var mistakes = 0;
var pattern = [];
var x = document.getElementById("strike");

//var clueHoldTime = 1000; //how long to hold each clue's light/sound

function startGame(){
  //initialize game variables
  console.log("start");
  progress = 0;
  mistakes = 0;
  x.innerHTML = "Mistakes: 0/3";
  console.log("start 0");
  gamePlaying = true;
  random_pattern();
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  pattern = [];
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 510,
  6: 570,
  7: 610,
  8: 680
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
  
  function playClueSequence(){
  guessCounter = 0;
 /* if(clueHoldTime != 500){
    clueHoldTime -= 100;
  }*/
    console.log("clue hold time: "+clueHoldTime);
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  x.innerHTML = "Mistakes: 0/3";
}
function winGame(){
  stopGame();
  alert("Game Over. You won!");
}


function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    mistakes++;
    console.log("mistakes: " + mistakes)

    if (mistakes ==1) {
      x.innerHTML = "Mistakes: 1/3";
      playClueSequence();
    }
    else if (mistakes == 2) {
      x.innerHTML = "Mistakes: 2/3";
      playClueSequence();
    }
    else if(mistakes ==3){
      loseGame();
    }
    
  }
  
}

function random_pattern(){
  for (var i=0; i< 10; i++) {
      pattern.push(Math.floor(Math.random() * 7)+1)
    console.log("pattern: " + pattern[i]);
  }
 
}
