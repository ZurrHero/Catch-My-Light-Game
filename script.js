//global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying= false; //keeps track of tone playing or not
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  
  //swap the start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

//functions for lighting or clearing a button
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

//function for playing a single clue scheduled to run in future
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

//function to repeat some code once for each clue 
//we want to play so sequence happens
//progess variable keeps track of which turn we're on
//delay keeps running total of how long to wait until playing next clue
//pattern stores the secret pattern of clues, i references i'th element 
//of array to determine which button should be used for the i'th clue
//guessCounter=0, pattern[2,2,4,3,2,1,2,4], progress=0,
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ //for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  //add game logic here
  //is guess correct?
  //if no then lose game
  //if yes then is turn over?
  //if no then increase guess counter
  //if yes then is this the last turn?
  //if no then increment progress and play next clue sequence
  //if yes then win game
  if(btn == pattern[guessCounter]){ //is button clicked (guess) same as sequence in pattern?
    //Guess is correct, so is turn over?
    if(guessCounter == progress){//check to see if sequence of user matches computer
      //is it the last turn?
      if(progress == pattern.length - 1){ //check if it is last turn
        //no more turns so user is winner
        winGame();
      }else{ //it is not the last turn, so increment progress and play next clue sequence
        progress += 1;
        playClueSequence();
      }
    }else{ //if turn is not over, then increment guess counter
      guessCounter += 1;
    }
  }else{ //button clicked (guess) isn't correct so user loses
    loseGame();
  }
  
}

//function for losing with dialog box message to user
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}
//function for winning with dialog box message to user
function winGame(){
  stopGame();
  alert("Game Over. Congratulations! You won!.")
}

//Sound Synthesis Functions for generating sound
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

//takes button number 1-4 (btn) and plays for time (len) in milliseconds
function playTone(btn,len){
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

//breaks up playing the tone into two steps: start and stop tones
//start tone continues playing until you call stop tone for button (btn) 1-4
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
//stop tone stops sound
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