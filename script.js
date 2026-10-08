"use strict";

/* ===== 1. MOBILE MENU: open and close the hamburger menu ===== */
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navigation.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

// Close the menu after tapping a link
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

// Close the menu with the Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

// Close the menu if the screen is resized to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 680) setMenuOpen(false);
});

/* ===== 2. FORM + THANK-YOU MESSAGE =====
   The form is sent to your third-party form tool without leaving the page,
   then the thank-you message below appears.

   OPTION A (this script): keep as is. Works with Formspree, Getform, Web3Forms, etc.
   OPTION B (redirect): delete this whole section 2, and in your form tool's settings
   set a "redirect after submit" URL pointing to a thank-you page (e.g. thanks.html).
*/
const form = document.querySelector("#registration-form");
const statusMessage = document.querySelector("#form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = form.fullName.value.trim();
  const thankYou = "Thank you" + (name ? ", " + name : "") + "! Your message has been received and I will get back to you soon.";
  const button = form.querySelector("button[type='submit']");

  // While the placeholder URL is still in the form, just preview the thank-you message
  if (form.action.includes("YOUR_FORM_ENDPOINT_URL")) {
    statusMessage.textContent = thankYou;
    form.reset();
    return;
  }

  button.disabled = true;
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Request failed");
    statusMessage.textContent = thankYou;
    form.reset();
  } catch (error) {
    statusMessage.textContent = "Sorry, something went wrong. Please try again or email me directly.";
  }
  button.disabled = false;
});
