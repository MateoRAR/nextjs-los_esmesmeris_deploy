import type { Metadata } from "next";
import "./(general)/globals.css";

export const metadata: Metadata = {
  title: "ERP Los Esmeraldes",
  description: "Sistema de gestión empresarial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
        className="min-h-screen"
        style={{
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        {children}
      </body>
    </html>
  );
}
