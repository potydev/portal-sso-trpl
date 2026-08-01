import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut, Home, Mail, User, Shield, School, Bookmark } from "lucide-react";

export default async function ProfilePage() {
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

  // Determine Role & NIM/NIP based on email or mock data
  const isStudent = user.email.endsWith(".stu@pnc.ac.id") || user.email.includes("student");
  const roleDisplay = isStudent ? "Mahasiswa" : "Dosen / Staff";
  const nimNipPlaceholder = isStudent ? "190302044" : "198204122010121002";
  const prodiDisplay = "Teknologi Rekayasa Perangkat Lunak (TRPL)";
  const jurusanDisplay = "Teknik Komputer dan Informatika";

  return (
    <div className="dashboard-wrapper">
      <div className="menu-container profile-container">
        
        {/* HEADER PANEL (WARNA BIRU DENGAN LOGO & NAVIGASI KEMBALI) */}
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
            <a href="/dashboard" className="btn-header">
              <Home size={14} />
              <span>Dashboard</span>
            </a>
            <a href="/api/auth/logout" className="btn-header btn-header-logout">
              <LogOut size={14} />
              <span>Keluar</span>
            </a>
          </div>
        </header>

        {/* BODY PANEL: DETAIL PROFIL */}
        <main className="menu-body profile-body">
          <h2 className="menu-body-title">Profil Pengguna</h2>
          
          <div className="profile-layout">
            
            {/* SISI KIRI: KARTU IDENTITAS MINI */}
            <div className="profile-identity-card">
              <div className="profile-avatar-wrapper">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="profile-avatar-large" />
                ) : (
                  <div className="profile-avatar-large-placeholder">
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <span className="role-badge">{roleDisplay}</span>
              </div>
              <h3 className="profile-full-name">{user.name}</h3>
              <p className="profile-email-text">{user.email}</p>
              <div className="identity-divider"></div>
              <p className="profile-institution">Politeknik Negeri Cilacap</p>
            </div>

            {/* SISI KANAN: DETAIL AKADEMIK & SSO */}
            <div className="profile-details-pane">
              <h3 className="pane-section-title">Informasi Akademik</h3>
              
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={18} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">{isStudent ? "NIM (Nomor Induk Mahasiswa)" : "NIP (Nomor Induk Pegawai)"}</span>
                    <span className="detail-value">{nimNipPlaceholder}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Bookmark size={18} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Program Studi</span>
                    <span className="detail-value">{prodiDisplay}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <School size={18} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Jurusan</span>
                    <span className="detail-value">{jurusanDisplay}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Shield size={18} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Metode Autentikasi</span>
                    <span className="detail-value">Single Sign-On (Google Workspace PNC)</span>
                  </div>
                </div>
              </div>

              {/* INTEGRASI PENUH KEYCLOAK ACCOUNT CONSOLE */}
              <div className="sso-settings-box">
                <div className="sso-box-header">
                  <h4 className="sso-box-title">Keamanan & Sesi Akun</h4>
                  <p className="sso-box-desc">
                    Akun Anda terhubung dengan layanan Single Sign-On. Anda dapat mengatur password, melihat perangkat yang terhubung, dan mengelola keamanan akun langsung di server SSO.
                  </p>
                </div>
                <a 
                  href="https://sso.potydev.cloud/realms/trpl/account" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-sso-action"
                >
                  Kelola Akun SSO (Keycloak)
                </a>
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
