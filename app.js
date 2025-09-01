// 🔧 Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnvwwxjZXSsegb9QVsWbElqJkzkuEjO1o",
  authDomain: "withyou-4a6e7.firebaseapp.com",
  projectId: "withyou-4a6e7",
  storageBucket: "withyou-4a6e7.appspot.com",
  messagingSenderId: "125390127809",
  appId: "1:125390127809:web:993f4312b1058e2f500a40",
  measurementId: "G-V1Q0NW24CS"
};

// 🔥 Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 🎯 Referencias DOM
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const logoutBtn = document.getElementById('logout-btn');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const bucketListUl = document.getElementById('bucket-list');
const completedListUl = document.getElementById('completed-list');

let currentUserId = null;

// 👤 Registro
registerBtn.addEventListener('click', () => {
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value.trim();

  if (!email || !password) return alert('Completa los campos');

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert('Registrado e iniciado'))
    .catch(e => alert(e.message));
});

// 🔐 Login
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) return alert('Completa los campos');

  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert('Sesión iniciada'))
    .catch(e => alert(e.message));
});

// 🔓 Logout
logoutBtn.addEventListener('click', () => auth.signOut());

// 👀 Estado de sesión
auth.onAuthStateChanged(user => {
  if (user) {
    currentUserId = user.uid;
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    loadTasks();
  } else {
    currentUserId = null;
    authSection.style.display = 'block';
    appSection.style.display = 'none';
    logoutBtn.style.display = 'none';
    clearLists();
  }
});

// ➕ Añadir tarea
addTaskBtn.addEventListener('click', () => {
  const taskName = taskInput.value.trim();
  if (!taskName) return;

  const task = {
    name: taskName,
    completed: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  db.collection('users').doc(currentUserId).collection('tasks').add(task)
    .then(() => {
      taskInput.value = '';
      loadTasks();
    })
    .catch(console.error);
});

// 📥 Cargar tareas
function loadTasks() {
  if (!currentUserId) return;

  clearLists();

  db.collection('users').doc(currentUserId).collection('tasks')
    .orderBy('createdAt')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const task = doc.data();
        const li = document.createElement('li');
        li.textContent = task.name;

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔️';
        completeBtn.title = 'Completar';
        completeBtn.onclick = () => completeTask(doc.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = () => deleteTask(doc.id);

        if (task.completed) {
          li.classList.add('completed');
          li.appendChild(deleteBtn);
          completedListUl.appendChild(li);
        } else {
          li.appendChild(completeBtn);
          li.appendChild(deleteBtn);
          bucketListUl.appendChild(li);
        }
      });
    })
    .catch(console.error);
}

// ✅ Completar
function completeTask(taskId) {
  db.collection('users').doc(currentUserId).collection('tasks').doc(taskId)
    .update({ completed: true })
    .then(loadTasks)
    .catch(console.error);
}

// ❌ Borrar
function deleteTask(taskId) {
  db.collection('users').doc(currentUserId).collection('tasks').doc(taskId)
    .delete()
    .then(loadTasks)
    .catch(console.error);
}

// 🧹 Limpiar listas
function clearLists() {
  bucketListUl.innerHTML = '';
  completedListUl.innerHTML = '';
}

