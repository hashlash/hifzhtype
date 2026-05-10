import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameConfig, GameState, WordStatus } from '../types/game';
import { fatihah } from '../data/surah/1';
import { compareArabic, isArabicPrefix } from '../utils/gameUtils';
import Word from './Word';
import Setup from './Setup';

export default function Game() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentTyped, setCurrentTyped] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const startLevel = (config: GameConfig, surahNumber: number, range: [number, number]) => {
    // For now only fatihah
    const surah = fatihah;
    const startIdx = range[0] - 1;
    const endIdx = range[1] - 1;
    const selectedAyahs = surah.ayahs.slice(startIdx, endIdx + 1);

    const initialWordStatuses: WordStatus[][] = selectedAyahs.map((ayah, aIdx) =>
      ayah.words.map((word, wIdx) => ({
        ayahIndex: aIdx,
        wordIndex: wIdx,
        status: wIdx < config.leadInWordCount && aIdx === 0 ? 'leadin' : 'pending',
        typedText: ''
      }))
    );

    setGameState({
      config,
      surah: surahNumber,
      startAyah: range[0],
      endAyah: range[1],
      currentAyahIndex: 0,
      currentWordIndex: config.leadInWordCount < selectedAyahs[0].words.length ? config.leadInWordCount : 0, // Simplified lead-in
      wordStatuses: initialWordStatuses
    });

    // Reset trackers
    setCurrentTyped('');
    setErrorCount(0);
    setLastActivity(Date.now());
  };

  useEffect(() => {
    if (gameState && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gameState) return;

    // Check if game is already finished
    if (
      gameState.currentAyahIndex >=
      gameState.endAyah - gameState.startAyah + 1
    ) {
      return;
    }

    const value = e.target.value;

    // Requirement: "Pressing the Spacebar at the end of a word."
    if (value.endsWith(' ')) {
      handleSpace(value.trim());
      return;
    }

    const currentAyah =
      fatihah.ayahs[gameState.startAyah - 1 + gameState.currentAyahIndex];
    const targetWord = currentAyah.words[gameState.currentWordIndex].text;

    // Real-time feedback and error tracking
    if (!isArabicPrefix(value, targetWord)) {
      if (value.length > currentTyped.length) {
        setErrorCount((prev) => prev + 1);
      }
    }

    setCurrentTyped(value);
    setLastActivity(Date.now());
  };

  const completeWord = useCallback(
    (status: WordStatus['status'], finalTyped: string) => {
      if (!gameState) return;

      const newStatuses = [...gameState.wordStatuses];
      newStatuses[gameState.currentAyahIndex][gameState.currentWordIndex] = {
        ...newStatuses[gameState.currentAyahIndex][gameState.currentWordIndex],
        status: status,
        typedText: finalTyped,
      };

      let nextAyahIdx = gameState.currentAyahIndex;
      let nextWordIdx = gameState.currentWordIndex + 1;

      const currentAyah = fatihah.ayahs[gameState.startAyah - 1 + nextAyahIdx];
      if (nextWordIdx >= currentAyah.words.length) {
        nextAyahIdx++;
        nextWordIdx = 0;
      }

      setGameState({
        ...gameState,
        currentAyahIndex: nextAyahIdx,
        currentWordIndex: nextWordIdx,
        wordStatuses: newStatuses,
      });

      setCurrentTyped('');
      setErrorCount(0);
      setLastActivity(Date.now());
    },
    [gameState]
  );

  const handleSpace = (typedWord: string) => {
    if (!gameState) return;
    const currentAyah =
      fatihah.ayahs[gameState.startAyah - 1 + gameState.currentAyahIndex];
    const targetWord = currentAyah.words[gameState.currentWordIndex].text;

    if (compareArabic(typedWord, targetWord)) {
      completeWord('correct', typedWord);
    } else {
      // Incorrect word, stay red (we mark it incorrect in state for display)
      const newStatuses = [...gameState.wordStatuses];
      newStatuses[gameState.currentAyahIndex][gameState.currentWordIndex] = {
        ...newStatuses[gameState.currentAyahIndex][gameState.currentWordIndex],
        status: 'incorrect',
        typedText: typedWord,
      };
      setGameState({ ...gameState, wordStatuses: newStatuses });
      setErrorCount((prev) => prev + 1);
    }
  };

  const revealSpoiler = useCallback(() => {
    if (!gameState) return;
    const currentAyah =
      fatihah.ayahs[gameState.startAyah - 1 + gameState.currentAyahIndex];
    const targetWord = currentAyah.words[gameState.currentWordIndex].text;
    completeWord('revealed', targetWord);
  }, [gameState, completeWord]);

  // Spoiler triggers
  useEffect(() => {
    if (!gameState || gameState.currentAyahIndex >= (gameState.endAyah - gameState.startAyah + 1)) return;
    if (!gameState.config.autoRevealSpoiler) return;

    const timer = setInterval(() => {
      const now = Date.now();
      if (gameState.config.spoilerOnInactivity && now - lastActivity > 10000) {
        revealSpoiler();
      }
    }, 1000);

    if (gameState.config.spoilerOnErrors && errorCount >= 5) {
      revealSpoiler();
    }

    const currentAyah = fatihah.ayahs[gameState.startAyah - 1 + gameState.currentAyahIndex];
    const targetWord = currentAyah.words[gameState.currentWordIndex].text;
    if (gameState.config.spoilerOnExcessiveTyping && currentTyped.length > targetWord.length + 5) {
      revealSpoiler();
    }

    return () => clearInterval(timer);
  }, [gameState, lastActivity, errorCount, currentTyped, revealSpoiler]);

  if (!gameState) {
    return <Setup onStart={startLevel} />;
  }

  const selectedAyahs = fatihah.ayahs.slice(gameState.startAyah - 1, gameState.endAyah);
  const totalWords = selectedAyahs.reduce((acc, a) => acc + a.words.length, 0);
  const completedWords = gameState.wordStatuses.flat().filter(s => ['correct', 'revealed', 'leadin'].includes(s.status)).length;
  const progress = (completedWords / totalWords) * 100;

  return (
    <div className="game-container" dir="rtl" lang="ar" onClick={() => inputRef.current?.focus()}>
      <div className="game-header" dir="ltr">
        <button onClick={() => setGameState(null)}>Back to Setup</button>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className={`ayahs-display ${gameState.config.layoutMode}`}>
        {selectedAyahs.map((ayah, aIdx) => {
          const isCurrentAyah = aIdx === gameState.currentAyahIndex;
          const showAyahTranslation = (gameState.config.translationDisplay === 'ayah' || gameState.config.translationDisplay === 'both') &&
            (aIdx < gameState.currentAyahIndex || (aIdx === gameState.currentAyahIndex && gameState.currentWordIndex === ayah.words.length));

          return (
            <div key={aIdx} className={`ayah-block ${showAyahTranslation ? 'with-translation' : ''}`}>
              <div className="words-container">
                {ayah.words.map((word, wIdx) => {
                  const status = gameState.wordStatuses[aIdx][wIdx];
                  const isCurrentWord = isCurrentAyah && wIdx === gameState.currentWordIndex;

                  return (
                    <React.Fragment key={wIdx}>
                      <Word
                        text={word.text}
                        translation={word.translation}
                        status={isCurrentWord ? 'typing' : status.status}
                        typedText={isCurrentWord ? currentTyped : status.typedText}
                        config={gameState.config}
                      />
                      {' '}
                    </React.Fragment>
                  );
                })}
                <span className="ayah-marker">۝{ayah.number}</span>
              </div>
              {showAyahTranslation && <div className="ayah-translation" dir="ltr">{ayah.translation}</div>}
            </div>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        value={currentTyped}
        onChange={handleInput}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      <style>{`
        .game-container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }
        .game-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        .progress-bar-container {
          flex-grow: 1;
          height: 10px;
          background: #eee;
          border-radius: 5px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: #28a745;
          transition: width 0.3s;
        }
        .ayahs-display.continuous {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          line-height: 2.5;
          font-size: 1.5em;
        }
        .ayahs-display.blocked .ayah-block {
          display: block;
          margin-bottom: 20px;
          line-height: 2.5;
          font-size: 1.5em;
        }
        .hidden-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .ayah-translation {
          font-size: 0.6em;
          color: #666;
          margin-top: 5px;
          line-height: 1.2;
        }
        .ayah-marker {
           font-family: serif;
           margin: 0 5px;
           color: #888;
        }
      `}</style>
    </div>
  );
}
