import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EnemyBullet, ENEMY_BULLET_SPEED } from '../objects/EnemyBullet'

vi.mock('phaser', () => {
  const MockSprite = class {
    x: number
    y: number
    active = true
    body = {
      setVelocityY: vi.fn(),
    }
    setPosition = vi.fn((x: number, y: number) => { this.x = x; this.y = y })
    destroy = vi.fn()

    constructor(_scene: unknown, x: number, y: number, _texture: string) {
      this.x = x
      this.y = y
    }
  }

  return {
    default: {
      Physics: {
        Arcade: {
          Sprite: MockSprite,
        },
      },
    },
  }
})

describe('EnemyBullet', () => {
  let bullet: EnemyBullet
  let mockScene: Phaser.Scene

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
    } as unknown as Phaser.Scene
    bullet = new EnemyBullet(mockScene, 240, 100)
  })

  it('指定した座標に配置される', () => {
    expect(bullet.x).toBe(240)
    expect(bullet.y).toBe(100)
  })

  it('ENEMY_BULLET_SPEEDが正の値である', () => {
    expect(ENEMY_BULLET_SPEED).toBeGreaterThan(0)
  })

  it('fireを呼ぶと下方向に速度がセットされる', () => {
    bullet.fire(240, 100)
    const body = bullet.body as unknown as { setVelocityY: ReturnType<typeof vi.fn> }
    expect(body.setVelocityY).toHaveBeenCalledWith(ENEMY_BULLET_SPEED)
  })

  it('画面下端を超えたらdestroyされる', () => {
    bullet.y = 660
    bullet.updatePosition()
    expect(bullet.destroy).toHaveBeenCalled()
  })
})
