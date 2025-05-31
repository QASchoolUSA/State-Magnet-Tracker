"use client";
import StateList from "@/components/StateList";
import USMap from "@/components/USMap";
import { useState } from "react";

export default function Home() {
  const [collected, setCollected] = useState<Record<string, boolean>>({});

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">State Magnet Tracker</h1>
      <USMap collected={collected} />
      <StateList collected={collected} setCollected={setCollected} />
    </main>
  );
}
