import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase";
export default async function PiecePage({ params }) {
  const supabase = createServerSupabase();
  const { data: piece } = await supabase.from("lf_pieces").select("*, lf_profiles(handle, display_name)").eq("id", params.id).maybeSingle();
  if (!piece) notFound();
  return (
    <article className="piece">
      <div className="kicker">{piece.is_public ? "Public" : "Private desk copy"}</div>
      <h1>{piece.title || "Untitled"}</h1>
      <p className="meta" style={{ marginBottom: 24 }}>
        {piece.lf_profiles?.display_name || "Someone"}
        {piece.lf_profiles?.handle ? (<> {" · "}<Link href={`/u/${piece.lf_profiles.handle}`}>@{piece.lf_profiles.handle}</Link></>) : null}
      </p>
      <div className="body">{piece.body}</div>
    </article>
  );
}
