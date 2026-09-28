import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase";
import DeskForm from "./desk-form";
import SignOut from "./sign-out";
function excerpt(text) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  return clean.length > 140 ? clean.slice(0, 137) + "…" : clean;
}
export default async function DeskPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/enter");
  let { data: profile } = await supabase.from("lf_profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) {
    const handle = (user.email?.split("@")[0] || "member").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() + user.id.replace(/-/g, "").slice(0, 4);
    await supabase.from("lf_profiles").insert({ id: user.id, handle, display_name: user.email?.split("@")[0] || "Member" });
    const again = await supabase.from("lf_profiles").select("*").eq("id", user.id).maybeSingle();
    profile = again.data;
  }
  const { data: pieces } = await supabase.from("lf_pieces").select("*").eq("author_id", user.id).order("created_at", { ascending: false });
  return (
    <>
      <div className="desk-head">
        <div>
          <div className="kicker">Your desk</div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", margin: "6px 0 0" }}>{profile?.display_name || "You"}</h1>
        </div>
        <SignOut />
      </div>
      <DeskForm />
      <section>
        <div className="kicker">Saved pieces</div>
        <div className="grid">
          {(pieces || []).map((piece, i) => (
            <Link key={piece.id} href={`/piece/${piece.id}`} className="card" style={{ animationDelay: `${i * 50}ms` }}>
              <h3>{piece.title || "Untitled"}</h3>
              <p>{excerpt(piece.body)}</p>
              <div className="meta">{piece.is_public ? "On the wall" : "Private"}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
