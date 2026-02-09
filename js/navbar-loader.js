const BASE = window.location.pathname.includes("/zat.am/")
  ? "/zat.am"
  : "";

async function loadNavbar() {
  const mount = document.getElementById("navbar-mount");
  if (!mount) return;

  const res = await fetch("/shared/navbar.html");
  mount.innerHTML = await res.text();

  const mod = await import("/js/navbar-auth.js");
  mod.initNavbarAuth();
}

loadNavbar();
