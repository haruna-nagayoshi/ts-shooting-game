import type { Player, Bullet, Enemy, GameScore } from "./types";

const BULLET_SPEED = 8;
const ENEMY_SPAWN_INTERVAL = 60; // フレーム単位
const ENEMY_SCORE = 10;

/**
 * シューティングゲームのコアロジック
 */
export class ShootingGame {
  private player: Player;
  private enemies: Enemy[] = [];
  private score = 0;
  private kills = 0;
  private frameCount = 0;
  private running = false;
  private startTime: number = 0;

  constructor(
    private readonly canvasWidth: number,
    private readonly canvasHeight: number
  ) {
    this.player = this.createPlayer();
  }

  private createPlayer(): Player {
    return {
      x: this.canvasWidth / 2,
      y: this.canvasHeight - 60,
      width: 32,
      height: 32,
      speed: 5,
      bullets: [],
    };
  }

  /**
   * ゲームを開始する
   */
  start(): void {
    this.player = this.createPlayer();
    this.enemies = [];
    this.score = 0;
    this.kills = 0;
    this.frameCount = 0;
    this.running = true;
    this.startTime = Date.now();
  }

  /**
   * ゲームを終了する
   */
  stop(): void {
    this.running = false;
  }

  /**
   * ゲームが実行中かどうかを返す
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * 自機を左へ移動する
   */
  moveLeft(): void {
    if (!this.running) return;
    this.player.x = Math.max(this.player.width / 2, this.player.x - this.player.speed);
  }

  /**
   * 自機を右へ移動する
   */
  moveRight(): void {
    if (!this.running) return;
    this.player.x = Math.min(
      this.canvasWidth - this.player.width / 2,
      this.player.x + this.player.speed
    );
  }

  /**
   * 弾を発射する
   */
  shoot(): void {
    if (!this.running) return;
    this.player.bullets.push({
      x: this.player.x,
      y: this.player.y - this.player.height / 2,
      speed: BULLET_SPEED,
      active: true,
    });
  }

  /**
   * 1フレーム分の更新処理
   */
  update(): void {
    if (!this.running) return;
    this.frameCount++;

    // 弾を移動
    this.player.bullets = this.player.bullets.filter((b) => b.active && b.y > 0);
    for (const bullet of this.player.bullets) {
      bullet.y -= bullet.speed;
    }

    // 敵を生成
    if (this.frameCount % ENEMY_SPAWN_INTERVAL === 0) {
      this.spawnEnemy();
    }

    // 敵を移動・画面外チェック
    this.enemies = this.enemies.filter((e) => e.active && e.y < this.canvasHeight);
    for (const enemy of this.enemies) {
      enemy.y += enemy.speed;
    }

    // 衝突判定
    this.checkCollisions();
  }

  private spawnEnemy(): void {
    const x = Math.random() * (this.canvasWidth - 32) + 16;
    this.enemies.push({
      x,
      y: 0,
      speed: 2 + Math.random() * 2,
      hp: 1,
      active: true,
    });
  }

  private checkCollisions(): void {
    for (const bullet of this.player.bullets) {
      for (const enemy of this.enemies) {
        if (!bullet.active || !enemy.active) continue;
        if (this.isColliding(bullet.x, bullet.y, 4, enemy.x, enemy.y, 16)) {
          bullet.active = false;
          enemy.hp--;
          if (enemy.hp <= 0) {
            enemy.active = false;
            this.kills++;
            this.score += ENEMY_SCORE;
          }
        }
      }
    }

    // 自機と敵の衝突（ゲームオーバー）
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      if (
        this.isColliding(
          this.player.x,
          this.player.y,
          this.player.width / 2,
          enemy.x,
          enemy.y,
          16
        )
      ) {
        this.running = false;
      }
    }
  }

  private isColliding(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ): boolean {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy) < r1 + r2;
  }

  /**
   * 現在のスコアを返す
   */
  getScore(): number {
    return this.score;
  }

  /**
   * 現在の撃墜数を返す
   */
  getKills(): number {
    return this.kills;
  }

  /**
   * ゲーム結果を返す
   */
  getGameScore(): GameScore {
    const duration = this.running ? 0 : Math.floor((Date.now() - this.startTime) / 1000);
    return {
      score: this.score,
      kills: this.kills,
      duration,
    };
  }

  /**
   * 描画用のスナップショットを返す
   */
  getSnapshot(): {
    player: Player;
    enemies: Enemy[];
    score: number;
    kills: number;
  } {
    return {
      player: { ...this.player, bullets: [...this.player.bullets] },
      enemies: [...this.enemies],
      score: this.score,
      kills: this.kills,
    };
  }
}
