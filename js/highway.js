/* "Highway" renderer: one keystroke per row, rows recede into the distance.
 * Each key tile sits at its real horizontal position on the keyboard and is
 * coloured by the finger that types it. Space is a wide grey tile.
 *
 * row = { ch, info, pos, current, error, shake, fade }
 *   pos 0 = nearest (bottom, biggest), pos 5 = far (top, tiny)
 */
(function (global) {
  'use strict';
  const DW = 720, DH = 205, BASE = 163;
  const FONT = '"Segoe UI", system-ui, -apple-system, Roboto, sans-serif';

  const scaleAt = p => Math.max(0.1, 1 - 0.16 * p);
  const yAt = p => BASE - 44 * (p - 0.075 * p * p);

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function Highway(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  Highway.prototype.resize = function () {
    const dpr = window.devicePixelRatio || 1;
    const w = this.c.clientWidth || DW;
    const h = w * DH / DW;
    this.c.style.height = h + 'px';
    this.c.width = Math.round(w * dpr);
    this.c.height = Math.round(h * dpr);
    this.k = (w / DW) * dpr;
  };

  Highway.prototype.draw = function (rows, now) {
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.c.width, this.c.height);
    ctx.setTransform(this.k, 0, 0, this.k, 0, 0);
    rows.filter(r => r.pos > -1.2 && r.pos < 5.6)
      .sort((a, b) => b.pos - a.pos)
      .forEach(r => this.drawRow(r, now));
    ctx.globalAlpha = 1;
  };

  Highway.prototype.drawRow = function (r, now) {
    const ctx = this.ctx, p = r.pos, s = scaleAt(p), y = yAt(p);
    let alpha = p < 0 ? Math.max(0, 1 + p * 1.6) : Math.min(1, Math.max(0, 1 - (p - 0.3) * 0.18));
    if (p > 4.6) alpha *= Math.max(0, 5.6 - p);
    if (r.fade != null) alpha *= r.fade;
    if (alpha <= 0.01) return;

    const cx = DW / 2, barW = 655 * s, barH = 40 * s;
    ctx.globalAlpha = alpha;
    roundRect(ctx, cx - barW / 2, y - barH / 2, barW, barH, 10 * s);
    ctx.fillStyle = '#edf2f6';
    ctx.fill();

    const info = r.info;
    if (!info) return;
    const u = (barW * 0.86) / 15;
    const kw = info.k.w * u - 4 * s, kh = 38 * s;
    let x = cx + (info.k.cx - 7.5) * u;
    if (r.shake) x += Math.sin(now / 16) * 6 * s * r.shake;

    const cur = !!r.current, space = info.key === ' ';
    let fill, edge, text;
    if (r.error) { fill = '#fecaca'; edge = '#dc2626'; text = '#991b1b'; }
    else if (r.hit) { fill = '#bbf7d0'; edge = '#16a34a'; text = '#166534'; }
    else if (space) { fill = cur ? '#dfe5eb' : '#e6ebf0'; edge = '#94a3b8'; text = '#64748b'; }
    else { fill = cur ? info.f.mid : info.f.light; edge = info.f.dark; text = info.f.dark; }

    const top = y - kh / 2 - (cur ? 2 * s : 0);
    if (cur) {
      roundRect(ctx, x - kw / 2, top + 4 * s, kw, kh, 7 * s);
      ctx.fillStyle = edge;
      ctx.fill();
    }
    roundRect(ctx, x - kw / 2, top, kw, kh, 7 * s);
    ctx.fillStyle = fill;
    ctx.fill();
    if (cur) { ctx.lineWidth = 1.5 * s; ctx.strokeStyle = edge; ctx.stroke(); }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = text;
    if (!space) {
      ctx.globalAlpha = alpha * (cur ? 1 : 0.8);
      ctx.font = `${cur ? 700 : 600} ${(21 * s).toFixed(1)}px ${FONT}`;
      ctx.fillText(r.ch === '\n' ? '↵' : r.ch, x, top + kh / 2 + s);
      if (info.shift) {
        ctx.font = `700 ${(11 * s).toFixed(1)}px ${FONT}`;
        ctx.fillText('⇧', x - kw / 2 + 8 * s, top + 9 * s);
      }
    } else if (cur) {
      ctx.globalAlpha = alpha * 0.8;
      ctx.font = `600 ${(12 * s).toFixed(1)}px ${FONT}`;
      ctx.fillText('spasi', x, top + kh / 2 + s);
    }
  };

  global.Highway = Highway;
})(window);
