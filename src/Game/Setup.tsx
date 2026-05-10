import React, { useState } from 'react';
import {
  GameConfig,
  LayoutMode,
  TranslationDisplay,
  TranslationPosition,
  RevealType,
} from '../types/game';
import { loadConfig, saveConfig } from '../utils/gameUtils';
import { fatihah } from '../data/surah/1';

interface SetupProps {
  onStart: (
    config: GameConfig,
    surahNumber: number,
    range: [number, number],
  ) => void;
}

export default function Setup({ onStart }: SetupProps) {
  const [config, setConfig] = useState<GameConfig>(loadConfig());
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(7);

  // In a real app, we'd fetch all surahs. For now, we only have Al-Fatihah.
  const surahs = [fatihah];

  const handleStart = () => {
    saveConfig(config);
    onStart(config, selectedSurah, [startAyah, endAyah]);
  };

  const updateConfig = (key: keyof GameConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className="setup-container" dir="rtl">
      <h1>إعداد الحفظ (Hifzh Setup)</h1>

      <section className="selection-section">
        <h2>الاختيار (Selection)</h2>
        <div className="form-group">
          <label>السورة (Surah):</label>
          <select
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(Number(e.target.value))}
          >
            {surahs.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" dir="ltr">
          <label>Ayah Range:</label>
          <input
            type="number"
            value={startAyah}
            onChange={(e) => setStartAyah(Number(e.target.value))}
            min={1}
            max={7}
          />
          <span> to </span>
          <input
            type="number"
            value={endAyah}
            onChange={(e) => setEndAyah(Number(e.target.value))}
            min={startAyah}
            max={7}
          />
        </div>
      </section>

      <section className="settings-section" dir="ltr">
        <h2>Settings</h2>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={config.realTimeFeedback}
              onChange={(e) =>
                updateConfig('realTimeFeedback', e.target.checked)
              }
            />
            Real-time Feedback
          </label>
        </div>

        <div className="setting-item">
          <label>Lead-in Words: </label>
          <input
            type="number"
            value={config.leadInWordCount}
            onChange={(e) =>
              updateConfig('leadInWordCount', Number(e.target.value))
            }
            min={0}
            max={5}
          />
        </div>

        <div className="setting-item">
          <label>Layout Mode: </label>
          <select
            value={config.layoutMode}
            onChange={(e) =>
              updateConfig('layoutMode', e.target.value as LayoutMode)
            }
          >
            <option value="continuous">Continuous</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Translation Display: </label>
          <select
            value={config.translationDisplay}
            onChange={(e) =>
              updateConfig(
                'translationDisplay',
                e.target.value as TranslationDisplay,
              )
            }
          >
            <option value="none">None</option>
            <option value="word">Word Level</option>
            <option value="ayah">Ayah Level</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Translation Position: </label>
          <select
            value={config.translationPosition}
            onChange={(e) =>
              updateConfig(
                'translationPosition',
                e.target.value as TranslationPosition,
              )
            }
          >
            <option value="tooltip">Tooltip</option>
            <option value="below">Below Word</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Spoiler Reveal Type: </label>
          <select
            value={config.spoilerRevealType}
            onChange={(e) =>
              updateConfig('spoilerRevealType', e.target.value as RevealType)
            }
          >
            <option value="base">Base Letters</option>
            <option value="vocalized">Full Vocalized</option>
          </select>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={config.autoRevealSpoiler}
              onChange={(e) =>
                updateConfig('autoRevealSpoiler', e.target.checked)
              }
            />
            Auto-reveal Spoiler
          </label>
        </div>
      </section>

      <button className="start-button" onClick={handleStart}>
        Start
      </button>

      <style>{`
        .setup-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
          text-align: right;
        }
        .settings-section {
          text-align: left;
          margin-top: 20px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
        .setting-item {
          margin: 10px 0;
        }
        .form-group {
          margin: 10px 0;
        }
        .start-button {
          margin-top: 20px;
          padding: 10px 40px;
          font-size: 1.2em;
          cursor: pointer;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
