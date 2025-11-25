
const menuContainer = document.getElementById("menu");
if (menuContainer && window.menuData) {
  window.menuData.forEach(item => {
    menuContainer.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>Precio: <strong>$${item.price}</strong></p>
      </div>`;
  });
}
