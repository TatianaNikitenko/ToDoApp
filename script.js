document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Render todos
    function renderTodos() {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
        });

        if (filteredTodos.length === 0) {
            todoList.innerHTML = '<div class="empty-state">No todos found</div>';
            return;
        }

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            if (todo.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${index}">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" data-id="${index}">Delete</button>
            `;

            todoList.appendChild(li);
        });

        // Add event listeners to checkboxes and delete buttons
        document.querySelectorAll('.todo-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTodo);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTodo);
        });
    }

    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            saveTodos();
            todoInput.value = '';
            renderTodos();
        }
    }

    // Toggle todo completion status
    function toggleTodo(e) {
        const id = e.target.getAttribute('data-id');
        todos[id].completed = !todos[id].completed;
        saveTodos();
        renderTodos();
    }

    // Delete todo
    function deleteTodo(e) {
        const id = e.target.getAttribute('data-id');
        todos.splice(id, 1);
        saveTodos();
        renderTodos();
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Filter todos
    function setFilter(e) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTodos();
    }

    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', setFilter);
    });

    // Initial render
    renderTodos();
});