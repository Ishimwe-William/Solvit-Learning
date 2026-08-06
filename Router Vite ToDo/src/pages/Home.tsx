import { useNavigate } from "react-router-dom";
import { Filter } from "../components/Filter";
import { TaskHeaderControls } from "../components/TaskHeaderControls";
import { TaskTableViewGroup } from "../components/TaskTableViewGroup";
import { TaskGridView } from "../components/TaskGridView";
import { useTaskManager } from "../hooks/useTaskManager";
import type { Task } from "../types/Task";
import { Ratings } from "../components/Ratings";

export const Home = () => {
  const navigate = useNavigate();
  const {
    tasks,
    activeCount,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    statusCounts,
    activeTasks,
    completedTasks,
    handleDeleteTask,
    handleToggleComplete,
  } = useTaskManager();

  const handleEditTask = (task: Task) => {
    navigate(`/tasks/${task.id}/edit`, { state: task });
  };

  const handleViewDetails = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <div className="app-wrapper">
      <Ratings rating={tasks.length > 0 ? 5 - (activeCount * 5 / tasks.length) : 0} />
      <TaskHeaderControls
        activeCount={activeCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddTaskClick={() => navigate("/tasks/create")}
      />

      <section id="task-list">
        <Filter
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          statusCounts={statusCounts}
        />

        {viewMode === "table" ? (
          <TaskTableViewGroup
            activeTasks={activeTasks}
            completedTasks={completedTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <TaskGridView
            activeTasks={activeTasks}
            completedTasks={completedTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onViewDetails={handleViewDetails}
          />
        )}
      </section>
    </div>
  );
};
