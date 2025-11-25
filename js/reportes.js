if (typeof requireRole === "function") requireRole(["admin"]);

function renderTabla(containerId, headers, rows) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  if (rows.length === 0) {
    cont.innerHTML = "<p>No hay datos.</p>";
    return;
  }
  let html = "<table class='tabla-reportes'><thead><tr>";
  headers.forEach(h => html += `<th>${h}</th>`);
  html += "</tr></thead><tbody>";
  rows.forEach(r => {
    html += "<tr>";
    r.forEach(c => html += `<td>${c}</td>`);
    html += "</tr>";
  });
  html += "</tbody></table>";
  cont.innerHTML = html;
}

function obtenerVentas() {
  return JSON.parse(localStorage.getItem("ventas") || "[]");
}

function reporteMesas() {
  const ventas = obtenerVentas();
  const tot = {};
  ventas.forEach(v => { tot[v.mesa] = (tot[v.mesa] || 0) + v.total; });
  const rows = Object.keys(tot).map(m => [m, "$" + tot[m]]);
  renderTabla("reporte-mesas", ["Mesa", "Total"], rows);
}

function reporteProductos() {
  const ventas = obtenerVentas();
  const cant = {};
  const ingreso = {};
  ventas.forEach(v => {
    (v.items || []).forEach(it => {
      const n = it.name;
      const q = it.qty || 1;
      cant[n] = (cant[n] || 0) + q;
      ingreso[n] = (ingreso[n] || 0) + it.price * q;
    });
  });
  const rows = Object.keys(cant).map(n => [n, cant[n], "$" + ingreso[n]]);
  renderTabla("reporte-productos", ["Producto", "Cantidad", "Ingresos"], rows);
}

function reporteUsuarios() {
  const ventas = obtenerVentas();
  const tot = {};
  ventas.forEach(v => {
    const u = v.usuario || "desconocido";
    tot[u] = (tot[u] || 0) + v.total;
  });
  const rows = Object.keys(tot).map(u => [u, "$" + tot[u]]);
  renderTabla("reporte-usuarios", ["Usuario", "Total"], rows);
}

reporteMesas();
reporteProductos();
reporteUsuarios();

// Actualizar reportes automáticamente si cambian las ventas en otra pestaña
window.addEventListener("storage", function (e) {
  if (e.key !== "ventas") return;
  console.log("[BarApp] Ventas actualizadas → refrescando reportes");
  reporteMesas();
  reporteProductos();
  reporteUsuarios();
});
