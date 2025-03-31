class AudioManager {
    constructor(audioSrc) {
        this.audio = new Audio(audioSrc);
        this.audio.loop = true;
        this.isSoundOn = localStorage.getItem("sound") !== "off";

        // Nếu âm thanh đang bật, phát nhạc ngay khi vào trang
        if (this.isSoundOn) {
            this.playMusic();
        }

        // Gán sự kiện cho nút bật/tắt âm thanh bằng ID
        let soundButton = document.getElementById("on_off");
        if (soundButton) {
            soundButton.onclick = () => this.toggleSound();
        }
    }

    playMusic() {
        this.audio.play().catch(() => {
            console.warn("Trình duyệt chặn phát nhạc, chờ tương tác...");
            document.addEventListener("click", () => this.handleUserInteraction(), { once: true });
        });
    }

    handleUserInteraction() {
        if (this.isSoundOn) {
            this.audio.play();
        }
    }

    toggleSound() {
        if (this.isSoundOn) {
            this.audio.pause();
            this.audio.currentTime = 0; // Reset bài hát
            localStorage.setItem("sound", "off");
            document.getElementById("on_off").innerHTML = "<i class=\"fa-solid fa-volume-high\"></i> Bật âm thanh";
        } else {
            this.playMusic();
            localStorage.setItem("sound", "on");
            document.getElementById("on_off").innerHTML = "<i class=\"fa-solid fa-volume-xmark\"></i> Tắt âm thanh";
        }
        this.isSoundOn = !this.isSoundOn;
    }
}

// Khởi tạo lớp quản lý âm thanh
const audioManager = new AudioManager("music.mp3");

