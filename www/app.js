/**
 * Site runtime: tenure, career years, contact thank-you URL.
 * Canonical production host: rudol.dev
 */
const CAREER_START_YEAR = 2014;
const PRODUCTION_ORIGIN = "https://rudol.dev";

function monthsBetween(start, end) {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

function formatTenure(totalMonths) {
  if (totalMonths < 0) totalMonths = 0;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} mo${months === 1 ? "" : "s"}`;
  if (months === 0) return `${years} yr${years === 1 ? "" : "s"}`;
  return `${years} yr${years === 1 ? "" : "s"} ${months} mo${months === 1 ? "" : "s"}`;
}

function parseYearMonth(value) {
  if (value === "present") return new Date();
  const [y, m] = value.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

function thankYouUrl() {
  const { protocol, hostname, origin, href } = window.location;
  const isLocal =
    protocol === "file:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local");

  if (isLocal) {
    return new URL("thanks.html", href).href;
  }
  // Prefer current origin (preview/staging), fall back documented prod
  const base = origin || PRODUCTION_ORIGIN;
  return new URL("/thanks.html", base).href;
}

const now = new Date();
const yearsIt = Math.max(0, now.getFullYear() - CAREER_START_YEAR);
for (const el of document.querySelectorAll("[data-years-it]")) {
  el.textContent = String(yearsIt);
}

for (const el of document.querySelectorAll("[data-tenure]")) {
  const start = parseYearMonth(el.dataset.start);
  const end = parseYearMonth(el.dataset.end || "present");
  el.textContent = ` · ${formatTenure(monthsBetween(start, end))}`;
}

const next = document.getElementById("contact-next");
if (next) next.value = thankYouUrl();

const hostEl = document.querySelector("[data-site-host]");
if (hostEl) {
  hostEl.textContent = window.location.hostname || "local";
  hostEl.parentElement?.removeAttribute("hidden");
}

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("contact-status");
const submitBtn = document.getElementById("contact-submit");
if (form && statusEl && submitBtn) {
  form.addEventListener("submit", () => {
    submitBtn.disabled = true;
    statusEl.hidden = false;
    statusEl.textContent = "Sending… complete the captcha if prompted.";
  });
}
