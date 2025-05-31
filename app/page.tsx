"use client";
import StateList from "@/components/StateList";
import USMap from "@/components/USMap";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [collected, setCollected] = useState<Record<string, boolean>>({});
  const [collectionId, setCollectionId] = useState("");
  const userEmail = session?.user?.email;

  // Set default collectionId to user's email on login
  useEffect(() => {
    if (userEmail && !collectionId) setCollectionId(userEmail);
  }, [userEmail, collectionId]);

  // Load collected states from API when user logs in or collectionId changes
  useEffect(() => {
    if (!userEmail || !collectionId) return;
    fetch(`/api/collected?collection_id=${encodeURIComponent(collectionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.states) setCollected(data.states);
      });
  }, [userEmail, collectionId]);

  // Save collected states to API when changed
  useEffect(() => {
    if (!userEmail || !collectionId) return;
    fetch(`/api/collected?collection_id=${encodeURIComponent(collectionId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ states: collected }),
    });
  }, [collected, userEmail, collectionId]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">State Magnet Tracker</h1>
      <div className="mb-4 flex flex-col items-center gap-2">
        <label htmlFor="collectionId" className="font-medium">Collection ID (share this with family):</label>
        <input
          id="collectionId"
          type="text"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className="border rounded px-3 py-2 w-64 text-center"
          placeholder="Enter or share a collection ID"
        />
      </div>
      <USMap collected={collected} />
      <StateList collected={collected} setCollected={setCollected} />
    </main>
  );
}
