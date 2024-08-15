document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const editTaskInput = document.getElementById('edit-task-input');
    const saveTaskBtn = document.getElementById('save-task-btn');

    let tasks = [];
    let currentEditIndex = null;

    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        renderTasks();
    }

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }
        const newTask = {
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveAndRenderTasks();
        taskInput.value = '';
    });

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveAndRenderTasks();
            });

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;
            if (task.completed) {
                span.style.textDecoration = 'line-through';
                span.style.color = '#888';
            }

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openEditModal(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                if (confirm('This task is going to be delete.')) {
                    tasks.splice(index, 1);
                    saveAndRenderTasks();
                }
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(actionsDiv);

            taskList.appendChild(li);
        });
    }

    function saveAndRenderTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function openEditModal(index) {
        currentEditIndex = index;
        editTaskInput.value = tasks[index].text;
        editModal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    });

    saveTaskBtn.addEventListener('click', () => {
        const editedText = editTaskInput.value.trim();
        if (editedText === '') {
            alert('Task cannot be empty.');
            return;
        }
        tasks[currentEditIndex].text = editedText;
        saveAndRenderTasks();
        editModal.style.display = 'none';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    editTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskBtn.click();
        }
    });
});