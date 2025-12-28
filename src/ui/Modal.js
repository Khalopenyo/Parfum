import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { THEME } from "../data/theme";

export default function Modal({ open, title, description = "", children, onClose, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl"
              style={{ background: THEME.surface, borderColor: THEME.border }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div
                className="flex items-center justify-between border-b p-5"
                style={{ borderColor: THEME.border2 }}
              >
                <div>
                  <div className="text-base font-semibold" style={{ color: THEME.text }}>
                    {title}
                  </div>
                  {description ? (
                    <div className="text-xs" style={{ color: THEME.muted }}>
                      {description}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-white/10"
                  onClick={onClose}
                  aria-label="Закрыть"
                >
                  <X className="h-4 w-4" style={{ color: THEME.muted }} />
                </button>
              </div>

              <div className="p-5">{children}</div>

              {footer ? (
                <div className="border-t p-4" style={{ borderColor: THEME.border2 }}>
                  {footer}
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
