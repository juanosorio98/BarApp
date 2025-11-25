
let inventario = JSON.parse(localStorage.getItem("inventario")) || {};
const productos = window.menuData;
const invContainer = document.getElementById("inventario-container");
const histContainer = document.getElementById("historial-container");

function renderInventario() {
  if (!invContainer) return;
  invContainer.innerHTML = "";
  productos.forEach(p => {
    const stock = inventario[p.id] || 0;
    const lowClass = stock <= 5 ? "low-stock" : "";
    const lowMsg = stock <= 5 ? "<p>⚠ Pocas existencias</p>" : "";
    invContainer.innerHTML += `
      <div class="card ${lowClass}">
        <h3>${p.name}</h3>
        <p>Stock: <strong id="stock-${p.id}">${stock}</strong></p>
        ${lowMsg}
        <button onclick="cambiar(${p.id}, 1)">+1</button>
        <button onclick="cambiar(${p.id}, -1)">-1</button>
        <button onclick="sinStock(${p.id})">Sin stock</button>
      </div>`;
  });
}

function sinStock(id) {
  const actual = inventario[id] || 0;
  if (actual <= 0) return;
  cambiar(id, -actual);
}

function cambiar(id, cant) {
  inventario[id] = Math.max(0, (inventario[id] || 0) + cant);
  localStorage.setItem("inventario", JSON.stringify(inventario));
  registrarMovimiento(id, cant);
  renderInventario();
}

function registrarMovimiento(id, cant) {
  const movimientos = JSON.parse(localStorage.getItem("inventarioHistorial")) || [];
  const prod = productos.find(p => p.id === id);
  movimientos.push({
    fecha: new Date().toLocaleString(),
    productoId: id,
    productoNombre: prod ? prod.name : `ID ${id}`,
    cambio: cant,
    nuevoStock: inventario[id],
    usuario: localStorage.getItem("usuario") || "desconocido",
  });
  localStorage.setItem("inventarioHistorial", JSON.stringify(movimientos));
  renderHistorial();
}

function renderHistorial() {
  if (!histContainer) return;
  const movimientos = JSON.parse(localStorage.getItem("inventarioHistorial")) || [];
  histContainer.innerHTML = "";
  if (movimientos.length === 0) {
    histContainer.innerHTML = "<p style='grid-column:1/-1;text-align:center;'>Sin movimientos</p>";
    return;
  }
  movimientos.slice().reverse().forEach(m => {
    histContainer.innerHTML += `
      <div class="card">
        <h3>${m.productoNombre}</h3>
        <p>${m.fecha}</p>
        <p>Cambio: ${m.cambio > 0 ? "+" + m.cambio : m.cambio}</p>
        <p>Nuevo stock: ${m.nuevoStock}</p>
        <p>Usuario: ${m.usuario}</p>
      </div>`;
  });
}

renderInventario();
renderHistorial();
