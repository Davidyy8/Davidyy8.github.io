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
      <span class="text">${item.name}</span>
      <div class="buttons">
        <button onclick="markCompleted(${index})" title="Marcar como completado">✔️</button>
        <button onclick="deletePending(${index})" title="Borrar actividad">🗑️</button>
      </div>
    `;
    ul.appendChild(li);
  });

  const cul = document.getElementById("completed-list");
  cul.innerHTML = "";
  completedList.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("completed");
    li.innerHTML = `
      <span class="text">
        ${item.name}<br/>
        <small>${item.date}</small><br/>
        ${item.photo ? `<img src="${item.photo}" alt="Foto">` : ""}
      </span>
      <div class="buttons">
        <button onclick="deleteCompleted(${index})" title="Borrar actividad">🗑️</button>
      </div>
    `;
    cul.appendChild(li);
  });

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

function addTask() {
  const input = document.getElementById("task-input");
  const value = input.value.trim();
  if (value) {
    bucketList.push({ name: value });
    saveData();
    renderList();
    input.value = "";
  }
}

function markCompleted(index) {
  const item = bucketList.splice(index, 1)[0];
  const date = new Date().toLocaleDateString();

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.capture = "environment";
  fileInput.style.display = "none";

  fileInput.onchange = () => {
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const photo = e.target.result;
        completedList.push({ ...item, date, photo });
        saveData();
        renderList();
      };
      reader.readAsDataURL(file);
    } else {
      completedList.push({ ...item, date });
      saveData();
      renderList();
    }
  };

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

function deletePending(index) {
  if (confirm("¿Quieres borrar esta actividad pendiente?")) {
    bucketList.splice(index, 1);
    saveData();
    renderList();
  }
}

function deleteCompleted(index) {
  if (confirm("¿Quieres borrar esta actividad completada?")) {
    completedList.splice(index, 1);
    saveData();
    renderList();
  }
}

document.getElementById("add-task-btn").addEventListener("click", addTask);

document.getElementById("task-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Renderizamos la lista al cargar
renderList();

