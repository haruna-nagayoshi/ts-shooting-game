import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Bullet, BULLET_SPEED } from '../objects/Bullet'

vi.mock('phaser', () => {
  const MockSprite = class {
    x: number
    y: number
    active = true
    body = {
      setVelocityY: vi.fn(),
    }
    setActive = vi.fn()
    setVisible = vi.fn()
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

describe('Bullet', () => {
  let bullet: Bullet
  let mockScene: Phaser.Scene

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      sys: { displayList: null, updateList: null },
    } as unknown as Phaser.Scene
    bullet = new Bullet(mockScene, 240, 500)
  })

  it('指定した座標に配置される', () => {
    expect(bullet.x).toBe(240)
    expect(bullet.y).toBe(500)
  })

  it('BULLET_SPEEDが正の値である', () => {
    expect(BULLET_SPEED).toBeGreaterThan(0)
  })

  it('fireを呼ぶと上方向に速度がセットされる', () => {
    bullet.fire(240, 500)
    const body = bullet.body as unknown as { setVelocityY: ReturnType<typeof vi.fn> }
    expect(body.setVelocityY).toHaveBeenCalledWith(-BULLET_SPEED)
  })
})
