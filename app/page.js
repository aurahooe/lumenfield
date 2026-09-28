import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase";

function excerpt(text) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  return clean.length > 140 ? clean.slice(0, 137) + "…" : clean;
}

export default async function Home() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pulse } = await supabase
    .from("lf_pulses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: pieces } = await supabase
    .from("lf_pieces")
    .select("id, title, body, created_at, author_id, lf_profiles(handle, display_name)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <>
      <header className="hero">
        <div className="kicker">Open field · Hour 01</div>
        <h1>Leave a note on the table.</h1>
        <p className="lede">
          Write something small and keep it, or mark it public and let it sit
          on the wall. No feed tricks. Just paper, names, and whatever people
          decide to share.
        </p>
        <div className="actions">
          {user ? (
            <Link className="btn" href="/desk">Go to your desk</Link>
          ) : (
            <>
              <Link className="btn" href="/enter">Come in</Link>
              <Link className="btn ghost" href="#wall">Read the wall</Link>
            </>
          )}
        </div>
      </header>
      {pulse && (
        <aside className="pulse">
          <time dateTime={pulse.created_at}>This hour</time>
          <h2>{pulse.title}</h2>
          <p>{pulse.body}</p>
        </aside>
      )}
      <section id="wall">
        <div className="kicker">Public wall</div>
        <div className="grid">
          {(pieces || []).length === 0 && (
            <article className="card">
              <h3>Still empty</h3>
              <p>The first public piece will land here. It can be yours.</p>
            </article>
          )}
          {(pieces || []).map((piece, i) => (
            <Link key={piece.id} href={`/piece/${piece.id}`} className="card" style={{ animationDelay: `${i * 60}ms` }}>
              <h3>{piece.title || "Untitled"}</h3>
              <p>{excerpt(piece.body)}</p>
              <div className="meta">{piece.lf_profiles?.display_name || piece.lf_profiles?.handle || "Someone"}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
