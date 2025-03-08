let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
};

// Physics
let velocityX = 0;
let velocityY = 0; // Doodler jump speed
let initialVelocityY = -8; // Starting velocity Y
let gravity = 0.4;

// Platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodler-right.png";
    doodler.img = doodlerRightImg;

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);

    // Add event listeners for buttons
    document.getElementById("leftButton").addEventListener("touchstart", () => {
        velocityX = -4; // Move left
        doodler.img = doodlerLeftImg;
    });

    document.getElementById("rightButton").addEventListener("touchstart", () => {
        velocityX = 4; // Move right
        doodler.img = doodlerRightImg;
    });

    document.getElementById("leftButton").addEventListener("touchend", () => {
        velocityX = 0; // Stop
    });

    document.getElementById("rightButton").addEventListener("touchend", () => {
        velocityX = 0; // Stop
    });
});

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > boardHeight) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // Platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) {
            platform.y -= initialVelocityY; // Slide platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; // Jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // Clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // Removes first element from the array
        newPlatform(); // Replace with new platform on top
    }

    // Score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth / 7, boardHeight * 7 / 8);
    }
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { // Move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    } else if (e.code == "ArrowLeft" || e.code == "KeyA") { // Move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    } else if (e.code == "Space" && gameOver) {
        // Reset
        doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width: doodlerWidth,
            height: doodlerHeight
        };

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    // Starting platforms
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    };

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); // (0-1) * boardWidth*3/4
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight
        };

        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); // (0-1) * boardWidth*3/4
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    };

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function updateScore() {
    let points = Math.floor(50 * Math.random()); // (0-1) * 50 --> (0-50)
    if (velocityY < 0) { // Negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    } else if (velocityY >= 0) {
        maxScore -= points;
    }
}
