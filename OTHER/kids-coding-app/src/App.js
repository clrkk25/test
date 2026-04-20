import React, { useState, useRef } from 'react';
import './App.css';

const wordCards = [
  { id: 1, word: '猫', image: '🐱', sound: 'mao.mp3', color: '#FF9AA2' },
  { id: 2, word: '狗', image: '🐶', sound: 'gou.mp3', color: '#FFB7B2' },
  { id: 3, word: '鸟', image: '🐦', sound: 'niao.mp3', color: '#FFDAC1' },
  { id: 4, word: '鱼', image: '🐠', sound: 'yu.mp3', color: '#E2F0CB' },
  { id: 5, word: '花', image: '🌸', sound: 'hua.mp3', color: '#B5EAD7' },
  { id: 6, word: '树', image: '🌳', sound: 'shu.mp3', color: '#C7CEEA' },
];

function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentCard = wordCards[currentCardIndex];
  const audioRef = useRef(null); // 用于引用当前音频实例

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % wordCards.length);
    setShowWord(false);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev - 1 + wordCards.length) % wordCards.length);
    setShowWord(false);
  };

  const toggleShowWord = () => {
    setShowWord(!showWord);
  };

  const playCardSound = () => {
    const audioPath = `${process.env.PUBLIC_URL}/${currentCard.sound}`;
    const audio = new Audio(audioPath);

    // 清理上一次的音频（防止多个播放）
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    audioRef.current = audio;

    // 设置播放状态
    setIsPlaying(true);

    // 播放音频（必须在用户点击的同步上下文中）
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('音频播放开始');
        })
        .catch((error) => {
          console.error('播放被阻止或失败:', error);
          alert('无法播放声音，请点击重试');
          setIsPlaying(false);
        });
    }

    // 监听结束和错误
    const handleEnded = () => {
      setIsPlaying(false);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };

    const handleError = () => {
      console.error('音频加载失败:', audioPath);
      alert('音频文件未找到或加载失败');
      setIsPlaying(false);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
  };

  return (
    <div className="app" style={{ backgroundColor: currentCard.color }}>
      <header className="app-header">
        <h1>儿童识字乐园</h1>
      </header>

      <main className="card-container">
        <div
          className="word-card"
          onClick={toggleShowWord}
          role="button"
          aria-label={`点击显示汉字：${currentCard.word}`}
          tabIndex={0}
        >
          <div className="card-image" style={{ fontSize: '100px' }}>
            {currentCard.image}
          </div>
          {showWord && (
            <div className="card-word" style={{ fontSize: '80px', margin: '20px 0' }}>
              {currentCard.word}
            </div>
          )}
          <button
            className="sound-button"
            onClick={(e) => {
              e.stopPropagation();
              playCardSound();
            }}
            disabled={isPlaying}
            aria-label={`播放‘${currentCard.word}’的读音`}
          >
            {isPlaying ? '播放中...' : '播放读音'}
          </button>
        </div>

        <div className="navigation-buttons">
          <button className="nav-button" onClick={handlePrev} aria-label="上一个卡片">
            上一个
          </button>
          <button className="nav-button" onClick={handleNext} aria-label="下一个卡片">
            下一个
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <div className="progress-indicator">
          第 {currentCardIndex + 1} 个 / 共 {wordCards.length} 个
        </div>
      </footer>
    </div>
  );
}

export default App;