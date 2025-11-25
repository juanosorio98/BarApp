
window.menuData = [
  { id: 1, name: "Cerveza Corona",   price: 45 },
  { id: 2, name: "Michelada",        price: 80 },
  { id: 3, name: "Mojito",           price: 95 },
  { id: 4, name: "Cuba Libre",       price: 90 },
  { id: 5, name: "Whisky",           price: 130 },
  { id: 6, name: "Papas con Chedar", price: 75 }
];

function initInventario() {
  if (!localStorage.getItem("inventario")) {
    const inv = { 1: 20, 2: 15, 3: 10, 4: 12, 5: 8, 6: 25 };
    localStorage.setItem("inventario", JSON.stringify(inv));
  }
}
initInventario();

/* THEME */
function applyTheme(theme) {
  const body = document.body;
  if (!body) return;
  body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const btn = document.querySelector(".theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️ Claro" : "🌙 Oscuro";
  }
}

function initThemeToggle() {
  const body = document.body;
  if (!body) return;

  const saved = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", saved);

  const header = document.querySelector("header");
  if (!header) {
    applyTheme(saved);
    return;
  }

  let btn = document.querySelector(".theme-toggle");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "theme-toggle";
    header.appendChild(btn);
  }

  applyTheme(saved);

  btn.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

document.addEventListener("DOMContentLoaded", initThemeToggle);

function requireRole(roles) {
  try {
    var rol = localStorage.getItem("rol");
    if (!rol || roles.indexOf(rol) === -1) {
      alert("Acceso restringido. Inicia sesión con un usuario autorizado.");
      window.location.href = "index.html";
    }
  } catch (e) {
    console.error("Error verificando rol:", e);
    window.location.href = "index.html";
  }
}
