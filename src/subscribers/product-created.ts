// src/subscribers/product-created.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework/subscribers";
import { createClient } from "@supabase/supabase-js";

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
    const transformers = await (Function('return import("@xenova/transformers")')() as Promise<any>);
    
    // Ép dùng WASM thay vì native ONNX — fix lỗi Alpine Linux
    transformers.env.backends.onnx.wasm.proxy = false;
    transformers.env.backends.onnx.wasm.numThreads = 1;

    extractorInstance = await transformers.pipeline(
      "image-feature-extraction",
      "Xenova/clip-vit-base-patch32",
      { device: "wasm" }, // thêm dòng này
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

    // 1. Load embeddings hien co
    const { data: blob } = await supabase.storage
      .from("embeddings")
      .download("products.json");
    const existing: Record<string, number[]> = blob
      ? JSON.parse(await blob.text())
      : {};

    // 2. Bo qua neu da co embedding
    if (existing[data.id]) {
      console.log(`[Subscriber] Skip — ${data.id} da co embedding`);
      return;
    }

    // 3. Fetch thong tin san pham de lay URL anh
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

    // 4. Tao embedding
    const extractor = await getExtractor();
    const output = await extractor(
      optimizeCloudinaryUrl(rawUrl),
      { pooling: "mean", normalize: true } as any,
    );

    existing[data.id] = Array.from(output.data as Float32Array);

    // 5. Upload len Supabase
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