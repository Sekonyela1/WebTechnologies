let currMoleTile;
let currPlantTile;
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let currentPlayer = 1;
let gameOver = false;
let timeLeft = 60;
let timerInterval;
let lastClickTime = 0;
let score = 0;
let doublePointsActive = false;
let freezeTimerActive = false;
let moleInterval;
let plantInterval;
let moleTime = 1000;
let plantTime = 2000;
let playerName = '';
let achievements = {
    firstBlood: false,
    centuryClub: false,
    whackMaster: false,
    unbeatable: false
};

window.onload = function() {
    openInstructions(); // Open instructions when the page is loaded
    fetchLeaderboard();
    document.getElementById("startButton").addEventListener("click", handleClick);
    document.getElementById("instructionsButton").addEventListener("click", openInstructions);
    document.getElementsByClassName("close")[0].addEventListener("click", closeInstructions);
    window.addEventListener("click", outsideClick);
    console.log("Event listeners set");
}

function playSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
}

function handleClick() {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 60000) {
        console.log("Start button clicked too soon. Waiting for 60 seconds to pass.");
        return; // Avoid starting a new game if the last game started less than 60 seconds ago
    }
    lastClickTime = currentTime;
    startGame();
}

function startGame() {
    console.log("Starting game...");
    gameOver = false;
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    currentPlayer = 1;
    timeLeft = 60;
    document.getElementById("scorePlayer1").innerText = "Player 1 Score: 0";
    document.getElementById("scorePlayer2").innerText = "Player 2 Score: 0";
    startTimer();
    setGame();
}

function startTimer() {
    timerInterval = setInterval(function() {
        document.getElementById("timer").innerText = "Time left: " + timeLeft + "s";
        if (timeLeft <= 0 || gameOver) {
            clearInterval(timerInterval);
            endGame();
        } else {
            timeLeft--;
        }
    }, 1000);
}

function setGame() {
    document.getElementById("board").innerHTML = ""; // Clear the board
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.classList.add("tile"); // Optional: Add class for styling
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setDifficulty();
}

function setDifficulty() {
    const difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") {
        moleTime = 1500;
        plantTime = 3000;
    } else if (difficulty === "medium") {
        moleTime = 1000;
        plantTime = 2000;
    } else if (difficulty === "hard") {
        moleTime = 500;
        plantTime = 1000;
    }

    moleInterval = setInterval(setMole, moleTime);
    plantInterval = setInterval(setPlant, plantTime);
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) return;
    if (currMoleTile) currMoleTile.innerHTML = "";
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";
    mole.classList.add("game-character"); // Add a class for styling
    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) return;
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);

     // Attach sound event listener to the new mole
     mole.addEventListener('click', function() {
        playSound("./slap-90128.mp3");
    });
}

function setPlant() {
    if (gameOver) return;
    if (currPlantTile) currPlantTile.innerHTML = "";
    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";
    plant.classList.add("game-character"); // Add a class for styling
    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) return;
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);

     // Attach sound event listener to the new plant
     plant.addEventListener('click', function() {
        playSound("./slap-90128.mp3");
    });
}

function endGame() {
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    let message = "Game over! ";
    if (scorePlayer1 > scorePlayer2) {
        message += "Player 1 wins!";
        startConfetti(); // Start confetti celebration
    } else if (scorePlayer2 > scorePlayer1) {
        message += "Player 2 wins!";
        startConfetti(); // Start confetti celebration
    } else {
        message += "It's a tie!";
    }
    alert(message);
    gameOver = true;

    // Prompt for player name and update leaderboard
    openNameModal();
}

// Modal functions
function openInstructions() {
    document.getElementById("instructionsModal").style.display = "block";
}

function closeInstructions() {
    document.getElementById("instructionsModal").style.display = "none";
}

function outsideClick(event) {
    if (event.target == document.getElementById("instructionsModal")) {
        document.getElementById("instructionsModal").style.display = "none";
    }
}

function openNameModal() {
    document.getElementById("nameModal").style.display = "block";
}

function closeNameModal() {
    document.getElementById("nameModal").style.display = "none";
}

function submitScore() {
    let player1Name = document.getElementById("player1Name").value.trim();
    let player2Name = document.getElementById("player2Name").value.trim();

    if (player1Name === '' || player2Name === '') {
        alert("Please enter both players' names.");
        return;
    }
    
    document.getElementById("nameModal").style.display = "none";
    updateLeaderboard(player1Name, scorePlayer1, player2Name, scorePlayer2);
}

function updateLeaderboard(player1Name, scorePlayer1, player2Name, scorePlayer2) {
    console.log("Updating leaderboard...");
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const date = new Date().toLocaleString();
    leaderboard.push({ player: player1Name, score: scorePlayer1, date: date });
    leaderboard.push({ player: player2Name, score: scorePlayer2, date: date });
    leaderboard.sort((a, b) => b.score - a.score);

    // Save to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    displayLeaderboard(leaderboard);
}

function fetchLeaderboard() {
    console.log("Fetching leaderboard...");
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    displayLeaderboard(leaderboard);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}


function displayLeaderboard(leaderboard) {
    console.log("Displaying leaderboard...");
    const list = document.getElementById("leaderboard-achievements-list");
    list.innerHTML = ''; // Clear the list

    // Header row for the columns
    const header = document.createElement('li');
    header.innerHTML = `
        <div><strong>Player</strong></div>
        <div><strong>Score</strong></div>
        <div><strong>Achievement</strong></div>
        <div><strong>Action</strong></div>
    `;
    list.appendChild(header);

    // Add leaderboard entries with achievements
    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        const achievement = getAchievement(entry.score);

        listItem.innerHTML = `
            <div><span>${entry.player}</span></div>
            <div><span>${entry.score}</span></div>
            <div><span>${achievement}</span></div>
            <div><button class="delete-button">Delete</button></div>
        `;
        
        // Add delete button functionality
        listItem.querySelector(".delete-button").addEventListener("click", function() {
            deleteLeaderboardEntry(index);
        });

        list.appendChild(listItem);
    });
}

// Function to determine the achievement based on the score
function getAchievement(score) {
    if (score >= 100) return 'Century Club';
    if (score >= 50) return 'Half Century';
    if (score >= 10) return 'First Blood';
    return 'Participant';
}

function deleteLeaderboardEntry(index) {
    console.log("Deleting leaderboard entry at index:", index);
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    if (index > -1 && index < leaderboard.length) {
        leaderboard.splice(index, 1);  // Remove the entry at the specified index
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));  // Save the updated leaderboard
        displayLeaderboard(leaderboard);  // Re-display the updated leaderboard
    } else {
        console.error("Invalid index for deletion");
    }
}

// Confetti Effect
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let confettiElements = [];

    function createConfetti() {
        for (let i = 0; i < 150; i++) {
            confettiElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                color: 'hsl(' + Math.random() * 360 + ', 100%, 50%)',
                size: Math.random() * 10 + 5,
                speed: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }
    }

    function renderConfetti() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        confettiElements.forEach((confetti, index) => {
            context.fillStyle = confetti.color;
            context.beginPath();
            context.arc(confetti.x, confetti.y, confetti.size, 0, Math.PI * 2);
            context.fill();
            
            confetti.y += confetti.speed;
            confetti.rotation += confetti.rotationSpeed;
            if (confetti.y > canvas.height) {
                confettiElements.splice(index, 1);
            }
        });

        if (confettiElements.length > 0) {
            requestAnimationFrame(renderConfetti);
        }
    }

    createConfetti();
    renderConfetti();
}


function checkAchievements(score) {
    if (!achievements.firstBlood && score > 0) {
        awardAchievement("First Blood");
        achievements.firstBlood = true;
    }
    if (!achievements.centuryClub && score >= 100) {
        awardAchievement("Century Club");
        achievements.centuryClub = true;
    }
    if (!achievements.whackMaster && score >= 200) {
        awardAchievement("Whack Master");
        achievements.whackMaster = true;
    }
    if (!achievements.unbeatable && isHighScore(score)) {
        awardAchievement("Unbeatable");
        achievements.unbeatable = true;
    }
}

function awardAchievement(achievementName) {
    const achievementDescriptions = {
        "First Blood": "Score at least 10 points.",
        "Century Club": "Score 100 points.",
        "Whack Master": "Score more than 150 points.",
        "Unbeatable": "End a game without anyone scoring."
    };

    // Check if the achievement is already displayed
    const achievementsList = document.getElementById('achievements-list');
    const existingAchievements = Array.from(achievementsList.getElementsByTagName('li'));
    if (existingAchievements.some(item => item.textContent.includes(achievementName))) {
        return; // If already displayed, don't add it again
    }

    // Display the achievement on the web page
    const achievementItem = document.createElement('li');
    achievementItem.textContent = '${achievementName}: ${achievementDescriptions[achievementName]}';
    achievementsList.appendChild(achievementItem);

    // Alert the player about the achievement
    alert("Achievement Unlocked: " + achievementName + "!");
    
    // Save the achievements to localStorage
    saveAchievements();
}

function isHighScore(score) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    if (leaderboard.length === 0) return true;
    return score > leaderboard[0].score;
}

function selectTile() {
    if (gameOver) return;

    let scoreUpdate = 0;

    if (this == currMoleTile) {
        scoreUpdate = 10;
        if (currentPlayer === 1) {
            scorePlayer1 += scoreUpdate;
            document.getElementById("scorePlayer1").innerText = "Player 1 Score: " + scorePlayer1.toString();
        } else {
            scorePlayer2 += scoreUpdate;
            document.getElementById("scorePlayer2").innerText = "Player 2 Score: " + scorePlayer2.toString();
        }
    } else if (this == currPlantTile) {
        scoreUpdate = -5;
        if (currentPlayer === 1) {
            scorePlayer1 += scoreUpdate; 
            document.getElementById("scorePlayer1").innerText = "Player 1 Score: " + scorePlayer1.toString();
        } else {
            scorePlayer2 += scoreUpdate; 
            document.getElementById("scorePlayer2").innerText = "Player 2 Score: " + scorePlayer2.toString();
        }
    }

    checkAchievements(); // Check for achievements

    // Switch to the next player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// Function to check and unlock achievements
function checkAchievements() {
    let score = currentPlayer === 1 ? scorePlayer1 : scorePlayer2;
    
    // First Blood Achievement (First successful whack)
    if (!achievements.firstBlood && score >= 10) {
        achievements.firstBlood = true;
        showAchievementModal('First Blood');
        addAchievementToLeaderboard('First Blood');
    }

    // Century Club Achievement (Reach 100 points)
    if (!achievements.centuryClub && score >= 100) {
        achievements.centuryClub = true;
        showAchievementModal('Century Club');
        addAchievementToLeaderboard('Century Club');
    }

    // Whack Master Achievement (Reach 500 points)
    if (!achievements.whackMaster && score >= 500) {
        achievements.whackMaster = true;
        showAchievementModal('Whack Master');
        addAchievementToLeaderboard('Whack Master');
    }

    // Unbeatable Achievement (Finish with the highest score)
    if (!achievements.unbeatable && scorePlayer1 > scorePlayer2) {
        achievements.unbeatable = true;
        showAchievementModal('Unbeatable');
        addAchievementToLeaderboard('Unbeatable');
    }
}

// Array to keep track of unlocked achievements
let unlockedAchievements = [];

// Function to display achievement modal
function showAchievementModal(achievementName) {
    const modal = document.querySelector('.achievement-modal');
    const modalContent = modal.querySelector('p');
    modalContent.innerText = `Achievement Unlocked: ${achievementName}!`;
    modal.style.display = 'block';

    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

// Function to add achievement to the leaderboard
function addAchievementToLeaderboard(achievementName) {
     // Check if the achievement is already in the list to prevent duplicates
     if (!unlockedAchievements.includes(achievementName)) {
        unlockedAchievements.push(achievementName);

    const achievementList = document.getElementById('leaderboard-achievements-list');
    const achievementItem = document.createElement('li');
    achievementItem.innerText = `${achievementName}`;
    achievementList.appendChild(achievementItem);
    console.log ('Achievement added to leaderboard', achievementName);
     }
}

// Function to unlock an achievement
function unlockAchievement(achievementName) {
    showAchievementModal(achievementName);
    addAchievementToLeaderboard(achievementName);
}

// Example of unlocking multiple achievements
function unlockAllAchievements() {
    const achievements = ['First Win', 'Sharp Shooter', 'Speed Runner', 'Master Explorer'];
    achievements.forEach(achievement => unlockAchievement(achievement));
}

function saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

function loadAchievements() {
    const savedAchievements = JSON.parse(localStorage.getItem('achievements'));
    if (savedAchievements) {
        achievements = savedAchievements;
        displayLoadedAchievements();  // Display the loaded achievements
    }
}

function displayLoadedAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = ''; // Clear the list before displaying

    const achievementDescriptions = {
        "First Blood": "Score at least 10 points.",
        "Century Club": "Score 100 points.",
        "Whack Master": "Score more than 150 points.",
        "Unbeatable": "End a game without anyone scoring."
    };

    for (const achievement in achievements) {
        if (achievements[achievement]) { // Only display achievements that have been unlocked
            const achievementItem = document.createElement('li');
            achievementItem.textContent = '${achievement}: ${achievementDescriptions[achievement]}';
            achievementsList.appendChild(achievementItem);
        }
    }
}

function updateAchievements() {
    
    if (!achievements.firstBlood && (scorePlayer1 >= 10 || scorePlayer2 >= 10)) {
        achievements.firstBlood = true;
        addAchievement("First Blood", "Score at least 10 points.");
    }

    if (!achievements.centuryClub && (scorePlayer1 >= 100 || scorePlayer2 >= 100)) {
        achievements.centuryClub = true;
        addAchievement("Century Club", "Score 100 points.");
    }

    if (!achievements.whackMaster && (scorePlayer1 > 150 || scorePlayer2 > 150)) {
        achievements.whackMaster = true;
        addAchievement("Whack Master", "Score more than 150 points.");
    }

    if (!achievements.unbeatable && scorePlayer1 === 0 && scorePlayer2 === 0 && gameOver) {
        achievements.unbeatable = true;
        addAchievement("Unbeatable", "End a game without anyone scoring.");
    }
}

function addAchievement(title, description) {
    const achievementList = document.getElementById("achievements-list");
    const achievementItem = document.createElement("li");
    achievementItem.textContent = '${title}: ${description}';
    achievementList.appendChild(achievementItem);
}

document.getElementById('download-leaderboard').addEventListener('click', function() {
    downloadLeaderboard();
});

function downloadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let csvContent = "data:text/csv;charset=utf-8,Player,Score,Date,Achievement\n";

    leaderboard.forEach(entry => {
        const achievement = getAchievement(entry.score);
        const row = entry.player + "," + entry.score + "," + entry.date + "," + achievement + "\n";
        csvContent += row;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leaderboard.csv");
    document.body.appendChild(link);

    link.click(); // This will download the file
    document.body.removeChild(link); // Clean up the link after download
}

function calculateScoreForAchievement(achievementName) {
    if (achievementName === 'First Win') return 1000;
    if (achievementName === 'Sharp Shooter') return 1500;
    if (achievementName === 'Whack Master') return 2000;
    if (achievementName === 'Century Club') return 2500;
    if (achievementName === 'Unbeatable') return 3000;
    

    return 0; 
}

function addToLeaderboard(player, score) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const date = new Date().toLocaleDateString(); // Get the current date in a readable format

    leaderboard.push({ player: player, score: score, date: date });

    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
    updateLeaderboardUI();
}

function updateLeaderboardUI() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardElement = document.getElementById('leaderboard');

    leaderboardElement.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = entry.player + ": " + entry.score + " points - " + formatDateTime(entry.date);
        leaderboardElement.appendChild(listItem);
    });
}

function activateBonusMole() {
    score += 10; // Increase score by a bonus amount
    updateScoreDisplay(); // Assuming you have a function to update the score display
}

function activateFreezePowerUp() {
    if (!freezeTimerActive) {
        freezeTimerActive = true;
        clearTimeout(gameTimer); 
        setTimeout(() => {
            startGameTimer(); 
            freezeTimerActive = false;
        }, 3000); // Freeze for 3 seconds
    }
}

function activateDoublePoints() {
    if (!doublePointsActive) {
        doublePointsActive = true;
        setTimeout(() => {
            doublePointsActive = false;
        }, 10000); // Double points active for 10 seconds
    }
}

function activatePenaltyMole() {
    score -= 5; // Deduct points
    updateScoreDisplay();
}

function moleClicked(event) {
    const mole = event.target;

    if (mole.classList.contains('bonus-mole')) {
        activateBonusMole();
    } else if (mole.classList.contains('freeze-powerup')) {
        activateFreezePowerUp();
    } else if (mole.classList.contains('double-points')) {
        activateDoublePoints();
    } else if (mole.classList.contains('penalty-mole')) {
        activatePenaltyMole();
    } else {
        score += doublePointsActive ? 2 : 1; // Double points if active
        updateScoreDisplay();
    }

    mole.classList.remove('active'); // Assuming active class shows the mole
    hideMole(mole); // Assuming a function that hides the mole after being clicked
}

function showRandomMole() {
    const moles = document.querySelectorAll('.mole');
    const mole = moles[Math.floor(Math.random() * moles.length)];
    
    // Randomly choose the mole type
    const random = Math.random();
    if (random < 0.1) {
        mole.classList.add('bonus-mole');
    } else if (random < 0.2) {
        mole.classList.add('freeze-powerup');
    } else if (random < 0.3) {
        mole.classList.add('double-points');
    } else if (random < 0.4) {
        mole.classList.add('penalty-mole');
    } else {
        mole.classList.add('regular-mole');
    }

    mole.classList.add('active'); // Show the mole
    setTimeout(() => hideMole(mole), 1000); // Hide the mole after 1 second
}