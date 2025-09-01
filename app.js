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
const db = firebase.firestore();

// 🎯 Referencias DOM
const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const bucketListUl = document.getElementById('bucket-list');
const completedListUl = document.getElementById('completed-list');

// ➕ Añadir tarea
addTaskBtn.addEventListener('click', () => {
  const taskName = taskInput.value.trim();
  if (!taskName) return;

  db.collection('publicTasks').add({
    name: taskName,
    completed: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    taskInput.value = '';
    loadTasks();
  })
  .catch(console.error);
});

// 📥 Cargar tareas
function loadTasks() {
  clearLists();

  db.collection('publicTasks')
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

// ✅ Completar tarea
function completeTask(taskId) {
  db.collection('publicTasks').doc(taskId)
    .update({ completed: true })
    .then(loadTasks)
    .catch(console.error);
}

// ❌ Borrar tarea
function deleteTask(taskId) {
  db.collection('publicTasks').doc(taskId)
    .delete()
    .then(loadTasks)
    .catch(console.error);
}

// 🧹 Limpiar listas
function clearLists() {
  bucketListUl.innerHTML = '';
  completedListUl.innerHTML = '';
}

// 🔁 Cargar tareas al cargar la página
window.addEventListener('load', loadTasks);

