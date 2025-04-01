class Gamelaixe {
    constructor() {
        this.gameContainer = document.getElementById("gameContainer");
        this.startButton = document.getElementById("start");
        this.scoreElement = document.getElementById("score");
        this.maxScoreElement = document.getElementById("max-score");
        this.gameMode = localStorage.getItem("gameMode") || "normal";

        this.score = 0;          // Điểm số ban đầu của người chơi
        this.maxScore = localStorage.getItem("maxScore") || 0; // Lấy điểm cao nhất từ Local Storage
        this.maxScoreElement.innerText = this.maxScore; // Hiển thị điểm cao nhất khi vào game
        this.obstacles = [];     // Danh sách các vật cản trên đường
        this.gameSpeed = 0;      // Tốc độ di chuyển của vật cản
        this.carX = 0;           // Tọa độ ngang của xe
        this.carY = 0;           // Tọa độ dọc của xe
        this.keys = {};          // Đối tượng lưu trạng thái phím bấm
        this.gameRunning = false; // Biến kiểm tra trạng thái trò chơi

        this.initEventListeners(); // Gọi hàm khởi tạo lắng nghe sự kiện
        this.initSounds(); // Khởi tạo âm thanh
    }

    // Khởi tạo âm thanh
    initSounds() {
        this.engineSound = new Howl({
            // src: ['https://assets.codepen.io/21542/howler-demo-bg-music.mp3'],
            src: ['music.mp3'],
            loop: true,
            volume: 0.6
        });

        this.crashSound = new Howl({
            src: ['lose.mp3'],
            volume: 1.0
        });
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

        // Xác định tốc độ và số lượng vật cản dựa trên chế độ chơi
        switch (this.gameMode) {
            case "easy":
                this.gameSpeed = 2;
                this.obstacleSpawnRate = 0.02; // Ít vật cản hơn
                this.pixel = 2;
                break;
            case "normal":
                this.gameSpeed = 3;
                this.obstacleSpawnRate = 0.03;
                this.pixel = 2;
                break;
            case "hard":
                this.gameSpeed = 4;
                this.obstacleSpawnRate = 0.04; // Nhiều vật cản hơn
                this.pixel = 3;
                break;
        }

        this.car = document.getElementById("car");
        this.gameRunning = true;
        this.startButton.style.display = "none";
        this.gameContainer.style.animation = 'roadmove 1s infinite linear';
        this.score = 0;
        this.scoreElement.innerText = this.score;

        // Reset phím bấm để tránh lỗi xe tự di chuyển
        this.keys = {};

        // Xóa các vật cản cũ nếu có
        this.obstacles.forEach(obs => obs.remove());
        this.obstacles = [];

        // Đặt xe vào vị trí chính giữa theo chiều ngang và gần đáy
        this.carX = (this.gameContainer.clientWidth - this.car.clientWidth) / 2;
        this.carY = this.gameContainer.clientHeight - this.car.clientHeight - 10;
        this.updateCarPosition();

        this.engineSound.play(); // Bắt đầu phát âm thanh động cơ
        this.crashSound.stop();
        requestAnimationFrame(() => this.update());
    }

    // Cập nhật trạng thái game
    update() {
        if (!this.gameRunning) return;
        this.moveCar();
        this.spawnObstacles();
        this.moveObstacles();
        this.checkCollision();

        if (this.gameRunning) {
            requestAnimationFrame(() => this.update());
        }
    }

    // Điều khiển xe
    moveCar() {
        const maxX = this.gameContainer.clientWidth - this.car.clientWidth;
        const maxY = this.gameContainer.clientHeight - this.car.clientHeight;

        if (this.keys["ArrowLeft"]) this.carX = Math.max(0, this.carX -  this.pixel);
        if (this.keys["ArrowRight"]) this.carX = Math.min(maxX, this.carX +  this.pixel);
        if (this.keys["ArrowUp"]) this.carY = Math.max(0, this.carY -  this.pixel);
        if (this.keys["ArrowDown"]) this.carY = Math.min(maxY, this.carY +  this.pixel);

        this.updateCarPosition();
    }

    // Cập nhật vị trí xe trên giao diện
    updateCarPosition() {
        this.car.style.left = `${this.carX}px`;
        this.car.style.top = `${this.carY}px`;
    }

    // Tạo chướng ngại vật
    spawnObstacles() {
        if (Math.random() < this.obstacleSpawnRate) {
            let maxAttempts = 10; // Số lần thử tìm vị trí hợp lệ
            let positionValid = false;
            let newLeft;

            while (maxAttempts > 0 && !positionValid) {
                newLeft = Math.random() * (this.gameContainer.clientWidth - 60);
                positionValid = this.checkObstaclePosition(newLeft); // Kiểm tra vị trí
                maxAttempts--;
            }

            if (positionValid) {
                let obs = document.createElement("img"); // Tạo phần tử <img>
                obs.src = "img.png"; // Đặt hình ảnh cho vật cản
                obs.className = "obstacle-image"; // Thêm class để CSS có thể định dạng
                obs.style.left = newLeft + "px"; // Đặt vị trí ngang (left)
                obs.style.top = "0px"; // Đặt vị trí dọc (bắt đầu từ trên cùng)
                this.gameContainer.appendChild(obs); // Thêm vào màn chơi
                this.obstacles.push(obs); // Lưu vật cản vào danh sách để quản lý
            }
        }
    }

    checkObstaclePosition(newLeft) {
        let minDistance = 80;
        for (let i = 0; i < this.obstacles.length; i++) {
            let obsLeft = parseFloat(this.obstacles[i].style.left);
            if (Math.abs(newLeft - obsLeft) < minDistance) {
                return false;
            }
        }
        return true;
    }

    // Di chuyển chướng ngại vật
    moveObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obs = this.obstacles[i];
            obs.style.top = (parseInt(obs.style.top) + this.gameSpeed) + "px";

            if (parseInt(obs.style.top) > this.gameContainer.clientHeight) {
                obs.remove();
                this.obstacles.splice(i, 1);

                // Cộng điểm khi né được vật cản
                if (this.gameRunning) {
                    this.score += 10;
                    this.scoreElement.innerText = this.score;
                }
            }
        }
    }


    // Kiểm tra va chạm
    checkCollision() {
        let carRect = this.car.getBoundingClientRect(); //getBoundingClientRect là một phương thức của DOM, trả về thông tin về kích thước và vị trí của phần tử trên màn hình.
        let buffer = 10; // Cho phép sai số 10px
        for (let obs of this.obstacles) {
            let obsRect = obs.getBoundingClientRect();
            if (
                carRect.left < obsRect.right - buffer &&
                carRect.right > obsRect.left + buffer &&
                carRect.top < obsRect.bottom - buffer &&
                carRect.bottom > obsRect.top + buffer
            ) {
                this.endGame();
                break;
            }
        }
    }

    // Kết thúc trò chơi
    endGame() {
        this.gameRunning = false;
        this.engineSound.stop(); // Dừng âm thanh động cơ
        this.crashSound.play(); // Phát âm thanh va chạm

        // Kiểm tra nếu điểm hiện tại cao hơn max-score
        if (this.score > this.maxScore) {
            this.maxScore = this.score;
            this.maxScoreElement.innerText = this.maxScore;
            localStorage.setItem("maxScore", this.maxScore); // Lưu vào Local Storage
        }

        // Hiển thị thông báo game over và điểm số
        alert("Game Over! Score: " + this.score);

        // Hiển thị lại nút Start để chơi lại
        this.startButton.innerText = "Chơi lại";
        this.startButton.style.backgroundColor = "#dc3545";
        this.startButton.style.display = "block";
        this.gameContainer.style.animation = 'none';
        this.keys = {}; // Reset lại phím khi game kết thúc

        // Xóa chướng ngại vật cũ
        this.obstacles.forEach(obs => obs.remove());
        this.obstacles = [];
    }
}