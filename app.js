let bucketList = JSON.parse(localStorage.getItem("bucketList")) || [];
let completedList = JSON.parse(localStorage.getItem("completedList")) || [];

function saveData() {
  localStorage.setItem("bucketList", JSON.stringify(bucketList));
  localStorage.setItem("completedList", JSON.stringify(completedList));
}

function renderList() {
  const ul = document.getElementById("bucket-list");
  ul.innerHTML = "";
  bucketList.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name}
      <button onclick="markCompleted(${index})">✔️</button>
    `;
    ul.appendChild(li);
  });

  const cul = document.getElementById("completed-list");
  cul.innerHTML = "";
  completedList.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("completed");
    li.innerHTML = `
      ${item.name}<br/>
      <small>${item.date}</small><br/>
      ${item.photo ? `<img src="${item.photo}" alt="Foto">` : ""}
    `;
    cul.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById("new-item");
  if (!input.value.trim()) return;
  bucketList.push({ name: input.value.trim() });
  input.value = "";
  saveData();
  renderList();
}

function markCompleted(index) {
  const item = bucketList.splice(index, 1)[0];
  const photo = prompt("URL de una foto del recuerdo (opcional):");
  const date = new Date().toLocaleDateString();
  completedList.push({ ...item, date, photo });
  saveData();
  renderList();
}
function renderList() {
  // ... ya existente ...

  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  completedList.forEach(item => {
    if (item.photo) {
      const img = document.createElement("img");
      img.src = item.photo;
      gallery.appendChild(img);
    }
  });
}
// Guardar la fecha de inicio si no existe
if (!localStorage.getItem("startDate")) {
  localStorage.setItem("startDate", new Date().toISOString());
}
function unlockSecretActivities() {
  const now = new Date();
  const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  let unlockedCount = 0;

  secretActivities.forEach(secret => {
    const alreadyExists = bucketList.some(item => item.name === secret.name) ||
                          completedList.some(item => item.name === secret.name);
    if (!alreadyExists && daysPassed >= secret.days) {
      bucketList.push({ name: secret.name });
      unlockedCount++;
    }
  });

  if (unlockedCount > 0) {
    saveData();
    alert(`🎉 ¡Se han desbloqueado ${unlockedCount} nueva(s) actividad(es) secreta(s)!`);
  }
}
unlockSecretActivities();
renderList();


const startDate = new Date(localStorage.getItem("startDate"));

// Actividades ocultas que se desbloquean con el tiempo
const secretActivities = [
  { days: 3, name: "Ver el atardecer juntos 🌅" },
  { days: 5, name: "Hacer una cena casera 🥘" },
  { days: 7, name: "Escribir una carta de amor 💌" },
  { days: 10, name: "Jugar a un juego de mesa 🎲" },
  { days: 14, name: "Tener una noche sin pantallas 📵" },
];

renderList();
