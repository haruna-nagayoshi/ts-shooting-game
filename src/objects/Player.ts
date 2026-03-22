import Phaser from 'phaser'
import { TextureKeys } from '../constants/TextureKeys'

// 自機の移動速度（ピクセル/秒）
// exportすることでテストからも参照・検証できる
export const PLAYER_SPEED = 300

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // 親クラス（Phaser.Physics.Arcade.Sprite）のコンストラクタを呼ぶ
    super(scene, x, y, TextureKeys.PLAYER)

    // シーンにこのオブジェクトを登録する（Phaserの決まり）
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // 画面端で止まるようにする
    this.setCollideWorldBounds(true)
  }

  // カーソルキーを受け取って移動を処理する
  // CursorKeys型: Phaserが提供するカーソルキーの型
  move(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    // bodyをArcade.Bodyに型キャスト（StaticBodyにはvelocity系メソッドがないため）
    const body = this.body as Phaser.Physics.Arcade.Body

    if (cursors.left.isDown) {
      body.setVelocityX(-PLAYER_SPEED)
    } else if (cursors.right.isDown) {
      body.setVelocityX(PLAYER_SPEED)
    } else {
      body.setVelocityX(0)
    }

    if (cursors.up.isDown) {
      body.setVelocityY(-PLAYER_SPEED)
    } else if (cursors.down.isDown) {
      body.setVelocityY(PLAYER_SPEED)
    } else {
      body.setVelocityY(0)
    }
  }
}
