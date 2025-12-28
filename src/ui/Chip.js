import React from "react";
import { X } from "lucide-react";

export default function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-white">
      <span className="text-white/90">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
        aria-label={"Удалить " + label}
      >
        <X className="h-4 w-4" />
      </button>
    </span>
  );
}
