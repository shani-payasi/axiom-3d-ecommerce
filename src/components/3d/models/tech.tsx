import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { RoundedBox, Cylinder, Sphere, Torus, Capsule } from "@react-three/drei";

export type ModelProps = {
  color: string;
  accent?: string;
  /** 0 → assembled, 1 → fully exploded */
  explode?: number;
  lowDetail?: boolean;
};

/* ------------------------------------------------------------------ helpers */

export const Part = ({
  dir = [0, 1, 0],
  explode = 0,
  amount = 0.9,
  position = [0, 0, 0],
  children,
  ...rest
}: {
  dir?: [number, number, number];
  explode?: number;
  amount?: number;
  position?: [number, number, number];
  children: ReactNode;
} & Record<string, unknown>) => (
  <group
    position={[
      position[0] + dir[0] * explode * amount,
      position[1] + dir[1] * explode * amount,
      position[2] + dir[2] * explode * amount,
    ]}
    {...rest}
  >
    {children}
  </group>
);

type MatOpts = {
  color?: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  transmission?: number;
  transparent?: boolean;
};

/** Material helpers accept either an options object or a plain colour string. */
type Maybe<A> = string | A | undefined;

const mat = (o: MatOpts) => (
  <meshStandardMaterial
    color={o.color ?? "#ffffff"}
    roughness={o.roughness ?? 0.35}
    metalness={o.metalness ?? 0}
    emissive={o.emissive ?? "#000000"}
    emissiveIntensity={o.emissiveIntensity ?? 1}
    transparent={(o.opacity ?? 1) < 1 || (o.transmission ?? 0) > 0}
    opacity={o.opacity ?? 1}
    envMapIntensity={1.15}
  />
);

const opts = <A extends object>(a: Maybe<A>, extra: Partial<MatOpts> = {}): MatOpts =>
  typeof a === "string" ? { color: a, ...extra } : { ...extra, ...(a as MatOpts) };

export const Metal = (
  a: Maybe<{ color?: string; roughness?: number }>,
  roughness?: number,
) => mat({ color: "#b9bfca", roughness: 0.22, ...opts(a), metalness: 1, ...(roughness !== undefined ? { roughness } : {}) });

export const Paint = (a: Maybe<{ color?: string; roughness?: number }>) =>
  mat({ color: "#15171c", roughness: 0.28, ...opts(a), metalness: 0.15 });

export const Glass = (
  a: Maybe<{ color?: string; opacity?: number }>,
  opacity?: number,
) =>
  mat({
    color: "#dff3ff",
    roughness: 0.05,
    metalness: 0.1,
    ...opts(a),
    opacity: (a as { opacity?: number })?.opacity ?? opacity ?? 0.28,
    transparent: true,
  });

export const Glow = (a: Maybe<{ color?: string; i?: number }>, i?: number) => {
  const o = opts(a);
  return mat({
    color: "#38dcff",
    ...o,
    emissive: o.color ?? "#38dcff",
    emissiveIntensity: (a as { i?: number })?.i ?? i ?? 2.4,
    roughness: 0.3,
  });
};

export const Rubber = (a: Maybe<{ color?: string }>) =>
  mat({ color: "#101216", ...opts(a), roughness: 0.9, metalness: 0 });

export const Leather = (a: Maybe<{ color?: string }>) =>
  mat({ color: "#2a201a", ...opts(a), roughness: 0.82, metalness: 0.02 });

/** Screen with a soft gradient "wallpaper" generated on a canvas. */
export const Screen = ({
  w = 1,
  h = 1.9,
  accent = "#38dcff",
  intensity = 1.1,
}: {
  w?: number;
  h?: number;
  accent?: string;
  intensity?: number;
}) => {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 256, 512);
    g.addColorStop(0, "#05070d");
    g.addColorStop(0.45, "#0a1226");
    g.addColorStop(1, "#04060b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 512);
    const rg = ctx.createRadialGradient(150, 180, 10, 150, 180, 240);
    rg.addColorStop(0, accent);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, 256, 512);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(78, 60, 100, 16);
    ctx.fillRect(78, 88, 66, 16);
    ctx.fillRect(40, 400, 176, 3);
    ctx.fillRect(40, 414, 120, 3);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [accent]);

  return (
    <mesh position={[0, 0, 0.008]}>
      <planeGeometry args={[w, h, 1, 1]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={intensity}
        roughness={0.14}
        metalness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
};

/** Repeating grid texture used for speaker grilles / vents / stitching. */
export const gridTexture = (line = "#ffffff", bg = "rgba(255,255,255,0)", step = 12) => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = line;
  ctx.lineWidth = 3;
  for (let i = 0; i < 128; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  return t;
};

/* ------------------------------------------------------------- SMARTPHONE */

export function Smartphone({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  return (
    <group scale={1.02}>
      {/* battery */}
      <Part dir={[0.9, -0.2, 0]} explode={explode} amount={0.8} position={[0, -0.12, -0.02]}>
        <RoundedBox args={[0.86, 1.3, 0.06]} radius={0.03} smoothness={2}>
          {mat({ color: "#2b2f38", emissive: "#1c2b4a", emissiveIntensity: 0.35, roughness: 0.5, metalness: 0.6 })}
        </RoundedBox>
      </Part>
      {/* logic board */}
      <Part dir={[-0.9, 0.45, 0]} explode={explode} amount={0.8} position={[0, 0.66, -0.02]}>
        <mesh>
          <boxGeometry args={[0.9, 0.5, 0.04]} />
          {mat({ color: "#1a3d2b", roughness: 0.6, metalness: 0.4 })}
        </mesh>
        {[-0.28, 0, 0.28].map((x) => (
          <mesh key={x} position={[x, 0, 0.03]}>
            <boxGeometry args={[0.16, 0.16, 0.03]} />
            {mat({ color: "#3a3f4a", metalness: 0.8, roughness: 0.3 })}
          </mesh>
        ))}
      </Part>
      {/* speaker + haptic */}
      <Part dir={[-0.6, -1, 0]} explode={explode} amount={0.7} position={[0.1, -0.86, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
          {mat({ color: "#22262e", roughness: 0.7, metalness: 0.4 })}
        </mesh>
      </Part>
      {/* frame */}
      <Part dir={[0, 0, -1]} explode={explode} amount={0.45}>
        <RoundedBox args={[1.02, 2.06, 0.12]} radius={0.13} smoothness={4}>
          {mat({ color, roughness: 0.22, metalness: 0.95 })}
        </RoundedBox>
        {/* side buttons */}
        {[-0.42, -0.18].map((y, i) => (
          <mesh key={i} position={[0.53, y, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.02, i ? 0.18 : 0.32, 0.05]} />
            {Metal(color)}
          </mesh>
        ))}
      </Part>
      {/* back glass + camera module */}
      <Part dir={[0, 0, 1]} explode={explode} amount={0.9}>
        <mesh position={[0, 0, -0.07]}>
          <boxGeometry args={[0.94, 1.98, 0.02]} />
          {Paint(color === "#e6e9ef" ? "#dfe3ea" : color)}
        </mesh>
        <group position={[-0.24, 0.66, -0.11]}>
          <RoundedBox args={[0.44, 0.44, 0.06]} radius={0.12} smoothness={3}>
            {mat({ color, roughness: 0.18, metalness: 0.9 })}
          </RoundedBox>
          {[
            [-0.09, 0.09],
            [0.09, 0.09],
            [0, -0.1],
          ].map(([x, y], i) => (
            <group key={i} position={[x, y, -0.045]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.075, 0.075, 0.05, 24]} />
                {Metal("#8e959f")}
              </mesh>
              <mesh position={[0, 0, -0.026]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />
                {mat({ color: "#0a1020", roughness: 0.05, metalness: 0.6 })}
              </mesh>
            </group>
          ))}
        </group>
      </Part>
      {/* display */}
      <Part dir={[0, 0, 0.9]} explode={explode} amount={0.85} position={[0, 0, 0.062]}>
        <RoundedBox args={[0.96, 2.0, 0.02]} radius={0.1} smoothness={3}>
          {mat({ color: "#05070c", roughness: 0.08, metalness: 0.4 })}
        </RoundedBox>
        <Screen w={0.9} h={1.94} accent={accent} />
      </Part>
    </group>
  );
}

/* ----------------------------------------------------------------- LAPTOP */

export function Laptop({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  const keys = useMemo(() => {
    const arr: [number, number][] = [];
    const rows = 5;
    const cols = 14;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) arr.push([c - (cols - 1) / 2, r - (rows - 1) / 2]);
    return arr;
  }, []);
  return (
    <group scale={0.92} position={[0, -0.15, 0]}>
      {/* lid */}
      <Part dir={[0, 0.9, -0.6]} explode={explode} amount={0.9} position={[0, 0.02, -0.72]}>
        <group rotation={[-1.38, 0, 0]}>
          <RoundedBox args={[2.3, 1.55, 0.06]} radius={0.03} smoothness={3}>
            {mat({ color, roughness: 0.3, metalness: 0.9 })}
          </RoundedBox>
          <group position={[0, 0, 0.045]}>
            <mesh>
              <planeGeometry args={[2.16, 1.4]} />
              {mat({ color: "#04060b", roughness: 0.1, metalness: 0.3 })}
            </mesh>
            <Screen w={2.14} h={1.38} accent={accent} intensity={0.9} />
          </group>
        </group>
      </Part>
      {/* base */}
      <Part dir={[0, -0.6, 0.5]} explode={explode} amount={0.6}>
        <RoundedBox args={[2.3, 0.08, 1.55]} radius={0.035} smoothness={3} position={[0, -0.04, 0]}>
          {mat({ color, roughness: 0.28, metalness: 0.92 })}
        </RoundedBox>
        {/* keyboard deck */}
        <group position={[0, 0.012, -0.22]}>
          <mesh>
            <planeGeometry args={[2.0, 0.86]} />
            {mat({ color: "#0b0d12", roughness: 0.55, metalness: 0.3 })}
          </mesh>
          {keys.map(([x, y], i) => (
            <mesh key={i} position={[x * 0.138, y * 0.152, 0.012]}>
              <boxGeometry args={[0.118, 0.128, 0.02]} />
              {mat({ color: "#161a22", roughness: 0.6, metalness: 0.2 })}
            </mesh>
          ))}
        </group>
        {/* trackpad */}
        <mesh position={[0, 0.012, 0.45]}>
          <planeGeometry args={[0.9, 0.42]} />
          {mat({ color: "#10131a", roughness: 0.2, metalness: 0.5 })}
        </mesh>
      </Part>
      {/* internals */}
      <Part dir={[0, -1, 0]} explode={explode} amount={0.5} position={[0, -0.16, 0]}>
        <mesh>
          <boxGeometry args={[1.7, 0.04, 1.0]} />
          {mat({ color: "#1a3d2b", roughness: 0.6, metalness: 0.4 })}
        </mesh>
      </Part>
    </group>
  );
}

/* -------------------------------------------------------------- HEADPHONE */

export function Headphone({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  const seg = explode;
  return (
    <group scale={1.05}>
      {/* headband */}
      <Part dir={[0, 1, 0]} explode={seg} amount={0.5}>
        <group rotation={[0, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.92, 0.055, 12, 48, Math.PI]} />
            {mat({ color, roughness: 0.25, metalness: 0.9 })}
          </mesh>
          <mesh scale={[1, 1.02, 1.35]} position={[0, 0.02, 0]}>
            <torusGeometry args={[0.92, 0.045, 10, 32, Math.PI]} />
            {Leather("#191c22")}
          </mesh>
        </group>
      </Part>
      {/* left cup */}
      <Part dir={[-0.9, -0.35, 0]} explode={seg} amount={0.8} position={[-0.92, -0.02, 0]}>
        <EarCup color={color} accent={accent} side={-1} />
      </Part>
      {/* right cup */}
      <Part dir={[0.9, -0.35, 0]} explode={seg} amount={0.8} position={[0.92, -0.02, 0]}>
        <EarCup color={color} accent={accent} side={1} />
      </Part>
      {/* driver */}
      <Part dir={[0, -1, 0]} explode={seg} amount={0.6} position={[0, -0.72, 0.2]}>
        <Cylinder args={[0.34, 0.34, 0.06, 24]} rotation={[Math.PI / 2, 0, 0]}>
          {mat({ color: "#1b1f26", roughness: 0.5, metalness: 0.6 })}
        </Cylinder>
      </Part>
    </group>
  );
}

function EarCup({ color, accent, side }: { color: string; accent?: string; side: number }) {
  return (
    <group rotation={[0, 0, side * 0.06]}>
      <Cylinder args={[0.46, 0.42, 0.3, 32]} rotation={[0, 0, Math.PI / 2]}>
        {mat({ color, roughness: 0.24, metalness: 0.92 })}
      </Cylinder>
      {/* cushion */}
      <Cylinder args={[0.42, 0.38, 0.14, 32]} position={[side * -0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        {Leather("#14161b")}
      </Cylinder>
      {/* outer ring glow */}
      <Torus args={[0.44, 0.022, 8, 40]} position={[side * 0.16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {Glow(accent ?? "#38dcff", 1.8)}
      </Torus>
      {/* yoke */}
      <Torus args={[0.2, 0.03, 8, 24, Math.PI]} position={[side * 0.22, 0.34, 0]} rotation={[0, side * Math.PI * 0.5, 0]}>
        {Metal(color)}
      </Torus>
    </group>
  );
}

/* ---------------------------------------------------------------- EARBUDS */

export function Earbuds({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  return (
    <group>
      <Part dir={[0, -0.9, 0]} explode={explode} amount={0.7} position={[0, -0.25, 0]}>
        <RoundedBox args={[1.15, 0.42, 0.85]} radius={0.18} smoothness={4}>
          {mat({ color, roughness: 0.25, metalness: 0.3, clearcoat: 1 })}
        </RoundedBox>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.9, 0.02, 0.6]} />
          {Glow(accent ?? "#38dcff", 1.4)}
        </mesh>
      </Part>
      {[-1, 1].map((s) => (
        <Part key={s} dir={[s * 0.6, 0.9, 0]} explode={explode} amount={0.6} position={[s * 0.36, 0.5, 0.05]}>
          <group rotation={[0, 0, s * 0.4]}>
            <Sphere args={[0.16, 20, 16]}>
              {mat({ color: "#e9edf3", roughness: 0.2, metalness: 0.2, clearcoat: 1 })}
            </Sphere>
            <Capsule args={[0.075, 0.22, 4, 12]} position={[0, -0.16, 0]} rotation={[0, 0, s * 0.5]}>
              {mat({ color: "#e9edf3", roughness: 0.25, metalness: 0.2 })}
            </Capsule>
            <Sphere args={[0.05, 12, 10]} position={[0, 0.0, -0.15]}>
              {mat({ color: "#0b0d12", roughness: 0.4 })}
            </Sphere>
          </group>
        </Part>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- SPEAKER */

export function Speaker({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  const grille = useMemo(() => gridTexture("rgba(0,0,0,0.55)", "#0d1016", 7), []);
  return (
    <group>
      {/* levitating tweeter ring */}
      <Part dir={[0, 1, 0]} explode={explode} amount={0.9} position={[0, 1.18, 0]}>
        <Torus args={[0.34, 0.05, 10, 40]} rotation={[Math.PI / 2, 0, 0]}>
          {mat({ color: "#d7dde6", roughness: 0.12, metalness: 1 })}
        </Torus>
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.02, 8, 32]} />
          {Glow(accent ?? "#38dcff", 2.2)}
        </mesh>
      </Part>
      {/* body */}
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <Cylinder args={[0.56, 0.6, 1.5, 40]}>
          {mat({ color, roughness: 0.2, metalness: 0.95 })}
        </Cylinder>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.575, 0.615, 1.1, 40, 1, true]} />
          <meshStandardMaterial map={grille} roughness={0.75} metalness={0.4} color="#8d949f" />
        </mesh>
        <Torus args={[0.58, 0.03, 8, 44]} position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {mat({ color: "#e8edf5", roughness: 0.1, metalness: 1 })}
        </Torus>
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
          {Glow(accent ?? "#38dcff", 1.1)}
        </mesh>
      </Part>
      {/* woofer base */}
      <Part dir={[0, -1, 0]} explode={explode} amount={0.7} position={[0, -0.98, 0]}>
        <Cylinder args={[0.66, 0.72, 0.16, 40]}>
          {mat({ color: "#0e1016", roughness: 0.5, metalness: 0.5 })}
        </Cylinder>
      </Part>
    </group>
  );
}

/* ---------------------------------------------------------------- CONSOLE */

export function Console({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0, 0.2, 0]}>
      {/* core */}
      <Part dir={[0, -0.5, 0]} explode={explode} amount={0.6}>
        <RoundedBox args={[1.5, 0.62, 0.72]} radius={0.05} smoothness={3}>
          {mat({ color: "#0c0e13", roughness: 0.45, metalness: 0.5 })}
        </RoundedBox>
        <mesh position={[0, 0.1, 0.37]}>
          <planeGeometry args={[1.2, 0.06]} />
          {Glow(accent ?? "#38dcff", 2.4)}
        </mesh>
      </Part>
      {/* shell top */}
      <Part dir={[0, 1, 0.2]} explode={explode} amount={0.75} position={[0, 0.12, 0]}>
        <RoundedBox args={[2.05, 0.1, 0.86]} radius={0.05} smoothness={3} position={[0, 0.34, 0]} rotation={[0, 0, 0.03]}>
          {mat({ color, roughness: 0.28, metalness: 0.2, clearcoat: 1 })}
        </RoundedBox>
      </Part>
      {/* shell bottom */}
      <Part dir={[0, -1, 0.2]} explode={explode} amount={0.75} position={[0, -0.5, 0]}>
        <RoundedBox args={[2.05, 0.1, 0.86]} radius={0.05} smoothness={3} position={[0, -0.36, 0]} rotation={[0, 0, -0.03]}>
          {mat({ color, roughness: 0.28, metalness: 0.2, clearcoat: 1 })}
        </RoundedBox>
      </Part>
      {/* stand */}
      <Part dir={[0.6, -1, 0]} explode={explode} amount={0.7} position={[0, -0.62, 0]}>
        <RoundedBox args={[0.7, 0.05, 0.7]} radius={0.02} smoothness={3}>
          {mat({ color: "#12151c", roughness: 0.3, metalness: 0.85 })}
        </RoundedBox>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------- CONTROLLER */

export function Controller({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  const btn = ["#e8edf5", accent ?? "#38dcff", "#e05a7a", "#4be0a5"];
  return (
    <group rotation={[0.15, 0, 0]}>
      {/* body */}
      <Part dir={[0, 0, 1]} explode={explode} amount={0.7}>
        <group scale={[1.25, 0.52, 0.72]}>
          <Sphere args={[0.5, 28, 20]}>
            {mat({ color, roughness: 0.35, metalness: 0.25, clearcoat: 0.8 })}
          </Sphere>
        </group>
      </Part>
      {/* grips */}
      {[-1, 1].map((s) => (
        <Part key={s} dir={[s * 0.7, -0.7, 0.2]} explode={explode} amount={0.7}>
          <Capsule args={[0.17, 0.34, 4, 16]} position={[s * 0.44, -0.2, 0.16]} rotation={[0.5, 0, s * -0.42]}>
            {mat({ color, roughness: 0.5, metalness: 0.15 })}
          </Capsule>
        </Part>
      ))}
      {/* thumbsticks */}
      {[-0.24, 0.3].map((x, i) => (
        <Part key={i} dir={[x * 2, 1, 0]} explode={explode} amount={0.5}>
          <group position={[x, 0.12, 0.18]}>
            <Cylinder args={[0.11, 0.13, 0.06, 20]}>
              {Rubber("#15181e")}
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 0.09, 14]} position={[0, 0.07, 0]}>
              {mat({ color: "#1c2028", roughness: 0.6 })}
            </Cylinder>
            <Torus args={[0.11, 0.012, 6, 20]} position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
              {Glow(accent ?? "#38dcff", 1.6)}
            </Torus>
          </group>
        </Part>
      ))}
      {/* dpad */}
      <Part dir={[-0.5, 1, 0.4]} explode={explode} amount={0.6}>
        <group position={[-0.42, 0.11, 0.02]}>
          <mesh>
            <boxGeometry args={[0.2, 0.02, 0.07]} />
            {mat({ color: "#12151b", roughness: 0.5 })}
          </mesh>
          <mesh>
            <boxGeometry args={[0.07, 0.02, 0.2]} />
            {mat({ color: "#12151b", roughness: 0.5 })}
          </mesh>
        </group>
      </Part>
      {/* face buttons */}
      {[
        [0, -0.06],
        [0, 0.12],
        [-0.09, 0.03],
        [0.09, 0.03],
      ].map(([x, z], i) => (
        <Part key={i} dir={[0.6, 1, 0.4]} explode={explode} amount={0.6}>
          <Cylinder args={[0.045, 0.045, 0.03, 16]} position={[0.52 + x * 1.1, 0.13, 0.03 + z * 2]}>
            {mat({ color: btn[i], roughness: 0.3, metalness: 0.4 })}
          </Cylinder>
        </Part>
      ))}
      {/* bumpers */}
      {[-1, 1].map((s) => (
        <Part key={s} dir={[s, 1, -0.4]} explode={explode} amount={0.6}>
          <RoundedBox args={[0.32, 0.06, 0.16]} radius={0.02} smoothness={2} position={[s * 0.3, 0.24, -0.16]} rotation={[0.2, 0, 0]}>
            {mat({ color, roughness: 0.35, metalness: 0.3 })}
          </RoundedBox>
        </Part>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ VISOR */

export function Visor({ color, accent = "#8b5cf6", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0.08, 0, 0]}>
      <Part dir={[0, 0, 1]} explode={explode} amount={0.8}>
        <RoundedBox args={[1.6, 0.56, 0.5]} radius={0.16} smoothness={4}>
          {mat({ color, roughness: 0.3, metalness: 0.4, clearcoat: 0.6 })}
        </RoundedBox>
      </Part>
      {/* lens */}
      <Part dir={[0, 0, 1.6]} explode={explode} amount={0.8} position={[0, 0, 0.26]}>
        <RoundedBox args={[1.5, 0.44, 0.03]} radius={0.12} smoothness={3}>
          {mat({ color: "#0a0d16", roughness: 0.05, metalness: 0.7 })}
        </RoundedBox>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.46, 0.4]} />
          {mat({ color: accent ?? "#8b5cf6", emissive: accent ?? "#8b5cf6", emissiveIntensity: 0.7, roughness: 0.2 })}
        </mesh>
      </Part>
      {/* straps */}
      {[-1, 1].map((s) => (
        <Part key={s} dir={[s, 0, -0.6]} explode={explode} amount={0.6}>
          <RoundedBox args={[0.22, 0.3, 0.3]} radius={0.06} smoothness={3} position={[s * 0.86, 0, -0.16]}>
            {mat({ color, roughness: 0.4, metalness: 0.3 })}
          </RoundedBox>
        </Part>
      ))}
      <Part dir={[0, 1, -0.8]} explode={explode} amount={0.6} position={[0, 0.28, -0.3]}>
        <Torus args={[0.42, 0.045, 8, 24, Math.PI]} rotation={[Math.PI / 2, 0, 0]}>
          {Rubber("#181b21")}
        </Torus>
      </Part>
      {/* tracking cameras */}
      {[-0.5, 0.5].map((x) => (
        <group key={x} position={[x, -0.16, 0.27]}>
          <Cylinder args={[0.05, 0.05, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]}>
            {mat({ color: "#070a10", roughness: 0.1, metalness: 0.5 })}
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

/* --------------------------------------------------------------- KEYBOARD */

export function Keyboard({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  const keys = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number] }[] = [];
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      const cols = r === 0 ? 14 : 13;
      for (let c = 0; c < cols; c++) {
        out.push({ p: [(c - (cols - 1) / 2) * 0.145, 0.075, (r - 2) * 0.15], s: [0.128, 0.132] });
      }
    }
    return out;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  return (
    <group>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.5}>
        <RoundedBox args={[2.25, 0.12, 0.86]} radius={0.03} smoothness={3} position={[0, 0, 0]}>
          {mat({ color, roughness: 0.26, metalness: 0.92 })}
        </RoundedBox>
      </Part>
      <Part dir={[0, 1, 0]} explode={explode} amount={0.8}>
        <Keycaps keys={keys} ref={ref} />
      </Part>
      <Part dir={[0, 0, 1]} explode={explode} amount={0.6} position={[0, -0.02, 0.1]}>
        <mesh>
          <boxGeometry args={[1.9, 0.04, 0.6]} />
          {mat({ color: "#1a3d2b", roughness: 0.6, metalness: 0.3 })}
        </mesh>
      </Part>
      <mesh position={[1.0, 0.062, -0.3]}>
        <planeGeometry args={[0.05, 0.05]} />
        {Glow(accent ?? "#38dcff", 2)}
      </mesh>
    </group>
  );
}

const Keycaps = ({
  keys,
  ref,
}: {
  keys: { p: [number, number, number]; s: [number, number] }[];
  ref: React.RefObject<THREE.InstancedMesh | null>;
}) => {
  const set = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh || (mesh as unknown as { _set?: boolean })._set) return;
    const m = new THREE.Matrix4();
    keys.forEach((k, i) => {
      m.makeScale(k.s[0], 0.04, k.s[1]);
      m.setPosition(k.p[0], k.p[1], k.p[2]);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    (mesh as unknown as { _set?: boolean })._set = true;
  };
  return (
    <instancedMesh ref={(n) => { ref.current = n; set(n); }} args={[undefined, undefined, keys.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      {mat({ color: "#191d25", roughness: 0.55, metalness: 0.25 })}
    </instancedMesh>
  );
};

/* ----------------------------------------------------------------- CAMERA */

export function Camera({ color, accent = "#e05a3a", explode = 0 }: ModelProps) {
  return (
    <group>
      {/* lens */}
      <Part dir={[0, 0, 1]} explode={explode} amount={1.0} position={[0, 0, 0.55]}>
        <Cylinder args={[0.36, 0.4, 0.42, 32]} rotation={[Math.PI / 2, 0, 0]}>
          {mat({ color: "#0f1218", roughness: 0.35, metalness: 0.6 })}
        </Cylinder>
        <Torus args={[0.37, 0.02, 8, 32]} position={[0, 0, 0.16]}>
          {Metal("#9aa2ae")}
        </Torus>
        <Torus args={[0.34, 0.02, 8, 32]} position={[0, 0, 0.02]}>
          {Rubber("#0a0c10")}
        </Torus>
        <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          {mat({ color: "#101a33", roughness: 0.05, metalness: 0.4 })}
        </mesh>
      </Part>
      {/* body */}
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <RoundedBox args={[1.5, 0.92, 0.62]} radius={0.09} smoothness={4}>
          {mat({ color, roughness: 0.32, metalness: 0.72 })}
        </RoundedBox>
        <RoundedBox args={[0.5, 0.8, 0.64]} radius={0.08} smoothness={3} position={[-0.5, -0.02, 0]}>
          {Rubber("#14161b")}
        </RoundedBox>
        <mesh position={[0, 0.05, -0.32]}>
          <planeGeometry args={[1.2, 0.72]} />
          {mat({ color: "#080a10", roughness: 0.1, metalness: 0.5 })}
        </mesh>
      </Part>
      {/* top plate + dials */}
      <Part dir={[0, 1, 0]} explode={explode} amount={0.7}>
        <RoundedBox args={[1.5, 0.1, 0.6]} radius={0.03} smoothness={3} position={[0, 0.5, 0]}>
          {Metal(color)}
        </RoundedBox>
        <Cylinder args={[0.16, 0.16, 0.1, 24]} position={[0.42, 0.58, -0.08]}>
          {Rubber("#0d0f14")}
        </Cylinder>
        <Cylinder args={[0.12, 0.12, 0.09, 20]} position={[-0.05, 0.57, -0.12]}>
          {Rubber("#0d0f14")}
        </Cylinder>
        <RoundedBox args={[0.3, 0.12, 0.34]} radius={0.03} smoothness={2} position={[0.2, 0.6, 0.16]}>
          {mat({ color: "#0a0c11", roughness: 0.4, metalness: 0.5 })}
        </RoundedBox>
      </Part>
      {/* sensor */}
      <Part dir={[0, -1, 0]} explode={explode} amount={0.7} position={[0, -0.62, 0]}>
        <mesh>
          <boxGeometry args={[0.62, 0.04, 0.5]} />
          {mat({ color: "#141c3a", roughness: 0.05, metalness: 0.7, emissive: accent ?? "#e05a3a", emissiveIntensity: 0.15 })}
        </mesh>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------------ DRONE */

export function Drone({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  const arms: [number, number][] = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];
  return (
    <group rotation={[0, 0.4, 0]}>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.5}>
        <RoundedBox args={[1.0, 0.24, 0.6]} radius={0.09} smoothness={4}>
          {mat({ color, roughness: 0.28, metalness: 0.6 })}
        </RoundedBox>
        <mesh position={[0, 0.125, 0]}>
          <planeGeometry args={[0.5, 0.3]} />
          {mat({ color: "#05070c", roughness: 0.1, metalness: 0.6 })}
        </mesh>
      </Part>
      {arms.map(([x, z], i) => (
        <group key={i}>
          <Part dir={[x * 1.1, 0.2, z * 1.1]} explode={explode} amount={0.7}>
            <RoundedBox args={[0.62, 0.07, 0.12]} radius={0.03} smoothness={2} position={[x * 0.52, 0.04, z * 0.32]} rotation={[0, -x * z * 0.5, 0]}>
              {mat({ color: "#1b1f27", roughness: 0.4, metalness: 0.6 })}
            </RoundedBox>
          </Part>
          <Part dir={[x * 1.5, 0.7, z * 1.5]} explode={explode} amount={0.8}>
            <group position={[x * 0.78, 0.12, z * 0.5]}>
              <Cylinder args={[0.1, 0.12, 0.1, 16]}>
                {mat({ color, roughness: 0.3, metalness: 0.7 })}
              </Cylinder>
              <group position={[0, 0.08, 0]}>
                {[0, 1].map((b) => (
                  <mesh key={b} rotation={[0, (b * Math.PI) / 2, 0]}>
                    <boxGeometry args={[0.72, 0.012, 0.09]} />
                    {mat({ color: "#c8ccd4", roughness: 0.25, metalness: 0.8, opacity: 0.9, transparent: true })}
                  </mesh>
                ))}
              </group>
              <Torus args={[0.2, 0.012, 6, 24]} position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
                {Glow(accent ?? "#38dcff", 1.2)}
              </Torus>
            </group>
          </Part>
        </group>
      ))}
      {/* gimbal camera */}
      <Part dir={[0, -1, 0.6]} explode={explode} amount={0.7} position={[0, -0.2, 0.3]}>
        <Sphere args={[0.13, 20, 16]}>
          {mat({ color: "#0c0f15", roughness: 0.2, metalness: 0.6 })}
        </Sphere>
        <Cylinder args={[0.07, 0.07, 0.06, 20]} position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
          {mat({ color: "#060910", roughness: 0.05, metalness: 0.5 })}
        </Cylinder>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------------ MOUSE */

export function Mouse({ color, accent = "#8b5cf6", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0, 0, 0]}>
      <Part dir={[0, 1, 0]} explode={explode} amount={0.6}>
        <group scale={[0.62, 0.4, 1.0]}>
          <Sphere args={[0.6, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]}>
            {mat({ color, roughness: 0.22, metalness: 0.7 })}
          </Sphere>
        </group>
      </Part>
      <Part dir={[0.6, 0.6, 0]} explode={explode} amount={0.6} position={[0, 0.1, -0.22]}>
        <RoundedBox args={[0.24, 0.05, 0.34]} radius={0.02} smoothness={3} position={[0, 0.13, -0.2]} rotation={[0.06, 0, 0]}>
          {mat({ color, roughness: 0.25, metalness: 0.7 })}
        </RoundedBox>
      </Part>
      <Part dir={[-0.6, 0.6, 0]} explode={explode} amount={0.6} position={[0, 0.1, -0.22]}>
        <RoundedBox args={[0.24, 0.05, 0.34]} radius={0.02} smoothness={3} position={[0, 0.13, -0.2]} rotation={[0.06, 0, 0]}>
          {mat({ color, roughness: 0.25, metalness: 0.7 })}
        </RoundedBox>
      </Part>
      <Part dir={[0, 1.4, 0]} explode={explode} amount={0.7}>
        <Cylinder args={[0.05, 0.05, 0.06, 16]} position={[0, 0.2, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          {Rubber("#0f1218")}
        </Cylinder>
      </Part>
      <mesh position={[0, -0.16, 0.16]} rotation={[-0.5, 0, 0]}>
        <planeGeometry args={[0.06, 0.3]} />
        {Glow(accent ?? "#8b5cf6", 2.4)}
      </mesh>
      <Part dir={[0, -1, 0]} explode={explode} amount={0.6} position={[0, -0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.4, 0.04, 0.5]} />
          {mat({ color: "#1a3d2b", roughness: 0.6, metalness: 0.3 })}
        </mesh>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------- PROJECTOR */

export function Projector({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  return (
    <group>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <RoundedBox args={[1.7, 0.36, 1.15]} radius={0.08} smoothness={4}>
          {mat({ color, roughness: 0.24, metalness: 0.8 })}
        </RoundedBox>
        <mesh position={[0, 0.185, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.0, 0.7]} />
          {mat({ color: "#0b0e14", roughness: 0.06, metalness: 0.6 })}
        </mesh>
      </Part>
      <Part dir={[0, 0, 1]} explode={explode} amount={1.0} position={[0.5, 0, 0.6]}>
        <Cylinder args={[0.2, 0.22, 0.18, 32]} rotation={[Math.PI / 2, 0, 0]}>
          {mat({ color: "#0a0d13", roughness: 0.2, metalness: 0.7 })}
        </Cylinder>
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          {Glow(accent ?? "#38dcff", 1.6)}
        </mesh>
      </Part>
      <Part dir={[0, 1, 0]} explode={explode} amount={0.7} position={[0, 0.36, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 0.04, 0.8]} />
          {mat({ color: "#1a3d2b", roughness: 0.6, metalness: 0.3 })}
        </mesh>
      </Part>
      <Part dir={[0, -1, 0]} explode={explode} amount={0.6} position={[0, -0.3, 0]}>
        <RoundedBox args={[1.2, 0.06, 0.8]} radius={0.02} smoothness={2}>
          {mat({ color: "#12151c", roughness: 0.4, metalness: 0.6 })}
        </RoundedBox>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------ SMARTWATCH */

export function Smartwatch({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0.2, 0, 0]}>
      {/* bands */}
      <Part dir={[0, 1, 0]} explode={explode} amount={0.8}>
        <RoundedBox args={[0.5, 0.72, 0.1]} radius={0.05} smoothness={3} position={[0, 0.72, -0.04]} rotation={[0.16, 0, 0]}>
          {Rubber(color)}
        </RoundedBox>
      </Part>
      <Part dir={[0, -1, 0]} explode={explode} amount={0.8}>
        <RoundedBox args={[0.5, 0.72, 0.1]} radius={0.05} smoothness={3} position={[0, -0.72, -0.04]} rotation={[-0.16, 0, 0]}>
          {Rubber(color)}
        </RoundedBox>
      </Part>
      {/* case */}
      <Part dir={[0, 0, -0.8]} explode={explode} amount={0.7}>
        <RoundedBox args={[0.95, 1.15, 0.26]} radius={0.2} smoothness={5}>
          {mat({ color, roughness: 0.2, metalness: 0.95 })}
        </RoundedBox>
        <Cylinder args={[0.07, 0.07, 0.1, 18]} position={[0.5, 0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
          {mat({ color: "#e05a3a", roughness: 0.3, metalness: 0.7 })}
        </Cylinder>
        <RoundedBox args={[0.06, 0.22, 0.1]} radius={0.02} smoothness={2} position={[0.5, -0.08, 0]}>
          {mat({ color, roughness: 0.25, metalness: 0.9 })}
        </RoundedBox>
      </Part>
      {/* display */}
      <Part dir={[0, 0, 1]} explode={explode} amount={0.9} position={[0, 0, 0.14]}>
        <RoundedBox args={[0.82, 1.02, 0.03]} radius={0.16} smoothness={4}>
          {mat({ color: "#05070c", roughness: 0.06, metalness: 0.4 })}
        </RoundedBox>
        <Screen w={0.76} h={0.96} accent={accent} intensity={1.2} />
      </Part>
      {/* internals */}
      <Part dir={[0.8, 0, 0]} explode={explode} amount={0.8} position={[0, 0, -0.02]}>
        <mesh>
          <boxGeometry args={[0.6, 0.8, 0.06]} />
          {mat({ color: "#1a3d2b", roughness: 0.6, metalness: 0.4 })}
        </mesh>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------ small extras */

export const Bulb = ({ accent = "#fb923c" }: { accent?: string }) => (
  <group>
    <Sphere args={[0.16, 16, 12]}>
      {Glow(accent, 3)}
    </Sphere>
    <pointLight color={accent} intensity={2.2} distance={4} />
  </group>
);
