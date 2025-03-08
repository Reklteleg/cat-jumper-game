let doodler;
let platforms = [];
let score = 0;
let bg, doodlerLeft, doodlerRight;

function preload() {
    bg = loadImage('doodlejumpbg.png');
    doodlerLeft = loadImage('doodler-left.png');
    doodlerRight = loadImage('doodler-right.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    doodler = new Doodler(doodlerLeft, doodlerRight);

    let platformCount = 6;
    let gap = height / platformCount;
    for (let i = 1; i < platformCount; i++) {
        platforms.push(new Platform(random(width), height - i * gap));
    }

    // Настройка кнопок
    document.getElementById("leftButton").addEventListener("touchstart", () => {
        doodler.x -= 4; // Движение влево
    });

    document.getElementById("rightButton").addEventListener("touchstart", () => {
        doodler.x += 4; // Движение вправо
    });
}

function draw() {
    image(bg, 0, 0);

    translate(0, height / 2 - doodler.y);
    doodler.update(platforms);
    doodler.draw();

    for (let platform of platforms) {
        platform.draw();
    }

    if (doodler.y < platforms[platforms.length - 1].y + 200) {
        platforms.push(new Platform(random(width), platforms[platforms.length - 1].y - 60));
    }

    if (platforms[0].y > doodler.y + 400) {
        platforms.shift();
        score++;
    }

    push();
    fill(255, 255, 255);
    textSize(30);
    textAlign(CENTER);
    text(score, width / 2, doodler.y - 150);
    pop();

    if (doodler.y > height) {
        noLoop();
        alert("Вы проиграли!");
    }
}

class Doodler {
    constructor(left, right) {
        this.x = width / 2;
        this.y = height / 2;
        this.width = 40;
        this.height = 60;

        this.velocity = 0;
        this.gravity = 0.1;
        this.jumpForce = 9;

        this.left = left;
        this.right = right;
        this.goingLeft = true;
    }

    draw() {
        if (this.goingLeft) {
            image(this.left, this.x, this.y, this.width, this.height);
        } else {
            image(this.right, this.x, this.y, this.width, this.height);
        }
    }

    update(platforms) {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.velocity < -9) this.velocity = -9;

        if (keyIsDown(LEFT_ARROW)) {
            this.x -= 4;
            this.goingLeft = true;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.x += 4;
            this.goingLeft = false;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > width) this.x = width - this.width;

        for (let platform of platforms) {
            if (
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + platform.height &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width
            ) {
                this.jump();
            }
        }
    }

    jump() {
        this.velocity = -this.jumpForce;
    }
}

class Platform {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 15;

        this.image = loadImage('platform.png');
        this.brokenImage = loadImage('platform-broken.png');

        this.isBroken = random() < 0.2;
    }

    draw() {
        if (this.isBroken) {
            image(this.brokenImage, this.x, this.y, this.width, this.height);
        } else {
            image(this.image, this.x, this.y, this.width, this.height);
        }
    }
}
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}
