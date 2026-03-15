/**
 * ユーザープロフィールの型定義
 */
export interface UserProfile {
  /** ユーザー名 */
  name: string;
  /** 最高スコア */
  highScore: number;
  /** プレイ回数 */
  playCount: number;
  /** 総撃墜数 */
  totalKills: number;
  /**
   * 作成日時
   * @remarks localStorage への保存時は ISO 文字列としてシリアライズされるため、
   * 読み込み時は `new Date(createdAt)` で Date オブジェクトに変換する必要があります。
   */
  createdAt: Date;
}

/**
 * ゲームスコアの型定義
 */
export interface GameScore {
  /** スコア */
  score: number;
  /** 撃墜数 */
  kills: number;
  /** プレイ時間（秒） */
  duration: number;
}

/**
 * 弾の型定義
 */
export interface Bullet {
  x: number;
  y: number;
  speed: number;
  active: boolean;
}

/**
 * 敵機の型定義
 */
export interface Enemy {
  x: number;
  y: number;
  speed: number;
  hp: number;
  active: boolean;
}

/**
 * 自機の型定義
 */
export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  bullets: Bullet[];
}
