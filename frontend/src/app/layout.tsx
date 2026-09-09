import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YourNav Pro - Autonomous Travel Intelligence",
  description: "An intelligent, constraint-aware travel planning and execution platform for India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen selection:bg-sky-500/20">
        {children}
      </body>
    </html>
  );
}
