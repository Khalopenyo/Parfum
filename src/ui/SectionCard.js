import React from "react";
import { THEME } from "../data/theme";

export default function SectionCard({ title, subtitle, right, children, className = "" }) {
  return (
    <div className={`rounded-3xl border bg-white/[0.02] p-4 ${className}`} style={{ borderColor: THEME.border2 }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: THEME.text }}>
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-xs" style={{ color: THEME.muted }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
