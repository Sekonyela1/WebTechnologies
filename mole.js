let currMoleTile;
let currPlantTile;
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let currentPlayer = 1; // Variable to keep track of the current player
let gameOver = false;  // Set the initial game state to not started
let timeLeft = 60; // Set initial time to 60 seconds
let timerInterval; // Variable to store the timer interval ID
let lastClickTime = 0; // Variable to track the last time the button was clicked



window.onload = function() {
    document.getElementById("startButton").addEventListener("click", handleClick);
}

function handleClick() {
    const currentTime = new Date().getTime(); // Get the current time in milliseconds
    if (currentTime - lastClickTime < 60000) {
        // If less than 60 seconds have passed since the last click, return without doing anything
        return;
    }
    // Otherwise, update the last click time and start the game
    lastClickTime = currentTime;
    startGame();
}

function startGame() {
   
    gameOver = false; // Start the game
       scorePlayer1 = 0; // Reset player 1's score
       scorePlayer2 = 0; // Reset player 2's score
       currentPlayer = 1; // Set player 1 as the current player
       timeLeft = 60; // Reset the timer
       document.getElementById("scorePlayer1").innerText = "Player 1 Score: 0"; // Reset player 1's score display
       document.getElementById("scorePlayer2").innerText = "Player 2 Score: 0"; // Reset player 2's score display
       startTimer(); // Start the timer
       setGame(); // Start the game setup
}

function startTimer() {
    timerInterval = setInterval(function() {
        document.getElementById("timer").innerText = "Time left: " + timeLeft + "s"; // Update the timer display

        if (timeLeft <= 0 || gameOver) {
            clearInterval(timerInterval); // Stop the timer when time runs out or game over
            endGame();
        } else {
            timeLeft--; // Decrease the time by 1 second
        }
    }, 1000); // Update the timer every second
}

function setGame() {
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 1000); // 1000 miliseconds = 1 second, every 1 second call setMole
    setInterval(setPlant, 2000); // 2000 miliseconds = 2 seconds, every 2 second call setPlant
}

function getRandomTile() {
    //math.random --> 0-1 --> (0-1) * 9 = (0-9) --> round down to (0-8) integers
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    clearInterval(setMole); // Stop the mole interval
    clearInterval(setPlant); // Stop the plant interval

    if (this == currMoleTile) {
        if (currentPlayer === 1) {
            scorePlayer1 += 10;
            document.getElementById("scorePlayer1").innerText = "Player 1 Score: " + scorePlayer1.toString();
        } else {
            scorePlayer2 += 10;
            document.getElementById("scorePlayer2").innerText = "Player 2 Score: " + scorePlayer2.toString();
        }
    }
    else if (this == currPlantTile) {
        if (currentPlayer === 1) {
            scorePlayer1 -= 5; // Deduct points for clicking on the piranha
            document.getElementById("scorePlayer1").innerText = "Player 1 Score: " + scorePlayer1.toString();
        } else {
            scorePlayer2 -= 5; // Deduct points for clicking on the piranha
            document.getElementById("scorePlayer2").innerText = "Player 2 Score: " + scorePlayer2.toString();
        }
    }

    // Switch to the next player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function endGame() {
    let message = "Game over! ";
    if (scorePlayer1 > scorePlayer2) {
        message += "Player 1 wins!";
    } else if (scorePlayer2 > scorePlayer1) {
        message += "Player 2 wins!";
    } else {
        message += "It's a tie!";
    }
    alert(message);
    gameOver = true;
}