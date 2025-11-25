
const users = [
  { user: "admin",   pass: "admin",  rol: "admin"  },
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
    publicHome.style.display = "none";
    appHome.style.display = "block";
    const map = { admin: "Administrador", mesero: "Mesero" };
    if (userInfo) {
      userInfo.textContent = `Sesión: ${localStorage.getItem("usuario")} (${map[rol] || rol})`;
    }
    const adminBtn = document.getElementById("admin-btn");
    const reportesBtn = document.getElementById("reportes-btn");
    const qrBtn = document.getElementById("qr-btn");
    const mesasBtn = document.getElementById("mesas-btn");
    if (rol === "admin") {
      adminBtn.style.display = "block";
      reportesBtn.style.display = "block";
      qrBtn.style.display = "block";
      mesasBtn.style.display = "block";
    } else if (rol === "mesero") {
      adminBtn.style.display = "none";
      reportesBtn.style.display = "none";
      qrBtn.style.display = "none";
      mesasBtn.style.display = "block";
    }
  } else {
    publicHome.style.display = "block";
    appHome.style.display = "none";
    if (userInfo) userInfo.textContent = "";
  }
}

window.addEventListener("load", () => {
  const qrImg = document.getElementById("qr-img");
  if (qrImg) {
        const path = window.location.pathname;
    const base = path.substring(0, path.lastIndexOf("/") + 1);
    const url = window.location.origin + base + "productos.html";
    qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(url);
  }
  const inicio = parseInt(localStorage.getItem("sesionInicio") || "0", 10);
  const maxMs = 30 * 60 * 1000;
  if (inicio && (Date.now() - inicio) > maxMs) {
    localStorage.clear();
  }
  mostrarVista();
});
