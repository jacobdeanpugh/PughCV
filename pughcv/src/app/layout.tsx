import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pugh Applications — ATS Resume Tailoring",
  description:
    "Paste a job description, pick a candidate profile, and generate a one-page ATS-optimized resume PDF.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
