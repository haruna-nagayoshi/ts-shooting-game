import type { UserProfile } from "./types";

/**
 * ユーザープロフィールページをレンダリングするクラス
 */
export class ProfileRenderer {
  constructor(private readonly container: HTMLElement) {}

  /**
   * プロフィール情報を画面に描画する
   */
  render(profile: Readonly<UserProfile>): void {
    this.container.innerHTML = "";

    const section = document.createElement("section");
    section.className = "profile-page";
    section.setAttribute("aria-label", "ユーザープロフィール");

    section.appendChild(this.createHeader(profile.name));
    section.appendChild(this.createStats(profile));

    const resetBtn = this.createResetButton();
    section.appendChild(resetBtn);

    this.container.appendChild(section);
  }

  /**
   * プロフィールヘッダーを生成する
   */
  private createHeader(name: string): HTMLElement {
    const header = document.createElement("header");
    header.className = "profile-header";

    const avatar = document.createElement("div");
    avatar.className = "profile-avatar";
    avatar.textContent = name.charAt(0).toUpperCase();
    avatar.setAttribute("aria-hidden", "true");

    const title = document.createElement("h1");
    title.className = "profile-name";
    title.textContent = name;

    header.appendChild(avatar);
    header.appendChild(title);
    return header;
  }

  /**
   * 統計情報セクションを生成する
   */
  private createStats(profile: Readonly<UserProfile>): HTMLElement {
    const stats = document.createElement("dl");
    stats.className = "profile-stats";

    const items: Array<{ label: string; value: string }> = [
      { label: "最高スコア", value: profile.highScore.toLocaleString("ja-JP") },
      { label: "プレイ回数", value: `${profile.playCount.toLocaleString("ja-JP")} 回` },
      { label: "総撃墜数", value: `${profile.totalKills.toLocaleString("ja-JP")} 機` },
      {
        label: "登録日",
        value: new Date(profile.createdAt).toLocaleDateString("ja-JP"),
      },
    ];

    for (const item of items) {
      const dt = document.createElement("dt");
      dt.textContent = item.label;
      const dd = document.createElement("dd");
      dd.textContent = item.value;
      stats.appendChild(dt);
      stats.appendChild(dd);
    }

    return stats;
  }

  /**
   * リセットボタンを生成する
   */
  private createResetButton(): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "profile-reset-btn";
    btn.textContent = "スコアをリセット";
    return btn;
  }

  /**
   * リセットボタンのクリックイベントを登録する
   */
  onReset(callback: () => void): void {
    const btn = this.container.querySelector<HTMLButtonElement>(".profile-reset-btn");
    if (btn) {
      btn.addEventListener("click", callback);
    }
  }
}
