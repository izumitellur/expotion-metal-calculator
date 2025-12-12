import type { Metadata } from "next";
import "./globals.css";
import "../styles.css";

export const metadata: Metadata = {
  title: "Калькулятор массы металлопроката",
  description: "Next.js 15 — расчёт массы металла с встроенными данными на русском языке",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
