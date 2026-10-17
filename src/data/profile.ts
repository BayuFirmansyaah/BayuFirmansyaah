export interface Project {
  id: string;
  number: string;
  name: string;
  type: string;
  description: string;
  tags: string[];
  challenge: string;
  contribution: string[];
  outcome: string;
}
export const profile = {
  name: "Bayu Firmansyah",
  role: "Senior Full Stack Developer",
  specialty: "Edutech Solution Architect",
  location: "Surabaya, Indonesia",
  email: "bayufirmansyah.me@gmail.com",
  linkedin: "https://www.linkedin.com/in/bayufirmansyah",
  website: "https://ubay.tech",
  cv: "/bayu-firmansyah-cv.pdf",
  sourceDate: "Februari 2026",
  summary:
    "Saya membangun sistem yang tetap andal saat ribuan orang mengandalkannya. Dari logika akademik yang kompleks hingga API mobile yang cepat — menghubungkan kebutuhan nyata dengan engineering yang tepat.",
};
export const projects: Project[] = [
  {
    id: "siakad",
    number: "01",
    name: "SiakadCloud",
    type: "ACADEMIC MANAGEMENT PLATFORM",
    description:
      "Di balik setiap perjalanan akademik, ada sistem yang harus selalu siap.",
    tags: ["Academic engine", "Laravel", "Database optimization"],
    challenge:
      "Menangani aturan akademik yang kompleks dan akses serentak dalam jumlah besar pada periode pengisian KRS.",
    contribution: [
      "Merancang logika core academic engine: bentrok jadwal, batas SKS berdasarkan IPK, dan alur akademik.",
      "Menerapkan Redis caching dan database indexing untuk mengatasi bottleneck saat “war KRS”.",
      "Menerapkan JWT Authentication dan Role-Based Access Control untuk melindungi data mahasiswa.",
    ],
    outcome:
      "Response time meningkat 40% melalui optimasi caching dan indexing, sebagaimana tercatat pada CV.",
  },
  {
    id: "edlink",
    number: "02",
    name: "EdLink",
    type: "MOBILE-FIRST LEARNING EXPERIENCE",
    description:
      "Membawa pengalaman belajar lebih dekat. Di kelas, maupun di mana saja.",
    tags: ["RESTful API", "Mobile-first", "Learning management"],
    challenge:
      "Mendukung pengalaman belajar di Android dan iOS dengan pengiriman data yang responsif dan struktur API yang siap digunakan aplikasi mobile.",
    contribution: [
      "Mengembangkan RESTful API berperforma tinggi untuk aplikasi EdLink Mobile.",
      "Mengoptimalkan pengiriman data dengan latensi rendah untuk pengguna mobile.",
      "Membawa pemahaman domain LMS: kelas digital, tugas, kuis, dan diskusi ke dalam pengembangan sistem.",
    ],
    outcome:
      "Kontribusi pengembangan API pada ekosistem SiakadCloud dan EdLink di SEVIMA, yang melayani 1.200+ universitas menurut CV.",
  },
  {
    id: "pddikti",
    number: "03",
    name: "PDDIKTI Bridge",
    type: "COMPLIANCE & DATA AUTOMATION",
    description: "Data kampus yang kompleks. Pelaporan yang lebih sederhana.",
    tags: ["Data integration", "Feeder Web Service", "Automation"],
    challenge:
      "Menghubungkan format data internal kampus dengan kebutuhan pelaporan nasional PDDIKTI.",
    contribution: [
      "Mengembangkan modul penghubung untuk memformat data akademik internal.",
      "Mengotomatisasi pengiriman data ke Pangkalan Data Pendidikan Tinggi.",
      "Mengurangi ketergantungan pada proses pelaporan manual yang rentan kesalahan.",
    ],
    outcome:
      "Pelaporan akademik terotomatisasi melalui integrasi Feeder Web Service, membantu menghilangkan kesalahan pelaporan manual.",
  },
];
export const experience = [
  {
    year: "2022",
    period: "AGU 2022 — SEKARANG*",
    company: "SEVIMA",
    role: "Senior Full Stack Developer",
    location: "Surabaya",
    detail:
      "Mengembangkan core academic engine SiakadCloud, API EdLink, optimasi database, dan integrasi PDDIKTI.",
  },
  {
    year: "2023",
    period: "AGU 2023 — JUN 2024",
    company: "RevoU",
    role: "Vertical Mentor · Software Engineering",
    location: "Remote",
    detail:
      "Mendampingi peserta membangun aplikasi full-stack dari nol dan menyederhanakan konsep teknis yang kompleks.",
  },
  {
    year: "2022",
    period: "MAR — JUL 2022",
    company: "ICUBE by SIRCLO",
    role: "Software Engineer",
    location: "Yogyakarta",
    detail:
      "Mengerjakan sinkronisasi data e-commerce secara real-time dan membangun frontend dengan React.js.",
  },
];
export const skillGroups = [
  {
    name: "Backend & architecture",
    subtitle: "THE ENGINE",
    skills: [
      "PHP / Laravel",
      "Node.js",
      "Microservices",
      "RESTful API",
      "JWT & RBAC",
    ],
  },
  {
    name: "Frontend experience",
    subtitle: "THE INTERFACE",
    skills: ["React.js", "TypeScript", "Next.js", "Redux", "Tailwind CSS"],
  },
  {
    name: "Data & performance",
    subtitle: "THE PERFORMANCE",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Query optimization",
      "Database design",
    ],
  },
  {
    name: "Delivery & collaboration",
    subtitle: "THE DELIVERY",
    skills: ["Docker", "CI/CD", "Git", "Jira", "Async collaboration"],
  },
];
