import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Webhook verification and handling for Razorpay
  // In production, verify the webhook signature from Razorpay headers
  try {
    const body = await request.json();
    const event = body.event;

    if (event === "payment.captured") {
      // Payment successful — update order status if needed
      // This is a safety net; primary verification happens in /verify
      console.log("Payment captured:", body.payload?.payment?.entity?.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
