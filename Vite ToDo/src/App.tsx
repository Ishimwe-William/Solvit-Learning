import { useState, useEffect } from 'react'
import './App.css'

const TaskStatus = {
  All: 'all',
  Active: 'active',
  Pending: 'pending',
  Completed: 'completed',
  Cancelled: 'cancelled'
} as const;

type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

interface FormErrors {
  title?: string;
  description?: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'Build Vite React App', description: 'Setup initial project structure and components', status: TaskStatus.Completed, createdAt: new Date().toLocaleDateString() },
  { id: 2, title: 'Style Bunsenplus Brand', description: 'Apply vibrant Google colors to Bunsenplus brand header', status: TaskStatus.Active, createdAt: new Date().toLocaleDateString() },
  { id: 3, title: 'Implement Task Workflow', description: 'Add support for active, pending, and completed task states', status: TaskStatus.Active, createdAt: new Date().toLocaleDateString() },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('bunsenplus_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [filterStatus, setFilterStatus] = useState<TaskStatus>(TaskStatus.All);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [taskForm, setTaskForm] = useState<{ title: string; description: string; status: TaskStatus }>({
    title: '',
    description: '',
    status: TaskStatus.Active
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean }>({});

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bunsenplus_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  const activeCount = tasks.filter(t => t.status === TaskStatus.Active || t.status === TaskStatus.Pending).length;

  const validateForm = (title: string, description: string, currentId: number | null): FormErrors => {
    const errors: FormErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      errors.title = 'Task title is required.';
    } else if (trimmedTitle.length < 3) {
      errors.title = 'Task title must be at least 3 characters.';
    } else if (trimmedTitle.length > 80) {
      errors.title = 'Task title cannot exceed 80 characters.';
    } else {
      const isDuplicate = tasks.some(t => t.id !== currentId && t.title.toLowerCase() === trimmedTitle.toLowerCase());
      if (isDuplicate) {
        errors.title = 'A task with this title already exists.';
      }
    }

    if (description.length > 300) {
      errors.description = 'Description cannot exceed 300 characters.';
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...taskForm, [name]: value };
    setTaskForm(updatedForm);

    if (touched[name as keyof FormErrors]) {
      const errors = validateForm(updatedForm.title, updatedForm.description, editingTaskId);
      setFormErrors(errors);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validateForm(taskForm.title, taskForm.description, editingTaskId);
    setFormErrors(errors);
  };

  const handleOpenAddModal = () => {
    setTaskForm({ title: '', description: '', status: TaskStatus.Active });
    setEditingTaskId(null);
    setFormErrors({});
    setTouched({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskForm({ title: task.title, description: task.description, status: task.status });
    setEditingTaskId(task.id);
    setFormErrors({});
    setTouched({});
    setIsAddModalOpen(true);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true });

    const errors = validateForm(taskForm.title, taskForm.description, editingTaskId);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      if (editingTaskId !== null) {
        // Edit existing task
        setTasks(prev => prev.map(t => t.id === editingTaskId ? {
          ...t,
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          status: taskForm.status
        } : t));
      } else {
        // Create new task
        const newTask: Task = {
          id: Date.now(),
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          status: taskForm.status,
          createdAt: new Date().toLocaleDateString()
        };
        setTasks(prev => [newTask, ...prev]);
      }

      setIsSaving(false);
      setIsAddModalOpen(false);
      setEditingTaskId(null);
    }, 400);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === TaskStatus.Completed ? TaskStatus.Active : TaskStatus.Completed;
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const filterTasks = (taskList: Task[], isCompletedColumn: boolean) => {
    return taskList.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isCompleted = t.status === TaskStatus.Completed;
      if (isCompletedColumn !== isCompleted) return false;

      if (filterStatus === TaskStatus.All) return matchesSearch;
      return matchesSearch && t.status === filterStatus;
    });
  };

  const activeTasks = filterTasks(tasks, false);
  const completedTasks = filterTasks(tasks, true);

  return (
    <div className="app-wrapper">
      {/* Header Row: Bunsenplus with Spinning Icon on Far Left, ToDo on Far Right */}
      <section id="header">
        <div className="header-row">
          <h1 className="header-title">
            <span className="bunsenplus-brand">
              <span className="spinning-brand-icon" title="Active Spinner"></span>
              <span className="bunsenplus">
                <span>B</span><span>u</span><span>n</span><span>s</span><span>e</span><span>n</span><span>p</span><span>l</span><span>u</span><span>s</span>
              </span>
            </span>
            <span className="todo-label">
              <span className="todo-dot"></span>
              ToDo
            </span>
          </h1>
        </div>
      </section>

      {/* Controls Row */}
      <section className="controls-section">
        <div className="task-header-left">
          <div className="task-count-row">
            <span className="task-title-text">Tasks</span>
            <span className="task-remaining-badge">{activeCount} remaining</span>
          </div>
          <p className="task-subtitle">Manage your daily tasks and workflow priorities.</p>
        </div>
        <button
          type="button"
          className="add-btn"
          onClick={handleOpenAddModal}
        >
          + Add Task
        </button>
      </section>

      {/* Search & Filter Controls */}
      <section id="task-list">
        <div className="task-filter-row">
          <div className="task-filter-group">
            {Object.values(TaskStatus).map((statusOption) => (
              <div
                key={statusOption}
                className={`task-filter-item ${filterStatus === statusOption ? 'active' : ''}`}
                onClick={() => setFilterStatus(statusOption)}
              >
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </div>
            ))}
          </div>
          <div className="task-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              maxLength={50}
            />
          </div>
        </div>

        {/* Modal with Form Validations */}
        {isAddModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{editingTaskId !== null ? 'Edit Task' : 'Create New Task'}</h3>
              <form onSubmit={handleSaveTask} noValidate>
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="task-title">Task Title *</label>
                    <span className={`char-count ${taskForm.title.length > 80 ? 'over-limit' : ''}`}>
                      {taskForm.title.length}/80
                    </span>
                  </div>
                  <input
                    id="task-title"
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter task title (3-80 chars)..."
                    className={touched.title && formErrors.title ? 'input-error' : ''}
                    autoFocus
                  />
                  {touched.title && formErrors.title && (
                    <span className="error-text">{formErrors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="task-description">Description</label>
                    <span className={`char-count ${taskForm.description.length > 300 ? 'over-limit' : ''}`}>
                      {taskForm.description.length}/300
                    </span>
                  </div>
                  <textarea
                    id="task-description"
                    name="description"
                    value={taskForm.description}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter task description (max 300 chars)..."
                    rows={3}
                    className={touched.description && formErrors.description ? 'input-error' : ''}
                  />
                  {touched.description && formErrors.description && (
                    <span className="error-text">{formErrors.description}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="task-status">Status</label>
                  <select
                    id="task-status"
                    name="status"
                    value={taskForm.status}
                    onChange={handleInputChange}
                  >
                    <option value={TaskStatus.Active}>Active</option>
                    <option value={TaskStatus.Pending}>Pending</option>
                    <option value={TaskStatus.Completed}>Completed</option>
                    <option value={TaskStatus.Cancelled}>Cancelled</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="btn-spinner"></span> Saving...
                      </>
                    ) : (
                      'Save Task'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Side-by-side ToDo columns in the same row */}
        <div className="todo-columns-row">
          {/* Left Column: Active & Pending ToDos */}
          <div className="todo-column left-column">
            <div className="column-header">
              <h2>Active ToDos</h2>
              <span className="column-count">{activeTasks.length}</span>
            </div>
            <div className="column-tasks">
              {activeTasks.length === 0 ? (
                <div className="empty-state">No active tasks found</div>
              ) : (
                activeTasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-card-header">
                      <input
                        type="checkbox"
                        checked={task.status === TaskStatus.Completed}
                        onChange={() => handleToggleComplete(task.id)}
                        title="Mark as completed"
                      />
                      <span className="task-card-title">{task.title}</span>
                      <span className={`task-status-badge ${task.status}`}>{task.status}</span>
                    </div>
                    {task.description && <p className="task-card-desc">{task.description}</p>}
                    <div className="task-card-footer">
                      <span className="task-date">{task.createdAt}</span>
                      <div className="task-card-actions">
                        <button onClick={() => handleOpenEditModal(task)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Completed ToDos */}
          <div className="todo-column right-column">
            <div className="column-header">
              <h2>Completed ToDos</h2>
              <span className="column-count">{completedTasks.length}</span>
            </div>
            <div className="column-tasks">
              {completedTasks.length === 0 ? (
                <div className="empty-state">No completed tasks yet</div>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="task-card completed-card">
                    <div className="task-card-header">
                      <input
                        type="checkbox"
                        checked={task.status === TaskStatus.Completed}
                        onChange={() => handleToggleComplete(task.id)}
                        title="Mark as active"
                      />
                      <span className="task-card-title completed-title">{task.title}</span>
                      <span className={`task-status-badge ${task.status}`}>{task.status}</span>
                    </div>
                    {task.description && <p className="task-card-desc">{task.description}</p>}
                    <div className="task-card-footer">
                      <span className="task-date">{task.createdAt}</span>
                      <div className="task-card-actions">
                        <button onClick={() => handleOpenEditModal(task)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
