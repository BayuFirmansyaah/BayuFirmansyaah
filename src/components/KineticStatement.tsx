import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { RotateCcw, Shuffle } from "lucide-react";

export default function KineticStatement({ calm }: { calm: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [chaos, setChaos] = useState(false);
  useEffect(() => {
    setChaos(false);
  }, [calm]);
  const { contextSafe } = useGSAP({
    scope: root,
    dependencies: [calm],
    revertOnUpdate: true,
  });
  const scatter = contextSafe(() => {
    if (calm) return;
    setChaos(true);
    root.current
      ?.querySelectorAll<HTMLElement>(".kinetic-letter")
      .forEach((letter, i) => {
        gsap.to(letter, {
          x: Math.sin(i * 7.3) * 24,
          y: Math.cos(i * 3.1) * 30,
          rotation: Math.sin(i * 4.7) * 35,
          scale: 0.7 + (i % 4) * 0.13,
          duration: 0.7,
          ease: "elastic.out(1,0.55)",
          overwrite: true,
        });
      });
  });
  const assemble = contextSafe(() => {
    setChaos(false);
    gsap.to(".kinetic-letter", {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      stagger: calm ? 0 : 0.015,
      duration: calm ? 0 : 0.8,
      ease: "elastic.out(1,0.45)",
      overwrite: true,
    });
  });
  const nudge = contextSafe((letter: HTMLElement) => {
    if (calm || chaos) return;
    gsap.fromTo(
      letter,
      { y: 0, rotation: 0 },
      {
        y: -22,
        rotation: 10,
        duration: 0.22,
        repeat: 1,
        yoyo: true,
        ease: "power2.out",
        overwrite: true,
      },
    );
  });
  return (
    <div className="kinetic-statement" ref={root}>
      <h2
        className="kinetic-title"
        aria-label="Complex systems. Clear solutions."
      >
        {["COMPLEX", "SYSTEMS.", "CLEAR", "SOLUTIONS."].map((word, row) => (
          <span
            className={`kinetic-line ${row > 1 ? "kinetic-accent" : ""}`}
            key={word}
            aria-hidden="true"
          >
            <span className="kinetic-word">
              {[...word].map((letter, i) => (
                <span
                  className="kinetic-letter"
                  key={i}
                  onPointerEnter={(e) => nudge(e.currentTarget)}
                >
                  {letter}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h2>
      <div className="type-play-controls">
        <span className="mono" aria-live="polite">
          {calm
            ? "PRECISION IN EVERY LETTER"
            : chaos
              ? "CHAOS MODE / NOW MAKE IT CLEAR"
              : "PLAY WITH THE TYPE ↗"}
        </span>
        <div>
          <button
            type="button"
            onClick={scatter}
            disabled={calm}
            aria-label="Acak huruf"
            aria-pressed={chaos && !calm}
          >
            <Shuffle size={15} />
            Acak
          </button>
          <button
            type="button"
            onClick={assemble}
            disabled={calm}
            aria-label="Susun kembali huruf"
          >
            <RotateCcw size={15} />
            Susun
          </button>
        </div>
      </div>
    </div>
  );
}
