"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { staffConfig } from "@/content/config/staff.config";
import { Touchable } from "@/components/touch/Touchable";
import { QuietButton } from "@/components/touch/QuietButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenicTransition } from "@/lib/motion/tokens";
import { verifyStaffPinLocally } from "@/lib/staff/clientPin";
import { useStaffStore } from "@/stores/staff.store";
import { cn } from "@/utils/cn";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "enter"] as const;

/**
 * Four-digit PIN pad after logo hold. Does not display the configured PIN.
 */
export function StaffPinGate() {
  const reducedMotion = useReducedMotion();
  const open = useStaffStore((s) => s.pinGateOpen);
  const closePinGate = useStaffStore((s) => s.closePinGate);
  const unlockWithPin = useStaffStore((s) => s.unlockWithPin);

  const [digits, setDigits] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setDigits("");
      setError(null);
      setBusy(false);
    }
  }, [open]);

  const submit = useCallback(
    async (pin: string) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        const response = await fetch("/api/staff/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });
        const data = (await response.json()) as { ok?: boolean };
        if (response.ok && data.ok) {
          unlockWithPin();
          setDigits("");
          return;
        }
        setError("Incorrect PIN");
        setDigits("");
      } catch {
        // Local Node API unreachable — allow public/dev PIN so staff can recover offline.
        if (verifyStaffPinLocally(pin)) {
          unlockWithPin();
          setDigits("");
        } else {
          setError("Unable to verify — check local app / PIN env");
          setDigits("");
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, unlockWithPin],
  );

  const onKey = useCallback(
    (key: (typeof KEYS)[number]) => {
      if (busy) return;
      setError(null);
      if (key === "clear") {
        setDigits("");
        return;
      }
      if (key === "enter") {
        setDigits((current) => {
          if (current.length === staffConfig.pinLength) {
            void submit(current);
          }
          return current;
        });
        return;
      }
      setDigits((current) => {
        if (current.length >= staffConfig.pinLength) return current;
        const next = `${current}${key}`;
        if (next.length === staffConfig.pinLength) {
          window.setTimeout(() => void submit(next), 60);
        }
        return next;
      });
    },
    [busy, submit],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-[80] flex items-center justify-center bg-[rgba(6,12,18,0.88)] p-[var(--space-6)]"
          role="dialog"
          aria-modal
          aria-label="Staff authentication"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={scenicTransition(reducedMotion)}
        >
          <div className="w-full max-w-sm rounded-[var(--radius-sm)] border border-white/15 bg-[rgba(14,22,28,0.96)] p-[var(--space-6)] shadow-xl">
            <p className="text-[length:var(--text-label)] tracking-[var(--tracking-label)] text-[var(--color-museum-warm)] uppercase">
              Staff access
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
              Enter the four-digit PIN
            </p>

            <div className="mt-[var(--space-5)] flex justify-center gap-3" aria-hidden>
              {Array.from({ length: staffConfig.pinLength }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-3 w-3 rounded-full border border-white/30",
                    index < digits.length && "bg-[var(--color-museum-warm)] border-[var(--color-museum-warm)]",
                  )}
                />
              ))}
            </div>

            {error ? (
              <p className="mt-[var(--space-3)] text-center text-[length:var(--text-body-sm)] text-[var(--color-danger,#c96b6b)]">
                {error}
              </p>
            ) : (
              <p className="mt-[var(--space-3)] text-center text-[length:var(--text-micro)] text-[var(--text-on-dark-muted)]">
                {busy ? "Checking…" : "\u00a0"}
              </p>
            )}

            <div className="mt-[var(--space-5)] grid grid-cols-3 gap-2">
              {KEYS.map((key) => (
                <Touchable
                  key={key}
                  soft
                  disabled={busy}
                  className={cn(
                    "min-h-[3.5rem] rounded-[var(--radius-sm)] bg-white/10 text-[length:var(--text-title)] text-[var(--text-on-dark)]",
                    (key === "clear" || key === "enter") && "text-[length:var(--text-body-sm)] uppercase tracking-[var(--tracking-label)]",
                  )}
                  onClick={() => onKey(key)}
                >
                  {key === "clear" ? "Clear" : key === "enter" ? "Enter" : key}
                </Touchable>
              ))}
            </div>

            <div className="mt-[var(--space-5)] flex justify-end">
              <QuietButton onClick={closePinGate}>Cancel</QuietButton>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
