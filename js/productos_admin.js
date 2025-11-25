
if (typeof requireRole === "function") {
  requireRole(["admin"]);
}

function obtenerMenu() {
  var raw = null;
  try {
    raw = localStorage.getItem("menuData");
  } catch (e) {
    console.error("Error leyendo menuData", e);
  }
  if (!raw) return window.menuData || [];
  try {
    var parsed = JSON.parse(raw) || [];
    if (Array.isArray(parsed)) return parsed;
    return window.menuData || [];
  } catch (e) {
    console.error("Error parseando menuData", e);
    return window.menuData || [];
  }
}

function guardarMenu(menu) {
  try {
    localStorage.setItem("menuData", JSON.stringify(menu));
  } catch (e) {
    console.error("Error guardando menuData", e);
  }
  window.menuData = menu;
}

function renderProductos() {
  var cont = document.getElementById("productos-lista");
  if (!cont) return;
  var menu = obtenerMenu();
  cont.innerHTML = "";
  if (!menu.length) {
    cont.innerHTML = "<p style='grid-column:1/-1;text-align:center;'>Sin productos</p>";
    return;
  }
  menu.forEach(function (item) {
    cont.innerHTML += `
      <div class="card">
        <h3>ID ${item.id}</h3>
        <input
          type="text"
          value="${item.name}"
          data-field="name"
          data-id="${item.id}"
          placeholder="Nombre">
        <input
          type="number"
          min="0"
          step="1"
          value="${item.price}"
          data-field="price"
          data-id="${item.id}"
          placeholder="Precio">
        <button onclick="guardarCambios(${item.id})">Guardar cambios</button>
        <button onclick="eliminarProducto(${item.id})">Eliminar</button>
      </div>`;
  });
}

function guardarCambios(id) {
  var nombreInput = document.querySelector('input[data-field="name"][data-id="' + id + '"]');
  var precioInput = document.querySelector('input[data-field="price"][data-id="' + id + '"]');
  if (!nombreInput || !precioInput) return;

  var nombre = nombreInput.value.trim();
  var precio = parseFloat(precioInput.value);

  if (!nombre) {
    alert("El nombre no puede estar vacío");
    return;
  }
  if (isNaN(precio) || precio < 0) {
    alert("Precio inválido");
    return;
  }

  var menu = obtenerMenu();
  var prod = menu.find(function (p) { return p.id === id; });
  if (!prod) return;

  prod.name = nombre;
  prod.price = precio;

  guardarMenu(menu);
  alert("Producto actualizado");
  renderProductos();
}

function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  var menu = obtenerMenu().filter(function (p) { return p.id !== id; });
  guardarMenu(menu);

  // También limpiamos el inventario de ese producto
  try {
    var inv = JSON.parse(localStorage.getItem("inventario") || "{}");
    if (inv && typeof inv === "object" && id in inv) {
      delete inv[id];
      localStorage.setItem("inventario", JSON.stringify(inv));
    }
  } catch (e) {
    console.error("Error actualizando inventario al borrar producto", e);
  }

  renderProductos();
}

function agregarProducto() {
  var nombreInput = document.getElementById("nuevo-nombre");
  var precioInput = document.getElementById("nuevo-precio");
  if (!nombreInput || !precioInput) return;

  var nombre = nombreInput.value.trim();
  var precio = parseFloat(precioInput.value);

  if (!nombre) {
    alert("Escribe un nombre para el producto");
    return;
  }
  if (isNaN(precio) || precio < 0) {
    alert("Escribe un precio válido");
    return;
  }

  var menu = obtenerMenu();
  var maxId = 0;
  menu.forEach(function (p) {
    if (typeof p.id === "number" && p.id > maxId) maxId = p.id;
  });
  var nuevo = {
    id: maxId + 1,
    name: nombre,
    price: precio
  };
  menu.push(nuevo);
  guardarMenu(menu);

  // Aseguramos registro en inventario
  try {
    var inv = JSON.parse(localStorage.getItem("inventario") || "{}") || {};
    if (inv[nuevo.id] == null) inv[nuevo.id] = 0;
    localStorage.setItem("inventario", JSON.stringify(inv));
  } catch (e) {
    console.error("Error añadiendo al inventario nuevo producto", e);
  }

  nombreInput.value = "";
  precioInput.value = "";
  alert("Producto agregado");
  renderProductos();
}

document.addEventListener("DOMContentLoaded", renderProductos);
