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
        <div className="project-credit">
          _ - Developed with Love by EthosGrowth |{" "}
          <a
            href="https://ethosgrowth.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            ethosgrowth.me
          </a>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
