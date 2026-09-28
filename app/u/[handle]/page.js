import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase";
function excerpt(text) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  return clean.length > 140 ? clean.slice(0, 137) + "…" : clean;
}
export default async function ProfilePage({ params }) {
  const supabase = createServerSupabase();
  const { data: profile } = await supabase.from("lf_profiles").select("*").eq("handle", params.handle).maybeSingle();
  if (!profile) notFound();
  const { data: pieces } = await supabase.from("lf_pieces").select("*").eq("author_id", profile.id).eq("is_public", true).order("created_at", { ascending: false });
  return (
    <>
      <header className="hero">
        <div className="kicker">@{profile.handle}</div>
        <h1>{profile.display_name || profile.handle}</h1>
        {profile.bio && <p className="lede">{profile.bio}</p>}
      </header>
      <div className="grid">
        {(pieces || []).map((piece, i) => (
          <Link key={piece.id} href={`/piece/${piece.id}`} className="card" style={{ animationDelay: `${i * 50}ms` }}>
            <h3>{piece.title || "Untitled"}</h3>
            <p>{excerpt(piece.body)}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
