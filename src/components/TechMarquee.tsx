import { useState } from "react";
import { Pause, Play } from "lucide-react";

const technologies = [
  "LARAVEL",
  "REACT",
  "TYPESCRIPT",
  "POSTGRESQL",
  "NODE.JS",
  "DOCKER",
  "REDIS",
];

export default function TechMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="tech-marquee"
      role="region"
      aria-label="Teknologi utama"
      data-paused={paused}
    >
      <div className="tech-marquee-track">
        {[0, 1].map((copy) => (
          <div
            className="tech-marquee-group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {technologies.map((technology) => (
              <span className="tech-marquee-item" key={technology}>
                <span>{technology}</span>
                <i aria-hidden="true">✳</i>
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        className="tech-marquee-toggle"
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Lanjutkan marquee" : "Jeda marquee"}
        aria-pressed={paused}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </div>
  );
}
