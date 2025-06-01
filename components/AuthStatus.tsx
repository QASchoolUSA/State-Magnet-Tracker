"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-gray-500 font-medium">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 bg-green-50 border border-green-300 rounded shadow text-green-900">
        <span className="font-semibold">Signed in as {session.user?.name || session.user?.email}</span>
        <Button variant="outline" onClick={() => signOut()} className="border-green-400 text-green-900 hover:bg-green-100">Sign out</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn()} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded shadow">Sign in</Button>
  );
}