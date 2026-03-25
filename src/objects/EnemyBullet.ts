import Phaser from 'phaser'
import { TextureKeys } from '../constants/TextureKeys'

export const ENEMY_BULLET_SPEED = 300

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TextureKeys.ENEMY_BULLET)
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  fire(x: number, y: number): void {
    this.setPosition(x, y)
    ;(this.body as Phaser.Physics.Arcade.Body).setVelocityY(ENEMY_BULLET_SPEED)
  }

  updatePosition(): void {
    if (this.y > 650) {
      this.destroy()
    }
  }
}
