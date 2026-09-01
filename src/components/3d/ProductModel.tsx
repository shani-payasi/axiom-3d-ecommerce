import type { ComponentType } from "react";
import type { ModelKind } from "@/data/products";
import type { ModelProps } from "./models/tech";
import {
  Smartphone,
  Laptop,
  Headphone,
  Speaker,
  Earbuds,
  Console,
  Controller,
  Visor,
  Keyboard,
  Camera,
  Drone,
  Mouse,
  Projector,
  Smartwatch,
} from "./models/tech";
import {
  Sunglasses,
  Bag,
  Cap,
  Wallet,
  Sneaker,
  Watch,
  Lamp,
  Diffuser,
  Humidifier,
  Perfume,
  Serum,
  Lipstick,
} from "./models/lifestyle";

export type { ModelProps };

export type ModelComponent = ComponentType<ModelProps>;

/**
 * Placeholder-free procedural model library. Every product in the catalogue
 * resolves to real geometry here. Swapping in a `.glb` later only requires
 * adding a branch that returns `<primitive object={gltf.scene} />`.
 */
export const MODEL_REGISTRY: Record<ModelKind, ModelComponent> = {
  smartphone: Smartphone,
  laptop: Laptop,
  headphone: Headphone,
  speaker: Speaker,
  earbuds: Earbuds,
  console: Console,
  controller: Controller,
  visor: Visor,
  keyboard: Keyboard,
  camera: Camera,
  drone: Drone,
  mouse: Mouse,
  projector: Projector,
  smartwatch: Smartwatch,
  sunglasses: Sunglasses,
  bag: Bag,
  cap: Cap,
  wallet: Wallet,
  sneaker: Sneaker,
  watch: Watch,
  lamp: Lamp,
  diffuser: Diffuser,
  humidifier: Humidifier,
  perfume: Perfume,
  serum: Serum,
  lipstick: Lipstick,
};

/** Normalises each model so every product fills the stage consistently. */
export const MODEL_SCALE: Record<ModelKind, number> = {
  smartphone: 1,
  laptop: 0.92,
  headphone: 0.95,
  speaker: 0.85,
  earbuds: 1.15,
  console: 1,
  controller: 1.15,
  visor: 1,
  keyboard: 1,
  camera: 1.05,
  drone: 1.05,
  mouse: 1.5,
  projector: 1,
  smartwatch: 1.05,
  sunglasses: 1.25,
  bag: 0.95,
  cap: 1.1,
  wallet: 1.35,
  sneaker: 1.05,
  watch: 1.05,
  lamp: 0.8,
  diffuser: 1.2,
  humidifier: 0.9,
  perfume: 1.1,
  serum: 1.05,
  lipstick: 1.25,
};

export const MODEL_Y: Record<ModelKind, number> = {
  smartphone: 0,
  laptop: 0.1,
  headphone: 0,
  speaker: -0.1,
  earbuds: -0.1,
  console: 0,
  controller: 0,
  visor: 0,
  keyboard: 0,
  camera: 0,
  drone: 0,
  mouse: 0,
  projector: 0,
  smartwatch: 0,
  sunglasses: 0,
  bag: 0,
  cap: 0,
  wallet: 0,
  sneaker: 0.1,
  watch: 0,
  lamp: 0.15,
  diffuser: 0,
  humidifier: 0,
  perfume: 0,
  serum: 0.05,
  lipstick: 0,
};

export function ProductModel({
  kind,
  color,
  accent,
  explode = 0,
  lowDetail = false,
}: {
  kind: ModelKind;
  color: string;
  accent?: string;
  explode?: number;
  lowDetail?: boolean;
}) {
  const Component = MODEL_REGISTRY[kind] ?? Smartphone;
  return (
    <group scale={MODEL_SCALE[kind] ?? 1} position={[0, MODEL_Y[kind] ?? 0, 0]}>
      <Component color={color} accent={accent} explode={explode} lowDetail={lowDetail} />
    </group>
  );
}
