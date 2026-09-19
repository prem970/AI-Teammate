import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Autonomous AI OS | Merchant Support & Operations Portal",
  description:
    "Autonomous AI OS portals for merchants and ops. Chat uses n8n Orchestrator; ledger/hardware/escalations read Cosmos when configured.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-slate-100 font-sans antialiased min-h-screen selection:bg-cyan-500/20 selection:text-cyan-300"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
