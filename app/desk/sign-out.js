"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
export default function SignOut() {
  const router = useRouter();
  return (
    <button className="btn ghost" onClick={async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    }}>Leave</button>
  );
}
