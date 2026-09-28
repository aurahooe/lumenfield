"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
export default function DeskForm() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Session dropped. Come back in."); setBusy(false); return; }
    const { error: err } = await supabase.from("lf_pieces").insert({
      author_id: user.id, title: title.trim(), body: body.trim(), is_public: isPublic,
    });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setTitle(""); setBody("");
    router.refresh();
  }
  return (
    <form className="form" onSubmit={onSubmit} style={{ maxWidth: 640 }}>
      <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional" /></label>
      <label>Piece<textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write it the way you would say it out loud." /></label>
      <label className="toggle"><input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />Put this on the public wall</label>
      {error && <p className="notice">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save piece"}</button>
    </form>
  );
}
