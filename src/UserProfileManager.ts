import type { UserProfile, GameScore } from "./types";

const STORAGE_KEY = "ts-shooting-game-profile";

/**
 * ユーザープロフィールの管理クラス
 */
export class UserProfileManager {
  private profile: UserProfile;

  constructor(name: string) {
    const saved = this.load();
    if (saved && saved.name === name) {
      this.profile = { ...saved, createdAt: new Date(saved.createdAt) };
    } else {
      this.profile = {
        name,
        highScore: 0,
        playCount: 0,
        totalKills: 0,
        createdAt: new Date(),
      };
    }
  }

  /**
   * プロフィールを取得する
   */
  getProfile(): Readonly<UserProfile> {
    return this.profile;
  }

  /**
   * ゲーム終了後にスコアを更新する
   */
  updateScore(score: GameScore): void {
    this.profile.playCount += 1;
    this.profile.totalKills += score.kills;
    if (score.score > this.profile.highScore) {
      this.profile.highScore = score.score;
    }
    this.save();
  }

  /**
   * プロフィールをリセットする
   */
  reset(name?: string): void {
    this.profile = {
      name: name ?? this.profile.name,
      highScore: 0,
      playCount: 0,
      totalKills: 0,
      createdAt: new Date(),
    };
    this.save();
  }

  /**
   * ローカルストレージから読み込む
   */
  private load(): (Omit<UserProfile, "createdAt"> & { createdAt: string }) | null {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!this.isValidSavedProfile(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * 保存データの型ガード
   */
  private isValidSavedProfile(
    value: unknown
  ): value is Omit<UserProfile, "createdAt"> & { createdAt: string } {
    if (typeof value !== "object" || value === null) return false;
    const obj = value as Record<string, unknown>;
    return (
      typeof obj["name"] === "string" &&
      typeof obj["highScore"] === "number" &&
      typeof obj["playCount"] === "number" &&
      typeof obj["totalKills"] === "number" &&
      typeof obj["createdAt"] === "string"
    );
  }

  /**
   * ローカルストレージに保存する
   */
  private save(): void {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
  }
}
