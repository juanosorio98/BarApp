// js/cliente.js
// Modo cliente: agrega a su propia mesa detectada por la URL

function getMesaFromURL() {
  var params = new URLSearchParams(window.location.search);
  return params.get("mesa");
}

var mesa = getMesaFromURL();
var mesaLabel = document.getElementById("mesa-label");
var menuDiv = document.getElementById("menu");

if (mesaLabel) {
  if (!mesa) {
    mesaLabel.textContent = "Mesa no definida";
    alert("URL sin mesa. Ejemplo: cliente.html?mesa=1");
  } else {
    mesaLabel.textContent = "Mesa " + mesa;
  }
}

// Pintar el menú para el cliente
if (menuDiv && window.menuData) {
  window.menuData.forEach(function (item) {
    var card =
      '<div class="card">' +
        "<h3>" + item.name + "</h3>" +
        "<p>$" + item.price + "</p>" +
        '<input type="number" min="1" value="1" data-id="' + item.id + '" placeholder="Cantidad">' +
        '<button onclick="agregar(' + item.id + ')">Agregar a mi pedido</button>' +
      "</div>";
    menuDiv.innerHTML += card;
  });
}

// Función global para el onclick
function agregar(id) {
  if (!mesa) {
    alert("Mesa no definida");
    return;
  }

  var input = document.querySelector('input[data-id="' + id + '"]');
  if (!input) {
    alert("No se encontró el campo de cantidad.");
    return;
  }

  var cantidad = parseInt(input.value, 10);
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

  alert("Agregado " + prod.name + " x" + cantidad + " a tu mesa");
  input.value = 1;
}
