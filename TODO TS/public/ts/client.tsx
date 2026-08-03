import * as tdo from '../../src/tdo.ts';

// Frontend Client Logic for Task Manager GUI
document.addEventListener('DOMContentLoaded', () => {
    let allTasks: tdo.taskModel[] = [];
    let currentFilter = 'all';
    let searchQuery = '';

    const tbody = document.querySelector('.table tbody');
    const countBadge = document.querySelector('.count-badge');
    const footerInfo = document.querySelector('.footer-info');
    const filterTabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.querySelector('.search-input') as HTMLInputElement | null; 
    const btnAddTask = document.getElementById('btn-add-task') as HTMLButtonElement | null;
    const btnClearCompleted = document.querySelector('.btn-link') as HTMLButtonElement | null;

    // Fetch & render tasks from API
    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) throw new Error('Failed to load tasks');
            allTasks = await response.json();
            render();
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Render task list & summary stats
    function render() {
        const filtered = allTasks.filter(task => {
            const matchesFilter = currentFilter === 'all' ||
                (currentFilter === 'pending' && task.status === 'pending') ||
                (currentFilter === 'completed' && task.status === 'completed') ||
                (currentFilter === 'cancelled' && task.status === 'cancelled');

            const matchesSearch = !searchQuery ||
                task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });

        // Clear existing rows
        tbody.innerHTML = '';

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #a1a1aa;">
                        No tasks found.
                    </td>
                </tr>
            `;
        } else {
            filtered.forEach(task => {
                const tr = document.createElement('tr');
                let rowClass = 'task-row';
                if (task.status === 'completed') rowClass += ' task-row-done';
                if (task.status === 'cancelled') rowClass += ' task-row-cancelled';
                tr.className = rowClass;
                tr.dataset.id = task.id;

                const isCompleted = task.status === 'completed';
                const isCancelled = task.status === 'cancelled';

                let statusClass = 'status-pending';
                if (task.status === 'completed') statusClass = 'status-completed';
                if (task.status === 'cancelled') statusClass = 'status-cancelled';

                const statusLabel = task.status.charAt(0).toUpperCase() + task.status.slice(1);

                tr.innerHTML = `
                    <td class="col-check">
                        <label class="checkbox-container" title="${isCompleted ? 'Mark as pending' : 'Mark as done'}">
                            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
                            <span class="checkbox-custom"></span>
                        </label>
                    </td>
                    <td class="task-id">#${String(task.id).padStart(2, '0')}</td>
                    <td class="task-name">${escapeHTML(task.name)}</td>
                    <td class="task-desc">${escapeHTML(task.description)}</td>
                    <td class="col-status">
                        <span class="status-badge ${statusClass}">${statusLabel}</span>
                    </td>
                    <td class="col-actions">
                        <div class="action-group">
                            <button class="btn-icon-text btn-edit-action" data-id="${task.id}" title="Edit Task">Edit</button>
                            ${!isCancelled ? `<button class="btn-icon-text danger btn-cancel-action" data-id="${task.id}" title="Cancel Task">Cancel</button>` : ''}
                            <button class="btn-icon-text danger btn-delete-action" data-id="${task.id}" title="Delete Task">Delete</button>
                        </div>
                    </td>
                `;

                // Add event listeners for controls
                const checkbox = tr.querySelector('.task-checkbox');
                checkbox.addEventListener('change', () => toggleStatus(task.id, checkbox.checked));

                const btnEdit = tr.querySelector('.btn-edit-action');
                if (btnEdit) btnEdit.addEventListener('click', () => handleEdit(task));

                const btnCancel = tr.querySelector('.btn-cancel-action');
                if (btnCancel) btnCancel.addEventListener('click', () => handleCancel(task.id));

                const btnDelete = tr.querySelector('.btn-delete-action');
                if (btnDelete) btnDelete.addEventListener('click', () => handleDelete(task.id));

                tbody.appendChild(tr);
            });
        }

        // Update counts
        const pendingCount = allTasks.filter(t => t.status === 'pending').length;
        const completedCount = allTasks.filter(t => t.status === 'completed').length;
        const cancelledCount = allTasks.filter(t => t.status === 'cancelled').length;

        if (countBadge) countBadge.textContent = `${pendingCount} remaining`;
        if (footerInfo) footerInfo.textContent = `Showing ${filtered.length} of ${allTasks.length} tasks`;

        // Update tab count badges
        const tabAll = document.querySelector('.tab-btn:nth-child(1) .tab-count');
        const tabPending = document.querySelector('.tab-btn:nth-child(2) .tab-count');
        const tabCompleted = document.querySelector('.tab-btn:nth-child(3) .tab-count');
        const tabCancelled = document.querySelector('.tab-btn:nth-child(4) .tab-count');

        if (tabAll) tabAll.textContent = allTasks.length;
        if (tabPending) tabPending.textContent = pendingCount;
        if (tabCompleted) tabCompleted.textContent = completedCount;
        if (tabCancelled) tabCancelled.textContent = cancelledCount;
    }

    // Toggle Task Completion
    async function toggleStatus(id: number, isDone: boolean) : Promise<void>{
        try {
            const newStatus = isDone ? 'completed' : 'pending';
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');
            const updated = await response.json();
            
            const index = allTasks.findIndex(t => t.id === id);
            if (index !== -1) allTasks[index] = updated;
            render();
        } catch (error) {
            console.error('Error updating task status:', error);
            fetchTasks();
        }
    }

    // Cancel Task
    async function handleCancel(id) {
        if (!confirm(`Are you sure you want to cancel task #${id}?`)) return;

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' })
            });

            if (!response.ok) throw new Error('Failed to cancel task');
            const updated = await response.json();

            const index = allTasks.findIndex(t => t.id === id);
            if (index !== -1) allTasks[index] = updated;
            render();
        } catch (error) {
            console.error('Error cancelling task:', error);
            alert('Could not cancel task.');
        }
    }

if (btnAddTask) {
    // Add New Task
    btnAddTask.addEventListener('click', async () => {
        const name = prompt("Enter new task name:");
        if (!name || !name.trim()) return;

        const description = prompt("Enter task description (optional):") || "";

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), description: description.trim() })
            });

            if (!response.ok) throw new Error('Failed to create task');
            const newTask = await response.json();
            allTasks.push(newTask);
            render();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Could not create task. Please try again.');
        }
    });
     }

    // Edit Task
    async function handleEdit(task: tdo.taskModel): Promise<void> {
        const newName = prompt("Update task name:", task.name);
        if (newName === null) return;

        const newDesc = prompt("Update task description:", task.description);
        if (newDesc === null) return;

        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() })
            });

            if (!response.ok) throw new Error('Failed to update task');
            const updated = await response.json();
            const index = allTasks.findIndex(t => t.id === task.id);
            if (index !== -1) allTasks[index] = updated;
            render();
        } catch (error) {
            console.error('Error editing task:', error);
            alert('Could not update task.');
        }
    }

    // Delete Task
    async function handleDelete(id: number): Promise<void> {
        if (!confirm(`Are you sure you want to delete task #${id}?`)) return;

        try {
            const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete task');

            allTasks = allTasks.filter(t => t.id !== id);
            render();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Could not delete task.');
        }
    }

    // Clear Completed Tasks
    if (btnClearCompleted) {
        btnClearCompleted.addEventListener('click', async () => {
            const completedTasks = allTasks.filter(t => t.status === 'completed');
            if (completedTasks.length === 0) {
                alert('No completed tasks to clear.');
                return;
            }

            if (!confirm(`Clear all ${completedTasks.length} completed tasks?`)) return;

            for (const task of completedTasks) {
                try {
                    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
                } catch (e) {
                    console.error('Error clearing task:', e);
                }
            }
            fetchTasks();
        });
    }

    // Filter Tabs
    filterTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (index === 0) currentFilter = 'all';
            else if (index === 1) currentFilter = 'pending';
            else if (index === 2) currentFilter = 'completed';
            else if (index === 3) currentFilter = 'cancelled';

            render();
        });
    });

    // Search Filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            render();
        });
    }

    // Utility HTML Escaper
    function escapeHTML(str) {
        return (str || '').replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Initial load
    fetchTasks();
});
