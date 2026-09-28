"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function EnterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fn = mode === "in"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });
    const { error: err } = await fn;
    setBusy(false);
    if (err) { setError(err.message); return; }
    router.push("/desk");
    router.refresh();
  }

  return (
    <>
      <header className="hero">
        <div className="kicker">{mode === "in" ? "Return" : "First visit"}</div>
        <h1>{mode === "in" ? "Come back in." : "Take a desk."}</h1>
        <p className="lede">Email and a password. That is the whole gate. Your private pieces stay attached to this account.</p>
      </header>
      <form className="form" onSubmit={onSubmit}>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="notice">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "One moment…" : mode === "in" ? "Enter" : "Create desk"}</button>
        <button type="button" className="btn ghost" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "I need a desk" : "I already have one"}
        </button>
      </form>
    </>
  );
}
