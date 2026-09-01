import { useMemo, useRef, useState } from "react";
import { ContactShadows, Html, MeshReflectorMaterial, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Canvas3D } from "./SceneCanvas";
import { LightingSystem } from "./LightingSystem";
import { ProductModel } from "./ProductModel";
import { ParticleField, FloatingMotes } from "./ParticleField";
import type { Product } from "@/data/products";
import { setCursor } from "@/lib/cursor";
import { currency } from "@/lib/utils";
import { useIsCompact } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ room */

function Room({ accent = "#38dcff" }: { accent?: string }) {
  const compact = useIsCompact();
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[46, 46]} />
        <MeshReflectorMaterial
          blur={[compact ? 140 : 260, compact ? 50 : 80]}
          resolution={compact ? 256 : 512}
          mixBlur={1}
          mixStrength={38}
          roughness={0.72}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#0a0c12"
          metalness={0.62}
          mirror={0.45}
        />
      </mesh>
      {/* glowing floor grid lines */}
      {[-9, -4.5, 0, 4.5, 9].map((z) => (
        <mesh key={`z${z}`} position={[0, -1.58, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 0.03]} />
          <meshBasicMaterial color={accent} transparent opacity={0.22} />
        </mesh>
      ))}
      {[-9, -4.5, 0, 4.5, 9].map((x) => (
        <mesh key={`x${x}`} position={[x, -1.58, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[30, 0.03]} />
          <meshBasicMaterial color={accent} transparent opacity={0.22} />
        </mesh>
      ))}
      {/* back wall */}
      <mesh position={[0, 4.5, -13]}>
        <planeGeometry args={[34, 16]} />
        <meshStandardMaterial color="#080a10" roughness={0.85} metalness={0.3} />
      </mesh>
      {/* side walls */}
      {[-13, 13].map((x) => (
        <mesh key={x} position={[x, 4.5, 0]} rotation={[0, -Math.sign(x) * Math.PI / 2, 0]}>
          <planeGeometry args={[30, 16]} />
          <meshStandardMaterial color="#070910" roughness={0.9} metalness={0.25} />
        </mesh>
      ))}
      {/* ceiling light bars */}
      {[-6, 0, 6].map((x) => (
        <group key={x} position={[x, 6.4, -2]}>
          <mesh>
            <boxGeometry args={[0.3, 0.06, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
          {x === 0 && <pointLight position={[0, 4.4, 0]} intensity={16} distance={20} color="#dbe7ff" />}
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------- pedestal */

export function ProductPedestal({
  product,
  position,
  onSelect,
  index = 0,
}: {
  product: Product;
  position: [number, number, number];
  onSelect: (p: Product) => void;
  index?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const compact = useIsCompact();
  const accent = product.colors[product.colors.length - 1]?.hex ?? "#38dcff";

  useFrame((state, delta) => {
    if (spin.current) spin.current.rotation.y += delta * (hovered ? 0.65 : 0.22);
    if (group.current) {
      const t = state.clock.elapsedTime + index;
      const target = hovered ? 1.1 : 1;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
      group.current.position.y = position[1] + Math.sin(t * 0.8) * 0.06;
    }
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setCursor({ mode: "view", label: "VIEW 3D" });
      }}
      onPointerOut={() => {
        setHovered(false);
        setCursor({ mode: "default" });
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(product);
      }}
    >
      {/* spot beam — only rendered for the pedestal under the cursor */}
      {hovered && (
        <spotLight
          position={[0, 4.2, 0.6]}
          angle={0.45}
          penumbra={0.9}
          intensity={40}
          distance={12}
          color="#ffffff"
        />
      )}
      <mesh position={[0, -1.55, 0]} receiveShadow>
        <cylinderGeometry args={[0.86, 1.0, 0.14, 40]} />
        <meshStandardMaterial color="#0d1017" roughness={0.22} metalness={0.9} />
      </mesh>
      <mesh position={[0, -1.47, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.86, 0.94, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={hovered ? 0.85 : 0.35} />
      </mesh>
      {/* glass case */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 2.7, 40, 1, true]} />
        <meshPhysicalMaterial
          color="#cfe9ff"
          transparent
          opacity={hovered ? 0.13 : 0.06}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={spin}>
        <ProductModel kind={product.model} color={product.colors[0].hex} accent={accent} lowDetail={compact} />
      </group>

      <Html position={[0, -1.85, 0]} center distanceFactor={11} zIndexRange={[15, 0]}>
        <button
          onClick={() => onSelect(product)}
          className={`pointer-events-auto w-44 rounded-2xl border px-3 py-2 text-center backdrop-blur-md transition-all duration-300 ${
            hovered
              ? "border-cyan-300/50 bg-cyan-400/10 shadow-[0_0_36px_-10px_rgba(56,220,255,0.9)]"
              : "border-white/10 bg-black/60"
          }`}
        >
          <p className="truncate text-[11px] font-semibold text-white">{product.name}</p>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-white/55">
            {currency(product.price)}
            <ChevronRight className="h-3 w-3" />
          </p>
        </button>
      </Html>
    </group>
  );
}

/* ----------------------------------------------------------------- scene */

export function ShowroomScene({
  products,
  onSelect,
  allowZoom = true,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
  allowZoom?: boolean;
}) {
  const compact = useIsCompact();
  const items = useMemo(() => products.slice(0, compact ? 6 : 8), [products, compact]);
  const radius = items.length > 6 ? 6.2 : 5.2;

  return (
    <>
      <LightingSystem intensity={0.85} />
      <Room />
      <ParticleField count={compact ? 90 : 320} radius={11} color="#8ad8ff" size={0.028} speed={0.05} />
      <FloatingMotes count={10} />
      <ContactShadows position={[0, -1.52, 0]} opacity={0.5} scale={26} blur={2.4} far={6} resolution={512} />

      {items.map((p, i) => {
        const a = (i / items.length) * Math.PI * 2;
        return (
          <ProductPedestal
            key={p.id}
            product={p}
            index={i}
            position={[Math.sin(a) * radius, -0.1, Math.cos(a) * radius]}
            onSelect={onSelect}
          />
        );
      })}

      {/* brand monolith */}
      <mesh position={[0, 1.6, -9.5]}>
        <boxGeometry args={[2.6, 6.4, 0.25]} />
        <meshStandardMaterial color="#0b0e15" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.6, -9.35]}>
        <planeGeometry args={[2.2, 5.6]} />
        <meshStandardMaterial color="#38dcff" emissive="#38dcff" emissiveIntensity={0.55} toneMapped={false} />
      </mesh>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        target={[0, 0.4, 0]}
        enableZoom={allowZoom}
        minDistance={5}
        maxDistance={17}
        maxPolarAngle={Math.PI / 2.08}
        minPolarAngle={0.5}
        enablePan={false}
        onStart={() => setCursor({ mode: "drag", label: "LOOK" })}
        onEnd={() => setCursor({ mode: "default" })}
      />
    </>
  );
}

export function Showroom({
  products,
  onSelect,
  allowZoom = true,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
  allowZoom?: boolean;
}) {
  const compact = useIsCompact();
  return (
    <Canvas3D
      name="showroom"
      alwaysLive
      cameraPosition={[0, 1.6, 11]}
      fov={compact ? 55 : 45}
      className="h-full w-full"
      fallback={
        <Html center>
          <span className="text-xs text-white/40">Building showroom…</span>
        </Html>
      }
    >
      <ShowroomScene products={products} onSelect={onSelect} allowZoom={allowZoom} />
    </Canvas3D>
  );
}
