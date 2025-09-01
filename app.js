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
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnvwwxjZXSsegb9QVsWbElqJkzkuEjO1o",
  authDomain: "withyou-4a6e7.firebaseapp.com",
  projectId: "withyou-4a6e7",
  storageBucket: "withyou-4a6e7.firebasestorage.app",
  messagingSenderId: "125390127809",
  appId: "1:125390127809:web:993f4312b1058e2f500a40",
  measurementId: "G-V1Q0NW24CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Registro
document.getElementById("register-btn").addEventListener("click", () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Usuario registrado y sesión iniciada");
      showApp();
    })
    .catch(error => alert(error.message));
});

// Inicio de sesión
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Sesión iniciada");
      showApp();
    })
    .catch(error => alert(error.message));
});

// Cerrar sesión
document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut().then(() => {
    alert("Sesión cerrada");
    showLogin();
  });
});

// Mostrar app después de login
function showApp() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("app-section").style.display = "block";
  document.getElementById("logout-btn").style.display = "inline-block";

  // Cargar datos del usuario actual
  loadTasks();
}

// Mostrar login si no está logueado
function showLogin() {
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("app-section").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
}

// Detectar estado de usuario (login/logout)
auth.onAuthStateChanged(user => {
  if(user) {
    showApp();
  } else {
    showLogin();
  }
});

const bucketListUl = document.getElementById("bucket-list");
const completedListUl = document.getElementById("completed-list");
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");

let userId = null;

auth.onAuthStateChanged(user => {
  if(user) {
    userId = user.uid;
    loadTasks();
  }
});

addTaskBtn.addEventListener("click", () => {
  const taskName = taskInput.value.trim();
  if(!taskName) return;

  const task = {
    name: taskName,
    completed: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  db.collection("users").doc(userId).collection("tasks").add(task)
    .then(() => {
      taskInput.value = "";
      loadTasks();
    })
    .catch(console.error);
});

function loadTasks() {
  if (!userId) return;

  // Limpiar listas
  bucketListUl.innerHTML = "";
  completedListUl.innerHTML = "";

  db.collection("users").doc(userId).collection("tasks")
    .orderBy("createdAt")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const task = doc.data();
        const li = document.createElement("li");
        li.textContent = task.name;

        if(task.completed) {
          li.style.textDecoration = "line-through";
          completedListUl.appendChild(li);
        } else {
          bucketListUl.appendChild(li);

          // Botón completar
          const completeBtn = document.createElement("button");
          completeBtn.textContent = "✔️";
          completeBtn.onclick = () => completeTask(doc.id);
          li.appendChild(completeBtn);
        }

        // Botón borrar para ambos
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.onclick = () => deleteTask(doc.id);
        li.appendChild(deleteBtn);
      });
    })
    .catch(console.error);
}

function completeTask(taskId) {
  db.collection("users").doc(userId).collection("tasks").doc(taskId)
    .update({ completed: true })
    .then(loadTasks)
    .catch(console.error);
}

function deleteTask(taskId) {
  db.collection("users").doc(userId).collection("tasks").doc(taskId)
    .delete()
    .then(loadTasks)
    .catch(console.error);
}

// Renderizamos la lista al cargar
renderList();

