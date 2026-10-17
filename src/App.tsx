import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { profile, projects, experience, skillGroups } from "./data/profile";
import type { Project } from "./data/profile";
import { useMotion } from "./hooks/useMotion";
import ProjectVisual from "./components/ProjectVisual";
import Lab from "./components/Lab";

function Brand() {
  return (
    <span className="brand" aria-label="Bayu Firmansyah">
      b<span>f</span>
      <i />
    </span>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!project) return;
    const node = dialog.current;
    node?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      node?.close();
      document.body.style.overflow = previous;
    };
  }, [project]);
  return (
    <dialog
      className="project-dialog"
      ref={dialog}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="project-title"
      data-lenis-prevent
    >
      {project && (
        <div className="dialog-content">
          <button
            type="button"
            className="dialog-close icon-button"
            onClick={onClose}
            aria-label="Tutup detail proyek"
            autoFocus
          >
            <X />
          </button>
          <span className="eyebrow">SELECTED WORK / {project.number}</span>
          <h2 id="project-title">{project.name}</h2>
          <p className="dialog-type">{project.type}</p>
          <ProjectVisual id={project.id} large />
          <div className="dialog-body">
            <div>
              <h3>Tantangan</h3>
              <p>{project.challenge}</p>
              <h3>Kontribusi saya</h3>
              <ul>
                {project.contribution.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <h3>Hasil</h3>
              <p>{project.outcome}</p>
            </div>
            <aside>
              <span className="eyebrow">CONTEXT</span>
              <p>
                PT Sentra Vidya Utama
                <br />
                (SEVIMA)
              </p>
              <span className="eyebrow">FOCUS</span>
              <div className="tags">
                {project.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <small>
                Ringkasan berdasarkan CV Februari 2026. Visual merupakan
                ilustrasi sistem, bukan antarmuka produk asli.
              </small>
              <a
                className="text-link"
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Diskusi proyek — " + project.name)}`}
              >
                Diskusikan proyek serupa <ArrowUpRight size={16} />
              </a>
            </aside>
          </div>
        </div>
      )}
    </dialog>
  );
}

function App() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scope = useMotion(ready);
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const advance = () => {
      loaded++;
      if (!cancelled) setProgress(loaded * 50);
    };
    const asset = new Image();
    const imageReady = new Promise<void>((resolve) => {
      asset.onload = () => resolve();
      asset.onerror = () => resolve();
      asset.src = "/assets/developer-workspace.jpg";
    });
    const failSafe = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 6000);
    Promise.all([
      imageReady.then(advance),
      document.fonts.ready.then(advance),
    ]).then(() => {
      if (!cancelled) setReady(true);
      clearTimeout(failSafe);
    });
    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      asset.onload = null;
      asset.onerror = null;
    };
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }
  const nav = [
    ["Tentang", "#about"],
    ["Karya", "#work"],
    ["Perjalanan", "#journey"],
  ];
  return (
    <div ref={scope}>
      {!ready && (
        <div
          className="preloader"
          role="status"
          aria-label="Memuat visual dan tipografi"
        >
          <Brand />
          <div>
            <span className="eyebrow">INITIALIZING EXPERIENCE</span>
            <strong>
              {String(progress).padStart(2, "0")}
              <small>%</small>
            </strong>
            <div className="loading-track">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="mono">ENGINEERED TO PERFORM.</span>
        </div>
      )}
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>
      <header className="site-header">
        <a href="#home" aria-label="Bayu Firmansyah — beranda">
          <Brand />
        </a>
        <a href="#home" className="header-name">
          BAYU FIRMANSYAH<span>DEVELOPER / ARCHITECT</span>
        </a>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="#contact">
          LET’S TALK <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button icon-button"
          type="button"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Navigasi mobile"
          >
            {[...nav, ["Kontak", "#contact"]].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight />
              </a>
            ))}
          </nav>
        )}
      </header>
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-scroll-story" aria-hidden="true">
            <div className="story-line story-line-one">
              BUILD SYSTEMS. BUILD IMPACT.
            </div>
            <div className="story-line story-line-two">
              FROM COMPLEXITY TO CLARITY.
            </div>
            <span className="story-caption">
              FULL STACK DEVELOPER / EDUTECH SOLUTION ARCHITECT
            </span>
          </div>
          <div className="hero-media">
            <div className="hero-parallax">
              <img
                className="hero-art"
                src="/assets/developer-workspace.jpg"
                alt=""
                fetchPriority="high"
                width="1672"
                height="941"
              />
            </div>
          </div>
          <div className="hero-glyph" aria-hidden="true">
            <svg viewBox="0 0 240 170" fill="none">
              <path
                d="M66 45 20 85 66 125 M145 15 95 155 M174 45 220 85 174 125"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
              />
            </svg>
            <span>TURNING IDEAS INTO SYSTEMS.</span>
          </div>
          <div className="hero-shade" />
          <div className="hero-top hero-reveal">
            <span className="eyebrow">
              <span className="status-dot" /> SENIOR FULL STACK DEVELOPER
            </span>
            <span className="hero-edition mono">
              PERSONAL PORTFOLIO
              <br />
              VOL. 01 / 2026
            </span>
          </div>
          <h1 className="hero-title">
            <span className="hero-line">
              <span className="hero-word">BAYU</span>
            </span>
            <span className="hero-line">
              <span className="hero-word">
                FIRMANSYAH<span className="name-period">.</span>
              </span>
            </span>
          </h1>
          <div className="hero-bottom hero-reveal">
            <div>
              <div className="hero-subtitle">
                <span className="tiny-cross">✳</span>
                <p>
                  ENGINEERED
                  <br />
                  TO <em>PERFORM.</em>
                </p>
              </div>
              <p className="hero-description">
                Sistem akademik. API mobile. Performa dalam skala besar.
                <br />
                Engineering yang menghubungkan teknologi dan pendidikan.
              </p>
            </div>
            <a className="round-link" href="#work">
              <span>
                EXPLORE
                <br />
                MY WORK
              </span>
              <span className="round-arrow">
                <ArrowDownRight size={30} />
              </span>
            </a>
          </div>
          <div className="hero-interaction-hint mono" aria-hidden="true">
            MOVE TO EXPLORE · SCROLL TO TRANSFORM
          </div>
          <div className="hero-scroll-meter" aria-hidden="true">
            <i />
          </div>
          <div className="hero-foot">
            <span>
              SURABAYA, INDONESIA <span className="text-lime">↗</span>
            </span>
            <span>EDUTECH SOLUTION ARCHITECT</span>
            <a href="#about">
              SCROLL TO DISCOVER <ArrowDown size={13} />
            </a>
          </div>
        </section>
        <div className="skills-strip" aria-label="Teknologi utama">
          <span>LARAVEL</span>
          <i>✳</i>
          <span>REACT</span>
          <i>✳</i>
          <span>TYPESCRIPT</span>
          <i>✳</i>
          <span>POSTGRESQL</span>
          <i>✳</i>
          <span>NODE.JS</span>
          <i>✳</i>
          <span>DOCKER</span>
          <i>✳</i>
          <span>REDIS</span>
        </div>
        <section id="about" className="about section-shell">
          <div className="section-label">
            <span className="eyebrow">01 / THE PERSON BEHIND THE CODE</span>
            <span className="mono">[ A LITTLE ABOUT ME ]</span>
          </div>
          <div className="about-layout">
            <h2 data-reveal>
              COMPLEX
              <br />
              SYSTEMS.
              <br />
              <span>
                CLEAR
                <br />
                SOLUTIONS.
              </span>
            </h2>
            <div className="about-copy" data-reveal>
              <span className="about-symbol">↗</span>
              <h3>
                Halo, saya Bayu.
                <br />
                Developer dengan cara pikir arsitek.
              </h3>
              <p>{profile.summary}</p>
              <p>
                Fokus saya ada di dunia pendidikan: membangun fondasi digital
                yang membantu kampus, dosen, dan mahasiswa bergerak lebih jauh.
              </p>
              <a className="dark-link" href={profile.cv} download>
                KENALI SAYA LEBIH JAUH <Download size={17} />
              </a>
            </div>
          </div>
          <div className="stats" data-reveal>
            <div>
              <strong>
                1.200<span>+</span>
              </strong>
              <span>
                UNIVERSITAS DALAM EKOSISTEM
                <br />
                SIAKADCLOUD & EDLINK
              </span>
            </div>
            <div>
              <strong>
                40<span>%</span>
              </strong>
              <span>
                PENINGKATAN RESPONSE TIME
                <br />
                MELALUI OPTIMASI SISTEM
              </span>
            </div>
            <div>
              <strong>05</strong>
              <span>
                TAHUN PENGALAMAN
                <br />
                SEBAGAIMANA TERCATAT DI CV
              </span>
            </div>
          </div>
          <div className="about-foot mono">
            <span>BUILT WITH PURPOSE. DRIVEN BY IMPACT.</span>
            <span>DATA: CV FEBRUARI 2026</span>
          </div>
        </section>
        <section id="work" className="work section-shell">
          <div className="section-label">
            <span className="eyebrow">02 / SELECTED WORK</span>
            <span className="mono">REAL CHALLENGES. REAL SYSTEMS.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              ON THE
              <br />
              <span className="text-lime">BUILD.</span>
            </h2>
            <p>
              Kontribusi engineering di SEVIMA.
              <br />
              Sistem akademik, pengalaman belajar,
              <br />
              dan integrasi data pendidikan.
            </p>
            <ArrowDownRight className="heading-arrow" />
          </div>
          <div className="project-grid">
            {projects.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`project project-${p.id}`}
                onClick={() => setProject(p)}
                aria-label={`Lihat studi kasus ${p.name}`}
                data-reveal
              >
                <ProjectVisual id={p.id} />
                <div className="project-meta">
                  <span className="eyebrow">
                    {p.number} / {p.type}
                  </span>
                  <ArrowUpRight size={22} />
                </div>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="tags">
                  {p.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <p className="work-note">
            Kontribusi profesional di SEVIMA · Visual konseptual untuk
            menjelaskan sistem.
          </p>
        </section>
        <section className="dual-section">
          <a className="dual-panel build-panel" href="#stack">
            <span className="eyebrow">THE CRAFT / 01</span>
            <Code2 className="dual-art" strokeWidth={0.7} />
            <div>
              <h2>
                ON
                <br />
                <span>CODE.</span>
              </h2>
              <p>
                Arsitektur, implementasi, optimasi.
                <br />
                Membangun sistem dari dalam ke luar.
              </p>
              <span className="panel-cta">
                EXPLORE THE STACK <ArrowUpRight />
              </span>
            </div>
          </a>
          <a className="dual-panel mentor-panel" href="#journey">
            <span className="eyebrow">THE MENTOR / 02</span>
            <span className="mentor-art" aria-hidden="true">
              “
            </span>
            <div>
              <h2>
                BEYOND
                <br />
                <span>CODE.</span>
              </h2>
              <p>
                Berbagi cara berpikir, bukan sekadar sintaks.
                <br />
                Dari membangun produk ke membimbing developer.
              </p>
              <span className="panel-cta">
                THE MENTORING JOURNEY <ArrowUpRight />
              </span>
            </div>
          </a>
        </section>
        <Lab />
        <section id="stack" className="stack section-shell">
          <div className="section-label">
            <span className="eyebrow">04 / THE TOOLKIT</span>
            <span className="mono">PURPOSE-BUILT. END TO END.</span>
          </div>
          <div className="stack-layout">
            <h2 data-reveal>
              THE RIGHT
              <br />
              TOOLS.
              <br />
              <span className="text-muted">NO SHORTCUTS.</span>
            </h2>
            <div className="skill-groups">
              {skillGroups.map((group, index) => (
                <details key={group.name} open={index === 0}>
                  <summary>
                    <span className="skill-index">0{index + 1}</span>
                    <span>
                      <small>{group.subtitle}</small>
                      {group.name}
                    </span>
                    <ChevronRight size={20} />
                  </summary>
                  <div className="skill-list">
                    {group.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="journey" className="journey section-shell">
          <div className="section-label">
            <span className="eyebrow">05 / THE TRACK RECORD</span>
            <span className="mono">EVERY CHAPTER BUILDS THE NEXT.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              ALWAYS
              <br />
              MOVING <span className="text-lime">FORWARD.</span>
            </h2>
          </div>
          <div className="career-list">
            {experience.map((e, i) => (
              <article className="career-row" key={e.company} data-reveal>
                <span className="career-year">
                  {e.year}
                  <small>0{i + 1}</small>
                </span>
                <div className="career-content">
                  <span className="eyebrow">
                    {e.period}{" "}
                    <span className="career-location">/ {e.location}</span>
                  </span>
                  <h3>{e.company}</h3>
                  <h4>{e.role}</h4>
                  <p>{e.detail}</p>
                </div>
                <ArrowUpRight className="career-arrow" size={30} />
              </article>
            ))}
          </div>
          <p className="career-note">
            *Status “sekarang” mengikuti CV Februari 2026.
          </p>
          <div className="education">
            <span className="eyebrow">THE FOUNDATION / EDUCATION</span>
            <div>
              <h4>Asia Cyber University</h4>
              <p>B.Sc., Information Technology</p>
              <small>2022 — SEKARANG*</small>
            </div>
            <div>
              <h4>SMK Negeri 4 Malang</h4>
              <p>Software Engineering</p>
              <small>2019 — 2022</small>
            </div>
          </div>
        </section>
        <section className="domain section-shell">
          <span className="eyebrow">06 / DOMAIN EXPERTISE</span>
          <div className="domain-heading">
            <h2>
              BUILT FOR
              <br />
              <span>EDUCATION.</span>
            </h2>
            <p>
              Logika KRS, data mahasiswa, pembayaran,
              <br />
              dan pelaporan nasional — dirancang
              <br />
              sebagai satu ekosistem yang terhubung.
            </p>
          </div>
          <div className="domain-rows">
            {[
              [
                "01",
                "Academic core",
                "KRS · Kurikulum · Penilaian · IPK · Siklus mahasiswa",
              ],
              [
                "02",
                "Finance & payment",
                "Manajemen biaya kuliah · Payment gateway · Virtual account",
              ],
              [
                "03",
                "Learning experience",
                "Kelas digital · Tugas · Kuis · Diskusi real-time",
              ],
              [
                "04",
                "National compliance",
                "PDDIKTI · Feeder Web Service · Sinkronisasi data",
              ],
            ].map(([n, name, detail]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{name}</h3>
                <p>{detail}</p>
                <ArrowUpRight size={20} />
              </div>
            ))}
          </div>
        </section>
        <section id="contact" className="contact section-shell">
          <div className="section-label">
            <span className="eyebrow">07 / YOUR NEXT CHAPTER</span>
            <a href={profile.cv} download className="text-link">
              DOWNLOAD CV <Download size={15} />
            </a>
          </div>
          <div className="contact-intro">
            <span className="status-dot" />
            <span>HAVE A CHALLENGE IN MIND?</span>
          </div>
          <a className="contact-title" href={`mailto:${profile.email}`}>
            <h2>
              LET’S BUILD
              <br />
              <span>WHAT’S NEXT.</span>
            </h2>
            <ArrowUpRight />
          </a>
          <div className="contact-bottom">
            <p>
              Punya sistem kompleks untuk dibangun?
              <br />
              Mari mulai dari percakapan yang sederhana.
            </p>
            <div className="email-block">
              <a href={`mailto:${profile.email}`}>
                {profile.email}
                <ArrowUpRight size={17} />
              </a>
              <button type="button" onClick={copyEmail} aria-live="polite">
                {copied ? "EMAIL TERSALIN ✓" : "SALIN ALAMAT EMAIL"}
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer section-shell">
        <div className="footer-top">
          <a href="#home" aria-label="Kembali ke awal">
            <Brand />
          </a>
          <span>
            PRECISION IN CODE.
            <br />
            PURPOSE IN EVERY BUILD.
          </span>
          <div className="footer-socials">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LINKEDIN <ExternalLink size={13} />
            </a>
            <a href={profile.website} target="_blank" rel="noreferrer">
              UBAY.TECH <ExternalLink size={13} />
            </a>
          </div>
          <a href="#home" className="back-top" aria-label="Kembali ke atas">
            <ArrowUp size={20} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} BAYU FIRMANSYAH</span>
          <span>SURABAYA, INDONESIA</span>
          <span>
            CONTENT BASED ON CV · FEB 2026 <ArrowRight size={11} />
          </span>
        </div>
      </footer>
      <ProjectDialog project={project} onClose={() => setProject(null)} />
    </div>
  );
}
export default App;
