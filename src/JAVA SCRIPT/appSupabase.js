
import { supabase, SUPABASE_ANON_KEY } from "./supabaseClient.js";

function ensureConfigured() {
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("PASTE_YOUR_ANON_KEY")) {
    throw new Error("Supabase anon key is missing. Edit supabaseClient.js and paste your anon key.");
  }
}

export function getSessionId() {
  const KEY = "luxeon_session_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());
    localStorage.setItem(KEY, id);
  }
  return id;
}

export async function submitContactMessage(payload) {
  ensureConfigured();
  const { error } = await supabase.from("contact_messages").insert([payload]);
  if (error) throw error;
}

export async function addWishlistItem(item) {
  ensureConfigured();
  const session_id = getSessionId();
  const { error } = await supabase.from("wishlist_items").upsert([{
    session_id,
    item_id: item.id,
    item_name: item.name
  }], { onConflict: "session_id,item_id" });

  if (error) throw error;
}

export async function removeWishlistItem(itemId) {
  ensureConfigured();
  const session_id = getSessionId();
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("session_id", session_id)
    .eq("item_id", itemId);

  if (error) throw error;
}

export async function loadWishlistFromDb() {
  ensureConfigured();
  const session_id = getSessionId();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("item_id,item_name,created_at")
    .eq("session_id", session_id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const list = (data || []).map(x => ({ id: x.item_id, name: x.item_name }));
  localStorage.setItem("luxeon_wishlist", JSON.stringify(list));
  return list;
}

export async function saveCartToDb(cart) {
  ensureConfigured();
  const session_id = getSessionId();

  const del = await supabase.from("cart_items").delete().eq("session_id", session_id);
  if (del.error) throw del.error;

  const rows = (cart.items || []).map(it => ({
    session_id,
    item_id: it.id,
    item_name: it.name,
    size: it.size || "",
    unit_price: it.unitPrice || 0,
    quantity: it.quantity || 0,
    line_total: it.lineTotal || 0
  }));

  if (rows.length) {
    const ins = await supabase.from("cart_items").insert(rows);
    if (ins.error) throw ins.error;
  }

  const up = await supabase.from("cart_summary").upsert([{
    session_id,
    subtotal: cart.subtotal || 0,
    final_total: cart.finalTotal || 0,
    rule: cart.rule || "none",
    updated_at: new Date().toISOString()
  }], { onConflict: "session_id" });

  if (up.error) throw up.error;
}

export async function loadCartFromDb() {
  ensureConfigured();
  const session_id = getSessionId();

  const summaryRes = await supabase
    .from("cart_summary")
    .select("subtotal,final_total,rule,updated_at")
    .eq("session_id", session_id)
    .maybeSingle();

  if (summaryRes.error) throw summaryRes.error;

  const itemsRes = await supabase
    .from("cart_items")
    .select("item_id,item_name,size,unit_price,quantity,line_total,created_at")
    .eq("session_id", session_id)
    .order("created_at", { ascending: false });

  if (itemsRes.error) throw itemsRes.error;

  const cart = {
    items: (itemsRes.data || []).map(r => ({
      id: r.item_id,
      name: r.item_name,
      size: r.size,
      unitPrice: Number(r.unit_price),
      quantity: Number(r.quantity),
      lineTotal: Number(r.line_total)
    })),
    subtotal: Number(summaryRes.data?.subtotal || 0),
    finalTotal: Number(summaryRes.data?.final_total || 0),
    rule: summaryRes.data?.rule || "none",
    updatedAt: summaryRes.data?.updated_at || null
  };

  localStorage.setItem("luxeon_cart", JSON.stringify(cart));
  return cart;
}
