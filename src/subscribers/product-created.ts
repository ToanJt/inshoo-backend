
// src/subscribers/product-created.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework/subscribers";
import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
};

function optimizeCloudinaryUrl(url: string): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/image/upload/", "/image/upload/w_300,h_300,c_fit,q_auto,f_jpg/");
}

let extractorInstance: any = null;
async function getExtractor() {
  if (!extractorInstance) {
    extractorInstance = await pipeline(
      "image-feature-extraction",
      "Xenova/clip-vit-base-patch32",
    );
  }
  return extractorInstance;
}

export default async function handleProductChanged({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("[Subscriber] Thieu SUPABASE_URL hoac SUPABASE_SERVICE_ROLE_KEY");
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: blob } = await supabase.storage
      .from("embeddings")
      .download("products.json");
    const existing: Record<string, number[]> = blob
      ? JSON.parse(await blob.text())
      : {};

    if (existing[data.id]) {
      console.log(`[Subscriber] Skip — ${data.id} da co embedding`);
      return;
    }

    const medusaUrl = `http://localhost:${process.env.PORT ?? 10000}`;
    const medusaKey = process.env.MEDUSA_PUBLISHABLE_KEY;

    const res = await fetch(
      `${medusaUrl}/store/products/${data.id}?fields=+images`,
      { headers: { "x-publishable-api-key": medusaKey ?? "" } },
    );
    const { product } = await res.json();

    const rawUrl = product?.images?.[0]?.url ?? product?.thumbnail;
    if (!rawUrl) {
      console.warn(`[Subscriber] Khong co anh cho ${data.id}`);
      return;
    }

    const extractor = await getExtractor();
    const output = await extractor(
      optimizeCloudinaryUrl(rawUrl),
      { pooling: "mean", normalize: true } as any,
    );

    existing[data.id] = Array.from(output.data as Float32Array);

    await supabase.storage.from("embeddings").upload(
      "products.json",
      new Blob([JSON.stringify(existing)], { type: "application/json" }),
      { upsert: true, cacheControl: "3600" },
    );

    console.log(`[Subscriber] OK Embedded xong: ${data.id}`);
  } catch (e) {
    console.error("[Subscriber] LOI:", e);
  }
}