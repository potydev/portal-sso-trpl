"use client";

import { useState, Suspense } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="form-box">
        {/* BAGIAN KIRI: AREA VISUAL KAMPUS */}
        <div className="univ-identity-box">
          <div className="univ-identity-content">
            <span className="welcome-text">SELAMAT DATANG</span>
            <h1 className="univ-name">
              Sistem Informasi Akademik <br />
              Politeknik Negeri Cilacap
            </h1>
          </div>
        </div>

        {/* BAGIAN KANAN: FORMULIR LOGIN */}
        <div className="form-container">
          <div className="form-wrapper">
            {/* Logo Kampus */}
            <div className="logo-container">
              <img
                src="https://assets.siakadcloud.com/uploads/pnc/logoaplikasi/1877.jpg?1768381018"
                alt="Logo Politeknik Negeri Cilacap"
                className="campus-logo"
              />
            </div>

            <div className="form-header">
              <h2 className="form-title">Masuk dan Verifikasi</h2>
              <p className="form-subtitle">
                <span className="badge-new">Baru!</span> Nikmati kemudahan sistem autentikasi tunggal untuk mengakses semua layanan dengan satu akun.
              </p>
            </div>

            {error && (
              <div className="alert alert-error" style={{
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                color: "#721c24",
                padding: "10px 14px",
                borderRadius: "4px",
                fontSize: "12.5px",
                marginBottom: "15px"
              }}>
                <div className="alert-message">
                  {error === "invalid_credentials" && "Email/akun pengguna atau password salah."}
                  {error === "oidc_not_initialized" && "Server SSO bermasalah. Mencoba bypass mode..."}
                  {error !== "invalid_credentials" && error !== "oidc_not_initialized" && "Autentikasi gagal. Silakan coba kembali."}
                </div>
              </div>
            )}

            {/* Google SSO Button */}
            <a href="/api/auth/login" className="btn-google" id="login-btn">
              <img
                src="https://quantum.sevima.com/assets/images/logo-google.svg"
                alt="Google Logo"
                className="google-icon"
              />
              Google
            </a>

            <div className="divider">
              <span>atau lanjutkan dengan</span>
            </div>

            {/* Traditional Form Login */}
            <form action="/api/auth/form-login" method="POST" className="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="username">
                  Email/akun pengguna<span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    placeholder="Masukkan email/NIM/NIP/username yang terdaftar"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password<span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <a href="#" className="forgot-password-link">Lupa kata sandi?</a>
              </div>

              <button type="submit" className="btn-submit">Masuk</button>
            </form>

            {/* Footer */}
            <div className="form-footer">
              <img
                src="https://assets.siakadcloud.com/assets/v1/img/logo-sevima-platform-200.png"
                alt="Powered By SEVIMA"
                className="sevima-footer-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="login-page">
        <div className="form-box" style={{ justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <div style={{ color: "#333", fontSize: "14px" }}>Loading...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
