import "./globals.css";

import ThemeProvider from "@/components/providers/ThemeProvider/ThemeProvider";

export const metadata = {
  title: "SaaS Admin Dashboard",
  description: "Portfolio project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}