import './style.css'
import Phaser from 'phaser'
import { GameScene } from './scenes/GameScene'

// Phaserゲームの設定
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,   // WebGL が使えればWebGL、なければCanvasにフォールバック
  width: 480,
  height: 640,
  backgroundColor: '#000000',
  scene: [GameScene],
  physics: {
    default: 'arcade',  // Arcade Physics: シンプルなAABB衝突判定
    arcade: {
      gravity: { x: 0, y: 0 },  // 重力なし（宇宙空間）
      debug: false,
    },
  },
  parent: 'app',  // index.html の <div id="app"> にマウント
  scale: {
    mode: Phaser.Scale.FIT,          // 画面サイズに合わせてフィット
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

new Phaser.Game(config)
