import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}