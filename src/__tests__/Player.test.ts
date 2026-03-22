import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Player, PLAYER_SPEED } from '../objects/Player'

// PhaserはブラウザのWebGLに依存するため、テスト用にモックする
vi.mock('phaser', () => {
  // Phaser.Physics.Arcade.Sprite を模倣した最小限のクラス
  const MockSprite = class {
    x: number
    y: number
    body = {
      setVelocityX: vi.fn(),
      setVelocityY: vi.fn(),
    }
    setCollideWorldBounds = vi.fn()

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

describe('Player', () => {
  let player: Player

  beforeEach(() => {
    // PlayerのコンストラクタでPhaserのScene APIを使うため最小限のモックを用意する
    const mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
    } as unknown as Phaser.Scene
    player = new Player(mockScene, 240, 560)
  })

  it('指定した座標に配置される', () => {
    expect(player.x).toBe(240)
    expect(player.y).toBe(560)
  })

  it('画面端で止まるようにsetCollideWorldBoundsが呼ばれる', () => {
    expect(player.setCollideWorldBounds).toHaveBeenCalledWith(true)
  })

  it('PLAYER_SPEEDが正の値である', () => {
    expect(PLAYER_SPEED).toBeGreaterThan(0)
  })
})
