import Phaser from 'phaser'
import { TextureKeys } from '../constants/TextureKeys'
import { Player } from '../objects/Player'
import { Bullet } from '../objects/Bullet'
import { Enemy } from '../objects/Enemy'
import { EnemyBullet } from '../objects/EnemyBullet'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private bullets: Bullet[] = []
  private enemies: Enemy[] = []
  private enemyBullets: EnemyBullet[] = []
  private spaceWasDown = false
  // 敵のスポーン間隔を管理するタイマー
  private enemySpawnTimer = 0
  private readonly ENEMY_SPAWN_INTERVAL = 2000 // ミリ秒
  private readonly ENEMY_FIRE_INTERVAL = 3000 // 敵の発射間隔（ミリ秒）
  private isGameOver = false

  constructor() {
    super({ key: 'GameScene' })
  }

  // preload: 画像・音声などのアセットを読み込む
  preload(): void {
    // プレースホルダー: Graphics APIで四角形テクスチャを動的生成する
    // → 後で this.load.image(TextureKeys.PLAYER, 'assets/player.png') に差し替えるだけでOK
    this.createPlaceholderTextures()
  }

  // create: ゲームオブジェクトの初期配置
  create(): void {
    this.isGameOver = false
    this.bullets = []
    this.enemies = []
    this.enemyBullets = []

    this.cameras.main.setBackgroundColor('#000000')

    this.player = new Player(this, 240, 560)
    this.cursors = this.input.keyboard!.createCursorKeys()
  }

  // update: 毎フレーム呼ばれるゲームループ
  // delta: 前フレームからの経過ミリ秒（フレームレートに依存しない動きに使う）
  update(_time: number, delta: number): void {
    if (this.isGameOver) {
      // Rキーでリスタート
      if (this.input.keyboard!.addKey('R').isDown) {
        this.scene.restart()
      }
      return
    }

    this.player.move(this.cursors)
    this.handleShooting()
    this.handleEnemySpawn(delta)

    // 当たり判定: 自機弾 ↔ 敵
    for (const bullet of this.bullets) {
      for (const enemy of this.enemies) {
        if (bullet.active && enemy.active &&
            Phaser.Geom.Intersects.RectangleToRectangle(
              bullet.getBounds(), enemy.getBounds()
            )) {
          this.onPlayerBulletHitEnemy(bullet, enemy)
        }
      }
    }

    // 当たり判定: 敵弾・敵 ↔ 自機
    for (const eb of this.enemyBullets) {
      if (eb.active && Phaser.Geom.Intersects.RectangleToRectangle(
        eb.getBounds(), this.player.getBounds()
      )) {
        this.onEnemyHitPlayer(eb)
      }
    }
    for (const enemy of this.enemies) {
      if (enemy.active && Phaser.Geom.Intersects.RectangleToRectangle(
        enemy.getBounds(), this.player.getBounds()
      )) {
        this.onEnemyHitPlayer(enemy)
      }
    }

    for (const bullet of this.bullets) {
      bullet.updatePosition()
    }
    this.bullets = this.bullets.filter(b => b.active)

    for (const enemy of this.enemies) {
      enemy.updatePosition()
      // 一定間隔で敵弾を発射
      enemy.fireTimer += delta
      if (enemy.fireTimer >= this.ENEMY_FIRE_INTERVAL) {
        enemy.fireTimer = 0
        const eb = new EnemyBullet(this, enemy.x, enemy.y + 20)
        eb.fire(enemy.x, enemy.y + 20)
        this.enemyBullets.push(eb)
      }
    }
    this.enemies = this.enemies.filter(e => e.active)

    for (const eb of this.enemyBullets) {
      eb.updatePosition()
    }
    this.enemyBullets = this.enemyBullets.filter(eb => eb.active)
  }

  // テストから呼べるようpublicにする
  onPlayerBulletHitEnemy(
    bullet: Phaser.Physics.Arcade.Sprite,
    enemy: Phaser.Physics.Arcade.Sprite
  ): void {
    this.spawnExplosion(enemy.x, enemy.y)
    bullet.destroy()
    enemy.destroy()
  }

  // 敵または敵弾が自機に当たったとき
  onEnemyHitPlayer(
    attacker: Phaser.Physics.Arcade.Sprite
  ): void {
    attacker.destroy()
    this.gameOver()
  }

  gameOver(): void {
    this.isGameOver = true
    // playerが初期化済みの場合のみ削除（テスト時はcreateが呼ばれないためガード）
    this.player?.destroy()

    // ゲームオーバーテキストを画面中央に表示
    this.add.text(240, 280, 'GAME OVER', {
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5)

    this.add.text(240, 340, 'Press R to Restart', {
      fontSize: '24px',
      color: '#aaaaaa',
    }).setOrigin(0.5)
  }

  private spawnExplosion(x: number, y: number): void {
    // 黄色い円を一瞬表示して消す簡易爆発エフェクト
    const g = this.add.graphics()
    g.fillStyle(0xffaa00)
    g.fillCircle(x, y, 20)
    // 300ms後に削除
    this.time.addEvent({
      delay: 300,
      callback: () => g.destroy(),
    })
  }

  private handleEnemySpawn(delta: number): void {
    this.enemySpawnTimer += delta

    if (this.enemySpawnTimer >= this.ENEMY_SPAWN_INTERVAL) {
      this.enemySpawnTimer = 0
      // x座標をランダムに選んで画面上端からスポーン
      // Phaser.Math.Between: min〜maxの整数乱数
      const x = Phaser.Math.Between(20, 460)
      const enemy = new Enemy(this, x, -20)
      enemy.startMoving()
      this.enemies.push(enemy)
    }
  }

  private handleShooting(): void {
    const spaceDown = this.input.keyboard!.addKey('SPACE').isDown

    // 前フレームで押されておらず、今フレームで押された瞬間だけ発射
    if (spaceDown && !this.spaceWasDown) {
      const bullet = new Bullet(this, this.player.x, this.player.y - 20)
      bullet.fire(this.player.x, this.player.y - 20)
      this.bullets.push(bullet)
    }

    this.spaceWasDown = spaceDown
  }

  private createPlaceholderTextures(): void {
    const g = this.make.graphics({ x: 0, y: 0 })

    // 自機: 緑の三角形（32x32）
    g.fillStyle(0x00ff00)
    g.fillTriangle(16, 0, 32, 32, 0, 32)
    g.generateTexture(TextureKeys.PLAYER, 32, 32)
    g.clear()

    // 自機の弾: 黄色の細長い四角（4x12）
    g.fillStyle(0xffff00)
    g.fillRect(0, 0, 4, 12)
    g.generateTexture(TextureKeys.PLAYER_BULLET, 4, 12)
    g.clear()

    // 敵: 赤の四角形（32x32）
    g.fillStyle(0xff0000)
    g.fillRect(0, 0, 32, 32)
    g.generateTexture(TextureKeys.ENEMY, 32, 32)
    g.clear()

    // 敵の弾: オレンジの細長い四角（4x12）
    g.fillStyle(0xff6600)
    g.fillRect(0, 0, 4, 12)
    g.generateTexture(TextureKeys.ENEMY_BULLET, 4, 12)

    g.destroy()
  }
}
