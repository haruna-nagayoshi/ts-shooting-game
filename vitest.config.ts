import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',  // ブラウザ環境をシミュレート
    globals: true,         // describe / it / expect をimportなしで使える
  },
})
