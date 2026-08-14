import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);
  console.log(`[Webhook] ${topic} für Shop ${shop} empfangen.`);
  return new Response("OK", { status: 200 });
};