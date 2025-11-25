if (typeof requireRole === "function") requireRole(["admin","mesero"]);

const totalMesas = 8;
let mesaActual = null;
const mesasContainer = document.getElementById("mesas-container");
const pedidoSection = document.getElementById("pedido-section");
if (pedidoSection) {
  pedidoSection.style.display = "none";
}

for (let i = 1; i <= totalMesas; i++) {
  mesasContainer.innerHTML += `
    <div class="card" id="mesa-card-${i}">
      <h3>Mesa ${i}</h3>
      <button onclick="abrirMesa(${i})">Abrir Pedido</button>
    </div>`;
}

function actualizarEstadoMesas() {
  for (let i = 1; i <= totalMesas; i++) {
    const card = document.getElementById("mesa-card-" + i);
    let pedidos = JSON.parse(localStorage.getItem("mesa" + i)) || [];
    if (pedidos.length > 0) card.classList.add("mesa-ocupada");
    else card.classList.remove("mesa-ocupada");
  }
}
actualizarEstadoMesas();

function abrirMesa(n) {
  mesaActual = n;
  document.getElementById("mesa-title").textContent = n;
  if (pedidoSection) pedidoSection.style.display = "block";
  cargarPedido();
}

function cargarPedido() {
  const list = document.getElementById("order-list");
  let pedidos = JSON.parse(localStorage.getItem("mesa" + mesaActual)) || [];
  pedidos = pedidos.map(p => (p.qty ? p : { ...p, qty: 1 }));
  localStorage.setItem("mesa" + mesaActual, JSON.stringify(pedidos));
  list.innerHTML = "";
  let total = 0;
  pedidos.forEach((item, idx) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    list.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>Cant: ${item.qty}</p>
        <p>Subtotal: $${subtotal}</p>
        <button onclick="cambiarCantidad(${idx},1)">+1</button>
        <button onclick="cambiarCantidad(${idx},-1)">-1</button>
        <button onclick="eliminarItem(${idx})">Eliminar</button>
      </div>`;
  });
  document.getElementById("total").textContent = "Total: $" + total;
  actualizarEstadoMesas();
}

function cambiarCantidad(index, delta) {
  let pedidos = JSON.parse(localStorage.getItem("mesa" + mesaActual)) || [];
  pedidos = pedidos.map(p => (p.qty ? p : { ...p, qty: 1 }));
  const item = pedidos[index];
  if (!item) return;
  let inventario = JSON.parse(localStorage.getItem("inventario")) || {};
  if (delta > 0) {
    if (!inventario[item.id] || inventario[item.id] <= 0) {
      alert("Sin stock adicional");
      return;
    }
    item.qty += 1;
    inventario[item.id] = (inventario[item.id] || 0) - 1;
  } else {
    inventario[item.id] = (inventario[item.id] || 0) + 1;
    if (item.qty <= 1) pedidos.splice(index, 1);
    else item.qty -= 1;
  }
  localStorage.setItem("inventario", JSON.stringify(inventario));
  localStorage.setItem("mesa" + mesaActual, JSON.stringify(pedidos));
  cargarPedido();
}

function eliminarItem(index) {
  let pedidos = JSON.parse(localStorage.getItem("mesa" + mesaActual)) || [];
  pedidos = pedidos.map(p => (p.qty ? p : { ...p, qty: 1 }));
  const item = pedidos[index];
  if (item) {
    let inventario = JSON.parse(localStorage.getItem("inventario")) || {};
    inventario[item.id] = (inventario[item.id] || 0) + (item.qty || 1);
    localStorage.setItem("inventario", JSON.stringify(inventario));
  }
  pedidos.splice(index, 1);
  localStorage.setItem("mesa" + mesaActual, JSON.stringify(pedidos));
  cargarPedido();
}

function cerrarCuenta() {
  let pedidos = JSON.parse(localStorage.getItem("mesa" + mesaActual)) || [];
  pedidos = pedidos.map(p => (p.qty ? p : { ...p, qty: 1 }));
  if (pedidos.length === 0) {
    alert("No hay pedidos");
    return;
  }
  let total = pedidos.reduce((s, p) => s + p.price * p.qty, 0);
  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
  ventas.push({
    mesa: mesaActual,
    total: total,
    fecha: new Date().toLocaleString(),
    usuario: localStorage.getItem("usuario") || "desconocido",
    items: pedidos
  });
  localStorage.setItem("ventas", JSON.stringify(ventas));
  localStorage.removeItem("mesa" + mesaActual);
  cargarPedido();
  actualizarEstadoMesas();
  alert("Cuenta cerrada y venta registrada");
}
