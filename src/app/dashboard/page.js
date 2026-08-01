import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut, User, BookOpen, GraduationCap, Briefcase, FileText, Mail, Laptop, Library, Users } from "lucide-react";

const apps = [
  {
    id: "siakad",
    name: "SIM Akademik",
    icon: <BookOpen className="module-icon-svg" size={40} color="#0067bd" />,
    url: process.env.APP_SIAKAD_URL || "https://siakad.potydev.cloud",
  },
  {
    id: "mbkm",
    name: "SIM Merdeka Belajar Kampus...",
    icon: <GraduationCap className="module-icon-svg" size={40} color="#eab308" />,
    url: process.env.APP_MBKM_URL || "https://mbkm.potydev.cloud",
  },
  {
    id: "magang",
    name: "SIM Magang",
    icon: <Briefcase className="module-icon-svg" size={40} color="#6366f1" />,
    url: process.env.APP_MAGANG_URL || "https://magang.potydev.cloud",
  },
  {
    id: "ta",
    name: "SIM Tugas Akhir",
    icon: <FileText className="module-icon-svg" size={40} color="#ec4899" />,
    url: process.env.APP_TA_URL || "https://ta.potydev.cloud",
  },
  {
    id: "persuratan",
    name: "SIM Persuratan",
    icon: <Mail className="module-icon-svg" size={40} color="#f59e0b" />,
    url: process.env.APP_PERSURATAN_URL || "https://persuratan.potydev.cloud",
  },
  {
    id: "lab",
    name: "Peminjaman Lab",
    icon: <Laptop className="module-icon-svg" size={40} color="#ef4444" />,
    url: process.env.APP_LAB_URL || "https://lab.potydev.cloud",
  },
  {
    id: "repository",
    name: "Repository Center",
    icon: <Library className="module-icon-svg" size={40} color="#8b5cf6" />,
    url: process.env.APP_REPOSITORY_URL || "https://repository.potydev.cloud",
  },
  {
    id: "perwalian",
    name: "SIM Perwalian",
    icon: <Users className="module-icon-svg" size={40} color="#10b981" />,
    url: process.env.APP_PERWALIAN_URL || "https://perwalian.potydev.cloud",
  },
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("pnc_sso_session");

  if (!sessionCookie) {
    redirect("/");
  }

  let user = null;
  try {
    user = JSON.parse(sessionCookie.value);
  } catch (e) {
    redirect("/");
  }

  return (
    <div className="dashboard-wrapper">
      <div className="menu-container">
        {/* HEADER KARTU (WARNA BIRU DENGAN LOGO & TOMBOL KANAN) */}
        <header className="menu-header">
          <div className="menu-header-left">
            <div className="logo-circle">
              <img
                src="https://assets.siakadcloud.com/uploads/pnc/logoaplikasi/1877.jpg?1768381018"
                alt="Logo PNC"
                className="logo-circle-img"
              />
            </div>
            <div className="menu-header-titles">
              <span className="menu-header-sub">Sistem Informasi Akademik</span>
              <h1 className="menu-header-main">POLITEKNIK NEGERI CILACAP</h1>
            </div>
          </div>
          <div className="menu-header-right">
            <a href="/profile" className="btn-header">
              <User size={14} />
              <span>Halaman Profil</span>
            </a>
            <a href="/api/auth/logout" className="btn-header btn-header-logout">
              <LogOut size={14} />
              <span>Keluar</span>
            </a>
          </div>
        </header>

        {/* BODY KARTU: DAFTAR MODUL */}
        <main className="menu-body">
          <h2 className="menu-body-title">Daftar Modul</h2>
          <div className="modules-grid">
            {apps.map((app) => (
              <a key={app.id} href={app.url} className="module-card">
                <div className="module-icon-container">
                  {app.icon}
                </div>
                <span className="module-label">{app.name}</span>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
