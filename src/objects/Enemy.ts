import Phaser from 'phaser'
import { TextureKeys } from '../constants/TextureKeys'

export const ENEMY_SPEED = 150

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  // 発射タイマー: 生成直後に発射されないよう初期値を設定
  fireTimer = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TextureKeys.ENEMY)
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  // 下方向への移動を開始する
  startMoving(): void {
    ;(this.body as Phaser.Physics.Arcade.Body).setVelocityY(ENEMY_SPEED)
  }

  // 毎フレーム呼ぶ: 画面下端を超えたら削除
  updatePosition(): void {
    if (this.y > 650) {
      this.destroy()
    }
  }
}
