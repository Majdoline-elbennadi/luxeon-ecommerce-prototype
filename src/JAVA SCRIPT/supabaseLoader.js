
import {
  getSessionId,
  submitContactMessage,
  addWishlistItem,
  removeWishlistItem,
  loadWishlistFromDb,
  saveCartToDb,
  loadCartFromDb
} from "./appSupabase.js";

window.LUXEON_SUPA = {
  getSessionId,
  submitContactMessage,
  addWishlistItem,
  removeWishlistItem,
  loadWishlistFromDb,
  saveCartToDb,
  loadCartFromDb
};

// OPTIONAL auto-sync
try { await loadWishlistFromDb(); } catch(e) {}
try { await loadCartFromDb(); } catch(e) {}
