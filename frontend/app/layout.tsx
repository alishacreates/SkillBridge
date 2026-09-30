import type { Metadata } from "next";
import { Felipa, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const felipa = Felipa({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-felipa",
});

export const metadata: Metadata = {
  title: "SkillBridge",
  description:
    "A career-focused workspace for turning skills into opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${felipa.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
