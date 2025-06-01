"use client";
import StateList from "@/components/StateList";
import USMap from "@/components/USMap";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AuthStatus from "@/components/AuthStatus";
import { ClipboardIcon, ShareIcon } from "@heroicons/react/24/outline";

function getCollectionIdFromUrl() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("collection_id");
}

export default function Home() {
  const { data: session } = useSession();
  const [collected, setCollected] = useState<Record<string, boolean>>({});
  const [collectionId, setCollectionId] = useState("");
  const userEmail = session?.user?.email;

  // On mount, check URL and localStorage for collectionId
  useEffect(() => {
    const urlId = getCollectionIdFromUrl();
    if (urlId) {
      setCollectionId(urlId);
      localStorage.setItem("collection_id", urlId);
    } else {
      const storedId = localStorage.getItem("collection_id");
      if (storedId) {
        setCollectionId(storedId);
      }
    }
  }, []);

  // If user logs in and no collectionId, use email
  useEffect(() => {
    if (userEmail && !collectionId) {
      setCollectionId(userEmail);
      localStorage.setItem("collection_id", userEmail);
    }
  }, [userEmail, collectionId]);

  // Persist collectionId changes to localStorage
  useEffect(() => {
    if (collectionId) {
      localStorage.setItem("collection_id", collectionId);
    }
  }, [collectionId]);

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
      <h1 className="text-2xl font-bold mb-4">State Magnet Tracker</h1>
      <div className="mb-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">Share your collection:</span>
          <button
            className="flex items-center gap-1 px-2 py-1 border rounded bg-white hover:bg-gray-100 text-sm"
            onClick={() => {
              const url = `${window.location.origin}?collection_id=${collectionId}`;
              navigator.clipboard.writeText(url);
              alert("Collection link copied to clipboard!");
            }}
            title="Copy collection link"
          >
            <ClipboardIcon className="w-4 h-4" /> Copy Link
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 border rounded bg-white hover:bg-gray-100 text-sm"
            onClick={async () => {
              const url = `${window.location.origin}?collection_id=${collectionId}`;
              if (navigator.share) {
                await navigator.share({ title: "State Magnet Tracker", url });
              } else {
                navigator.clipboard.writeText(url);
                alert("Collection link copied to clipboard!");
              }
            }}
            title="Share collection link"
          >
            <ShareIcon className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
      <div className="mb-4">
        <AuthStatus />
      </div>
      <USMap collected={collected} />
      <StateList collected={collected} setCollected={setCollected} />
    </main>
  );
}
