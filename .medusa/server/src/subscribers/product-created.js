"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = handleProductChanged;
exports.config = {
    event: ["product.created", "product.updated"],
};
async function handleProductChanged({ event: { data }, }) {
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
        }
        else {
            console.warn("[Subscriber] ⚠️ Sync response:", res.status);
        }
    }
    catch (e) {
        console.error("[Subscriber] ❌ Không gọi được storefront:", e);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1jcmVhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL3Byb2R1Y3QtY3JlYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFVQSx1Q0E2QkM7QUFqQ1ksUUFBQSxNQUFNLEdBQXFCO0lBQ3RDLEtBQUssRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO0NBQzlDLENBQUM7QUFFYSxLQUFLLFVBQVUsb0JBQW9CLENBQUMsRUFDakQsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQ2dCO0lBQy9CLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0lBQ2pELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBRTNDLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLG9EQUFvRCxDQUFDLENBQUM7UUFDbkUsT0FBTztJQUNULENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCxNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLGFBQWEsc0JBQXNCLEVBQUU7WUFDOUQsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLFVBQVU7Z0JBQzNCLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RSxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztBQUNILENBQUMifQ==