class AudioManager {
    constructor(audioSrc) {
        this.audio = new Audio(audioSrc);
        this.audio.loop = true;
        this.isSoundOn = localStorage.getItem("sound") !== "off";

        // Nếu âm thanh đang bật, phát nhạc ngay khi vào trang
        if (this.isSoundOn) {
            this.playMusic();
        }

        // Gán sự kiện cho tất cả nút có class "musicOnOff"
        document.querySelectorAll(".musicOnOff").forEach(button => {
            button.onclick = () => this.toggleSound();
        });
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
        } else {
            this.playMusic();
            localStorage.setItem("sound", "on");
        }
        this.isSoundOn = !this.isSoundOn;
    }
}

// Khởi tạo lớp quản lý âm thanh
const audioManager = new AudioManager("music.mp3");

// Khi bấm nút "Bắt đầu", chuyển sang trang game
document.getElementById("start").onclick = function() {
    window.location.href = "index.html";
};