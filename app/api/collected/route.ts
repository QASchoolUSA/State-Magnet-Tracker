import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import type { Session } from "next-auth";
function getCollectionId(req: NextRequest, session: Session) {
  const { searchParams } = new URL(req.url);
  const email = session.user?.email ?? undefined;
  return searchParams.get("collection_id") || email;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const collection_id = getCollectionId(req, session);
  const { data, error } = await supabase
    .from("collected_states")
    .select("states")
    .eq("collection_id", collection_id)
    .single();
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ states: data?.states || {} });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const collection_id = getCollectionId(req, session);
  const body = await req.json();
  const { states: newStates } = body;
  console.log("POST /api/collected", { collection_id, body });
  // Fetch existing states
  const { data: existing, error: fetchError } = await supabase
    .from("collected_states")
    .select("states")
    .eq("collection_id", collection_id)
    .single();
  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Supabase fetch error", fetchError);
    return NextResponse.json({ error: fetchError.message, details: fetchError }, { status: 500 });
  }
  const mergedStates = { ...(existing?.states || {}), ...newStates };
  const { error } = await supabase
    .from("collected_states")
    .upsert({ collection_id, states: mergedStates }, { onConflict: "collection_id" });
  if (error) {
    console.error("Supabase upsert error", error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}