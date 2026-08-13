import { useState } from "react";
import { personalization } from "../data/personalization";
import { V2_UI_TEXT } from "../data/uiText";
import { useLang } from "../i18n";
import type { Difficulty } from "../game/types";

export function StartScreen({
  hasSave,
  onStart,
  onContinue,
  onClearSave,
}: {
  hasSave: boolean;
  onStart: (difficulty: Difficulty, name: string, seed: string) => void;
  onContinue: () => void;
  onClearSave: () => void;
}) {
  const { ui, lang, setLang, t } = useLang();
  const [name, setName] = useState(personalization.playerDefaultName);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [seed, setSeed] = useState(() => String(Date.now() >>> 0));

  const diffName = (d: Difficulty) =>
    d === "easy" ? ui.easy : d === "normal" ? ui.normal : ui.hard;
  const diffDesc = (d: Difficulty) =>
    d === "easy" ? ui.easyDesc : d === "normal" ? ui.normalDesc : ui.hardDesc;

  return (
    <div className="start-screen fade-in">
      <div className="start-card">
        <div className="start-top">
          <button
            className="btn ghost"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
          >
            {ui.langButton}
          </button>
        </div>

        <h1 className="start-title">{ui.appTitle}</h1>
        <p className="start-tagline">{ui.tagline}</p>
        <p className="start-desc">{ui.startDescription}</p>

        <label className="field">
          <span className="field-label">{ui.nameLabel}</span>
          <input
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={ui.namePlaceholder}
            maxLength={20}
          />
        </label>

        <label className="field">
          <span className="field-label">{t(V2_UI_TEXT.seedLabel)}</span>
          <input
            className="text-input"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
            placeholder={t(V2_UI_TEXT.seedPlaceholder)}
            maxLength={40}
            inputMode="text"
          />
          <span className="field-hint">{t(V2_UI_TEXT.seedHint)}</span>
        </label>

        <div className="field">
          <span className="field-label">{ui.difficulty}</span>
          <div className="difficulty-row">
            {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                className={"diff-btn" + (difficulty === d ? " active" : "")}
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
              >
                <span className="diff-name">{diffName(d)}</span>
                <span className="diff-desc">{diffDesc(d)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="start-actions">
          <button className="btn primary big" onClick={() => onStart(difficulty, name, seed)}>
            {ui.newGame}
          </button>
          {hasSave && (
            <button className="btn ghost big" onClick={onContinue}>
              {ui.continueGame}
            </button>
          )}
        </div>

        {hasSave && (
          <button className="btn link danger-text" onClick={onClearSave}>
            {ui.clearSave}
          </button>
        )}

        <p className="disclaimer">
          {lang === "zh"
            ? "这是一款受牙学院生活启发的虚构小游戏，并非任何学校的官方产品或课程模拟。"
            : "A fictionalized game inspired by dental school life. Not an official school product or curriculum simulator."}
        </p>
      </div>
    </div>
  );
}
