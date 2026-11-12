const phone = "56954018537";
const wa = message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

document.querySelectorAll("[data-equipment]").forEach(link => {
  const equipment = link.dataset.equipment;
  link.href = wa(`Hola, quiero consultar por el arriendo de ${equipment}. ¿Tienen disponibilidad y cuál es el valor?`);
  link.target = "_blank";
  link.rel = "noopener";
});

const cards = [...document.querySelectorAll(".equipment-card")];
const filters = [...document.querySelectorAll(".filter")];
const search = document.querySelector("#search");
const results = document.querySelector("#results");
const empty = document.querySelector("#empty-state");
let active = "todos";
const normalize = text => text.toLocaleLowerCase("es-CL").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function updateCatalog() {
  const query = normalize(search.value.trim());
  let count = 0;
  cards.forEach(card => {
    const categoryMatch = active === "todos" || card.dataset.category === active;
    const textMatch = !query || normalize(card.dataset.name + " " + card.innerText).includes(query);
    card.hidden = !(categoryMatch && textMatch);
    if (!card.hidden) count++;
  });
  results.textContent = `Mostrando ${count} ${count === 1 ? "equipo" : "equipos"}`;
  empty.hidden = count !== 0;
}
filters.forEach(button => button.addEventListener("click", () => {
  active = button.dataset.filter;
  filters.forEach(item => {
    const selected = item === button;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  updateCatalog();
}));
search.addEventListener("input", updateCatalog);

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Abrir menú");
}));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }
});

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px 50px 0px", threshold: .04 });
  document.querySelectorAll(".reveal").forEach((item, index) => {
    if (item.classList.contains("equipment-card")) item.style.transitionDelay = `${(index % 4) * 55}ms`;
    observer.observe(item);
  });
} else {
  document.querySelectorAll(".reveal").forEach(item => item.classList.add("is-visible"));
}
document.querySelector("#year").textContent = new Date().getFullYear();
