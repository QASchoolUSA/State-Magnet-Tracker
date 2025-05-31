"use client"

import { useState } from "react";
import { US_STATES, USState } from "@/lib/us-states";
import { Button } from "@/components/ui/button";

interface StateListProps {
  collected: Record<string, boolean>;
  setCollected: (cb: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}

export default function StateList({ collected, setCollected }: StateListProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredStates = US_STATES.filter((state) =>
    state.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const toggleCollected = (abbr: string) => {
    setCollected((prev) => ({ ...prev, [abbr]: !prev[abbr] }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search states..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />
        <Button variant="outline" onClick={() => setSortAsc((s) => !s)}>
          Sort {sortAsc ? "A-Z" : "Z-A"}
        </Button>
      </div>
      <ul className="divide-y divide-border rounded shadow bg-background">
        {filteredStates.map((state) => (
          <li key={state.abbreviation} className="flex items-center justify-between px-4 py-3">
            <span className="flex items-center gap-3">
              {/* Placeholder for state outline or flag */}
              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                {state.abbreviation}
              </span>
              <span>{state.name}</span>
            </span>
            <Button
              variant={collected[state.abbreviation] ? "secondary" : "default"}
              onClick={() => toggleCollected(state.abbreviation)}
            >
              {collected[state.abbreviation] ? "Remove Magnet" : "Add Magnet"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}