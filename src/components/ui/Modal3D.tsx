import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { stopScroll } from "@/hooks/useLenis";
import { cn } from "@/utils/cn";

/** Depth-aware modal: panel rises out of the page, backdrop blurs away. */
export function Modal3D({
  open,
  onClose,
  children,
  className,
  label = "Dialog",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      stopScroll(true);
      window.addEventListener("keydown", onKey);
    }
    return () => {
      stopScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-2xl"
          />
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 70, rotateX: 12, scale: 0.94 },
              visible: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
            }}
            transition={{ type: "spring", stiffness: 190, damping: 24, mass: 0.9 }}
            style={{ transformPerspective: 1600 }}
            className={cn(
              "relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/10 bg-ink-900/80 shadow-[0_60px_140px_-40px_rgba(0,0,0,1)] backdrop-blur-2xl no-scrollbar",
              className,
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-30 grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-black/50 text-white/70 backdrop-blur-md transition hover:border-white/30 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
