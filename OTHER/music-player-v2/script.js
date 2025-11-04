// 音乐播放器功能
const songs = [
  {
    title: 'Lay It Down',
    artist: 'steelix',
    src: 'src/layitdown.mp3',
    cover: 'src/0.jpg',
    duration: '3:13'
  },
  {
    title: '不说',
    artist: '周公',
    src: 'src/不说.mp3',
    cover: 'src/1.jpg',
    duration: '3:33'
  },
  {
    title: 'Aces',
    artist: 'dkj /sped up nightcore',
    src: 'src/Aces.mp3',
    cover: 'src/2.jpg',
    duration: '1:41'
  },
  {
    title: 'Tek It',
    artist: 'Cafuné',
    src: 'src/Tek It.mp3',
    cover: 'src/3.jpg',
    duration: '3:11'
  },
  {
    title: 'We Don\'t Talk Anymore',
    artist: 'Charlie Puth /Selena Gomez',
    src: 'src/We%20Don%20t%20Talk%20Anymore.mp3',
    cover: 'src/4.jpg',
    duration: '4:14'
  }
];

let currentSongIndex = 0;
let isPlaying = false;

const audio = new Audio();
const playerSongTitle = document.getElementById('player-song-title');
const playerSongArtist = document.getElementById('player-song-artist');
const playerAlbumArt = document.getElementById('player-album-art');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const playlistSongs = document.getElementById('playlist-songs');

// 进度条相关元素
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const progressFill = document.getElementById('progress-fill');
const progressSlider = document.getElementById('progress-slider');
const progressBar = document.querySelector('.progress-bar');

// 初始化播放器
function initializePlayer() {
  loadSong(currentSongIndex);
  
  // 添加播放列表点击事件
  playlistSongs.querySelectorAll('.playlist-song').forEach((songElement, index) => {
    songElement.addEventListener('click', () => {
      loadSong(index);
      playSong();
    });
  });
  
  // 添加控制按钮事件
  playButton.addEventListener('click', playSong);
  pauseButton.addEventListener('click', pauseSong);
  previousButton.addEventListener('click', previousSong);
  nextButton.addEventListener('click', nextSong);
  
  // 音频结束事件
  audio.addEventListener('ended', nextSong);
  
  // 进度条相关事件
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateDuration);
  
  // 进度条点击事件
  progressBar.addEventListener('click', seekToPosition);
  progressSlider.addEventListener('input', seekToPosition);
  
  // 更新按钮状态
  updateButtonStates();
}

// 加载歌曲
function loadSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  
  audio.src = song.src;
  playerSongTitle.textContent = song.title;
  playerSongArtist.textContent = song.artist;
  
  // 更新专辑封面
  const albumArt = playerAlbumArt.querySelector('.album-art');
  albumArt.src = song.cover;
  albumArt.alt = `${song.title} - ${song.artist}`;
  
  // 高亮当前播放的歌曲
  playlistSongs.querySelectorAll('.playlist-song').forEach((songElement, i) => {
    songElement.classList.toggle('active', i === index);
  });
}

// 播放歌曲
function playSong() {
  audio.play();
  isPlaying = true;
  updateButtonStates();
}

// 暂停歌曲
function pauseSong() {
  audio.pause();
  isPlaying = false;
  updateButtonStates();
}

// 上一首
function previousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    playSong();
  }
}

// 下一首
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    playSong();
  }
}

// 更新按钮状态
function updateButtonStates() {
  playButton.style.display = isPlaying ? 'none' : 'block';
  pauseButton.style.display = isPlaying ? 'block' : 'none';
}

// 更新进度条
function updateProgress() {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressSlider.value = progressPercent;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  }
}

// 更新总时长
function updateDuration() {
  if (audio.duration) {
    durationDisplay.textContent = formatTime(audio.duration);
  }
}

// 跳转到指定位置
function seekToPosition(e) {
  if (!audio.duration) return;
  
  let clickPosition;
  if (e.type === 'click') {
    // 点击进度条
    const rect = progressBar.getBoundingClientRect();
    clickPosition = (e.clientX - rect.left) / rect.width;
  } else {
    // 拖动滑块
    clickPosition = e.target.value / 100;
  }
  
  const seekTime = audio.duration * clickPosition;
  audio.currentTime = seekTime;
}

// 格式化时间显示
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 图片查看器功能
const albumArt = document.querySelector('.album-art');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeBtn = document.getElementById('close-btn');

// 添加专辑封面点击事件
if (albumArt) {
  albumArt.addEventListener('click', () => {
    // 显示当前歌曲的大图
    lightboxImage.src = albumArt.src;
    lightbox.style.display = 'flex';
  });
}

// 关闭按钮事件
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// 点击模态框背景关闭
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  initializePlayer();
});