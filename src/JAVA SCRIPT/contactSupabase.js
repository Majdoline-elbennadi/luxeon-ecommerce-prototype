

import { submitContactMessage, getSessionId } from "./appSupabase.js";

function byId(x){ return document.getElementById(x); }

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.form");
  if (!form) return;

  const status = byId("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try{
      if (status) status.textContent = "Sending...";

      await submitContactMessage({
        session_id: getSessionId(),
        full_name: byId("name")?.value || "",
        email: byId("email")?.value || "",
        subject: byId("subject")?.value || "",
        order_id: byId("order")?.value || "",
        message: byId("message")?.value || ""
      });

      if (status) status.textContent = "Sent! We’ll reply within 24–48 hours.";
      form.reset();
      setTimeout(()=>{ if(status) status.textContent=""; }, 4000);
    } catch(err){
      console.warn(err);
      if (status) status.textContent = "Error: check Supabase key/table.";
    }
  });
});
