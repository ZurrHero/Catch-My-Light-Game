//global constants
//the following constant is changed to variable to increase difficulty
//const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables/
var pattern = [2, 2, 4, 3, 4, 5, 1, 2, 1, 3, 2]; 
//use [2, 2, 4, 3, 4, 5, 1, 2, 1, 3, 2] for funny star wars sound when not using the new sound files
var progress = 0;
var gamePlaying = false;
var tonePlaying= false; //keeps track of tone playing or not
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1100;
var strikes = 0;
//console.log("New Log:--------------------------------");
var timerId = 0;
var clock = 0;
var timeLimit = 60;
var timeLimitId= 0;

function guessTimeLimit() {
  timeLimit -= 1;
  document.getElementById("guessTimeLimitLabel").innerHTML = "Choose a pattern: " + timeLimit + " seconds left.";
  if(timeLimit == 0){
    loseGame();
  }
}

function stopWatch() {
  clock += 1;
  document.getElementById("timerLabel").innerHTML = "Timer: " + clock + " seconds elapsed.";
}

function randomizePattern(pattern){
  for(let i = 0; i <= pattern.length - 1; i++){
    var randomNum = Math.random() * 5;
    pattern[i] = Math.floor(randomNum) + 1;
  }
  return pattern;
}

function startGame(){
  //initialize game variables
  //console.log("Begin game.");
  progress = 0;
  gamePlaying = true;
  clueHoldTime = 1100;
  pattern = randomizePattern(pattern);
  strikes = 0;
  clock = 0;
  timeLimit = 60;
  
  document.getElementById("strikesLabel").innerHTML = "Strikes: " + strikes + " of 3.";
  document.getElementById("gameResetNotification").classList.add("hidden");
  
  //swap the start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
  
  timerId = setInterval(stopWatch, 1000);
  //setTimeout(() => {clearInterval(timerId);}, 10000);
  timeLimitId = setInterval(guessTimeLimit, 1000);
  //setTimeout(() => {clearInterval(timeLimitId);}, 15000);
}

function stopGame(){
  //console.log("Gameover.");
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("gameResetNotification").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("gameResetNotification").classList.add("hidden");}, 60000);
  clearInterval(timerId);
  clearInterval(timeLimitId);
  //document.getElementById("timerLabel").innerHTML = "Timer: " + clock + " seconds elapsed. Timer will reset in 5 seconds.";
  //document.getElementById("guessTimeLimitLabel").innerHTML = "Choose a pattern: " + timeLimit + "seconds left. Guess time will reset in 5 seconds.";
  //console.log("Timer will reset in 1 minute.");
  setTimeout(() => {
    //clearInterval(timerId);
    clock = 0;
    document.getElementById("timerLabel").innerHTML = "Timer: " + clock + " seconds elapsed.";}, 60000);
  setTimeout(() => {
    timeLimit = 60;
    document.getElementById("guessTimeLimitLabel").innerHTML = "Choose a pattern: " + timeLimit + " seconds left.";}, 60000);
  setTimeout(() => {
    strikes = 0;
    document.getElementById("strikesLabel").innerHTML = "Strikes: " + strikes + " of 3.";}, 60000);
}

function changeColor(){
  document.getElementById("colorButton").classList.add("lit");
  document.getElementById("background").classList.add("lit");
  document.getElementById("colorButton").classList.add("hidden");
  document.getElementById("refreshLabel").classList.remove("hidden");
}

//functions for lighting or clearing a button
function lightButton(btn){
  document.getElementById("button" + btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button" + btn).classList.remove("lit")
}

//function for playing a single clue scheduled to run in future
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playNumber(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

//function to repeat some code once for each clue 
//we want to play so sequence happens
//progess variable keeps track of which turn we're on
//delay keeps running total of how long to wait until playing next clue
//pattern stores the secret pattern of clues, i references i'th element 
//of array to determine which button should be used for the i'th clue
//guessCounter=0, pattern[2,2,4,3,2,1,2,4], progress=0, was orginal's sequence
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time = 1 second
  for(let i=0;i<=progress;i++){ //for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime -= 14;
    //console.log("time limit: " + timeLimit + " pattern: " + pattern[i]);
  }
  //console.log(timeLimit);

}

function guess(btn){
  //console.log("user guessed: " + btn);
  timeLimit = 60;
  if(!gamePlaying){
    return;
  }
  
  //add game logic here
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
  }else{ //button clicked (guess) isn't correct so user loses or gets a strike
    if(strikes == 2){
      document.getElementById("strikesLabel").innerHTML = "Strike " + strikes + " of 3";
      loseGame();
    }else{
      strikes += 1;
      document.getElementById("strikesLabel").innerHTML = "Strike " + strikes + " of 3";
      //console.log("strike: " + strikes);
      playClueSequence();
    }
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
  alert("Game Over. Congratulations! You won!")
}

//Sound Synthesis Functions for generating sound
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500
}

function playNumber(btn,len){
  document.getElementById("number" + btn).play();
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