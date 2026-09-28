import "./globals.css";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase";

export const metadata = {
  title: "Lumenfield",
  description: "A living public notebook.",
};

export default async function RootLayout({ children }) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="shell">
          <nav className="nav">
            <Link className="mark" href="/">
              Lumen<span>field</span>
            </Link>
            <div className="nav-links">
              <Link href="/">Wall</Link>
              {user ? (
                <Link href="/desk">Desk</Link>
              ) : (
                <Link href="/enter">Enter</Link>
              )}
            </div>
          </nav>
          {children}
          <footer className="foot">
            Public pieces stay on the wall. Private ones never leave your desk.
          </footer>
        </div>
      </body>
    </html>
  );
}
