class Gamelaixe {
    constructor() {
        this.gameContainer = document.getElementById("gameContainer");
        this.startButton = document.getElementById("start");
        this.scoreElement = document.getElementById("score");

        this.score = 0;
        this.obstacles = [];
        this.gameSpeed = 1;
        this.carX = 0;
        this.carY = 0;
        this.keys = {};
        this.gameRunning = false;

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
        this.car = document.getElementById("car");
        this.gameRunning = true;
        this.startButton.style.display = "none";
        this.gameContainer.style.animation = 'roadmove 1s infinite linear';
        this.score = 0;
        this.scoreElement.innerText = this.score;

        // Đặt xe vào vị trí chính giữa theo chiều ngang và gần đáy
        this.carX = (this.gameContainer.clientWidth - this.car.clientWidth) / 2;
        this.carY = this.gameContainer.clientHeight - this.car.clientHeight - 10;
        this.updateCarPosition();

        requestAnimationFrame(() => this.update());
    }

    // Cập nhật trạng thái game
    update() {
        if (!this.gameRunning) return;
        this.moveCar();
        this.spawnObstacles();
        this.moveObstacles();
        requestAnimationFrame(() => this.update());
    }

    // Điều khiển xe
    moveCar() {
        const maxX = this.gameContainer.clientWidth - this.car.clientWidth;
        const maxY = this.gameContainer.clientHeight - this.car.clientHeight;

        if (this.keys["ArrowLeft"]) this.carX = Math.max(0, this.carX - 3);
        if (this.keys["ArrowRight"]) this.carX = Math.min(maxX, this.carX + 3);
        if (this.keys["ArrowUp"]) this.carY = Math.max(0, this.carY - 3);
        if (this.keys["ArrowDown"]) this.carY = Math.min(maxY, this.carY + 3);

        this.updateCarPosition();
    }

    // Cập nhật vị trí xe trên giao diện
    updateCarPosition() {
        this.car.style.left = `${this.carX}px`;
        this.car.style.top = `${this.carY}px`;
    }
    // Tạo chướng ngại vật
    spawnObstacles() {
        if (Math.random() < 0.02) { // Xác suất tạo vật cản (2%)
            let maxAttempts = 10; // Số lần thử tìm vị trí hợp lệ
            let positionValid = false;
            let newLeft;

            while (maxAttempts > 0 && !positionValid) {
                newLeft = Math.random() * (this.gameContainer.clientWidth - 60);
                positionValid = this.checkObstaclePosition(newLeft); // Kiểm tra vị trí
                maxAttempts--;
            }

            if (positionValid) {
                let obs = document.createElement("img");
                obs.src = "img.png";
                obs.className = "obstacle-image";
                obs.style.left = newLeft + "px";
                obs.style.top = "0px";
                this.gameContainer.appendChild(obs);
                this.obstacles.push(obs);
            }
        }
    }
    checkObstaclePosition(newLeft) {
        let minDistance = 70; // Khoảng cách tối thiểu giữa các vật cản
        for (let obs of this.obstacles) {
            let obsLeft = parseFloat(obs.style.left);
            if (Math.abs(newLeft - obsLeft) < minDistance) {
                return false; // Vị trí quá gần, không hợp lệ
            }
        }
        return true; // Vị trí hợp lệ
    }

    // Di chuyển chướng ngại vật
    moveObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obs = this.obstacles[i];
            obs.style.top = (parseInt(obs.style.top) + this.gameSpeed) + "px";

            if (parseInt(obs.style.top) > this.gameContainer.clientHeight) {
                obs.remove();
                this.obstacles.splice(i, 1);
                this.score += 10;
                this.scoreElement.innerText = this.score;
            }

        }
    }
}
