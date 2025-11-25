

/* Datos de menú: inicialización dinámica en localStorage */
function initMenu() {
  var stored = null;
  try {
    stored = localStorage.getItem("menuData");
  } catch (e) {
    console.error("Error leyendo menuData de localStorage", e);
  }
  var menu;
  if (!stored) {
    menu = [
      { id: 1, name: "Cerveza Corona",   price: 45 },
      { id: 2, name: "Michelada",        price: 80 },
      { id: 3, name: "Mojito",           price: 95 },
      { id: 4, name: "Cuba Libre",       price: 90 },
      { id: 5, name: "Whisky",           price: 130 },
      { id: 6, name: "Papas con Chedar", price: 75 }
    ];
    try {
      localStorage.setItem("menuData", JSON.stringify(menu));
    } catch (e) {
      console.error("No se pudo guardar menuData inicial", e);
    }
  } else {
    try {
      menu = JSON.parse(stored) || [];
    } catch (e) {
      console.error("Error parseando menuData, reestableciendo por defecto", e);
      menu = [];
    }
    if (!Array.isArray(menu) || menu.length === 0) {
      menu = [
        { id: 1, name: "Cerveza Corona",   price: 45 },
        { id: 2, name: "Michelada",        price: 80 },
        { id: 3, name: "Mojito",           price: 95 },
        { id: 4, name: "Cuba Libre",       price: 90 },
        { id: 5, name: "Whisky",           price: 130 },
        { id: 6, name: "Papas con Chedar", price: 75 }
      ];
      try {
        localStorage.setItem("menuData", JSON.stringify(menu));
      } catch (e2) {
        console.error("No se pudo restaurar menuData por defecto", e2);
      }
    }
  }
  window.menuData = menu;
}

/* Inventario: asegurar que exista stock para todos los productos */
function initInventario() {
  var inv;
  try {
    inv = JSON.parse(localStorage.getItem("inventario") || "{}");
  } catch (e) {
    console.error("Error leyendo inventario, reiniciando", e);
    inv = {};
  }
  if (!inv || typeof inv !== "object") inv = {};

  var defaults = { 1: 20, 2: 15, 3: 10, 4: 12, 5: 8, 6: 25 };

  (window.menuData || []).forEach(function (item) {
    if (inv[item.id] == null) {
      inv[item.id] = defaults[item.id] != null ? defaults[item.id] : 0;
    }
  });

  try {
    localStorage.setItem("inventario", JSON.stringify(inv));
  } catch (e) {
    console.error("No se pudo guardar inventario", e);
  }
}

initMenu();
initInventario();

/* THEME */
function applyTheme(theme) {
  var body = document.body;
  if (!body) return;
  body.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    console.error("No se pudo guardar theme", e);
  }

  var btn = document.querySelector(".theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️ Claro" : "🌙 Oscuro";
  }
}

function initThemeToggle() {
  var body = document.body;
  if (!body) return;

  var saved;
  try {
    saved = localStorage.getItem("theme") || "dark";
  } catch (e) {
    saved = "dark";
  }
  body.setAttribute("data-theme", saved);

  var header = document.querySelector("header");
  if (!header) {
    applyTheme(saved);
    return;
  }

  var btn = document.querySelector(".theme-toggle");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "theme-toggle";
    header.appendChild(btn);
  }

  applyTheme(saved);

  btn.addEventListener("click", function () {
    var current = document.body.getAttribute("data-theme") || "dark";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

document.addEventListener("DOMContentLoaded", initThemeToggle);

/* Protección por rol básica */
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

/* Actualización automática de vistas cuando cambian datos clave */
window.addEventListener("storage", function (e) {
  var clavesInteres = ["inventario", "inventarioHistorial", "ventas", "menuData"];
  if (clavesInteres.indexOf(e.key) === -1) return;

  var path = window.location.pathname || "";
  var paginasQueDependen = [
    "inventario.html",
    "reportes.html",
    "mesas.html",
    "carta.html",
    "cliente.html",
    "productos.html"
  ];

  var deboRecargar = paginasQueDependen.some(function (nombre) {
    return path.endsWith(nombre);
  });

  if (!deboRecargar) return;

  console.log("[BarApp] Cambio en", e.key, "→ recargando vista:", path);
  window.location.reload();
});
