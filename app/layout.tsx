import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoForge | AI Production System",
  description:
    "AutoForge transforms raw ideas into cinematic prompts and publish-ready content packages."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
