class Gamelaixe {
    constructor() {
        this.gameContainer = document.getElementById("gameContainer");
        this.startButton = document.getElementById("start");
        this.car = document.getElementById("car");
        this.scoreElement = document.getElementById("score");

        this.score = 0;
        this.carX = 0;
        this.carY = 0;
        this.obstacles = [];
        this.gameSpeed = 1;
        this.keys = {};
        this.gameRunning = false;
        this.animationFrame = null;

        this.initEventListeners();
    }

    // Khởi tạo lắng nghe sự kiện
    initEventListeners() {
        document.addEventListener("keydown", (e) => this.keys[e.key] = true);
        document.addEventListener("keyup", (e) => this.keys[e.key] = false);
        this.startButton.addEventListener("click", () => this.startGame());
    }

    // Hàm bắt đầu game
    startGame() {
        if (this.gameRunning) return;
        this.gameRunning = true;
        this.startButton.style.display = "none";
        this.gameContainer.style.animation = 'roadmove 1s infinite linear';
        this.score = 0;
        this.scoreElement.innerText = this.score;
        this.carX = 0;
        this.carY = 0;
        this.car.style.transform = `translateX(-50%)`;
        this.obstacles.forEach(obs => obs.remove());
        this.obstacles = [];
        this.update();
    }
    // Cập nhật trạng thái game
    update() {
        if (!this.gameRunning) return;

        this.moveCar();
        // this.spawnObstacles();
        // this.moveObstacles();

        this.animationFrame = requestAnimationFrame(() => this.update());
    }
    // Điều khiển xe
    moveCar() {
        if (this.keys["ArrowLeft"] && this.carX > -this.gameContainer.clientWidth / 2 + 25) this.carX -= 2;
        if (this.keys["ArrowRight"] && this.carX < this.gameContainer.clientWidth / 2 - 25) this.carX += 2;
        if (this.keys["ArrowUp"] && this.carY < this.gameContainer.clientHeight  / 2 + 25) this.carX += 2;
        if (this.keys["ArrowDown"] && this.carY < this.gameContainer.clientHeight  / 2 - 25) this.carX += 2;
        this.car.style.transform = `translateX(-50%) translateX(${this.carX}px)`;
    }
}