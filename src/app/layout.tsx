import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faceless Mystery Video Generator | Remotion HTML Motion",
  description: "Automated 9:16 vertical mystery video generation powered by LLM and Remotion Pure HTML/CSS motion graphics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#07090e] text-slate-100 min-h-screen selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

