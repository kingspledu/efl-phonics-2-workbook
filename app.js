const $ = (id) => document.getElementById(id);
const state = { pages: [], index: 0, active: null, audio: null, context: null, source: null, gain: null, lastButton: null };

async function init() {
  try {
    const response = await fetch('pages.json');
    if (!response.ok) throw new Error('페이지 정보를 불러오지 못했습니다.');
    state.pages = await response.json();
    const requested = Number(new URLSearchParams(location.search).get('page'));
    state.index = requested >= 1 && requested <= state.pages.length ? requested - 1 : 0;
    buildThumbnails();
    showPage(state.index);
  } catch (error) {
    $('pageTitle').textContent = '교재를 불러올 수 없습니다';
    $('activeText').textContent = error.message;
  }
}

function buildThumbnails() {
  const track = $('thumbnails');
  track.replaceChildren();
  state.pages.forEach((page, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'thumb';
    button.setAttribute('aria-label', `${page.page}페이지 열기`);
    button.innerHTML = `<img src="thumbs/${String(page.page).padStart(2, '0')}.webp" alt="" loading="lazy"><span>${page.page}쪽</span>`;
    button.addEventListener('click', () => showPage(index));
    track.append(button);
  });
}

function showPage(index) {
  if (index < 0 || index >= state.pages.length) return;
  stopAudio();
  state.index = index;
  state.active = null;
  const page = state.pages[index];
  $('pageTitle').textContent = `워크북 ${page.page}쪽`;
  $('pageCount').textContent = `${page.page} / ${state.pages.length}`;
  $('pageImage').src = `pages/${String(page.page).padStart(2, '0')}.webp`;
  $('pageImage').alt = `EFL Phonics 2 Workbook ${page.page}쪽`;
  $('activeText').textContent = '읽을 글자를 선택해 주세요.';
  $('textEdit').value = '';
  $('prevButton').disabled = index === 0;
  $('nextButton').disabled = index === state.pages.length - 1;
  history.replaceState(null, '', `?page=${page.page}`);
  const layer = $('textLayer');
  const list = $('textList');
  layer.replaceChildren();
  list.replaceChildren();
  page.segments.forEach((segment, segmentIndex) => {
    const hotspot = document.createElement('button');
    hotspot.type = 'button';
    hotspot.className = 'text-hotspot';
    hotspot.style.cssText = `left:${segment.x * 100}%;top:${segment.y * 100}%;width:${segment.w * 100}%;height:${segment.h * 100}%`;
    hotspot.setAttribute('aria-label', `${segment.text} 읽기`);
    hotspot.title = segment.text;
    hotspot.addEventListener('click', () => selectSegment(segmentIndex, hotspot));
    layer.append(hotspot);
    const item = document.createElement('button');
    item.type = 'button';
    item.textContent = segment.text;
    item.addEventListener('click', () => selectSegment(segmentIndex, hotspot));
    list.append(item);
  });
  const selectedThumb = $('thumbnails').children[index];
  for (const button of $('thumbnails').children) button.classList.remove('active');
  selectedThumb.classList.add('active');
  selectedThumb.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function selectSegment(index, button) {
  if (state.lastButton) state.lastButton.classList.remove('active');
  state.lastButton = button;
  button.classList.add('active');
  state.active = index;
  const text = state.pages[state.index].segments[index].text;
  $('activeText').textContent = text;
  $('textEdit').value = text;
  speak();
}

function stopAudio() {
  if (state.audio) { state.audio.pause(); state.audio.currentTime = 0; state.audio = null; }
  speechSynthesis.cancel();
}

async function speak() {
  stopAudio();
  const text = $('textEdit').value.trim();
  if (!text) return;
  const segment = state.active === null ? null : state.pages[state.index].segments[state.active];
  const recorded = segment && segment.text === text && /[A-Za-z]/.test(text);
  if (recorded) {
    const page = String(state.index + 1).padStart(2, '0');
    const number = String(state.active).padStart(3, '0');
    const audio = new Audio(`audio/${page}-${number}.wav`);
    audio.preload = 'auto';
    audio.playbackRate = 0.8;
    audio.preservesPitch = true;
    state.audio = audio;
    try {
      if (!state.context) state.context = new AudioContext();
      if (state.context.state === 'suspended') await state.context.resume();
      const source = state.context.createMediaElementSource(audio);
      const gain = state.context.createGain();
      gain.gain.value = 1.2;
      source.connect(gain).connect(state.context.destination);
      await audio.play();
      return;
    } catch { /* If pre-recorded audio is missing, use the browser voice below. */ }
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.8;
  utterance.volume = 1;
  const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('en'));
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

$('prevButton').addEventListener('click', () => showPage(state.index - 1));
$('nextButton').addEventListener('click', () => showPage(state.index + 1));
$('stopButton').addEventListener('click', stopAudio);
$('speakButton').addEventListener('click', speak);
$('pageImage').addEventListener('click', event => {
  const page = state.pages[state.index];
  if (!page || !page.segments.length) return;
  const box = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width;
  const y = (event.clientY - box.top) / box.height;
  let nearest = -1, distance = Infinity;
  page.segments.forEach((segment, index) => {
    const dx = x - (segment.x + segment.w / 2);
    const dy = y - (segment.y + segment.h / 2);
    const current = Math.hypot(dx, dy * 1.3);
    if (current < distance) { distance = current; nearest = index; }
  });
  if (nearest >= 0 && distance < 0.14) selectSegment(nearest, $('textLayer').children[nearest]);
});
document.addEventListener('keydown', event => {
  if (event.target.matches('textarea,input')) return;
  if (event.key === 'ArrowLeft') showPage(state.index - 1);
  if (event.key === 'ArrowRight') showPage(state.index + 1);
});
init();
