import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseR: number;
  alpha: number;
  dAlpha: number;
  color: string;
  layer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  life: number;
  maxLife: number;
}

const COLORS = [
  "255,220,120",
  "200,180,255",
  "150,220,255",
  "255,200,150",
  "220,255,200",
];

const StarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -2000, y: -2000, active: false });
  const stars = useRef<Star[]>([]);
  const particles = useRef<Particle[]>([]);
  const meteors = useRef<Meteor[]>([]);
  const rafRef = useRef<number>(0);
  const lastMeteor = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initStars();
    };

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const initStars = () => {
      const count = Math.min(
        Math.floor((W() * H()) / 4500),
        220
      );
      stars.current = Array.from({ length: count }, () => {
        const layer = Math.floor(Math.random() * 3);
        const baseR = layer === 0 ? Math.random() * 0.8 + 0.3 : layer === 1 ? Math.random() * 1.2 + 0.7 : Math.random() * 2 + 1.2;
        return {
          x: Math.random() * W(),
          y: Math.random() * H(),
          vx: (Math.random() - 0.5) * (0.05 + layer * 0.08),
          vy: (Math.random() - 0.5) * (0.05 + layer * 0.08),
          r: baseR,
          baseR,
          alpha: Math.random() * 0.5 + 0.3,
          dAlpha: (Math.random() - 0.5) * 0.006,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          layer,
        };
      });
    };

    const spawnMeteor = () => {
      const x = Math.random() * W() * 1.2;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 8 + Math.random() * 6;
      const life = 60 + Math.random() * 40;
      meteors.current.push({
        x,
        y: -20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 80 + Math.random() * 80,
        alpha: 0.9,
        life,
        maxLife: life,
      });
    };

    const spawnBurst = (x: number, y: number) => {
      const count = 28;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 50 + Math.random() * 30,
          maxLife: 80,
          r: 1 + Math.random() * 2.5,
          color,
        });
      }
    };

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, W(), H());

      const mx = pointer.current.x;
      const my = pointer.current.y;
      const active = pointer.current.active;
      const PULL_R = active ? 180 : 0;
      const GLOW_R = 140;

      // Spawn meteors
      if (ts - lastMeteor.current > 3500 + Math.random() * 4000) {
        spawnMeteor();
        lastMeteor.current = ts;
      }

      // Draw meteors
      meteors.current = meteors.current.filter((m) => m.life > 0);
      meteors.current.forEach((m) => {
        const t = m.life / m.maxLife;
        const tailX = m.x - m.vx * (m.len / m.vx);
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, m.y - m.len);
        grad.addColorStop(0, `rgba(255,240,200,${t * 0.95})`);
        grad.addColorStop(0.4, `rgba(200,180,255,${t * 0.4})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * (m.len / Math.hypot(m.vx, m.vy)), m.y - m.vy * (m.len / Math.hypot(m.vx, m.vy)));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 * t;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,220,${t * 0.9})`;
        ctx.fill();

        m.x += m.vx;
        m.y += m.vy;
        m.life--;
      });

      // Draw connections between close stars
      const nearby = stars.current.filter((s) => {
        const dx = s.x - mx;
        const dy = s.y - my;
        return Math.hypot(dx, dy) < GLOW_R;
      });
      nearby.forEach((a, i) => {
        nearby.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,210,120,${(1 - dist / 100) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      // Draw stars
      stars.current.forEach((s) => {
        // Move
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += s.dAlpha;
        if (s.alpha > 0.95 || s.alpha < 0.1) s.dAlpha *= -1;
        if (s.x < -5) s.x = W() + 5;
        if (s.x > W() + 5) s.x = -5;
        if (s.y < -5) s.y = H() + 5;
        if (s.y > H() + 5) s.y = -5;

        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.hypot(dx, dy);

        // Pull effect
        if (PULL_R > 0 && dist < PULL_R && dist > 1) {
          const force = (1 - dist / PULL_R) * 0.6;
          s.vx += (-dx / dist) * force;
          s.vy += (-dy / dist) * force;
          const maxV = 2.5;
          const speed = Math.hypot(s.vx, s.vy);
          if (speed > maxV) { s.vx = (s.vx / speed) * maxV; s.vy = (s.vy / speed) * maxV; }
        } else {
          // Damping back to base speed
          const baseSpeed = 0.05 + s.layer * 0.08;
          const speed = Math.hypot(s.vx, s.vy);
          if (speed > baseSpeed * 2) {
            s.vx *= 0.96;
            s.vy *= 0.96;
          }
        }

        const glowBoost = dist < GLOW_R ? (1 - dist / GLOW_R) : 0;
        const r = s.baseR + glowBoost * s.baseR * 3;
        const alpha = Math.min(1, s.alpha + glowBoost * 0.6);

        // Glow
        if (glowBoost > 0) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 5);
          grd.addColorStop(0, `rgba(${s.color},${alpha * 0.6})`);
          grd.addColorStop(1, `rgba(${s.color},0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.fill();

        // Sparkle cross on big/boosted stars
        if (s.baseR > 1.5 || glowBoost > 0.4) {
          const len = r * 3 + glowBoost * 8;
          ctx.strokeStyle = `rgba(${s.color},${alpha * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }

        // Lines to pointer
        if (dist < GLOW_R) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(255,210,100,${(1 - dist / GLOW_R) * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      // Draw burst particles
      particles.current = particles.current.filter((p) => p.life > 0);
      particles.current.forEach((p) => {
        const t = p.life / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life--;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grd.addColorStop(0, `rgba(${p.color},${t})`);
        grd.addColorStop(1, `rgba(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * t, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${t * 0.8})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    // ─── Pointer helpers ───────────────────────────────────────────────
    const getPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      const p = getPos(e.clientX, e.clientY);
      pointer.current = { ...p, active: true };
    };
    const onMouseLeave = () => {
      pointer.current = { x: -2000, y: -2000, active: false };
    };
    const onMouseClick = (e: MouseEvent) => {
      const p = getPos(e.clientX, e.clientY);
      spawnBurst(p.x, p.y);
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      const p = getPos(t.clientX, t.clientY);
      pointer.current = { ...p, active: true };
      spawnBurst(p.x, p.y);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const p = getPos(t.clientX, t.clientY);
      pointer.current = { ...p, active: true };
    };
    const onTouchEnd = () => {
      pointer.current = { x: -2000, y: -2000, active: false };
    };

    resize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onMouseClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onMouseClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair"
      style={{ display: "block", touchAction: "none" }}
    />
  );
};

export default StarCanvas;
