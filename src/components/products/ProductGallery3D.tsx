import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { Canvas3D } from "@/components/3d/SceneCanvas";
import { LightingSystem } from "@/components/3d/LightingSystem";
import { ProductModel } from "@/components/3d/ProductModel";
import { Modal3D } from "@/components/ui/Modal3D";
import { Product3DViewer } from "@/components/3d/Product3DViewer";
import type { ModelKind } from "@/data/products";
import { useIsCompact } from "@/lib/utils";
import { setCursor } from "@/lib/cursor";
import { cn } from "@/utils/cn";

export type GalleryView = { label: string; note: string; camera: [number, number, number] };

const VIEWS: GalleryView[] = [
  { label: "Front", note: "Hero elevation", camera: [0, 0.3, 4.6] },
  { label: "Three-quarter", note: "Form study", camera: [2.6, 1.2, 3.4] },
  { label: "Profile", note: "Silhouette", camera: [4.4, 0.2, 0.4] },
  { label: "Rear detail", note: "Material close-up", camera: [-1.2, 1.6, -3.6] },
  { label: "Low angle", note: "Presence", camera: [0.6, -1.8, 3.8] },
  { label: "Top-down", note: "Plan view", camera: [0.4, 4.6, 0.8] },
];

function GalleryPlane({
  kind,
  color,
  accent,
  view,
  active,
  onOpen,
  compact,
}: {
  kind: ModelKind;
  color: string;
  accent: string;
  view: GalleryView;
  active: boolean;
  onOpen: () => void;
  compact: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -10, z: 70, rotateX: -4 }}
      style={{ transformPerspective: 1400 }}
      onClick={onOpen}
      onMouseEnter={() => setCursor({ mode: "view", label: "OPEN 3D" })}
      onMouseLeave={() => setCursor({ mode: "default" })}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl border p-1 text-left transition-colors duration-500",
        active ? "border-cyan-300/50 bg-cyan-400/[0.07]" : "border-white/10 bg-white/[0.03] hover:border-white/25",
      )}
      aria-label={`Open ${view.label} 3D view`}
    >
      <div className="relative h-36 w-full sm:h-40">
        <Canvas3D
          frameloop={active ? "always" : "demand"}
          cameraPosition={view.camera}
          fov={38}
          shadows={false}
          performanceDpr={[1, 1.35]}
        >
          <LightingSystem accent={accent} intensity={active ? 1.25 : 0.8} shadows={false} envResolution={64} />
          <group>
            <ProductModel kind={kind} color={color} accent={accent} lowDetail={compact} />
          </group>
        </Canvas3D>
        <span className="pointer-events-none absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-black/50 text-white/70 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3 w-3" />
        </span>
      </div>
      <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">{view.label}</p>
          <p className="text-[10px] text-white/35">{view.note}</p>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(56,220,255,0.9)]" />
      </div>
    </motion.button>
  );
}

/**
 * 3D image gallery — floating planes that each hold the same real-time model
 * framed from a different cinematic angle. Clicking opens a full-screen viewer.
 */
export function ProductGallery3D({
  kind,
  color,
  accent,
  views = VIEWS,
}: {
  kind: ModelKind;
  color: string;
  accent?: string;
  views?: GalleryView[];
}) {
  const compact = useIsCompact();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const tone = accent ?? "#38dcff";

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {views.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 26, rotateY: -8 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <GalleryPlane
              kind={kind}
              color={color}
              accent={tone}
              view={v}
              active={active === i}
              compact={compact}
              onOpen={() => {
                setActive(i);
                setOpen(i);
              }}
            />
          </motion.div>
        ))}
      </div>

      <Modal3D open={open !== null} onClose={() => setOpen(null)} label="Full screen 3D viewer">
        <div className="h-[70vh] w-full sm:h-[78vh]">
          {open !== null && (
            <Product3DViewer
              kind={kind}
              color={color}
              accent={tone}
              cameraPosition={views[open].camera}
              fov={38}
              className="h-full w-full"
            />
          )}
        </div>
      </Modal3D>
    </>
  );
}
