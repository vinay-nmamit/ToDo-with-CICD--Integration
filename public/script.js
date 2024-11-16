document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch tasks from the database via the backend
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => renderTasks(tasks))
            .catch(err => console.error('Error fetching tasks:', err));
    }

    // Render tasks on the UI
    function renderTasks(tasks) {
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `${task.task} <button class="delete-btn" data-id="${task.id}">Delete</button>`;
            taskList.appendChild(li);
        });

        // Add event listeners to delete buttons
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.dataset.id;
                deleteTask(taskId);
            });
        });
    }

    // Add task (it makes an API call to add the task to the database)
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newTask = taskInput.value.trim();
        if (newTask) {
            const task = {
                task: newTask
            };
            taskInput.value = '';
            addTask(task);
        }
    });

    // Add a task (send POST request to server)
    function addTask(task) {
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(() => {
            // Fetch all tasks again to update the task list
            fetchTasks();
        })
        .catch(err => console.error('Error adding task:', err));
    }

    // Delete task (send DELETE request to server)
    function deleteTask(taskId) {
        fetch(`/tasks/${taskId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => fetchTasks())  // Refresh tasks after deletion
            .catch(err => console.error('Error deleting task:', err));
    }

    // Initial fetch of tasks when the page loads
    fetchTasks();
});

// changes