const data = 장데이터;   // 데이터.js 에서 불러옴 (fetch 없이 동작 - 로컬 더블클릭 가능)
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function highlight(html, kw) {
  if (!kw) return html;
  const re = new RegExp(escRe(esc(kw)), 'gi');
  return html.split(/(<[^>]+>)/).map(p => p.startsWith('<') ? p : p.replace(re, m => `<mark>${m}</mark>`)).join('');
}

function fmt(text, kw) {
  return text.split(/\n{2,}/).map(block => {
    const h = block.match(/^###\s+(.*)$/);
    const html = esc(h ? h[1] : block).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return h ? `<h4>${highlight(html, kw)}</h4>` : `<p>${highlight(html, kw)}</p>`;
  }).join('');
}

function render(arr, kw) {
  count.textContent = `결과 ${arr.length}건`;
  list.innerHTML = arr.length ? arr.map(a => `
    <div class="card">
      <span class="label">${esc(a.장)}장</span>
      <div class="title">${highlight(esc(a.제목), kw)}</div>
      <div class="body">${fmt(a.본문, kw)}</div>
    </div>`).join('') : '<div class="empty">검색 결과가 없습니다.</div>';
}

q.addEventListener('input', () => {
  const kw = q.value.trim();
  const lower = kw.toLowerCase();
  const filtered = kw ? data.filter(a => a.본문.toLowerCase().includes(lower) || a.제목.toLowerCase().includes(lower)) : data;
  render(filtered, kw);
});

render(data, '');
