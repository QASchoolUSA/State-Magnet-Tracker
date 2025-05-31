"use client";
import StateList from "@/components/StateList";
import USMap from "@/components/USMap";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [collected, setCollected] = useState<Record<string, boolean>>({});
  const userEmail = session?.user?.email;

  // Load collected states from API when user logs in
  useEffect(() => {
    if (!userEmail) return;
    fetch("/api/collected")
      .then((res) => res.json())
      .then((data) => {
        if (data.states) setCollected(data.states);
      });
  }, [userEmail]);

  // Save collected states to API when changed
  useEffect(() => {
    if (!userEmail) return;
    fetch("/api/collected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ states: collected }),
    });
  }, [collected, userEmail]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">State Magnet Tracker</h1>
      <USMap collected={collected} />
      <StateList collected={collected} setCollected={setCollected} />
    </main>
  );
}
