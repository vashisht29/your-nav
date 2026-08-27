import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart AI Travel Planner",
  description: "An intelligent, constraint-aware travel planning and execution platform for India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
