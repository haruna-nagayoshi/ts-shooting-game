import { ShootingGame } from "./ShootingGame";
import { UserProfileManager } from "./UserProfileManager";
import { ProfileRenderer } from "./ProfileRenderer";

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

/**
 * ゲームアプリケーションのエントリーポイント
 */
export function initApp(rootElement: HTMLElement): void {
  const playerName = prompt("プレイヤー名を入力してください", "プレイヤー1") ?? "プレイヤー1";
  const profileManager = new UserProfileManager(playerName);

  // キャンバス
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.id = "game-canvas";

  // プロフィールコンテナ
  const profileContainer = document.createElement("div");
  profileContainer.id = "profile-container";

  // ナビゲーション
  const nav = document.createElement("nav");
  const gameBtn = createNavButton("ゲーム", true);
  const profileBtn = createNavButton("プロフィール", false);
  nav.appendChild(gameBtn);
  nav.appendChild(profileBtn);

  rootElement.appendChild(nav);
  rootElement.appendChild(canvas);
  rootElement.appendChild(profileContainer);

  const ctx = canvas.getContext("2d")!;
  const game = new ShootingGame(CANVAS_WIDTH, CANVAS_HEIGHT);
  const profileRenderer = new ProfileRenderer(profileContainer);

  // 初期表示: ゲーム画面
  profileContainer.style.display = "none";
  showStartScreen(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

  // タブ切り替え
  gameBtn.addEventListener("click", () => {
    canvas.style.display = "block";
    profileContainer.style.display = "none";
    gameBtn.classList.add("active");
    profileBtn.classList.remove("active");
  });

  profileBtn.addEventListener("click", () => {
    canvas.style.display = "none";
    profileContainer.style.display = "block";
    profileBtn.classList.add("active");
    gameBtn.classList.remove("active");

    profileRenderer.render(profileManager.getProfile());
    profileRenderer.onReset(() => {
      if (confirm("スコアをリセットしてよろしいですか？")) {
        profileManager.reset();
        profileRenderer.render(profileManager.getProfile());
      }
    });
  });

  // キーボード操作
  const keys: Record<string, boolean> = {};
  document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if ((e.code === "Space" || e.code === "KeyZ") && game.isRunning()) {
      game.shoot();
    }
    if (e.code === "Enter" && !game.isRunning()) {
      game.start();
      requestAnimationFrame(gameLoop);
    }
  });
  document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  let lastTime = 0;
  function gameLoop(timestamp: number): void {
    if (!game.isRunning()) {
      const score = game.getGameScore();
      profileManager.updateScore(score);
      showGameOver(ctx, score.score, CANVAS_WIDTH, CANVAS_HEIGHT);
      return;
    }

    if (timestamp - lastTime >= 16) {
      lastTime = timestamp;

      if (keys["ArrowLeft"]) game.moveLeft();
      if (keys["ArrowRight"]) game.moveRight();

      game.update();
      renderGame(ctx, game, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    requestAnimationFrame(gameLoop);
  }
}

function createNavButton(label: string, active: boolean): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = "nav-btn" + (active ? " active" : "");
  return btn;
}

function showStartScreen(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("TypeScript シューティングゲーム", w / 2, h / 2 - 20);
  ctx.font = "18px sans-serif";
  ctx.fillText("Enter キーでスタート", w / 2, h / 2 + 20);
}

function showGameOver(ctx: CanvasRenderingContext2D, score: number, w: number, h: number): void {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", w / 2, h / 2 - 30);
  ctx.font = "24px sans-serif";
  ctx.fillText(`スコア: ${score}`, w / 2, h / 2 + 10);
  ctx.font = "18px sans-serif";
  ctx.fillText("Enter キーでリスタート", w / 2, h / 2 + 50);
}

function renderGame(
  ctx: CanvasRenderingContext2D,
  game: ShootingGame,
  w: number,
  h: number
): void {
  const snap = game.getSnapshot();

  // 背景
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  // 自機
  ctx.fillStyle = "#00bfff";
  ctx.beginPath();
  ctx.moveTo(snap.player.x, snap.player.y - snap.player.height / 2);
  ctx.lineTo(snap.player.x - snap.player.width / 2, snap.player.y + snap.player.height / 2);
  ctx.lineTo(snap.player.x + snap.player.width / 2, snap.player.y + snap.player.height / 2);
  ctx.closePath();
  ctx.fill();

  // 弾
  ctx.fillStyle = "#ff0";
  for (const b of snap.player.bullets) {
    if (!b.active) continue;
    ctx.fillRect(b.x - 2, b.y - 6, 4, 12);
  }

  // 敵
  ctx.fillStyle = "#f00";
  for (const e of snap.enemies) {
    if (!e.active) continue;
    ctx.beginPath();
    ctx.arc(e.x, e.y, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // スコア
  ctx.fillStyle = "#fff";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`スコア: ${snap.score}`, 10, 24);
  ctx.textAlign = "right";
  ctx.fillText(`撃墜: ${snap.kills}`, w - 10, 24);
}
