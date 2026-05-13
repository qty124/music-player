// 歌曲列表
const songs = [
  { name: '夜曲', artist: '周杰伦', src: 'mp3/music0.mp3', duration: '4:32', cover: 'img/record0.jpg' },
  { name: '稻香', artist: '周杰伦', src: 'mp3/music1.mp3', duration: '3:43', cover: 'img/record1.jpg' },
  { name: '晴天', artist: '周杰伦', src: 'mp3/music2.mp3', duration: '4:29', cover: 'img/record2.jpg' },
  { name: '七里香', artist: '周杰伦', src: 'mp3/music3.mp3', duration: '4:59', cover: 'img/record3.jpg' }
];

// 播放模式：顺序、单曲循环、随机
const playModes = [
  { name: '顺序播放', icon: 'img/mode1.png' },
  { name: '单曲循环', icon: 'img/mode2.png' },
  { name: '随机播放', icon: 'img/mode3.png' }
];

let currentSongIndex = 0;
let currentMode = 0;
let isPlaying = false;

// DOM元素
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playImg = document.getElementById('playImg');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modeBtn = document.getElementById('modeBtn');
const modeImg = document.getElementById('modeImg');
const progressBar = document.getElementById('progressBar');
const progressCurrent = document.getElementById('progressCurrent');
const progressDot = document.getElementById('progressDot');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const recordImg = document.getElementById('recordImg');
const songNameEl = document.getElementById('songName');
const artistEl = document.getElementById('artist');
const volumeSlider = document.getElementById('volumeSlider');
const volIcon = document.getElementById('volIcon');
const playlistEl = document.getElementById('playlist');
const playlistToggle = document.getElementById('playlistToggle');
const playlistSongs = document.getElementById('playlistSongs');

// 初始化播放列表
function initPlaylist() {
  playlistSongs.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="song-index">${String(index + 1).padStart(2, '0')}</span>
      <span class="song-title">${song.name}</span>
      <span class="song-duration">${song.duration}</span>
    `;
    li.addEventListener('click', () => playSong(index));
    if (index === currentSongIndex) li.classList.add('active');
    playlistSongs.appendChild(li);
  });
}

// 播放指定歌曲
function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  audio.src = song.src;
  songNameEl.textContent = song.name;
  artistEl.textContent = song.artist;
  recordImg.src = song.cover;
  updatePlaylistActive();
  audio.play();
  isPlaying = true;
  updatePlayBtn();
  recordImg.classList.add('playing');
  totalTimeEl.textContent = song.duration;
}

// 播放/暂停
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    recordImg.classList.remove('playing');
  } else {
    audio.play();
    recordImg.classList.add('playing');
  }
  isPlaying = !isPlaying;
  updatePlayBtn();
}

// 更新播放按钮图标
function updatePlayBtn() {
  playImg.src = isPlaying ? 'img/暂停.png' : 'img/继续播放.png';
}

// 上一曲
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(currentSongIndex);
}

// 下一曲
function nextSong() {
  if (playModes[currentMode].name === '随机播放') {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  playSong(currentSongIndex);
}

// 切换播放模式
function toggleMode() {
  currentMode = (currentMode + 1) % playModes.length;
  modeImg.src = playModes[currentMode].icon;
  modeBtn.title = playModes[currentMode].name;
}

// 更新时间显示
function updateTime() {
  const current = transTime(audio.currentTime);
  currentTimeEl.textContent = current;
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  progressCurrent.style.width = percent + '%';
  progressDot.style.left = percent + '%';
}

// 音频时间转换
function transTime(value) {
  var time = '';
  var h = parseInt(value / 3600);
  value %= 3600;
  var m = parseInt(value / 60);
  var s = parseInt(value % 60);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }
  return time;
}

function formatTime(value) {
  var time = '';
  var s = value.split(':');
  var i = 0;
  for (; i < s.length - 1; i++) {
    time += s[i].length == 1 ? '0' + s[i] : s[i];
    time += ':';
  }
  time += s[i].length == 1 ? '0' + s[i] : s[i];
  return time;
}

// 进度条点击
function seekTo(e) {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
}

// 音量控制
function updateVolume() {
  audio.volume = volumeSlider.value / 100;
  if (volumeSlider.value == 0) {
    volIcon.src = 'img/静音.png';
  } else {
    volIcon.src = 'img/音量.png';
  }
}

// 播放列表展开/收起
function togglePlaylist() {
  playlistEl.classList.toggle('open');
}

// 更新播放列表高亮
function updatePlaylistActive() {
  const lis = playlistSongs.querySelectorAll('li');
  lis.forEach((li, i) => {
    if (i === currentSongIndex) {
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });
}

// 事件绑定
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
modeBtn.addEventListener('click', toggleMode);
audio.addEventListener('timeupdate', updateTime);
audio.addEventListener('ended', () => {
  if (playModes[currentMode].name === '单曲循环') {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
});
progressBar.addEventListener('click', seekTo);
volumeSlider.addEventListener('input', updateVolume);
playlistToggle.addEventListener('click', togglePlaylist);

// 初始化
initPlaylist();
updateTime();