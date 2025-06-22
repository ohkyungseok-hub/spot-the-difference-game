const originalCanvas = document.getElementById("originalCanvas");
const originalCtx = originalCanvas.getContext("2d");

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

let differences = [];
let found = [];
let score = 0;
let timeLeft = 60;
let timerInterval = null;

function drawMarker(x, y) {
  gameCtx.beginPath();
  gameCtx.arc(x, y, 20, 0, 2 * Math.PI);
  gameCtx.strokeStyle = "lime";
  gameCtx.lineWidth = 4;
  gameCtx.stroke();
}

function startNewRound() {
  fetch("/generate")
    .then(res => res.json())
    .then(data => {
      differences = data.coords;
      found = [];
      timeLeft = 60;
      document.getElementById("timer").innerText = timeLeft;

      const originalImg = new Image();
      const modifiedImg = new Image();

      const timestamp = Date.now();
      originalImg.src = "/original?t=" + timestamp;
      modifiedImg.src = "/image?t=" + timestamp;

      originalImg.onload = () => {
        console.log("✅ 원본 이미지 로드됨");
        originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
        originalCtx.drawImage(originalImg, 0, 0, originalCanvas.width, originalCanvas.height);
      };

      modifiedImg.onload = () => {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.drawImage(modifiedImg, 0, 0, gameCanvas.width, gameCanvas.height);
      };

      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert("⏰ 시간 종료!");
        }
      }, 1000);
    });
}

gameCanvas.addEventListener("click", function (e) {
  const rect = gameCanvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  for (let i = 0; i < differences.length; i++) {
    const d = differences[i];
    const dx = clickX - d.x;
    const dy = clickY - d.y;
    if (Math.sqrt(dx * dx + dy * dy) < d.radius) {
      if (!found.includes(i)) {
        found.push(i);
        score += 100;
        drawMarker(d.x, d.y);
        document.getElementById("score").innerText = score;
        if (found.length === differences.length) {
          alert("🎉 모두 찾았습니다!");
        }
        return;
      }
    }
  }

  score -= 50;
  document.getElementById("score").innerText = score;
});




startNewRound();
document.getElementById("hintBtn").addEventListener("click", () => {
  const remaining = differences.filter((_, i) => !found.includes(i));
  if (remaining.length === 0) {
    alert("모든 틀린 부분을 이미 찾았습니다!");
    return;
  }

  // 하나 랜덤 선택
  const hint = remaining[Math.floor(Math.random() * remaining.length)];
  drawHintMarker(hint.x, hint.y);
});

function drawHintMarker(x, y) {
  gameCtx.beginPath();
  gameCtx.arc(x, y, 25, 0, 2 * Math.PI);
  gameCtx.strokeStyle = "red";
  gameCtx.lineWidth = 4;
  gameCtx.setLineDash([5, 5]); // 점선
  gameCtx.stroke();
  gameCtx.setLineDash([]); // 원상복구
}
