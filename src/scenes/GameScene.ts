import Phaser from 'phaser'
import { TextureKeys } from '../constants/TextureKeys'
import { Player } from '../objects/Player'

export class GameScene extends Phaser.Scene {
  // privateフィールド: このクラス内からしかアクセスできない
  // !（非nullアサーション）: createで必ず初期化されるためnullチェックを省略
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

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
  update(): void {
    this.player.move(this.cursors)
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
