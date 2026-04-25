import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
