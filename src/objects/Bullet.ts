import Phaser from 'phaser'
import { TextureKeys } from '../constants/TextureKeys'

export const BULLET_SPEED = 500

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TextureKeys.PLAYER_BULLET)
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  // 指定座標から弾を発射する
  fire(x: number, y: number): void {
    this.setPosition(x, y)
    ;(this.body as Phaser.Physics.Arcade.Body).setVelocityY(-BULLET_SPEED)
  }

  // update内で毎フレーム呼ぶ: 画面外に出たら削除
  updatePosition(): void {
    if (this.y < -10) {
      this.destroy()
    }
  }
}
