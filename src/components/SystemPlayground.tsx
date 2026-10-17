import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Code2,
  Database,
  Rocket,
  RotateCcw,
  Server,
  Sparkles,
} from "lucide-react";

const nodes = [
  {
    label: "INTERFACE",
    code: "01",
    hint: "Tempat pengguna berinteraksi",
    Icon: Code2,
  },
  {
    label: "API",
    code: "02",
    hint: "Penghubung antarmuka dan logika",
    Icon: Server,
  },
  {
    label: "DATABASE",
    code: "03",
    hint: "Menyimpan data yang terstruktur",
    Icon: Database,
  },
  {
    label: "DEPLOY",
    code: "04",
    hint: "Membawa sistem ke pengguna",
    Icon: Rocket,
  },
];
const initialOrder = [2, 0, 3, 1];

export default function SystemPlayground({ calm }: { calm: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<number[]>([]);
  const placedRef = useRef<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "Pilih modul, lalu pilih slot yang sesuai. Atau drag langsung.",
  );
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    element: HTMLButtonElement;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef<{ id: number; until: number } | null>(null);
  const { contextSafe } = useGSAP({
    scope: root,
    dependencies: [calm],
    revertOnUpdate: true,
  });
  const place = contextSafe((id: number, slot: number) => {
    if (id !== slot) {
      setMessage(
        `Belum cocok. ${nodes[id].label} masuk ke slot ${nodes[id].code}.`,
      );
      if (!calm)
        gsap.fromTo(
          `[data-slot="${slot}"]`,
          { x: -7 },
          { x: 0, duration: 0.4, ease: "elastic.out(1,0.2)", overwrite: true },
        );
      return;
    }
    if (placedRef.current.includes(id)) return;
    const next = [...placedRef.current, id];
    placedRef.current = next;
    setPlaced(next);
    setSelected(null);
    setMessage(
      next.length === 4
        ? "System connected. Kamu baru menyusun satu alur full-stack!"
        : `${nodes[id].label} terhubung. ${next.length} dari 4 modul siap.`,
    );
    if (!calm) {
      gsap.fromTo(
        `[data-slot="${slot}"]`,
        { scale: 0.9 },
        {
          scale: 1,
          duration: 0.65,
          ease: "elastic.out(1,0.4)",
          overwrite: true,
        },
      );
      if (next.length === 4) {
        gsap.fromTo(
          ".system-confetti i",
          { opacity: 1, x: 0, y: 0, scale: 1 },
          {
            x: (i) => Math.cos(i * 2.4) * (90 + i * 5),
            y: (i) => -60 - Math.sin(i * 1.8) * 95,
            rotation: (i) => i * 42,
            opacity: 0,
            scale: 0.3,
            duration: 1.2,
            stagger: 0.015,
            ease: "power2.out",
          },
        );
      }
    }
  });
  const startDrag = (event: PointerEvent<HTMLButtonElement>, id: number) => {
    if (event.button !== 0) return;
    suppressClick.current = null;
    drag.current = {
      id,
      x: event.clientX,
      y: event.clientY,
      element: event.currentTarget,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const active = drag.current;
    if (!active) return;
    const x = event.clientX - active.x,
      y = event.clientY - active.y;
    if (Math.abs(x) + Math.abs(y) > 7) active.moved = true;
    if (active.moved) {
      active.element.style.transform = `translate(${x}px, ${y}px) rotate(-5deg)`;
      active.element.style.zIndex = "20";
    }
  };
  const finishDrag = (
    event: PointerEvent<HTMLButtonElement>,
    cancelled = false,
  ) => {
    const active = drag.current;
    if (!active) return;
    active.element.style.transform = "";
    active.element.style.zIndex = "";
    if (active.element.hasPointerCapture(event.pointerId))
      active.element.releasePointerCapture(event.pointerId);
    drag.current = null;
    if (active.moved) {
      if (cancelled) {
        suppressClick.current = null;
        return;
      }
      suppressClick.current = { id: active.id, until: performance.now() + 500 };
      const slot = [
        ...(root.current?.querySelectorAll<HTMLElement>("[data-slot]") ?? []),
      ].find((el) => {
        const r = el.getBoundingClientRect();
        return (
          event.clientX >= r.left &&
          event.clientX <= r.right &&
          event.clientY >= r.top &&
          event.clientY <= r.bottom
        );
      });
      if (slot) place(active.id, Number(slot.dataset.slot));
      else {
        setSelected(active.id);
        setMessage(
          `Pilih slot ${nodes[active.id].code} untuk ${nodes[active.id].label}.`,
        );
      }
    }
  };
  const reset = () => {
    suppressClick.current = null;
    placedRef.current = [];
    setPlaced([]);
    setSelected(null);
    setMessage("Mulai lagi. Pilih modul, lalu pasangkan dengan slotnya.");
  };
  return (
    <div
      className="system-playground"
      ref={root}
      data-complete={placed.length === 4}
    >
      <div className="playground-heading">
        <div>
          <span className="eyebrow">
            A LITTLE EXPERIMENT / PLAYABLE ARCHITECTURE
          </span>
          <h3>
            MAKE IT <span>CONNECT.</span>
          </h3>
        </div>
        <span
          className="connection-count"
          aria-label={`${placed.length} dari 4 modul terhubung`}
        >
          {String(placed.length).padStart(2, "0")}
          <small>/04</small>
        </span>
      </div>
      <p className="playground-intro">
        Dari antarmuka sampai deployment. Coba rakit alurnya sendiri.
      </p>
      <div className="system-slots">
        {nodes.map(({ label, code, hint, Icon }, i) => (
          <button
            type="button"
            className={`system-slot ${placed.includes(i) ? "connected" : ""}`}
            data-slot={i}
            key={label}
            aria-label={`Slot ${code}: ${label}${placed.includes(i) ? ", terhubung" : ""}`}
            aria-disabled={placed.includes(i)}
            onClick={() => {
              if (placed.includes(i)) return;
              if (selected === null)
                setMessage("Pilih salah satu modul di bawah terlebih dahulu.");
              else place(selected, i);
            }}
          >
            <span className="slot-number">{code}</span>
            <Icon size={26} />
            <strong>{placed.includes(i) ? label : hint}</strong>
            <small>
              {placed.includes(i) ? "CONNECTED ✓" : "DROP MODULE HERE"}
            </small>
          </button>
        ))}
      </div>
      <div className="system-tray" aria-label="Modul untuk dirakit">
        {initialOrder.map((id) => {
          const { Icon, label, code } = nodes[id];
          return (
            <button
              type="button"
              key={id}
              className={`system-module ${selected === id ? "is-selected" : ""}`}
              disabled={placed.includes(id)}
              aria-pressed={selected === id}
              onPointerDown={(e) => startDrag(e, id)}
              onPointerMove={moveDrag}
              onPointerUp={(e) => finishDrag(e)}
              onPointerCancel={(e) => finishDrag(e, true)}
              onClick={(event) => {
                if (
                  event.detail > 0 &&
                  suppressClick.current?.id === id &&
                  performance.now() < suppressClick.current.until
                ) {
                  suppressClick.current = null;
                  return;
                }
                setSelected(id);
                setMessage(`${label} dipilih. Sekarang pilih slot ${code}.`);
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
              <small>{code}</small>
            </button>
          );
        })}
      </div>
      <div className="playground-bottom">
        <p role="status">
          <Sparkles size={14} />
          {message}
        </p>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Main lagi
        </button>
      </div>
      <div className="system-confetti" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
    </div>
  );
}
