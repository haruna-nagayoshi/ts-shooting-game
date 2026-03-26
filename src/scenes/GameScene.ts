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
    this.cameras.main.setBackgroundColor('#000000')

    // 自機を画面下中央に配置
    this.player = new Player(this, 240, 560)

    // カーソルキー（矢印キー）を取得
    this.cursors = this.input.keyboard!.createCursorKeys()
  }

  // update: 毎フレーム呼ばれるゲームループ
  // delta: 前フレームからの経過ミリ秒（フレームレートに依存しない動きに使う）
  update(_time: number, delta: number): void {
    this.player.move(this.cursors)
    this.handleShooting()
    this.handleEnemySpawn(delta)

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
