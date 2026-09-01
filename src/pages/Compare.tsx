import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/ui/PageShell";
import {
  ProductComparisonStage,
  CompareTable,
  CompareEmpty,
} from "@/components/products/ProductComparison";
import { Footer3D } from "@/components/sections/Footer3D";
import { useStore } from "@/store/useStore";
import { getProduct, type Product } from "@/data/products";

export default function Compare() {
  const ids = useStore((s) => s.compare);
  const items = ids.map(getProduct).filter(Boolean) as Product[];
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    if (focus >= items.length) setFocus(0);
  }, [items.length, focus]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Comparison lab"
        title="Side by side, in the same room."
        subtitle="Products are placed on a shared 3D stage. Focus any of them and the camera dollies across to inspect it."
        crumbs={[{ label: "Home", to: "/" }, { label: "Compare" }]}
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        {items.length === 0 ? (
          <CompareEmpty />
        ) : (
          <div className="space-y-8">
            <ProductComparisonStage products={items} focus={focus} onFocus={setFocus} />
            <div>
              <h2 className="mb-4 font-display text-xl font-semibold text-white">Specification matrix</h2>
              <CompareTable ids={ids} />
            </div>
          </div>
        )}
      </section>
      <Footer3D />
    </PageShell>
  );
}
