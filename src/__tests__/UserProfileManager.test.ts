import { UserProfileManager } from "../UserProfileManager";

// localStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("UserProfileManager", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("新規プロフィールが正しく初期化される", () => {
    const manager = new UserProfileManager("テストユーザー");
    const profile = manager.getProfile();
    expect(profile.name).toBe("テストユーザー");
    expect(profile.highScore).toBe(0);
    expect(profile.playCount).toBe(0);
    expect(profile.totalKills).toBe(0);
  });

  it("updateScore() でスコアが更新される", () => {
    const manager = new UserProfileManager("テストユーザー");
    manager.updateScore({ score: 100, kills: 5, duration: 60 });
    const profile = manager.getProfile();
    expect(profile.highScore).toBe(100);
    expect(profile.playCount).toBe(1);
    expect(profile.totalKills).toBe(5);
  });

  it("updateScore() で最高スコアが更新される", () => {
    const manager = new UserProfileManager("テストユーザー");
    manager.updateScore({ score: 100, kills: 5, duration: 60 });
    manager.updateScore({ score: 200, kills: 10, duration: 90 });
    expect(manager.getProfile().highScore).toBe(200);
  });

  it("updateScore() で低いスコアは最高スコアを上書きしない", () => {
    const manager = new UserProfileManager("テストユーザー");
    manager.updateScore({ score: 200, kills: 10, duration: 90 });
    manager.updateScore({ score: 50, kills: 2, duration: 30 });
    expect(manager.getProfile().highScore).toBe(200);
  });

  it("updateScore() でプレイ回数が累積される", () => {
    const manager = new UserProfileManager("テストユーザー");
    manager.updateScore({ score: 100, kills: 5, duration: 60 });
    manager.updateScore({ score: 100, kills: 5, duration: 60 });
    expect(manager.getProfile().playCount).toBe(2);
  });

  it("updateScore() で総撃墜数が累積される", () => {
    const manager = new UserProfileManager("テストユーザー");
    manager.updateScore({ score: 100, kills: 5, duration: 60 });
    manager.updateScore({ score: 100, kills: 3, duration: 30 });
    expect(manager.getProfile().totalKills).toBe(8);
  });

  it("reset() でプロフィールがリセットされる", () => {
    const manager = new UserProfileManager("テストユーザー");
    manager.updateScore({ score: 100, kills: 5, duration: 60 });
    manager.reset();
    const profile = manager.getProfile();
    expect(profile.highScore).toBe(0);
    expect(profile.playCount).toBe(0);
    expect(profile.totalKills).toBe(0);
  });

  it("reset() に名前を渡すとプロフィール名が変更される", () => {
    const manager = new UserProfileManager("テストユーザー");
    manager.reset("新しいユーザー");
    expect(manager.getProfile().name).toBe("新しいユーザー");
  });

  it("localStorage に保存されたデータが再読み込みされる", () => {
    const manager1 = new UserProfileManager("テストユーザー");
    manager1.updateScore({ score: 150, kills: 7, duration: 70 });

    // 同じキーで再インスタンス化
    const manager2 = new UserProfileManager("テストユーザー");
    expect(manager2.getProfile().highScore).toBe(150);
    expect(manager2.getProfile().playCount).toBe(1);
  });
});
