import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

// Helper to get collection_id from query or default to user's email
function getCollectionId(req: NextRequest, session: any) {
  const { searchParams } = new URL(req.url);
  return searchParams.get("collection_id") || session.user?.email;
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
  const { states } = body;
  const { error } = await supabase
    .from("collected_states")
    .upsert({ collection_id, states }, { onConflict: "collection_id" });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}