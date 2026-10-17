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
export default function Lab() {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(false);
  const [webgl] = useState(supportsWebGL);
  const [variant, setVariant] = useState(0);
  const [reset, setReset] = useState(0);
  const [rotation, setRotation] = useState(0);
  const reduced = useReducedMotion();
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
      className="core-fallback"
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
          Arsitektur yang kuat dimulai dari detail. Eksperimen visual tentang
          struktur, interaksi, dan performa.
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
          aria-label={`Sculpture abstrak ${variants[variant].name}. Putar dengan drag atau tombol reset.`}
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
                />
              </Suspense>
            </SceneBoundary>
          ) : (
            fallback
          )}
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
