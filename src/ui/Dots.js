import React from "react";

export default function Dots({ value }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i + 1 <= value;
        return (
          <span
            key={i}
            className={"h-1.5 w-4 rounded-full " + (on ? "bg-white/85" : "bg-white/15")}
          />
        );
      })}
    </div>
  );
}
