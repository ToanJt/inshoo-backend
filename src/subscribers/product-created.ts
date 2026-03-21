// src/subscribers/product-created.ts
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework/subscribers";

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
};

export default async function handleProductChanged({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  const storefrontUrl = process.env.STOREFRONT_URL;
  const syncSecret = process.env.SYNC_SECRET;

  if (!storefrontUrl || !syncSecret) {
    console.warn("[Subscriber] Thiếu STOREFRONT_URL hoặc SYNC_SECRET");
    return;
  }

  try {
    const res = await fetch(`${storefrontUrl}/api/sync-embeddings`, {
      method: "POST",
      headers: {
        "x-sync-secret": syncSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: data.id }),
    });

    if (res.ok) {
      console.log("[Subscriber] ✅ Sync embeddings triggered cho:", data.id);
    } else {
      console.warn("[Subscriber] ⚠️ Sync response:", res.status);
    }
  } catch (e) {
    console.error("[Subscriber] ❌ Không gọi được storefront:", e);
  }
}