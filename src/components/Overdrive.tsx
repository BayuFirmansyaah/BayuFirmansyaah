import { useCallback, useEffect, useRef, useState } from "react";
export default function Overdrive({
  disabled,
  onChange,
}: {
  disabled: boolean;
  onChange: (boost: boolean) => void;
}) {
  const [boost, setBoost] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    held = useRef(false);
  const callback = useRef(onChange);
  callback.current = onChange;
  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setBoost(false);
    callback.current(false);
  }, []);
  const release = useCallback(() => {
    held.current = false;
    stop();
  }, [stop]);
  function start() {
    if (disabled || held.current) return;
    held.current = true;
    setBoost(true);
    callback.current(true);
    timer.current = setTimeout(stop, 3000);
  }
  useEffect(() => {
    if (disabled) release();
  }, [disabled, release]);
  useEffect(() => {
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", release);
    return () => {
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", release);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [release]);
  return (
    <div className={`overdrive-control ${boost ? "boosting" : ""}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label="Tahan untuk Overdrive"
        aria-pressed={boost}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (!e.repeat) start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") release();
        }}
        onBlur={release}
      >
        <span>✳</span> HOLD TO OVERDRIVE <span>↗</span>
        <i aria-hidden="true" />
      </button>
      <span className="mono" role="status">
        {disabled ? "OVERDRIVE ISTIRAHAT" : ""}
        {!disabled &&
          (boost
            ? "BOOST ACTIVE / LEPAS UNTUK BERHENTI"
            : "TAHAN KLIK / SPACE · MAKS. 3 DETIK")}
      </span>
    </div>
  );
}
