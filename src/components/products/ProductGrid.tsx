import { ProductCard3D } from "./ProductCard3D";
import type { Product } from "@/data/products";
import { cn } from "@/utils/cn";

export function ProductGrid({
  products,
  className,
  columns = 4,
}: {
  products: Product[];
  className?: string;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:gap-7",
        columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((p, i) => (
        <ProductCard3D key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
