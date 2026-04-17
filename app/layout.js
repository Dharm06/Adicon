import "./globals.css";

export const metadata = {
  title: "ADICON - Agriculture Solutions",
  description: "ADICON agriculture solutions website",
  openGraph: {
    title: "ADICON - Agriculture Solutions",
    description: "Manufacturer & wholesaler of premium agri-input solutions.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
