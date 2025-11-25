
const users = [
  { user: "admin",  pass: "admin",  rol: "admin"  },
  { user: "mesero", pass: "mesero", rol: "mesero" }
];

function login() {
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value.trim();
  const found = users.find(x => x.user === u && x.pass === p);
  if (!found) {
    alert("Usuario o contraseña incorrectos");
    return;
  }
  localStorage.setItem("rol", found.rol);
  localStorage.setItem("usuario", found.user);
  localStorage.setItem("sesionInicio", Date.now().toString());
  mostrarVista();
}

function logout() {
  localStorage.clear();
  mostrarVista();
}

function mostrarVista() {
  const rol = localStorage.getItem("rol");
  const publicHome = document.getElementById("public-home");
  const appHome = document.getElementById("app-home");
  const userInfo = document.getElementById("user-info");

  if (rol) {
    if (publicHome) publicHome.style.display = "none";
    if (appHome) appHome.style.display = "block";
    const map = { admin: "Administrador", mesero: "Mesero" };
    if (userInfo) {
      userInfo.textContent =
        "Sesión: " + (localStorage.getItem("usuario") || "") +
        " (" + (map[rol] || rol) + ")";
    }
    const adminBtn = document.getElementById("admin-btn");
    const reportesBtn = document.getElementById("reportes-btn");
    const qrBtn = document.getElementById("qr-btn");
    const mesasBtn = document.getElementById("mesas-btn");
    const productosAdminBtn = document.getElementById("productos-admin-btn");

    if (rol === "admin") {
      if (adminBtn) adminBtn.style.display = "block";
      if (reportesBtn) reportesBtn.style.display = "block";
      if (qrBtn) qrBtn.style.display = "block";
      if (mesasBtn) mesasBtn.style.display = "block";
      if (productosAdminBtn) productosAdminBtn.style.display = "block";
    } else if (rol === "mesero") {
      if (adminBtn) adminBtn.style.display = "none";
      if (reportesBtn) reportesBtn.style.display = "none";
      if (qrBtn) qrBtn.style.display = "none";
      if (mesasBtn) mesasBtn.style.display = "block";
      if (productosAdminBtn) productosAdminBtn.style.display = "none";
    }
  } else {
    if (publicHome) publicHome.style.display = "block";
    if (appHome) appHome.style.display = "none";
    if (userInfo) userInfo.textContent = "";
  }
}

window.addEventListener("load", () => {
  const qrImg = document.getElementById("qr-img");
  if (qrImg) {
    const path = window.location.pathname || "/";
    const base = path.substring(0, path.lastIndexOf("/") + 1);
    const url = window.location.origin + base + "productos.html";
    qrImg.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
      encodeURIComponent(url);
  }
  const inicio = parseInt(localStorage.getItem("sesionInicio") || "0", 10);
  const maxMs = 30 * 60 * 1000;
  if (inicio && Date.now() - inicio > maxMs) {
    localStorage.clear();
  }
  mostrarVista();
});
