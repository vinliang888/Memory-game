const gameContainer = document.getElementById("game");
const gameMessage = document.getElementById("game-message")
const btn = document.querySelector("button");
const currentScoreDisplay = document.querySelector("#current-score");
let gameStarted = false;
let topScore = localStorage.getItem("topScore");
const topScoreDisplay = document.querySelector("#top-score")
topScoreDisplay.innerText = topScore;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
let cardsRevealed = [];
const maxReveal = 2;


function handleCardClick(event) {
  // you can use event.target to see which element was clicked

  //do nothing when extra clicks beyond 2 cards or same card
  if (cardsRevealed.length === maxReveal || event.target.className.includes("revealed") ) {
    return;
  }

  gameMessage.innerText = "";

  //add "color-revealed" class to the div when clicked. add div objects to revealed array
  let cardColor = event.target.className;
  event.target.classList.add(cardColor+'-revealed');
  cardsRevealed.push(event.target);

  //when 2 cards are revealed, update the score, check for match
  //if no match, remove the "color-revealed" class after 1 second
  if (cardsRevealed.length === maxReveal) {
    currentScore++;
    currentScoreDisplay.innerText = currentScore;
    if (cardsRevealed[0].classList[0] === cardsRevealed[1].classList[0]) {
      gameMessage.innerText = "That's a match!";
      cardsRevealed = [];
    } else {
      const noMatch = setTimeout(function (){
        for (let i = 0; i < cardsRevealed.length; i++) {
          cardsRevealed[i].classList.remove(cardsRevealed[i].classList[1]);
        }
        cardsRevealed = [];
      }, 1000);
      gameMessage.innerText = "That's not a match!";
    }
  }
  
  //continue the game if any of the cards do not have a "color-revealed" class
  let gameContinue = false;
  for (cards of gameContainer.children) {
    if (!cards.className.includes("revealed")) {
      gameContinue = true;
      break;
    }
  }

  //if not continued, declare the game over and evaluate if top score has been beaten. store top score locally if there is a new top score.
  if (!gameContinue) {
    if (topScore === null || currentScore < topScore) {
      localStorage.setItem("topScore",currentScore);
      topScore = currentScore;
      gameMessage.innerText = "Game Over! Congratulations on a new top score!"
      topScoreDisplay.innerText = topScore;
    } else {
      gameMessage.innerText = "Game Over!";
    }

  }
}

// Start/Reset button
btn.addEventListener("click", gameButton);

function gameButton() {
  if (!gameStarted) {
    btn.innerText = "Reset Game";
    gameStarted = true;
  } else {
    gameContainer.innerHTML="";
  }
  currentScore = 0;
  currentScoreDisplay.innerText = currentScore;
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  gameMessage.innerText = "New game started!";
}