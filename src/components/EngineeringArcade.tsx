import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useVisibleActivity } from "../hooks/useVisibleActivity";

function KrsSimulator({
  calm,
  onComplete,
}: {
  calm: boolean;
  onComplete: () => void;
}) {
  const { ref, active } = useVisibleActivity<HTMLDivElement>();
  const [load, setLoad] = useState(180);
  const [cache, setCache] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [running, setRunning] = useState(true);
  const [queue, setQueue] = useState(0);
  const capacity = 100 + (cache ? 180 : 0) + (indexed ? 140 : 0);
  const overloaded = load > capacity;
  const animating = active && running && !calm;
  useEffect(() => {
    if (!active || !running) return;
    const id = window.setInterval(
      () =>
        setQueue((q) => Math.max(0, Math.min(999, q + (load - capacity) / 2))),
      500,
    );
    return () => window.clearInterval(id);
  }, [active, running, load, capacity]);
  useEffect(() => {
    if (cache && indexed && load === 400 && queue === 0) onComplete();
  }, [cache, indexed, load, queue, onComplete]);
  return (
    <div
      className={`krs-simulator ${animating ? "experiment-running" : "experiment-paused"}`}
      ref={ref}
    >
      <div className="arcade-intro">
        <span className="mono">01 / KEEP THE CAMPUS RUNNING</span>
        <h3>KRS WAR ROOM.</h3>
        <p>
          Jam 08.00. Semua mahasiswa masuk bersamaan. Naikkan beban, aktifkan
          optimasi, lalu selamatkan antreannya.
        </p>
      </div>
      <div className="sim-flow" aria-hidden="true">
        <div className="sim-endpoint">
          <span>↗</span>MAHASISWA
        </div>
        <div
          className={`request-stream ${overloaded ? "congested" : ""}`}
          style={
            {
              "--flow-speed": `${Math.max(0.5, 2 - load / 300)}s`,
            } as CSSProperties
          }
        >
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
        <div className={`sim-server ${overloaded ? "server-busy" : ""}`}>
          <span>
            BF
            <span className="server-led" />
          </span>
          ACADEMIC API
        </div>
        <div className="sim-storage">
          <span>{cache ? "REDIS ✓" : "REDIS —"}</span>
          <span>{indexed ? "INDEX ✓" : "INDEX —"}</span>
        </div>
      </div>
      <div className="sim-dashboard">
        <div>
          <small>BEBAN / DETIK</small>
          <strong>
            {load}
            <span> req</span>
          </strong>
        </div>
        <div>
          <small>KAPASITAS MODEL</small>
          <strong>
            {capacity}
            <span> req/s</span>
          </strong>
        </div>
        <div>
          <small>ANTREAN SIMULASI</small>
          <strong className={queue > 0 ? "text-orange" : "text-lime"}>
            {Math.round(queue)}
            {queue >= 999 ? "+" : ""}
          </strong>
        </div>
      </div>
      <div className="sim-controls">
        <label>
          BEBAN MASUK
          <input
            aria-label="Beban request KRS"
            type="range"
            min="40"
            max="500"
            step="20"
            value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
          />
        </label>
        <div className="arcade-button-row">
          {[
            ["Normal", 80],
            ["Jam KRS", 260],
            ["Traffic spike", 400],
          ].map(([name, value]) => (
            <button
              key={name}
              type="button"
              aria-pressed={load === value}
              onClick={() => setLoad(Number(value))}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="arcade-button-row">
          <button
            type="button"
            aria-pressed={cache}
            onClick={() => setCache(!cache)}
          >
            Redis cache {cache ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            aria-pressed={indexed}
            onClick={() => setIndexed(!indexed)}
          >
            Database index {indexed ? "ON" : "OFF"}
          </button>
          <button type="button" onClick={() => setRunning(!running)}>
            {running ? "Jeda simulasi" : "Lanjut simulasi"}
          </button>
          <button
            type="button"
            onClick={() => {
              setLoad(180);
              setCache(false);
              setIndexed(false);
              setQueue(0);
              setRunning(true);
            }}
          >
            Reset KRS ↺
          </button>
        </div>
      </div>
      <p
        className={`experiment-status ${overloaded ? "text-orange" : "text-lime"}`}
        role="status"
      >
        {!running
          ? "SIMULASI DIJEDA"
          : overloaded
            ? "BOTTLENECK — permintaan lebih cepat daripada pemrosesan."
            : "FLOW STABLE — kapasitas cukup untuk menguras antrean."}
      </p>
      <p className="arcade-mission">
        MISI: tangani Traffic spike 400 req/s dengan kedua optimasi dan
        kosongkan antrean.{" "}
        <small>
          Model edukatif dengan angka buatan; bukan benchmark sistem produksi.
          Antrean ditampilkan hingga 999+.
        </small>
      </p>
    </div>
  );
}

const bugs = [
  {
    title: "Satu SKS terlalu banyak",
    context:
      "Mahasiswa punya 21 SKS. Batasnya 24. Ia menambah mata kuliah 4 SKS.",
    code: "if (currentSks <= maxSks) {\n  enroll(course);\n}",
    choices: [
      "Naikkan maxSks menjadi 25",
      "Periksa currentSks + course.sks <= maxSks",
      "Hapus validasi SKS",
    ],
    answer: 1,
    explanation:
      "Validasi total setelah penambahan: 21 + 4 = 25. Permintaan ditolak karena melewati batas 24 SKS.",
    fixed: "if (currentSks + course.sks <= maxSks) {\n  enroll(course);\n}",
  },
  {
    title: "Cache salah pemilik",
    context:
      "Dua mahasiswa membuka jadwal. Keduanya mendapatkan cache dengan kunci yang sama.",
    code: 'const key = "student:schedule";\nreturn cache.remember(key, loadSchedule);',
    choices: [
      "Gunakan key dengan studentId dan semesterId",
      "Perpanjang TTL cache",
      "Ubah nama key menjadi jadwal",
    ],
    answer: 0,
    explanation:
      "Sertakan identitas mahasiswa dan semester agar data tidak tertukar. Pemeriksaan otorisasi tetap diperlukan sebelum membaca jadwal.",
    fixed:
      "const key = `schedule:${studentId}:${semesterId}`;\nreturn cache.remember(key, loadSchedule);",
  },
  {
    title: "Kursi terakhir direbut",
    context:
      "Dua request membaca sisa 1 kursi bersamaan. Keduanya lolos pengecekan lalu mendaftar.",
    code: "if (course.seats > 0) {\n  enroll(student);\n  course.seats--;\n}",
    choices: [
      "Tambahkan delay 1 detik",
      "Periksa kursi di browser saja",
      "Transaksi + kunci row, cek ulang, lalu simpan",
    ],
    answer: 2,
    explanation:
      "Kunci row dalam transaksi menserialkan perubahan pada kursi tersebut. Cek ulang kapasitas, simpan pendaftaran, dan kurangi kursi dalam transaksi yang sama.",
    fixed:
      "transaction(() => {\n  const course = lockCourseRow(courseId);\n  if (course.seats > 0) enrollAndDecrement(course);\n});",
  },
];
function DebugChallenge({ onComplete }: { onComplete: () => void }) {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const question = bugs[round];
  const correct = choice === question.answer;
  return (
    <div className={`debug-challenge ${correct ? "debug-fixed" : ""}`}>
      <div className="arcade-intro">
        <span className="mono">02 / THINK. FIX. SHIP.</span>
        <h3>BREAKPOINT.</h3>
        <p>
          Tiga bug kecil. Dampaknya bisa satu kampus. Temukan perbaikan yang
          masuk akal.
        </p>
      </div>
      <div
        className="debug-progress"
        aria-label={`Tantangan ${round + 1} dari 3`}
      >
        {bugs.map((bug, i) => (
          <span
            key={bug.title}
            className={
              i < round || (i === round && correct)
                ? "complete"
                : i === round
                  ? "current"
                  : ""
            }
          >
            0{i + 1} {i < round || (i === round && correct) ? "✓" : "•"}
          </span>
        ))}
      </div>
      <div className="debug-grid">
        <div className="debug-code">
          <div>
            <span className={correct ? "text-lime" : "text-orange"}>
              {correct ? "PATCH APPLIED ●" : "BUG DETECTED ●"}
            </span>
            <span>CONCEPTUAL CODE</span>
          </div>
          <pre>
            <code>{correct ? question.fixed : question.code}</code>
          </pre>
          <div className="debug-scan" aria-hidden="true" />
        </div>
        <div className="debug-question">
          <h4>{question.title}</h4>
          <p>{question.context}</p>
          <div className="debug-options">
            {question.choices.map((answer, i) => (
              <button
                key={answer}
                type="button"
                disabled={correct}
                aria-pressed={choice === i}
                onClick={() => {
                  setChoice(i);
                  if (i === question.answer && round === 2) {
                    setSolved(true);
                    onComplete();
                  }
                }}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {answer}
                {choice === i && (correct ? " ✓" : " ×")}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="debug-feedback" role="status">
        {choice === null
          ? "Pilih patch untuk melihat hasilnya."
          : correct
            ? question.explanation
            : "Bug belum teratasi. Coba telusuri perubahan data dan siapa yang membacanya."}
      </div>
      <div className="arcade-button-row">
        {correct && round < 2 && (
          <button
            className="arcade-primary"
            type="button"
            onClick={() => {
              setRound(round + 1);
              setChoice(null);
            }}
          >
            Bug berikutnya ↗
          </button>
        )}
        {solved && (
          <strong className="text-lime">3 / 3 — READY TO SHIP.</strong>
        )}
        <button
          type="button"
          onClick={() => {
            setRound(0);
            setChoice(null);
            setSolved(false);
          }}
        >
          Ulangi challenge ↺
        </button>
      </div>
    </div>
  );
}

const campusModules = [
  {
    name: "KRS",
    tag: "ACADEMIC ENGINE",
    description:
      "Pemilihan mata kuliah, batas SKS, dan pemeriksaan bentrok jadwal.",
    x: 24,
    y: 28,
  },
  {
    name: "LMS",
    tag: "LEARNING SPACE",
    description:
      "Materi, tugas, dan aktivitas belajar terhubung dengan kelas mahasiswa.",
    x: 73,
    y: 24,
  },
  {
    name: "PAYMENTS",
    tag: "FINANCE GATEWAY",
    description:
      "Contoh integrasi status pembayaran dan akses layanan akademik.",
    x: 23,
    y: 72,
  },
  {
    name: "PDDIKTI",
    tag: "REPORTING BRIDGE",
    description:
      "Validasi dan sinkronisasi data akademik ke layanan pelaporan.",
    x: 75,
    y: 72,
  },
];
function CampusBuilder({
  calm,
  onComplete,
}: {
  calm: boolean;
  onComplete: () => void;
}) {
  const { ref, active } = useVisibleActivity<HTMLDivElement>();
  const [enabled, setEnabled] = useState<number[]>([0]);
  const [focused, setFocused] = useState(0);
  function toggle(i: number) {
    const next = enabled.includes(i)
      ? enabled.filter((v) => v !== i)
      : [...enabled, i];
    setEnabled(next);
    setFocused(i);
    if (next.length === 4) onComplete();
  }
  return (
    <div
      ref={ref}
      className={`campus-builder ${active && !calm ? "campus-active" : ""}`}
    >
      <div className="arcade-intro">
        <span className="mono">03 / YOUR CAMPUS. YOUR SYSTEM.</span>
        <h3>BUILD A CAMPUS.</h3>
        <p>
          Nyalakan layanan satu per satu. Lihat bagaimana sebuah kampus menjadi
          ekosistem yang terhubung.
        </p>
      </div>
      <div className="campus-layout">
        <div
          className="campus-map"
          role="img"
          aria-label={`Diagram kampus dengan ${enabled.length} layanan aktif: ${enabled.map((i) => campusModules[i].name).join(", ") || "belum ada"}`}
        >
          <img src="/assets/academic-ecosystem.jpg" loading="lazy" alt="" />
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {campusModules.map((m, i) => (
              <path
                key={m.name}
                d={`M 50 50 L ${m.x} 50 L ${m.x} ${m.y}`}
                className={enabled.includes(i) ? "connected" : ""}
              />
            ))}
          </svg>
          <div className="campus-hub">
            CAMPUS<span>CORE</span>
          </div>
          {campusModules.map((m, i) => (
            <div
              key={m.name}
              className={`campus-node ${enabled.includes(i) ? "online" : ""}`}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <span>{enabled.includes(i) ? "●" : "○"}</span>
              {m.name}
            </div>
          ))}
          <span className="campus-map-label">
            CONCEPTUAL ECOSYSTEM / {enabled.length.toString().padStart(2, "0")}{" "}
            ONLINE
          </span>
        </div>
        <div className="campus-switches">
          {campusModules.map((m, i) => (
            <button
              key={m.name}
              type="button"
              aria-pressed={enabled.includes(i)}
              onClick={() => toggle(i)}
            >
              <span>
                <small>{m.tag}</small>
                {m.name}
              </span>
              <span className="campus-switch" aria-hidden="true">
                <i />
              </span>
            </button>
          ))}
          <div className="campus-detail" role="status">
            <span className="text-lime">
              {campusModules[focused].name} /{" "}
              {enabled.includes(focused) ? "ONLINE" : "OFFLINE"}
            </span>
            <p>{campusModules[focused].description}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEnabled([]);
              setFocused(0);
            }}
          >
            Reset kampus ↺
          </button>
        </div>
      </div>
      <p className="arcade-mission">
        MISI: hubungkan keempat layanan.{" "}
        <small>
          Eksperimen arsitektur konseptual, bukan tampilan atau klaim fitur
          produk tertentu.
        </small>
      </p>
    </div>
  );
}

export default function EngineeringArcade({ calm }: { calm: boolean }) {
  const [tab, setTab] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = ["KRS WAR ROOM", "DEBUG CHALLENGE", "BUILD YOUR CAMPUS"];
  const complete = (id: number) =>
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  return (
    <section id="arcade" className="engineering-arcade section-shell">
      <div className="section-label">
        <span className="eyebrow">SIDE QUEST / ENGINEERING ARCADE</span>
        <span className="mono" role="status">
          {completed.length} / 3 MISSIONS COMPLETED
        </span>
      </div>
      <div className="arcade-heading">
        <h2>
          LESS SCROLL.
          <br />
          <span className="text-lime">MORE PLAY.</span>
        </h2>
        <p>
          Masuk ke ruang eksperimen.
          <br />
          Utak-atik sistemnya. Temukan polanya.
          <br />
          Setiap klik punya konsekuensi.
        </p>
      </div>
      <div
        className="arcade-tabs"
        role="tablist"
        aria-label="Eksperimen engineering"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`arcade-tab-${i}`}
            role="tab"
            aria-selected={tab === i}
            aria-controls={`arcade-panel-${i}`}
            tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === "ArrowRight") next = (i + 1) % 3;
              else if (e.key === "ArrowLeft") next = (i + 2) % 3;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 2;
              else return;
              e.preventDefault();
              setTab(next);
              tabs.current[next]?.focus();
            }}
          >
            <span>0{i + 1}</span>
            {label}
            <span>{completed.includes(i) ? "✓" : "↗"}</span>
          </button>
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          id={`arcade-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`arcade-tab-${i}`}
          hidden={tab !== i}
          tabIndex={0}
          className="arcade-panel"
        >
          {i === 0 ? (
            <KrsSimulator calm={calm} onComplete={() => complete(0)} />
          ) : i === 1 ? (
            <DebugChallenge onComplete={() => complete(1)} />
          ) : (
            <CampusBuilder calm={calm} onComplete={() => complete(2)} />
          )}
        </div>
      ))}
      <div className="arcade-bottom">
        <span>NO HIGH SCORE. JUST GOOD SYSTEMS.</span>
        <a href="#contact">Punya tantangan sungguhan? Let’s talk ↗</a>
      </div>
    </section>
  );
}
