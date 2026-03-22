# CLAUDE.md - Claude Code 指示書

このファイルはClaude Code（AI）への指示書です。

## プロジェクト概要

TypeScript + Phaser 3 で作るブラウザシューティングゲーム。
itch.io での公開を目標とし、GitHub Actions による自動デプロイを構築する。  
また、PHPエンジニアがAIを開発パートナーとしてモダンなTS開発を習得するプロセスを記録し、得られた知見について記事を執筆することが最終目的。

## 技術スタック

| 用途 | ライブラリ |
|---|---|
| 言語 | TypeScript |
| ゲームエンジン | Phaser 3 |
| ビルドツール | Vite |
| テスト | Vitest + jsdom |
| CI/CD | GitHub Actions（予定） |

## ディレクトリ構成

```
src/
  main.ts              # Phaserゲーム設定・起動
  constants/
    TextureKeys.ts     # テクスチャキー定数（画像差し替えはここを変えるだけ）
  scenes/
    GameScene.ts       # メインゲームシーン
  objects/
    Player.ts          # 自機クラス
    Bullet.ts          # 弾クラス
    Enemy.ts           # 敵クラス
```

## 開発ルール

### TDD（テスト駆動開発）

**必ずテストを先に書いてから実装すること。**

```
1. テストを書く（Red: 失敗する状態）
2. 実装する（Green: テストが通る最小限のコード）
3. リファクタ（Refactor: コードを整理）
4. npm run test でパスを確認
5. commit
```

テストファイルは `src/__tests__/` に配置する。

### commit・PRのルール

- **commit・PRは必ずユーザーの許可を得てから実行する**
- commitの前に必ず `npm run test` を実行してテストがパスすることを確認する
- commitメッセージは日本語でよい
- 1機能 = 1commit を基本とする

### commitメッセージのプレフィックス

```
feat:   新機能
fix:    バグ修正
test:   テスト追加・修正
refactor: リファクタ
chore:  設定・ツール変更
```

### ブランチ戦略

```
main               # 本番（直接コミット禁止）
feature/xxx        # 機能開発ブランチ
```

### 実装の進め方

1機能ずつ以下のサイクルで進める：

```
テスト作成 → 実装 → 動作確認（npm run dev）→ テストパス確認 → ユーザー確認 → commit → push → PR
```

## 画像差し替えについて

`src/constants/TextureKeys.ts` でキーを一元管理している。
現在はGraphics APIでプレースホルダーを動的生成。
画像に差し替える場合は `GameScene.preload()` で以下のように変更するだけ：

```typescript
// Before（プレースホルダー）
this.createPlaceholderTextures()

// After（実画像）
this.load.image(TextureKeys.PLAYER, 'assets/player.png')
this.load.image(TextureKeys.ENEMY, 'assets/enemy.png')
```

## コーディング規約

- TypeScriptの `strict` モードを維持する（tsconfig.jsonで設定済み）
- `any` 型の使用禁止
- クラスのフィールドには必ずアクセス修飾子（`private` / `readonly`）を付ける
- Phaser のゲームオブジェクトは `Phaser.Physics.Arcade.Sprite` を継承して作る

## npm scripts

```bash
npm run dev      # 開発サーバー起動（localhost:5173）
npm run build    # 本番ビルド（dist/）
npm run test     # テスト実行
npm run preview  # ビルド結果のプレビュー
```

## ユーザー情報

- PHPエンジニアでTypeScript・Phaser 3は学習中
- 説明はTypeScriptの学習を兼ねて丁寧に行う
