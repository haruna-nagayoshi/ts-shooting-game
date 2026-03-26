import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GameScene } from '../scenes/GameScene'

vi.mock('phaser', () => {
  const MockSprite = class {
    x = 0
    y = 0
    active = true
    destroy = vi.fn(() => { this.active = false })
  }

  const MockScene = class {
    add = {
      existing: vi.fn(),
      graphics: vi.fn(() => ({
        fillStyle: vi.fn().mockReturnThis(),
        fillCircle: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      })),
      text: vi.fn(() => ({
        setOrigin: vi.fn().mockReturnThis(),
      })),
    }
    physics = {
      add: {
        existing: vi.fn(),
        // overlapのコールバックを即時実行してテストできるようにする
        overlap: vi.fn((
          _a: unknown,
          _b: unknown,
          callback: (a: unknown, b: unknown) => void
        ) => {
          callback(_a, _b)
        }),
      },
    }
    input = { keyboard: { addKey: vi.fn(() => ({ isDown: false })), createCursorKeys: vi.fn() } }
    cameras = { main: { setBackgroundColor: vi.fn() } }
    make = { graphics: vi.fn(() => ({ fillStyle: vi.fn().mockReturnThis(), fillTriangle: vi.fn().mockReturnThis(), fillRect: vi.fn().mockReturnThis(), generateTexture: vi.fn().mockReturnThis(), clear: vi.fn().mockReturnThis(), destroy: vi.fn() })) }
    time = { addEvent: vi.fn() }
    sys = { displayList: null, updateList: null }

    constructor() {
      // Phaserのシーン継承をスキップ
    }
  }

  return {
    default: {
      Scene: MockScene,
      Physics: { Arcade: { Sprite: MockSprite } },
      Math: { Between: vi.fn(() => 240) },
      Scale: { FIT: 0, CENTER_BOTH: 0 },
      AUTO: 0,
    },
  }
})

describe('GameScene - 当たり判定', () => {
  let scene: GameScene

  beforeEach(() => {
    scene = new GameScene()
  })

  it('onPlayerBulletHitEnemyを呼ぶと弾と敵が両方destroyされる', () => {
    const bullet = { active: true, destroy: vi.fn() }
    const enemy = { active: true, destroy: vi.fn() }

    scene.onPlayerBulletHitEnemy(
      bullet as unknown as Phaser.Physics.Arcade.Sprite,
      enemy as unknown as Phaser.Physics.Arcade.Sprite
    )

    expect(bullet.destroy).toHaveBeenCalled()
    expect(enemy.destroy).toHaveBeenCalled()
  })

  it('onEnemyHitPlayerを呼ぶとgameOverが呼ばれる', () => {
    const gameOverSpy = vi.spyOn(scene, 'gameOver')
    const enemy = { active: true, destroy: vi.fn() }

    scene.onEnemyHitPlayer(
      enemy as unknown as Phaser.Physics.Arcade.Sprite
    )

    expect(gameOverSpy).toHaveBeenCalled()
  })
})
