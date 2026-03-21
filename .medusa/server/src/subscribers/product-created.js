"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = handleProductChanged;
const supabase_js_1 = require("@supabase/supabase-js");
exports.config = {
    event: ["product.created", "product.updated"],
};
function optimizeCloudinaryUrl(url) {
    if (!url.includes("res.cloudinary.com"))
        return url;
    return url.replace("/image/upload/", "/image/upload/w_300,h_300,c_fit,q_auto,f_jpg/");
}
let extractorInstance = null;
async function getExtractor() {
    if (!extractorInstance) {
        // Dynamic import — bắt buộc vì @xenova/transformers là ESM module
        const transformers = await Function('return import("@xenova/transformers")')();
        extractorInstance = await transformers.pipeline("image-feature-extraction", "Xenova/clip-vit-base-patch32");
    }
    return extractorInstance;
}
async function handleProductChanged({ event: { data }, }) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        console.warn("[Subscriber] Thieu SUPABASE_URL hoac SUPABASE_SERVICE_ROLE_KEY");
        return;
    }
    try {
        const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        // 1. Load embeddings hien co
        const { data: blob } = await supabase.storage
            .from("embeddings")
            .download("products.json");
        const existing = blob
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
        const res = await fetch(`${medusaUrl}/store/products/${data.id}?fields=+images`, { headers: { "x-publishable-api-key": medusaKey ?? "" } });
        const { product } = await res.json();
        const rawUrl = product?.images?.[0]?.url ?? product?.thumbnail;
        if (!rawUrl) {
            console.warn(`[Subscriber] Khong co anh cho ${data.id}`);
            return;
        }
        // 4. Tao embedding
        const extractor = await getExtractor();
        const output = await extractor(optimizeCloudinaryUrl(rawUrl), { pooling: "mean", normalize: true });
        existing[data.id] = Array.from(output.data);
        // 5. Upload len Supabase
        await supabase.storage.from("embeddings").upload("products.json", new Blob([JSON.stringify(existing)], { type: "application/json" }), { upsert: true, cacheControl: "3600" });
        console.log(`[Subscriber] OK Embedded xong: ${data.id}`);
    }
    catch (e) {
        console.error("[Subscriber] LOI:", e);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1jcmVhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL3Byb2R1Y3QtY3JlYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUEwQkEsdUNBZ0VDO0FBeEZELHVEQUFxRDtBQUV4QyxRQUFBLE1BQU0sR0FBcUI7SUFDdEMsS0FBSyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUM7Q0FDOUMsQ0FBQztBQUVGLFNBQVMscUJBQXFCLENBQUMsR0FBVztJQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztRQUFFLE9BQU8sR0FBRyxDQUFDO0lBQ3BELE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFFRCxJQUFJLGlCQUFpQixHQUFRLElBQUksQ0FBQztBQUNsQyxLQUFLLFVBQVUsWUFBWTtJQUN6QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN2QixrRUFBa0U7UUFDbEUsTUFBTSxZQUFZLEdBQUcsTUFBTyxRQUFRLENBQUMsdUNBQXVDLENBQUMsRUFBbUIsQ0FBQztRQUNqRyxpQkFBaUIsR0FBRyxNQUFNLFlBQVksQ0FBQyxRQUFRLENBQzdDLDBCQUEwQixFQUMxQiw4QkFBOEIsQ0FDL0IsQ0FBQztJQUNKLENBQUM7SUFDRCxPQUFPLGlCQUFpQixDQUFDO0FBQzNCLENBQUM7QUFFYyxLQUFLLFVBQVUsb0JBQW9CLENBQUMsRUFDakQsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQ2dCO0lBQy9CLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0lBQzdDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7SUFFMUQsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRSxD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