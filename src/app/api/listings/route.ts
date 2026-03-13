import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// 募集一覧（unit_id でフィルタ）
export async function GET(request: NextRequest) {
  const unitId = request.nextUrl.searchParams.get("unit_id");
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("listings")
    .select("*")
    .order("detected_at", { ascending: false });
  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 募集登録
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const body = await request.json();
  const listingType = body.listing_type || "rental";

  const insertData: Record<string, unknown> = {
    unit_id: body.unit_id,
    listing_type: listingType,
    status: body.status || "active",
    floor: body.floor || null,
    source_site: body.source_site || null,
    source_url: body.source_url || null,
    detected_at: body.detected_at || new Date().toISOString(),
  };

  if (listingType === "sale") {
    insertData.sale_price = body.sale_price || null;
    insertData.price_per_sqm = body.price_per_sqm || null;
    insertData.maintenance_fee_sale = body.maintenance_fee_sale || null;
    insertData.repair_reserve_fund = body.repair_reserve_fund || null;
    insertData.current_rent = 0;
  } else {
    insertData.current_rent = body.current_rent;
    insertData.management_fee = body.management_fee || null;
    insertData.deposit = body.deposit || null;
    insertData.key_money = body.key_money || null;
  }

  const { data, error } = await supabase
    .from("listings")
    .insert(insertData)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
