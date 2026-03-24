import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Enemy, ENEMY_SPEED } from '../objects/Enemy'

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

describe('Enemy', () => {
  let enemy: Enemy
  let mockScene: Phaser.Scene

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
    } as unknown as Phaser.Scene
    enemy = new Enemy(mockScene, 240, 0)
  })

  it('指定した座標に配置される', () => {
    expect(enemy.x).toBe(240)
    expect(enemy.y).toBe(0)
  })

  it('ENEMY_SPEEDが正の値である', () => {
    expect(ENEMY_SPEED).toBeGreaterThan(0)
  })

  it('startMovingを呼ぶと下方向に速度がセットされる', () => {
    enemy.startMoving()
    const body = enemy.body as unknown as { setVelocityY: ReturnType<typeof vi.fn> }
    expect(body.setVelocityY).toHaveBeenCalledWith(ENEMY_SPEED)
  })

  it('画面下端を超えたらdestroyされる', () => {
    // y座標を画面下端より下に設定
    enemy.y = 660
    enemy.updatePosition()
    expect(enemy.destroy).toHaveBeenCalled()
  })
})
