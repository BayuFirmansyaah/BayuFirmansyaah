import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoveUpRight,
  RotateCcw,
} from "lucide-react";
import { useReducedMotion } from "../hooks/useMotion";
const CoreScene = lazy(() => import("./CoreScene"));
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
export default function Lab({ calm }: { calm: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(false);
  const [webgl] = useState(supportsWebGL);
  const [variant, setVariant] = useState(0);
  const [reset, setReset] = useState(0);
  const [rotation, setRotation] = useState(0);
  const reduced = useReducedMotion() || calm;
  const [shape, setShape] = useState(0);
  const [energy, setEnergy] = useState(0.2);
  const [wireframe, setWireframe] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const variants = [
    { name: "Racing lime", color: "#d7ff35" },
    { name: "Liquid silver", color: "#c5d3db" },
    { name: "Burnt orange", color: "#ff7c38" },
  ];
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { rootMargin: "120px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const fallback = (
    <div
      className={`core-fallback shape-${shape} ${wireframe ? "wireframe-fallback" : ""} ${expanded ? "expanded-fallback" : ""}`}
      style={{
        color: variants[variant].color,
        transform: `rotate(${rotation * 30}deg)`,
      }}
    >
      <div />
      <div />
      <div />
      <span>BF</span>
    </div>
  );
  return (
    <section id="lab" className="lab section-shell" ref={ref}>
      <div className="lab-copy" data-reveal>
        <span className="eyebrow">03 / UNDER THE HOOD</span>
        <h2>
          PRECISION.
          <br />
          IN EVERY
          <br />
          <span className="text-lime">LAYER.</span>
        </h2>
        <p>
          Satu struktur. Banyak kemungkinan. Putar bentuknya, bongkar
          lapisannya, lalu naikkan energinya. Ini ruang untuk bereksperimen.
        </p>
        <span className="lab-caption">
          <MoveUpRight size={14} />
          {webgl
            ? "Eksperimen 3D interaktif · drag untuk memutar"
            : "Mode visual 2D · WebGL tidak tersedia"}
        </span>
      </div>
      <div className="lab-stage">
        <div className="lab-cross top-left">+</div>
        <div className="lab-cross top-right">+</div>
        <div className="lab-coordinate">BF—CORE / EXPERIMENT 001</div>
        <div
          className="scene"
          role="img"
          aria-label={`Sculpture ${["knot", "orb", "torus"][shape]} berwarna ${variants[variant].name}. Putar dengan drag atau tombol arah.`}
        >
          {entered && webgl ? (
            <SceneBoundary fallback={fallback}>
              <Suspense fallback={fallback}>
                <CoreScene
                  key={reset}
                  color={variants[variant].color}
                  reduced={reduced}
                  active={active}
                  rotation={rotation}
                  shape={shape}
                  energy={energy}
                  wireframe={wireframe}
                  expanded={expanded}
                />
              </Suspense>
            </SceneBoundary>
          ) : (
            fallback
          )}
        </div>
        <div className="lab-play-tools">
          <div className="shape-options" aria-label="Pilih bentuk">
            {["KNOT", "ORB", "TORUS"].map((name, i) => (
              <button
                type="button"
                key={name}
                aria-pressed={shape === i}
                onClick={() => setShape(i)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="lab-mode-options">
            <button
              type="button"
              aria-pressed={wireframe}
              onClick={() => setWireframe((v) => !v)}
            >
              WIREFRAME
            </button>
            <button
              type="button"
              aria-pressed={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              EXPAND ↗
            </button>
          </div>
          <label className="energy-control">
            ENERGY{" "}
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(energy * 100)}
              onChange={(e) => setEnergy(Number(e.target.value) / 100)}
              disabled={reduced}
              aria-label="Intensitas gerakan 3D"
            />
            <output>{Math.round(energy * 100)}%</output>
          </label>
        </div>
        <div className="lab-controls">
          <div className="swatches" aria-label="Warna sculpture">
            {variants.map((v, i) => (
              <button
                key={v.name}
                type="button"
                title={v.name}
                aria-label={v.name}
                aria-pressed={variant === i}
                onClick={() => setVariant(i)}
                className={variant === i ? "selected" : ""}
                style={{ background: v.color }}
              />
            ))}
          </div>
          <span className="mono">{variants[variant].name}</span>
          <button
            type="button"
            className="icon-button rotate-button"
            onClick={() => setRotation((v) => v - Math.PI / 6)}
            aria-label="Putar ke kiri"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="icon-button rotate-button"
            onClick={() => setRotation((v) => v + Math.PI / 6)}
            aria-label="Putar ke kanan"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setReset((v) => v + 1);
              setRotation(0);
              setShape(0);
              setEnergy(0.2);
              setWireframe(false);
              setExpanded(false);
            }}
            aria-label="Reset rotasi 3D"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
