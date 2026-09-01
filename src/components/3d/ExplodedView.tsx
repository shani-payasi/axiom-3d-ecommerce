import { useState } from "react";
import { Product3DViewer } from "./Product3DViewer";
import type { ModelKind } from "@/data/products";
import { Layers, X } from "lucide-react";
import { cn } from "@/utils/cn";

type PartLabel = { text: string; offset: [number, number, number] };

/** Component callouts per product family — drives the exploded-view labels. */
export const EXPLODE_PARTS: Partial<Record<ModelKind, PartLabel[]>> = {
  smartphone: [
    { text: "Quantum OLED panel", offset: [0.1, 0.4, 1.5] },
    { text: "Titanium frame", offset: [0.6, 1.5, -0.6] },
    { text: "Back glass", offset: [-0.2, 0.2, -1.5] },
    { text: "Triple camera module", offset: [-1.2, 1.2, -1.2] },
    { text: "A19 logic board", offset: [-1.6, 1.1, 0.4] },
    { text: "5100 mAh cell", offset: [1.5, -0.9, 0.5] },
    { text: "Haptic + speaker", offset: [0.6, -1.6, 0.6] },
  ],
  laptop: [
    { text: "Mini-LED display", offset: [0.2, 1.6, -1.1] },
    { text: "Liquid-metal lid", offset: [1.4, 1.2, -1.3] },
    { text: "Keyboard deck", offset: [-0.2, -1.1, 0.7] },
    { text: "Logic board", offset: [1.5, -1.4, 0.2] },
  ],
  headphone: [
    { text: "Aluminium headband", offset: [0.2, 1.4, 0.2] },
    { text: "Beryllium driver", offset: [0.3, -1.5, 0.6] },
    { text: "Protein-leather cushion", offset: [-1.6, -0.3, 0.5] },
    { text: "Machined cup", offset: [1.6, -0.2, 0.2] },
  ],
  watch: [
    { text: "Sapphire crystal", offset: [0.4, 0.6, 1.4] },
    { text: "Lume dial + hands", offset: [1.4, 0.5, 0.4] },
    { text: "316L case", offset: [-1.4, 0.6, -0.6] },
    { text: "Calibre AX-01", offset: [0.3, -0.5, -1.5] },
    { text: "Bracelet", offset: [0.2, 1.7, -0.6] },
  ],
  smartwatch: [
    { text: "Micro-LED display", offset: [0.3, 0.3, 1.3] },
    { text: "Titanium case", offset: [1.4, 0.8, -0.4] },
    { text: "Sensor array", offset: [1.4, -0.8, 0.3] },
    { text: "Fluoroelastomer band", offset: [-0.2, -1.6, -0.2] },
  ],
  sneaker: [
    { text: "Carbon plate", offset: [1.4, -0.4, 0.9] },
    { text: "Nitrogen foam", offset: [-0.3, -1.3, 0.4] },
    { text: "Knit upper", offset: [-0.3, 1.3, 0.2] },
    { text: "Lacing system", offset: [0.6, 1.7, 0.4] },
    { text: "Rubber outsole", offset: [0.4, -1.7, -0.3] },
  ],
  camera: [
    { text: "Lens assembly", offset: [0.3, 0.2, 1.6] },
    { text: "Magnesium body", offset: [1.5, 0.4, -0.5] },
    { text: "45 MP sensor", offset: [0.2, -1.5, 0.3] },
    { text: "Dial cluster", offset: [0.2, 1.5, 0.2] },
  ],
  console: [
    { text: "Liquid-cooled core", offset: [0.2, -1.2, 0.4] },
    { text: "Upper shell", offset: [0.2, 1.4, 0.3] },
    { text: "Lower shell", offset: [0.2, -1.7, 0.3] },
    { text: "Stand", offset: [1.5, -1.6, 0.2] },
  ],
  controller: [
    { text: "Hall-effect stick", offset: [-0.2, 1.4, 0.6] },
    { text: "Face buttons", offset: [1.5, 1.0, 0.6] },
    { text: "Shell", offset: [0.2, 0.6, 1.4] },
    { text: "Grip", offset: [-1.5, -1.2, 0.4] },
  ],
  perfume: [
    { text: "Anodised cap", offset: [0.2, 1.7, 0.2] },
    { text: "Neck collar", offset: [1.3, 0.9, 0.2] },
    { text: "Hand-cut glass", offset: [1.3, -0.2, 0.6] },
    { text: "Extrait concentrate", offset: [-1.3, -0.3, 0.4] },
  ],
  lamp: [
    { text: "Opal glass shade", offset: [0.3, 1.6, 0.4] },
    { text: "Aluminium column", offset: [1.2, 0.2, 0.3] },
    { text: "Machined base", offset: [0.2, -1.6, 0.3] },
  ],
  visor: [
    { text: "Pancake optics", offset: [0.2, 0.2, 1.4] },
    { text: "Visor shell", offset: [1.5, 0.6, -0.3] },
    { text: "Head strap", offset: [0.2, 1.5, -0.7] },
  ],
};

export function ExplodedView({
  kind,
  color,
  accent,
  className,
}: {
  kind: ModelKind;
  color: string;
  accent?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const parts = EXPLODE_PARTS[kind] ?? [
    { text: "Primary assembly", offset: [0.2, 1.3, 0.4] },
    { text: "Core module", offset: [1.4, 0.2, 0.3] },
    { text: "Base structure", offset: [0.2, -1.5, 0.3] },
  ];

  return (
    <div className={cn("relative", className)}>
      <Product3DViewer
        kind={kind}
        color={color}
        accent={accent}
        labels={parts}
        cameraPosition={[0, 0.6, 5.4]}
        className="rounded-3xl"
      />
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition",
          open
            ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100"
            : "border-white/12 bg-black/50 text-white/70 hover:text-white",
        )}
      >
        {open ? <X className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
        {open ? "HIDE COMPONENTS" : "COMPONENTS"}
      </button>
      {open && (
        <div className="absolute bottom-16 right-3 z-20 w-56 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-xl sm:bottom-20 sm:right-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Internal components
          </p>
          <ul className="space-y-1.5">
            {parts.map((p) => (
              <li key={p.text} className="flex items-center gap-2 text-[11px] text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(56,220,255,0.9)]" />
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
