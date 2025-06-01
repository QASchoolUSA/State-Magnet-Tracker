"use client"

import { useState } from "react";
import { US_STATES } from "@/lib/us-states";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

interface StateListProps {
  collected: Record<string, boolean>;
  setCollected: (cb: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}

export default function StateList({ collected, setCollected }: StateListProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredStates = US_STATES.filter((state) =>
    state.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const [pendingAction, setPendingAction] = useState<{
    abbr: string;
    name: string;
    isCollected: boolean;
  } | null>(null);

  const handleConfirm = () => {
    if (pendingAction) {
      setCollected((prev) => ({ ...prev, [pendingAction.abbr]: !pendingAction.isCollected }));
      setPendingAction(null);
    }
  };

  const handleCancel = () => setPendingAction(null);

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
        {filteredStates.slice(0, visibleCount).map((state) => (
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
              onClick={() => setPendingAction({ abbr: state.abbreviation, name: state.name, isCollected: !!collected[state.abbreviation] })}
            >
              {collected[state.abbreviation] ? "Remove Magnet" : "Add Magnet"}
            </Button>
          </li>
        ))}
      </ul>
      {visibleCount < filteredStates.length && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + 10)}>
            Show More
          </Button>
        </div>
      )}
    {/* Confirmation Modal */}
    <AlertDialog open={!!pendingAction} onOpenChange={open => { if (!open) handleCancel(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {pendingAction?.isCollected ? "Remove Magnet" : "Add Magnet"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {pendingAction?.isCollected
              ? `Are you sure you want to remove ${pendingAction.name}?`
              : `Are you sure you want to add ${pendingAction?.name}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} autoFocus>
            {pendingAction?.isCollected ? "Remove" : "Add"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  );
}