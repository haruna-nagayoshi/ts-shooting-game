import { defineConfig } from 'vite'

export default defineConfig({
  // itch.ioはサブディレクトリからゲームを配信するため相対パスが必要
  // './' にすることでビルド後のJSやCSSが相対パスで読み込まれる
  base: './',
})
