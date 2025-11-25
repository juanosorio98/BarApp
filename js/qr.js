
const qrContainer = document.getElementById("qr-container");
const totalMesasQR = 8;

if (typeof requireRole === "function") {
  requireRole(["admin"]);
}

if (qrContainer) {
  for (let i = 1; i <= totalMesasQR; i++) {
    const path = window.location.pathname || "/";
    const base = path.substring(0, path.lastIndexOf("/") + 1);
    const url = window.location.origin + base + `cliente.html?mesa=${i}`;
    const img =
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
      encodeURIComponent(url);
    qrContainer.innerHTML += `
      <div class="card">
        <h3>Mesa ${i}</h3>
        <img src="${img}" alt="QR Mesa ${i}" class="qr-image">
        <p>${url}</p>
      </div>`;
  }
}
