import { RoundedBox, Cylinder, Sphere, Torus, Cone } from "@react-three/drei";
import {
  Metal,
  Glass,
  Glow,
  Rubber,
  Leather,
  Part,
  type ModelProps,
} from "./tech";

/* ------------------------------------------------------------- SUNGLASSES */

export function Sunglasses({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  const lensColor = "#0b1622";
  return (
    <group rotation={[0.06, 0, 0]}>
      {[-1, 1].map((s) => (
        <group key={s}>
          {/* lens */}
          <Part dir={[s * 0.4, 0, 0.9]} explode={explode} amount={0.8} position={[s * 0.42, 0, 0.02]}>
            <RoundedBox args={[0.72, 0.48, 0.035]} radius={0.16} smoothness={4}>
              {mat3(lensColor, 0.06, 0.75, 0.55)}
            </RoundedBox>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.66, 0.42]} />
              {mat3(accent ?? "#38dcff", 0.2, 0.1, 0.0, 0.35)}
            </mesh>
          </Part>
          {/* rim */}
          <Part dir={[s * 0.4, 0, -0.9]} explode={explode} amount={0.8} position={[s * 0.42, 0, -0.02]}>
            <RoundedBox args={[0.76, 0.52, 0.05]} radius={0.17} smoothness={4}>
              {Leather(color)}
            </RoundedBox>
          </Part>
          {/* temple */}
          <Part dir={[s * 1.2, 0, -0.7]} explode={explode} amount={0.9}>
            <group position={[s * 0.78, 0.06, -0.12]} rotation={[0, s * -0.22, 0]}>
              <RoundedBox args={[0.06, 0.08, 0.92]} radius={0.02} smoothness={3} position={[0, 0, -0.42]} rotation={[0.06, 0, 0]}>
                {Leather(color)}
              </RoundedBox>
              <RoundedBox args={[0.065, 0.12, 0.2]} radius={0.03} smoothness={2} position={[0, -0.04, -0.86]} rotation={[0.35, 0, 0]}>
                {Rubber("#14161b")}
              </RoundedBox>
            </group>
          </Part>
        </group>
      ))}
      {/* bridge */}
      <Part dir={[0, 0.6, 0]} explode={explode} amount={0.7} position={[0, 0.06, 0]}>
        <RoundedBox args={[0.22, 0.07, 0.06]} radius={0.03} smoothness={3}>
          {Leather(color)}
        </RoundedBox>
      </Part>
      <Part dir={[0, -0.7, 0]} explode={explode} amount={0.6} position={[0, -0.3, 0]}>
        <RoundedBox args={[0.5, 0.03, 0.3]} radius={0.015} smoothness={2}>
          {Rubber("#0e1015")}
        </RoundedBox>
      </Part>
    </group>
  );
}

const mat3 = (color: string, roughness = 0.3, metalness = 0.3, _clearcoat = 0, opacity = 1) => (
  <meshStandardMaterial
    color={color}
    roughness={roughness}
    metalness={metalness}
    transparent={opacity < 1}
    opacity={opacity}
    envMapIntensity={1.2}
  />
);

/* -------------------------------------------------------------------- BAG */

export function Bag({ color, accent = "#f472b6", explode = 0 }: ModelProps) {
  return (
    <group>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.35}>
        <RoundedBox args={[1.35, 1.6, 0.72]} radius={0.16} smoothness={4}>
          {mat3(color, 0.62, 0.05)}
        </RoundedBox>
        <RoundedBox args={[1.15, 0.5, 0.78]} radius={0.1} smoothness={3} position={[0, -0.4, 0.02]}>
          {mat3(color, 0.6, 0.05)}
        </RoundedBox>
        <mesh position={[0, 0.18, 0.375]}>
          <planeGeometry args={[0.9, 0.06]} />
          {Rubber("#0d0f14")}
        </mesh>
      </Part>
      {/* straps */}
      {[-1, 1].map((s) => (
        <Part key={s} dir={[s * 0.9, 1, 0]} explode={explode} amount={0.8}>
          <Torus args={[0.42, 0.045, 8, 28, Math.PI]} position={[s * 0.34, 0.72, 0]} rotation={[Math.PI / 2, 0, s * 0.15]}>
            {Rubber("#191c22")}
          </Torus>
        </Part>
      ))}
      {/* hardware */}
      <Part dir={[0, 0.9, 0.4]} explode={explode} amount={0.7} position={[0, 0.55, 0.36]}>
        <RoundedBox args={[0.3, 0.16, 0.06]} radius={0.03} smoothness={2}>
          {Metal("#c9ced8", 0.25)}
        </RoundedBox>
        <Cylinder args={[0.03, 0.03, 0.18, 12]} position={[0, -0.14, 0]}>
          {Metal("#c9ced8", 0.3)}
        </Cylinder>
      </Part>
      <Part dir={[-0.9, -0.8, 0]} explode={explode} amount={0.7} position={[0, -0.86, 0]}>
        <RoundedBox args={[1.2, 0.06, 0.7]} radius={0.02} smoothness={2}>
          {Rubber("#0f1116")}
        </RoundedBox>
      </Part>
      <mesh position={[0, 0.4, 0.38]}>
        <planeGeometry args={[0.16, 0.16]} />
        {Glow(accent ?? "#f472b6", 1.1)}
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------- CAP */

export function Cap({ color, accent = "#a3e635", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0.12, 0, 0]}>
      {/* crown */}
      <Part dir={[0, 1, 0]} explode={explode} amount={0.7}>
        <mesh position={[0, 0.12, 0]} scale={[1, 0.78, 1]}>
          <sphereGeometry args={[0.62, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
          {mat3(color, 0.7, 0.02)}
        </mesh>
        <Cylinder args={[0.05, 0.05, 0.05, 16]} position={[0, 0.6, 0]}>
          {mat3(color, 0.5, 0.2)}
        </Cylinder>
      </Part>
      {/* panels */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <Part key={i} dir={[x * 2, 0.4, 0.2]} explode={explode} amount={0.6}>
          <mesh position={[x, 0.16, 0]} scale={[0.9, 0.78, 1]}>
            <sphereGeometry args={[0.62, 12, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            {mat3(color, 0.72, 0.02)}
          </mesh>
        </Part>
      ))}
      {/* brim */}
      <Part dir={[0, -0.2, 1.1]} explode={explode} amount={0.9} position={[0, 0.02, 0.5]}>
        <group scale={[1, 0.12, 1.35]}>
          <Cylinder args={[0.6, 0.6, 1, 32, 1, false, -Math.PI * 0.52, Math.PI * 1.04]}>
            {mat3(color, 0.68, 0.02)}
          </Cylinder>
        </group>
        <mesh position={[0, 0.04, 0.34]} rotation={[0.08, 0, 0]}>
          <planeGeometry args={[0.9, 0.05]} />
          {Glow(accent ?? "#a3e635", 1.3)}
        </mesh>
      </Part>
      {/* band */}
      <Part dir={[0, -0.8, 0]} explode={explode} amount={0.7} position={[0, -0.16, 0]}>
        <Torus args={[0.6, 0.035, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
          {Rubber("#15181d")}
        </Torus>
      </Part>
    </group>
  );
}

/* ----------------------------------------------------------------- WALLET */

export function Wallet({ color, accent = "#c9a227", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0.25, 0.2, 0]}>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <RoundedBox args={[1.15, 0.72, 0.2]} radius={0.07} smoothness={4}>
          {Leather(color)}
        </RoundedBox>
      </Part>
      <Part dir={[0, 0.8, 0.3]} explode={explode} amount={0.7} position={[0, 0.3, 0.02]}>
        <RoundedBox args={[1.0, 0.16, 0.22]} radius={0.06} smoothness={3}>
          {Leather(color)}
        </RoundedBox>
      </Part>
      <Part dir={[0, -0.8, -0.3]} explode={explode} amount={0.7} position={[0, -0.3, -0.02]}>
        <RoundedBox args={[1.0, 0.16, 0.22]} radius={0.06} smoothness={3}>
          {Leather(color)}
        </RoundedBox>
      </Part>
      <Part dir={[0, 0, 1]} explode={explode} amount={0.9} position={[0, 0, 0.11]}>
        <mesh>
          <planeGeometry args={[0.95, 0.55]} />
          {mat3("#0c0e13", 0.9, 0.1)}
        </mesh>
        {[-0.2, 0, 0.2].map((y) => (
          <mesh key={y} position={[0, y, 0.005]}>
            <planeGeometry args={[0.7, 0.05]} />
            {mat3("#16181f", 0.8, 0.1)}
          </mesh>
        ))}
      </Part>
      <Part dir={[0.8, 0, -0.6]} explode={explode} amount={0.8} position={[0.5, 0.28, 0]}>
        <Cylinder args={[0.045, 0.045, 0.06, 16]} rotation={[Math.PI / 2, 0, 0]}>
          {Metal("#c9a227", 0.3)}
        </Cylinder>
      </Part>
      <mesh position={[-0.42, -0.24, 0.115]}>
        <planeGeometry args={[0.14, 0.14]} />
        {Glow(accent ?? "#c9a227", 1.0)}
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- SNEAKER */

export function Sneaker({ color, accent = "#c7f437", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0.1, -0.35, 0]} position={[0, -0.1, 0]}>
      {/* outsole */}
      <Part dir={[0, -1, 0]} explode={explode} amount={0.7}>
        <group>
          <RoundedBox args={[2.0, 0.14, 0.82]} radius={0.07} smoothness={4} position={[0, -0.34, 0]}>
            {Rubber("#14161b")}
          </RoundedBox>
          {[-0.7, -0.35, 0, 0.35, 0.7].map((x) => (
            <mesh key={x} position={[x, -0.42, 0]}>
              <boxGeometry args={[0.08, 0.05, 0.7]} />
              {Rubber("#0c0e12")}
            </mesh>
          ))}
        </group>
      </Part>
      {/* midsole foam */}
      <Part dir={[0, -0.45, 0]} explode={explode} amount={0.55}>
        <RoundedBox args={[1.95, 0.26, 0.78]} radius={0.12} smoothness={5} position={[0, -0.16, 0]}>
          {mat3("#eef1f6", 0.42, 0.0)}
        </RoundedBox>
      </Part>
      {/* upper */}
      <Part dir={[0, 0.5, 0]} explode={explode} amount={0.7}>
        <group>
          <RoundedBox args={[1.55, 0.44, 0.7]} radius={0.2} smoothness={5} position={[0.05, 0.12, 0]}>
            {mat3(color, 0.66, 0.03)}
          </RoundedBox>
          {/* toe box */}
          <group position={[0.82, 0.02, 0]} scale={[0.9, 0.62, 1]}>
            <Sphere args={[0.4, 24, 18]}>
              {mat3(color, 0.6, 0.03)}
            </Sphere>
          </group>
          {/* heel counter */}
          <group position={[-0.68, 0.16, 0]} scale={[0.7, 0.85, 1]}>
            <Sphere args={[0.42, 20, 16]}>
              {mat3(color, 0.55, 0.05)}
            </Sphere>
          </group>
          {/* collar */}
          <Torus args={[0.26, 0.075, 10, 24]} position={[-0.3, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
            {Rubber("#1a1d23")}
          </Torus>
          {/* tongue */}
          <RoundedBox args={[0.44, 0.1, 0.34]} radius={0.04} smoothness={3} position={[-0.02, 0.36, 0]} rotation={[0, 0, 0.12]}>
            {mat3(color, 0.7, 0.02)}
          </RoundedBox>
        </group>
      </Part>
      {/* laces */}
      <Part dir={[0, 1, 0]} explode={explode} amount={0.9}>
        {[-0.22, -0.06, 0.1, 0.26].map((y, i) => (
          <mesh key={i} position={[0.16 + y * 0.3, 0.3 + y * 0.35, 0]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[0.07, 0.045, 0.52]} />
            {mat3("#e8ebf1", 0.75, 0.02)}
          </mesh>
        ))}
      </Part>
      {/* carbon plate / accent swoosh */}
      <Part dir={[0.5, 0, 0.8]} explode={explode} amount={0.8}>
        <mesh position={[0.1, -0.05, 0.3]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[1.0, 0.03, 0.16]} />
          {Glow(accent ?? "#c7f437", 1.2)}
        </mesh>
      </Part>
      {/* insole */}
      <Part dir={[-0.6, 0, -0.9]} explode={explode} amount={0.8} position={[-0.1, 0.0, 0]}>
        <RoundedBox args={[1.3, 0.05, 0.6]} radius={0.02} smoothness={2}>
          {mat3("#20242c", 0.8, 0.05)}
        </RoundedBox>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------- ANALOG WATCH */

export function Watch({ color, accent = "#e3cfa4", explode = 0 }: ModelProps) {
  const indices = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
  return (
    <group rotation={[0.35, 0, 0]}>
      {/* case */}
      <Part dir={[0, 0, -0.9]} explode={explode} amount={0.8}>
        <Cylinder args={[0.56, 0.58, 0.18, 48]}>
          {Metal(color, 0.22)}
        </Cylinder>
        {/* lugs */}
        {[-1, 1].map((s) => (
          <RoundedBox key={s} args={[0.42, 0.18, 0.16]} radius={0.04} smoothness={3} position={[0, s * 0.62, 0]}>
            {Metal(color, 0.25)}
          </RoundedBox>
        ))}
        {/* crown + pushers */}
        <Cylinder args={[0.07, 0.07, 0.1, 16]} position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          {Metal(color, 0.18)}
        </Cylinder>
        <Torus args={[0.5, 0.06, 8, 48]} position={[0, 0, 0.09]}>
          {Metal(color, 0.16)}
        </Torus>
      </Part>
      {/* dial */}
      <Part dir={[0, 0, 0]} explode={explode} amount={0.45}>
        <Cylinder args={[0.48, 0.48, 0.03, 48]} position={[0, 0, 0.06]}>
          {mat3("#0b0e14", 0.28, 0.55)}
        </Cylinder>
        {indices.map((a, i) => (
          <mesh key={i} position={[Math.sin(a) * 0.38, Math.cos(a) * 0.38, 0.078]} rotation={[0, 0, -a]}>
            <boxGeometry args={[0.03, i % 3 === 0 ? 0.11 : 0.07, 0.012]} />
            {Glow(accent ?? "#e3cfa4", 1.1)}
          </mesh>
        ))}
        {/* hands */}
        <mesh position={[0, 0.1, 0.09]}>
          <boxGeometry args={[0.035, 0.42, 0.012]} />
          {Glow("#ffffff", 0.9)}
        </mesh>
        <mesh position={[0.11, 0, 0.095]} rotation={[0, 0, -Math.PI / 2.6]}>
          <boxGeometry args={[0.03, 0.32, 0.012]} />
          {Glow(accent ?? "#e3cfa4", 1.0)}
        </mesh>
        <Cylinder args={[0.035, 0.035, 0.03, 16]} position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          {Metal(color, 0.2)}
        </Cylinder>
      </Part>
      {/* crystal */}
      <Part dir={[0, 0, 1]} explode={explode} amount={0.9} position={[0, 0, 0.13]}>
        <Cylinder args={[0.5, 0.5, 0.04, 48]}>
          {Glass("#d9f2ff", 0.22)}
        </Cylinder>
      </Part>
      {/* movement */}
      <Part dir={[0, 0, -1.6]} explode={explode} amount={0.9} position={[0, 0, -0.12]}>
        <Cylinder args={[0.42, 0.42, 0.06, 32]}>
          {mat3("#8a7a3a", 0.35, 0.9)}
        </Cylinder>
        <Torus args={[0.2, 0.03, 8, 24]} position={[0, 0, 0.04]}>
          {Metal("#c9a24a", 0.3)}
        </Torus>
      </Part>
      {/* bracelet */}
      <Part dir={[0, 1, 0]} explode={explode} amount={0.85}>
        <group position={[0, 0.72, 0]} rotation={[-0.5, 0, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <RoundedBox key={i} args={[0.42, 0.14, 0.1]} radius={0.03} smoothness={2} position={[0, 0.12 + i * 0.15, -i * 0.04]}>
              {Metal(color, 0.26)}
            </RoundedBox>
          ))}
        </group>
      </Part>
      <Part dir={[0, -1, 0]} explode={explode} amount={0.85}>
        <group position={[0, -0.72, 0]} rotation={[0.5, 0, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <RoundedBox key={i} args={[0.42, 0.14, 0.1]} radius={0.03} smoothness={2} position={[0, -0.12 - i * 0.15, -i * 0.04]}>
              {Metal(color, 0.26)}
            </RoundedBox>
          ))}
        </group>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------------- LAMP */

export function Lamp({ color, accent = "#fb923c", explode = 0 }: ModelProps) {
  return (
    <group>
      <Part dir={[0, -1, 0]} explode={explode} amount={0.7} position={[0, -1.05, 0]}>
        <Cylinder args={[0.42, 0.46, 0.08, 36]}>
          {Metal(color, 0.3)}
        </Cylinder>
      </Part>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <Cylinder args={[0.07, 0.07, 1.7, 24]} position={[0, -0.15, 0]}>
          {Metal(color, 0.24)}
        </Cylinder>
      </Part>
      <Part dir={[0, 1, 0]} explode={explode} amount={0.9} position={[0, 0.95, 0]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.28, 0.55, 36, 1, true]} />
          {mat3(color, 0.35, 0.9)}
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.34, 0.24, 0.02, 32]} />
          {Glow(accent ?? "#fb923c", 2.2)}
        </mesh>
        <Sphere args={[0.12, 16, 12]} position={[0, 0.02, 0]}>
          {Glow("#fff2df", 3)}
        </Sphere>
      </Part>
      <Part dir={[0, 0.6, 0.9]} explode={explode} amount={0.7} position={[0, 0.6, 0]}>
        <Torus args={[0.2, 0.02, 8, 24]} rotation={[Math.PI / 2, 0, 0]}>
          {Glow(accent ?? "#fb923c", 1.2)}
        </Torus>
      </Part>
    </group>
  );
}

/* --------------------------------------------------------------- DIFFUSER */

export function Diffuser({ color, accent = "#fbbf24", explode = 0 }: ModelProps) {
  return (
    <group>
      <Part dir={[0, -1, 0]} explode={explode} amount={0.7} position={[0, -0.5, 0]}>
        <Cylinder args={[0.42, 0.46, 0.14, 36]}>
          {mat3("#3a2c20", 0.7, 0.05)}
        </Cylinder>
      </Part>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <Sphere args={[0.44, 36, 24]} position={[0, 0.06, 0]}>
          {mat3(color, 0.34, 0.95)}
        </Sphere>
        <Torus args={[0.3, 0.028, 8, 36]} position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {Glow(accent ?? "#fbbf24", 1.6)}
        </Torus>
      </Part>
      <Part dir={[0, 1, 0]} explode={explode} amount={0.9} position={[0, 0.72, 0]}>
        <Cone args={[0.22, 0.5, 24, 1, true]} position={[0, 0.2, 0]}>
          {mat3("#dff3ff", 0.1, 0.0, 0, 0.22)}
        </Cone>
      </Part>
      <Part dir={[0.9, 0, 0]} explode={explode} amount={0.8} position={[0, -0.1, 0]}>
        <Cylinder args={[0.16, 0.16, 0.24, 20]}>
          {Glass("#eaf7ff", 0.35)}
        </Cylinder>
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------- HUMIDIFIER */

export function Humidifier({ color, accent = "#38dcff", explode = 0 }: ModelProps) {
  return (
    <group>
      <Part dir={[0, -1, 0]} explode={explode} amount={0.7} position={[0, -0.95, 0]}>
        <Cylinder args={[0.42, 0.45, 0.16, 36]}>
          {mat3("#1a1e26", 0.5, 0.4)}
        </Cylinder>
      </Part>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <Cylinder args={[0.4, 0.42, 1.5, 40]}>
          {mat3(color, 0.22, 0.25)}
        </Cylinder>
        <Torus args={[0.41, 0.022, 8, 40]} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {Glow(accent ?? "#38dcff", 2)}
        </Torus>
      </Part>
      <Part dir={[0, 1, 0]} explode={explode} amount={0.9} position={[0, 0.86, 0]}>
        <Cylinder args={[0.42, 0.4, 0.16, 36]}>
          {mat3("#22262e", 0.4, 0.6)}
        </Cylinder>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a) * 0.3, 0.09, Math.cos(a) * 0.3]}>
              <boxGeometry args={[0.06, 0.03, 0.12]} />
              {mat3("#0d1016", 0.6, 0.3)}
            </mesh>
          );
        })}
      </Part>
    </group>
  );
}

/* ---------------------------------------------------------------- PERFUME */

export function Perfume({ color, accent = "#e879f9", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0.05, 0.3, 0]}>
      <Part dir={[0, -0.6, 0]} explode={explode} amount={0.6} position={[0, -0.55, 0]}>
        <RoundedBox args={[0.9, 0.1, 0.4]} radius={0.03} smoothness={3}>
          {Metal(color, 0.3)}
        </RoundedBox>
      </Part>
      {/* liquid */}
      <Part dir={[0, 0, 0]} explode={explode} amount={0.3}>
        <RoundedBox args={[0.66, 0.86, 0.28]} radius={0.1} smoothness={3} position={[0, 0.02, 0]}>
          {mat3("#c98b3a", 0.1, 0.0, 0, 0.72)}
        </RoundedBox>
      </Part>
      {/* glass */}
      <Part dir={[0, 0, 0.9]} explode={explode} amount={0.85} position={[0, 0.02, 0.02]}>
        <RoundedBox args={[0.76, 0.98, 0.36]} radius={0.13} smoothness={4}>
          {Glass("#e8f6ff", 0.2)}
        </RoundedBox>
      </Part>
      {/* neck + cap */}
      <Part dir={[0, 1, 0]} explode={explode} amount={0.9} position={[0, 0.62, 0]}>
        <Cylinder args={[0.13, 0.15, 0.16, 24]}>
          {Metal(color, 0.25)}
        </Cylinder>
      </Part>
      <Part dir={[0, 1.6, 0]} explode={explode} amount={0.9} position={[0, 0.98, 0]}>
        <RoundedBox args={[0.34, 0.44, 0.34]} radius={0.08} smoothness={4}>
          {mat3(color, 0.22, 0.95)}
        </RoundedBox>
      </Part>
      <mesh position={[0, -0.2, 0.19]}>
        <planeGeometry args={[0.2, 0.3]} />
        {Glow(accent ?? "#e879f9", 1.2)}
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ SERUM */

export function Serum({ color, accent = "#e879f9", explode = 0 }: ModelProps) {
  return (
    <group>
      {[-0.42, 0.42].map((x, i) => (
        <Part key={i} dir={[x * 1.6, 0, i ? 0.6 : -0.6]} explode={explode} amount={0.8} position={[x, 0, 0]}>
          <group>
            <Cylinder args={[0.24, 0.26, 0.9, 32]} position={[0, -0.1, 0]}>
              {Glass("#eef7ff", 0.24)}
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.5, 28]} position={[0, -0.16, 0]}>
              {mat3(i ? "#f0c9a0" : "#f7d34e", 0.15, 0, 0, 0.85)}
            </Cylinder>
            <Cylinder args={[0.12, 0.12, 0.2, 20]} position={[0, 0.52, 0]}>
              {Metal(color, 0.25)}
            </Cylinder>
            <RoundedBox args={[0.16, 0.16, 0.3]} radius={0.04} smoothness={3} position={[0, 0.64, 0.05]}>
              {Metal(color, 0.3)}
            </RoundedBox>
          </group>
        </Part>
      ))}
      <Part dir={[0, 0, -1]} explode={explode} amount={0.9} position={[0, -0.2, -0.5]}>
        <RoundedBox args={[1.1, 0.9, 0.16]} radius={0.04} smoothness={3}>
          {mat3(color, 0.3, 0.5)}
        </RoundedBox>
      </Part>
      <mesh position={[0, 0.2, 0.28]}>
        <planeGeometry args={[0.2, 0.5]} />
        {Glow(accent ?? "#e879f9", 1.1)}
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------- LIPSTICK */

export function Lipstick({ color, accent = "#d94f6a", explode = 0 }: ModelProps) {
  return (
    <group rotation={[0.15, -0.2, 0]}>
      <Part dir={[0, 0, 0]} explode={explode} amount={0.4}>
        <RoundedBox args={[0.9, 0.34, 0.5]} radius={0.08} smoothness={4} position={[0, -0.2, 0]}>
          {mat3(color, 0.22, 0.95)}
        </RoundedBox>
        <RoundedBox args={[0.8, 0.03, 0.42]} radius={0.015} smoothness={2} position={[0, -0.03, 0]}>
          {Metal("#20242c", 0.4)}
        </RoundedBox>
      </Part>
      {[-0.24, 0, 0.24].map((x, i) => (
        <Part key={i} dir={[x * 2, 1, 0]} explode={explode} amount={0.8} position={[x, 0.1, 0]}>
          <group>
            <Cylinder args={[0.09, 0.1, 0.3, 24]} position={[0, 0.08, 0]}>
              {Metal(i === 1 ? "#d9dfe8" : color, 0.28)}
            </Cylinder>
            <Sphere args={[0.088, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} position={[0, 0.24, 0]} scale={[1, 1.5, 1]}>
              {mat3(i === 0 ? "#d94f6a" : i === 1 ? "#b8455c" : "#8d3a4e", 0.28, 0.15)}
            </Sphere>
          </group>
        </Part>
      ))}
      <Part dir={[0, 0, 1]} explode={explode} amount={0.9} position={[0, -0.2, 0.4]}>
        <RoundedBox args={[0.84, 0.28, 0.06]} radius={0.03} smoothness={3}>
          {mat3("#dfe6f0", 0.06, 0.95)}
        </RoundedBox>
      </Part>
      <mesh position={[0, 0.1, 0.26]}>
        <planeGeometry args={[0.5, 0.1]} />
        {Glow(accent ?? "#d94f6a", 1.2)}
      </mesh>
    </group>
  );
}

