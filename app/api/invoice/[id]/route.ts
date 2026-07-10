import { NextRequest, NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [orderRes, companyRes] = await Promise.all([
    fetch(`${BACKEND}/api/checkout/${id}/public`),
    fetch(`${BACKEND}/api/admin/company`),
  ]);
  if (!orderRes.ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  const order = await orderRes.json();
  const company = await companyRes.json();
  return NextResponse.json({ order, company });
}
