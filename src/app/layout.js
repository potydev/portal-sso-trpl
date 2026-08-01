import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "SIAKAD SSO — Politeknik Negeri Cilacap",
  description: "Portal SIAKAD SSO TRPL Politeknik Negeri Cilacap - Masuk dan Verifikasi Terpusat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={plusJakartaSans.className}>
        {children}
      </body>
    </html>
  );
}
