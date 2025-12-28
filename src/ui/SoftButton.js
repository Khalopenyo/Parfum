import React from "react";
import { THEME } from "../data/theme";

export default function SoftButton({ children, onClick, active, title, className = "" }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={
        `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)] focus:ring-offset-0 ${className} ` +
        (active
          ? "border-[rgba(247,242,232,0.20)] bg-white/[0.06] text-white"
          : "border-white/10 bg-white/[0.02] text-white/80 hover:bg-white/[0.05]")
      }
    >
      {children}
    </button>
  );
}
