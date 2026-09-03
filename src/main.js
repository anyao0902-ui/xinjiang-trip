import './style.css';
import { ITINERARY, DAY_COUNT, TOTAL_MILES } from './data.js';

// 经纬 → 高德 [经,纬]
const toAMap = (c) => [c[1], c[0]];
const N = DAY_COUNT;

// ---------- 单一状态源 ----------
const state = { currentIndex: -1, playing: false };

const $ = (id) => document.getElementById(id);
const daylistEl = $('daylist'), detailEl = $('detail'), tooltipEl = $('tooltip'),
      nowDayEl = $('nowDay'), loadingEl = $('loading'), loaderrEl = $('loaderr');

// ---------- 左侧行程列表 ----------
const dayEls = [];
ITINERARY.forEach((item, idx) => {
  const div = document.createElement('div');
  div.className = 'day';
  div.innerHTML = `
    <div class="num">${idx + 1}</div>
    <div class="info">
      <div class="date">${item.date}${item.miles ? ' · ' + item.miles : ''}</div>
      <div class="name">${item.name}</div>
      <div class="sub">${item.summary}</div>
      <div class="hotel">🏨 ${item.hotel} · ${item.room}</div>
    </div>
    <div class="go">›</div>`;
  div.addEventListener('click', () => activate(idx, true));
  daylistEl.appendChild(div);
  dayEls.push(div);
});

// ---------- 渲染函数 ----------
function renderList() {
  dayEls.forEach((el, i) => el.classList.toggle('active', i === state.currentIndex));
}
function renderScore() {
  nowDayEl.textContent = state.currentIndex < 0 ? '—' : ('当前：Day ' + (state.currentIndex + 1));
}
function renderTooltip() {
  if (state.currentIndex < 0) { tooltipEl.classList.remove('show'); tooltipEl.innerHTML = ''; return; }
  const it = ITINERARY[state.currentIndex];
  tooltipEl.innerHTML = 'Day ' + (state.currentIndex + 1) + ' · <b>' + it.date + '</b> ' + it.name + ' — ' + it.summary;
  tooltipEl.classList.add('show');
}
function renderDetail() {
  if (state.currentIndex < 0) {
    detailEl.innerHTML = `<div class="empty"><span class="ico">🗺️</span>点击左侧列表或地图标记<br>查看当天行程详情</div>`;
    return;
  }
  const it = ITINERARY[state.currentIndex];
  const isStart = it.type === 'start', isEnd = it.type === 'end';
  const badgeCls = isStart || isEnd ? 'start' : 'day';
  const badgeTxt = isStart ? '起点' : isEnd ? '终点' : ('Day ' + (state.currentIndex + 1));
  const wps = (it.waypoints && it.waypoints.length)
    ? `<div class="wps"><div class="k">途经点</div><ul>${it.waypoints.map((w) => '<li>' + w + '</li>').join('')}</ul></div>` : '';
  detailEl.innerHTML = `
    <div class="card">
      <span class="c-badge ${badgeCls}">${badgeTxt}</span>
      <h3>${it.name}</h3>
      <div class="c-date">${it.date}${it.miles ? ' · ' + it.miles : ''}</div>
      <div class="c-sum">${it.summary}</div>
      ${wps}
      <div class="row"><span class="k">酒店</span><span class="v hotel">${it.hotel} · ${it.room}</span></div>
      ${it.miles ? `<div class="row"><span class="k">里程</span><span class="v">${it.miles}</span></div>` : ''}
    </div>`;
}

// ---------- 地图初始化（高德） ----------
let map = null, markers = [], routeLine = null, infoWindow = null;

function markerHTML(it, idx) {
  const wps = (it.waypoints && it.waypoints.length) ? it.waypoints.map((w) => '· ' + w).join('<br>') : '';
  return `<div style="font-family:'PingFang SC','Microsoft YaHei',sans-serif;min-width:210px;">
    <div style="font-size:15px;color:#1f8a5d;font-weight:700;margin-bottom:4px;">Day ${idx + 1} · ${it.name}</div>
    <div style="font-size:12px;color:#8fa3b5;margin-bottom:8px;">${it.date}</div>
    <div style="font-size:13px;color:#1a1a1a;margin-bottom:6px;line-height:1.5;">${it.summary}</div>
    ${wps ? '<div style="font-size:12.5px;color:#1f8a5d;margin-top:8px;font-weight:600;">途经：</div><div style="font-size:12.5px;color:#2b6cb0;">' + wps + '</div>' : ''}
    <div style="font-size:12.5px;color:#1f8a5d;margin-top:8px;font-weight:600;">🏨 ${it.hotel} · ${it.room}</div>
    ${it.miles ? '<div style="font-size:12.5px;color:#2b6cb0;margin-top:4px;">🚗 ' + it.miles + '</div>' : ''}
  </div>`;
}

function initMap() {
  if (typeof AMap === 'undefined') {
    loaderrEl.innerHTML = '高德地图脚本未加载成功。<br>请检查：<br>1) 网络能否访问 webapi.amap.com<br>2) 该 Key 是否绑定当前域名或 localhost。';
    return;
  }
  map = new AMap.Map('map', { zoom: 6, center: toAMap(ITINERARY[0].coord), viewMode: '2D', resizeEnable: true });

  const path = ITINERARY.map((it) => toAMap(it.coord));
  routeLine = new AMap.Polyline({ path, strokeColor: '#1f8a5d', strokeWeight: 4, strokeOpacity: 0.9, lineJoin: 'round' });
  map.add(routeLine);

  infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -34), closeWhenClickMap: true });

  ITINERARY.forEach((item, idx) => {
    const isTerminal = item.type === 'start' || item.type === 'end';
    const color = isTerminal ? '#b83280' : '#1f8a5d';
    const pin = document.createElement('div');
    pin.style.cssText = 'width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;background:' + color + ';';
    pin.innerHTML = '<span style="transform:rotate(45deg);color:#fff;font-weight:800;font-size:12px;">' + (idx + 1) + '</span>';
    const marker = new AMap.Marker({ position: toAMap(item.coord), content: pin, offset: new AMap.Pixel(-15, -30), title: item.name });
    marker.on('click', () => {
      activate(idx, true);
      infoWindow.setContent(markerHTML(item, idx));
      infoWindow.open(map, toAMap(item.coord));
    });
    map.add(marker);
    markers.push(marker);
  });

  map.setFitView([routeLine, ...markers], false, [80, 80, 80, 80]);
  loadingEl.classList.add('hide');
  renderDetail();
  setTimeout(() => { if (map) map.resize(); }, 200);
}

// ---------- 交互逻辑 ----------
function activate(idx, pan) {
  state.currentIndex = Math.max(0, Math.min(N - 1, idx));
  renderList(); renderScore(); renderTooltip(); renderDetail();
  if (pan && map) {
    const c = toAMap(ITINERARY[state.currentIndex].coord);
    map.setZoomAndCenter(9, c);
  }
}
function deselect() {
  state.currentIndex = -1;
  stopPlay();
  renderList(); renderScore(); renderTooltip(); renderDetail();
  if (map) {
    if (infoWindow) infoWindow.close();
    map.setFitView([routeLine, ...markers], false, [80, 80, 80, 80]);
  }
}

$('navBtn').addEventListener('click', () => activate(Math.max(0, (state.currentIndex < 0 ? 0 : state.currentIndex) - 1), true));
$('navBtn2').addEventListener('click', () => activate(state.currentIndex < 0 ? 0 : Math.min(N - 1, state.currentIndex + 1), true));
$('reset').addEventListener('click', deselect);

// 播放 / 暂停
let playTimer = null;
const playBtn = $('play');
playBtn.addEventListener('click', () => {
  if (!map) { alert('地图尚未加载完成，请稍候重试。'); return; }
  if (state.playing) { stopPlay(); return; }
  state.playing = true;
  playBtn.textContent = '⏸ 暂停';
  let i = state.currentIndex < 0 ? 0 : state.currentIndex;
  activate(i, false);
  playTimer = setInterval(() => {
    if (i >= N) { stopPlay(); return; }
    activate(i, true);
    i++;
  }, 1600);
});
function stopPlay() {
  state.playing = false;
  playBtn.textContent = '▶ 播放路线';
  if (playTimer) { clearInterval(playTimer); playTimer = null; }
}

// 键盘翻站
window.addEventListener('keydown', (e) => {
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  if (!map) return;
  if (e.key === 'ArrowLeft') { activate(Math.max(0, (state.currentIndex < 0 ? 0 : state.currentIndex) - 1), true); }
  else if (e.key === 'ArrowRight') { activate(state.currentIndex < 0 ? 0 : Math.min(N - 1, state.currentIndex + 1), true); }
});

// ---------- 启动 ----------
renderList(); renderScore(); renderTooltip(); renderDetail();
if (typeof AMap !== 'undefined') {
  initMap();
} else {
  const s = document.querySelector('script[src*="webapi.amap.com"]');
  if (s) { s.addEventListener('load', initMap); s.addEventListener('error', initMap); }
  else { initMap(); }
}
