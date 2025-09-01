// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnvwwxjZXSsegb9QVsWbElqJkzkuEjO1o",
  authDomain: "withyou-4a6e7.firebaseapp.com",
  projectId: "withyou-4a6e7",
  storageBucket: "withyou-4a6e7.appspot.com",
  messagingSenderId: "125390127809",
  appId: "1:125390127809:web:993f4312b1058e2f500a40",
  measurementId: "G-V1Q0NW24CS"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referencias DOM
const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const bucketListUl = document.getElementById('bucket-list');
const completedListUl = document.getElementById('completed-list');

// Añadir tarea al pulsar botón
addTaskBtn.addEventListener('click', () => {
  const taskName = taskInput.value.trim();
  if (!taskName) {
    alert('Por favor, escribe una tarea');
    return;
  }

  db.collection('publicTasks').add({
    name: taskName,
    completed: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    taskInput.value = '';
    loadTasks();
  })
  .catch(error => {
    console.error("Error añadiendo tarea:", error);
    alert('Error al añadir la tarea, revisa la consola');
  });
});

// Cargar tareas
function loadTasks() {
  bucketListUl.innerHTML = '';
  completedListUl.innerHTML = '';

  db.collection('publicTasks')
    .orderBy('createdAt', 'asc')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const task = doc.data();
        const li = document.createElement('li');
        li.textContent = task.name;

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔️';
        completeBtn.title = 'Completar tarea';
        completeBtn.style.marginLeft = '10px';
        completeBtn.onclick = () => completeTask(doc.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Eliminar tarea';
        deleteBtn.style.marginLeft = '5px';
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
    .catch(error => {
      console.error("Error cargando tareas:", error);
      alert('Error al cargar tareas, revisa la consola');
    });
}

// Marcar tarea como completada
function completeTask(taskId) {
  db.collection('publicTasks').doc(taskId)
    .update({ completed: true })
    .then(loadTasks)
    .catch(error => {
      console.error("Error completando tarea:", error);
      alert('Error al completar tarea, revisa la consola');
    });
}

// Borrar tarea
function deleteTask(taskId) {
  db.collection('publicTasks').doc(taskId)
    .delete()
    .then(loadTasks)
    .catch(error => {
      console.error("Error borrando tarea:", error);
      alert('Error al borrar tarea, revisa la consola');
    });
}

// Cargar tareas al abrir la página
window.addEventListener('load', loadTasks);
