import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
type Line = { command: string; output: string };
const initial: Line = {
  command: "",
  output:
    "BAYU.OS v1.0 — portfolio playground\nKetik help untuk menjelajah. Tidak terhubung ke shell atau server.",
};
export default function SecretTerminal() {
  const dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null),
    log = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false),
    [value, setValue] = useState(""),
    [lines, setLines] = useState<Line[]>([initial]),
    [history, setHistory] = useState<string[]>([]),
    [cursor, setCursor] = useState(-1);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if (e.key !== "~" || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input,textarea,select,[contenteditable=true],dialog"))
        return;
      e.preventDefault();
      setOpen(true);
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    input.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.current?.close();
      document.body.style.overflow = overflow;
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect(() => {
    log.current?.scrollTo({
      top: log.current.scrollHeight,
      behavior: "instant",
    });
  }, [lines]);
  const jump = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "instant", block: "start" });
      if (el) {
        el.tabIndex = -1;
        el.focus({ preventScroll: true });
      }
    });
  };
  function run() {
    const raw = value.trim();
    if (!raw) return;
    const command = raw.toLowerCase().replace(/\s+/g, " ");
    setHistory((h) => [...h, raw].slice(-30));
    setCursor(-1);
    setValue("");
    if (command === "clear") {
      setLines([initial]);
      return;
    }
    let output = "";
    switch (command) {
      case "help":
        output =
          "help       Daftar perintah\nwhoami     Tentang Bayu\nprojects   Menuju studi kasus\nplay       Buka engineering arcade\nstack      Jelajahi skill\ncontact    Menuju kontak\nsudo hire bayu   Mulai percakapan\nclear      Bersihkan layar\nexit       Tutup terminal\n↑ / ↓      Riwayat perintah";
        break;
      case "whoami":
        output =
          "Bayu Firmansyah\nSenior Full Stack Developer / Edutech Solution Architect\nSurabaya, Indonesia. Complex systems. Clear solutions.";
        break;
      case "projects":
        jump("work");
        return;
      case "play":
        jump("arcade");
        return;
      case "stack":
        jump("stack");
        return;
      case "contact":
        jump("contact");
        return;
      case "sudo hire bayu":
        output = `Permission granted. Good conversations need no sudo.\nEmail: ${profile.email}\nKlik “Mulai percakapan” di bawah untuk membuka aplikasi email.`;
        break;
      case "exit":
        setOpen(false);
        return;
      default:
        output = `Perintah “${raw.slice(0, 80)}” belum dikenal. Ketik help.`;
    }
    setLines((prev) => [...prev, { command: raw, output }].slice(-30));
  }
  return (
    <>
      <button
        type="button"
        className="terminal-launch"
        onClick={() => setOpen(true)}
        aria-label="Buka terminal rahasia"
      >
        <span>&gt;_</span>
        <span>
          TERMINAL <kbd>~</kbd>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="secret-terminal"
        aria-labelledby="terminal-title"
        data-lenis-prevent
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="terminal-top">
          <h2 id="terminal-title">
            <span>●</span> BAYU.OS / TERMINAL
          </h2>
          <button
            type="button"
            aria-label="Tutup terminal"
            onClick={() => setOpen(false)}
          >
            ESC ×
          </button>
        </div>
        <div
          className="terminal-log"
          ref={log}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {lines.map((line, i) => (
            <div key={i}>
              {line.command && (
                <p className="terminal-command">
                  bayu@portfolio:~$ {line.command}
                </p>
              )}
              <pre>{line.output}</pre>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <label htmlFor="terminal-input">bayu@portfolio:~$</label>
          <input
            ref={input}
            id="terminal-input"
            aria-label="Perintah terminal"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={160}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
              e.preventDefault();
              const next =
                e.key === "ArrowUp"
                  ? Math.min(history.length - 1, cursor + 1)
                  : Math.max(-1, cursor - 1);
              setCursor(next);
              setValue(
                next < 0 ? "" : history[history.length - 1 - next] || "",
              );
            }}
          />
          <button type="submit" aria-label="Jalankan perintah">
            ↵
          </button>
        </form>
        <div className="terminal-shortcuts">
          <button type="button" onClick={() => jump("arcade")}>
            Buka arcade ↗
          </button>
          <a href={`mailto:${profile.email}`}>Mulai percakapan ↗</a>
        </div>
      </dialog>
    </>
  );
}
