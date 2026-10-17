import {
  ArrowUpRight,
  BookOpen,
  Database,
  GraduationCap,
  Play,
  ShieldCheck,
} from "lucide-react";
export default function ProjectVisual({
  id,
  large = false,
}: {
  id: string;
  large?: boolean;
}) {
  return (
    <div
      className={`project-visual visual-${id} ${large ? "visual-large" : ""}`}
      aria-hidden="true"
    >
      <div className="visual-top">
        <span>BF / SYSTEM STUDIES</span>
        <span>0{id === "siakad" ? "1" : id === "edlink" ? "2" : "3"} ↗</span>
      </div>
      {id === "siakad" ? (
        <div className="campus-graphic">
          <img
            src="/assets/academic-ecosystem.jpg"
            alt=""
            loading="lazy"
            width="1536"
            height="1024"
          />
          <div className="campus-overlay">
            <GraduationCap size={19} />
            <span>
              CONNECTED CAMPUS
              <br />
              <strong>ONE ACADEMIC ENGINE.</strong>
            </span>
          </div>
        </div>
      ) : id === "edlink" ? (
        <div className="learning-graphic">
          <span className="learning-word">
            LEARN.
            <br />
            ANYWHERE.
          </span>
          <div className="phone">
            <div className="phone-notch" />
            <div className="phone-header">
              <span>ed / learning</span>
              <BookOpen size={16} />
            </div>
            <p>
              Keep moving.
              <br />
              <b>Keep learning.</b>
            </p>
            <div className="lesson-art">
              <span>01</span>
              <Play size={22} />
            </div>
            <div className="phone-lesson">
              <strong>Your next chapter</strong>
              <small>DIGITAL CLASSROOM</small>
            </div>
            <div className="lesson-line">
              <i />
              <i />
              <i />
            </div>
            <div className="phone-bottom">
              <span>Classroom</span>
              <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="floating-tag">
            <span className="status-dot" />
            MOBILE-FIRST API
          </div>
        </div>
      ) : (
        <div className="bridge-graphic">
          <div className="bridge-node">
            <Database />
            <strong>
              CAMPUS
              <br />
              DATA
            </strong>
          </div>
          <div className="data-stream">
            <i />
            <i />
            <i />
            <span>FORMAT → SYNC</span>
          </div>
          <div className="bridge-node bridge-destination">
            <ShieldCheck />
            <strong>
              PDDIKTI
              <br />
              FEEDER
            </strong>
          </div>
        </div>
      )}
      <div className="visual-bottom">
        <span>CONCEPT VISUAL · BUKAN SCREENSHOT PRODUK</span>
        <span>+</span>
      </div>
    </div>
  );
}
