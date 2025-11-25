// js/carta.js
// Carta para mesero: agregar productos a una mesa específica

if (typeof requireRole === "function") requireRole(["admin","mesero"]);

(function () {
  var menuCarta = document.getElementById("menu");
  var totalMesas = 8;

  if (!menuCarta || !window.menuData) return;

  // Pintar la carta
  window.menuData.forEach(function (item) {
    var opciones = '<option value="" disabled selected>Selecciona mesa</option>';
    for (var i = 1; i <= totalMesas; i++) {
      opciones += '<option value="' + i + '">Mesa ' + i + "</option>";
    }

    var card =
      '<div class="card">' +
        "<h3>" + item.name + "</h3>" +
        "<p>$" + item.price + "</p>" +
        '<select data-id="' + item.id + '">' + opciones + "</select>" +
        '<input type="number" min="1" value="1" data-id="qty-' + item.id + '" placeholder="Cantidad">' +
        '<button onclick="addToMesa(' + item.id + ')">Agregar a Mesa</button>' +
      "</div>";

    menuCarta.innerHTML += card;
  });

})();

// Hacer la función global para que la pueda ver el onclick
function addToMesa(id) {
  var select = document.querySelector('select[data-id="' + id + '"]');
  var qtyInput = document.querySelector('input[data-id="qty-' + id + '"]');

  if (!select || !qtyInput) {
    alert("No se encontró el elemento de la carta.");
    return;
  }

  var mesa = select.value;
  var cantidad = parseInt(qtyInput.value, 10);

  if (!mesa) {
    alert("Selecciona una mesa");
    return;
  }

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Cantidad inválida");
    return;
  }

  var inventario = JSON.parse(localStorage.getItem("inventario") || "{}");

  if (!inventario[id] || inventario[id] < cantidad) {
    alert("Sin stock suficiente");
    return;
  }

  var keyMesa = "mesa" + mesa;
  var pedidos = JSON.parse(localStorage.getItem(keyMesa) || "[]");

  // Normalizar qty por si hay registros viejos
  for (var i = 0; i < pedidos.length; i++) {
    if (!pedidos[i].qty) pedidos[i].qty = 1;
  }

  var prod = null;
  for (var j = 0; j < window.menuData.length; j++) {
    if (window.menuData[j].id === id) {
      prod = window.menuData[j];
      break;
    }
  }
  if (!prod) {
    alert("Producto no encontrado");
    return;
  }

  var existente = null;
  for (var k = 0; k < pedidos.length; k++) {
    if (pedidos[k].id === id) {
      existente = pedidos[k];
      break;
    }
  }

  if (existente) {
    existente.qty += cantidad;
  } else {
    pedidos.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      qty: cantidad
    });
  }

  localStorage.setItem(keyMesa, JSON.stringify(pedidos));

  inventario[id] = (inventario[id] || 0) - cantidad;
  localStorage.setItem("inventario", JSON.stringify(inventario));

  alert("Agregado " + prod.name + " x" + cantidad + " a Mesa " + mesa);
  select.value = "";
  qtyInput.value = 1;
}
