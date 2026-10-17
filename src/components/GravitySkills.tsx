import { useEffect, useRef, useState } from "react";
import { useVisibleActivity } from "../hooks/useVisibleActivity";

const skills = [
  { name: "REACT", lane: 0 },
  { name: "TYPESCRIPT", lane: 0 },
  { name: "LARAVEL", lane: 1 },
  { name: "NODE.JS", lane: 1 },
  { name: "POSTGRESQL", lane: 2 },
  { name: "REDIS", lane: 2 },
  { name: "DOCKER", lane: 3 },
  { name: "CI/CD", lane: 3 },
];
type Body = { x: number; y: number; vx: number; vy: number };
const size = { w: 122, h: 42 };
export default function GravitySkills({ calm }: { calm: boolean }) {
  const { ref, active } = useVisibleActivity<HTMLDivElement>();
  const stage = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const drag = useRef<{
    index: number;
    offsetX: number;
    offsetY: number;
    lastX: number;
    lastY: number;
    time: number;
  } | null>(null);
  const [organized, setOrganized] = useState(false);
  const [paused, setPaused] = useState(false);
  const [kick, setKick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const arrange = organized || calm;
  const running = active && !paused && !arrange;
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const place = () => {
      const width = el.clientWidth,
        height = el.clientHeight;
      const cols = width < 600 ? 2 : 4;
      el.style.setProperty("--gravity-cols", String(cols));
      bodies.current = skills.map((s, i) => ({
        x: arrange
          ? (((s.lane % cols) + 0.5) * width) / cols - size.w / 2
          : 12 + (((i + kick) % cols) * (width - 24 - size.w)) / (cols - 1),
        y: arrange
          ? (Math.floor(s.lane / cols) * height) / (4 / cols) +
            58 +
            (i % 2) * 62
          : 20 + Math.floor(i / cols) * 62,
        vx: Math.sin(i * 13 + kick * 7 + 1) * (90 + i * 12),
        vy: -Math.abs(Math.cos(i * 5 + kick)) * 150,
      }));
      bodies.current.forEach((b, i) => {
        if (chips.current[i])
          chips.current[i]!.style.transform =
            `translate3d(${b.x}px,${b.y}px,0)`;
      });
    };
    const observer = new ResizeObserver(place);
    observer.observe(el);
    place();
    return () => observer.disconnect();
  }, [arrange, kick]);
  useEffect(() => {
    if (!running) return;
    let frame = 0,
      last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.025) : 0;
      last = now;
      const width = stage.current?.clientWidth || 300,
        height = stage.current?.clientHeight || 390;
      const data = bodies.current;
      data.forEach((b, i) => {
        if (drag.current?.index === i) return;
        b.vy += 190 * dt;
        b.vx *= Math.pow(0.995, dt * 60);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x < 0) {
          b.x = 0;
          b.vx = Math.abs(b.vx) * 0.8;
        }
        if (b.x > width - size.w) {
          b.x = width - size.w;
          b.vx = -Math.abs(b.vx) * 0.8;
        }
        if (b.y < 0) {
          b.y = 0;
          b.vy = Math.abs(b.vy) * 0.7;
        }
        if (b.y > height - size.h) {
          b.y = height - size.h;
          b.vy = -Math.abs(b.vy) * 0.58;
          if (Math.abs(b.vy) < 8) b.vy = 0;
        }
      });
      for (let i = 0; i < data.length; i++)
        for (let j = i + 1; j < data.length; j++) {
          const a = data[i],
            b = data[j],
            dx = b.x - a.x,
            dy = b.y - a.y;
          const overlapX = size.w - Math.abs(dx),
            overlapY = size.h - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;
          const moveA = drag.current?.index === i ? 0 : 1,
            moveB = drag.current?.index === j ? 0 : 1,
            total = moveA + moveB;
          if (overlapX < overlapY) {
            const push = (Math.sign(dx || 1) * overlapX) / total;
            a.x -= push * moveA;
            b.x += push * moveB;
            const v = a.vx;
            a.vx = b.vx * 0.7;
            b.vx = v * 0.7;
          } else {
            const push = (Math.sign(dy || 1) * overlapY) / total;
            a.y -= push * moveA;
            b.y += push * moveB;
            const v = a.vy;
            a.vy = b.vy * 0.55;
            b.vy = v * 0.55;
          }
        }
      data.forEach((b, i) => {
        b.x = Math.max(0, Math.min(width - size.w, b.x));
        b.y = Math.max(0, Math.min(height - size.h, b.y));
        if (chips.current[i])
          chips.current[i]!.style.transform =
            `translate3d(${b.x}px,${b.y}px,0)`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  useEffect(() => {
    if (!running) drag.current = null;
  }, [running]);
  return (
    <div
      className={`gravity-skills ${arrange ? "gravity-organized" : ""}`}
      ref={ref}
    >
      <div className="gravity-heading">
        <div>
          <span className="mono">THE STACK, UNBOXED.</span>
          <h3>MAKE IT CLICK.</h3>
        </div>
        <p>
          {arrange
            ? "Satu stack. Empat lapisan yang bekerja bersama."
            : "Tarik dan lempar skill-nya. Atau pilih satu, lalu tekan Enter untuk melontarkannya."}
        </p>
      </div>
      <div
        className="gravity-stage"
        ref={stage}
        aria-label="Playground skill interaktif"
      >
        {arrange && (
          <div className="gravity-lanes" aria-hidden="true">
            {["FRONTEND", "BACKEND", "DATA", "DELIVERY"].map((name) => (
              <div key={name}>
                <span>{name}</span>
                <i>↓</i>
              </div>
            ))}
          </div>
        )}
        {!arrange && (
          <span className="gravity-watermark" aria-hidden="true">
            LET IT
            <br />
            DROP.
          </span>
        )}
        {skills.map((skill, i) => (
          <button
            type="button"
            key={skill.name}
            ref={(el) => {
              chips.current[i] = el;
            }}
            className={`gravity-chip lane-${skill.lane}`}
            aria-label={`${skill.name}: ${arrange ? "lihat peran" : "lontarkan skill"}`}
            onClick={(e) => {
              setSelected(i);
              if (e.detail === 0 && running && bodies.current[i]) {
                bodies.current[i].vy = -260;
                bodies.current[i].vx = (i % 2 ? 1 : -1) * 150;
              }
            }}
            onPointerDown={(e) => {
              if (!running) return;
              const rect = stage.current!.getBoundingClientRect(),
                b = bodies.current[i];
              if (!b) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = {
                index: i,
                offsetX: e.clientX - rect.left - b.x,
                offsetY: e.clientY - rect.top - b.y,
                lastX: e.clientX,
                lastY: e.clientY,
                time: performance.now(),
              };
              setSelected(i);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d || d.index !== i) return;
              const rect = stage.current!.getBoundingClientRect(),
                b = bodies.current[i],
                now = performance.now(),
                dt = Math.max(0.016, (now - d.time) / 1000);
              b.x = Math.max(
                0,
                Math.min(
                  rect.width - size.w,
                  e.clientX - rect.left - d.offsetX,
                ),
              );
              b.y = Math.max(
                0,
                Math.min(
                  rect.height - size.h,
                  e.clientY - rect.top - d.offsetY,
                ),
              );
              b.vx = Math.max(-650, Math.min(650, (e.clientX - d.lastX) / dt));
              b.vy = Math.max(-650, Math.min(650, (e.clientY - d.lastY) / dt));
              d.lastX = e.clientX;
              d.lastY = e.clientY;
              d.time = now;
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onLostPointerCapture={() => {
              drag.current = null;
            }}
          >
            {skill.name}
            <span>✳</span>
          </button>
        ))}
      </div>
      <div className="gravity-footer">
        <div className="arcade-button-row">
          <button
            type="button"
            className="arcade-primary"
            aria-pressed={arrange}
            onClick={() => setOrganized(!organized)}
            disabled={calm}
          >
            {arrange ? "Lepaskan gravitasi ↗" : "Build architecture ↗"}
          </button>
          <button
            type="button"
            disabled={arrange}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Lanjut gravitasi" : "Jeda gravitasi"}
          </button>
          <button
            type="button"
            disabled={arrange}
            onClick={() => {
              setKick((v) => v + 1);
              setPaused(false);
            }}
          >
            Acak skill ↺
          </button>
        </div>
        <p role="status">
          {selected === null
            ? "CHAOS → STRUCTURE"
            : `${skills[selected].name} / ${["Membangun antarmuka dan interaksi.", "Menjalankan aturan bisnis dan API.", "Menyimpan data dan mempercepat akses.", "Mengirim perubahan secara konsisten."][skills[selected].lane]}`}
        </p>
      </div>
    </div>
  );
}
