
function money(x) {
  return "$" + Number(x || 0).toFixed(2);
}

function getSelectedRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) return Number(radios[i].value);
  }
  return 0;
}

function getSelectedRadioLabel(name) {
  const radios = document.getElementsByName(name);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return (radios[i].parentElement?.textContent || "").trim();
    }
  }
  return "";
}

function myfunc() {

  const totalBox = document.getElementById("total");

  let subtotal = 0;
  const items = [];

  function calcOne(itemId, propName, qtyId, totalId, displayName) {
    const cb = document.getElementById(itemId);
    const qtyEl = document.getElementById(qtyId);
    const lineEl = document.getElementById(totalId);

    
    if (!cb || !cb.checked) {
      if (lineEl) lineEl.textContent = money(0);
      return;
    }

    const unitPrice = getSelectedRadioValue(propName);
    const sizeLabel = getSelectedRadioLabel(propName);
    const qty = Number(qtyEl?.value || 0);

 
    if (!unitPrice || qty <= 0) {
      if (lineEl) lineEl.textContent = money(0);
      return;
    }

    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    if (lineEl) lineEl.textContent = money(lineTotal);

    items.push({
      id: itemId,
      name: displayName,
      size: sizeLabel,
      unitPrice,
      quantity: qty,
      lineTotal
    });
  }

  calcOne("item1", "property1", "quantity1", "total1", "Elegant Fragrance");
  calcOne("item2", "property2", "quantity2", "total2", "Fresh Essence");
  calcOne("item3", "property3", "quantity3", "total3", "Classic Aroma");

  let finalTotal = subtotal;
  let rule = "none";

  if (subtotal > 0 && subtotal < 200) {
    finalTotal = subtotal + subtotal * 0.15;
    rule = "tax+15%";
  } else if (subtotal >= 200) {
    finalTotal = subtotal - subtotal * 0.15;
    rule = "discount-15%";
  }

  if (totalBox) {
    totalBox.textContent = `Total Cost (including taxes): (${money(finalTotal)})`;
  }


  const cartPayload = {
    items,
    subtotal,
    finalTotal,
    rule,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem("luxeon_cart", JSON.stringify(cartPayload));

  
  if (window.LUXEON_SUPA && typeof window.LUXEON_SUPA.saveCartToDb === "function") {
    window.LUXEON_SUPA.saveCartToDb(cartPayload).catch(console.warn);
  }
}


function toggleWishlist(item) {
  const raw = localStorage.getItem("luxeon_wishlist");
  let list = [];
  try { list = raw ? JSON.parse(raw) : []; } catch (e) { list = []; }

  const idx = list.findIndex(x => x.id === item.id);
  let added = false;

  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(item);
    added = true;
  }

  localStorage.setItem("luxeon_wishlist", JSON.stringify(list));


  if (window.LUXEON_SUPA) {
    if (added && window.LUXEON_SUPA.addWishlistItem) {
      window.LUXEON_SUPA.addWishlistItem(item).catch(console.warn);
    }
    if (!added && window.LUXEON_SUPA.removeWishlistItem) {
      window.LUXEON_SUPA.removeWishlistItem(item.id).catch(console.warn);
    }
  }

  return list;
}


document.addEventListener("click", (e) => {
  const btn = e.target.closest ? e.target.closest("[data-wish]") : null;
  if (!btn) return;

  const id = btn.getAttribute("data-wish");
  const name = btn.getAttribute("data-name") || id;

  const list = toggleWishlist({ id, name });
  btn.classList.toggle("is-wished", list.some(x => x.id === id));
});
