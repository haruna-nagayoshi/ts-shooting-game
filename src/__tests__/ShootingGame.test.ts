import { ShootingGame } from "../ShootingGame";

describe("ShootingGame", () => {
  const W = 480;
  const H = 640;

  it("初期状態ではゲームが停止している", () => {
    const game = new ShootingGame(W, H);
    expect(game.isRunning()).toBe(false);
  });

  it("start() でゲームが開始される", () => {
    const game = new ShootingGame(W, H);
    game.start();
    expect(game.isRunning()).toBe(true);
  });

  it("start() でスコアと撃墜数がリセットされる", () => {
    const game = new ShootingGame(W, H);
    game.start();
    expect(game.getScore()).toBe(0);
    expect(game.getKills()).toBe(0);
  });

  it("stop() でゲームが停止する", () => {
    const game = new ShootingGame(W, H);
    game.start();
    game.stop();
    expect(game.isRunning()).toBe(false);
  });

  it("moveLeft() で自機が左方向に移動する", () => {
    const game = new ShootingGame(W, H);
    game.start();
    const before = game.getSnapshot().player.x;
    game.moveLeft();
    const after = game.getSnapshot().player.x;
    expect(after).toBeLessThan(before);
  });

  it("moveRight() で自機が右方向に移動する", () => {
    const game = new ShootingGame(W, H);
    game.start();
    const before = game.getSnapshot().player.x;
    game.moveRight();
    const after = game.getSnapshot().player.x;
    expect(after).toBeGreaterThan(before);
  });

  it("自機は画面左端より外に出ない", () => {
    const game = new ShootingGame(W, H);
    game.start();
    for (let i = 0; i < 200; i++) game.moveLeft();
    const { player } = game.getSnapshot();
    expect(player.x).toBeGreaterThanOrEqual(player.width / 2);
  });

  it("自機は画面右端より外に出ない", () => {
    const game = new ShootingGame(W, H);
    game.start();
    for (let i = 0; i < 200; i++) game.moveRight();
    const { player } = game.getSnapshot();
    expect(player.x).toBeLessThanOrEqual(W - player.width / 2);
  });

  it("shoot() で弾が追加される", () => {
    const game = new ShootingGame(W, H);
    game.start();
    game.shoot();
    expect(game.getSnapshot().player.bullets.length).toBe(1);
  });

  it("update() で弾が移動する", () => {
    const game = new ShootingGame(W, H);
    game.start();
    game.shoot();
    const bulletBefore = game.getSnapshot().player.bullets[0];
    const yBefore = bulletBefore.y;
    game.update();
    const bulletAfter = game.getSnapshot().player.bullets[0];
    expect(bulletAfter.y).toBeLessThan(yBefore);
  });

  it("ゲームが停止中は移動・射撃が無効", () => {
    const game = new ShootingGame(W, H);
    const xBefore = game.getSnapshot().player.x;
    game.moveLeft();
    game.moveRight();
    game.shoot();
    expect(game.getSnapshot().player.x).toBe(xBefore);
    expect(game.getSnapshot().player.bullets.length).toBe(0);
  });

  it("getGameScore() で現在のスコア情報が取得できる", () => {
    const game = new ShootingGame(W, H);
    game.start();
    const score = game.getGameScore();
    expect(score.score).toBe(0);
    expect(score.kills).toBe(0);
  });
});
