import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Custom hook for managing tasks with localStorage persistence
 * @param {string} key - The localStorage key to use
 * @param {Array} initialValue - The initial value if no stored value exists
 */
const useLocalStorage = (key, initialValue) => {
  // Initialize state from localStorage or with initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

/**
 * Custom hook for managing tasks with localStorage persistence
 */
const useLocalStorageTasks = () => {
  // Initialize state from localStorage or with empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Update localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (text) => {
    if (text.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  // Toggle task completion status
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return { tasks, addTask, toggleTask, deleteTask };
};

/**
 * TaskManager component for managing tasks
 */
const TaskManager = ({ className = '' }) => {
  const { theme } = useTheme();
  const { tasks, addTask, toggleTask, deleteTask } = useLocalStorageTasks();
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem('taskFilter') || 'all';
  });
  const [sortBy, setSortBy] = useState('createdAt');

  // Update filter preference in localStorage
  useEffect(() => {
    localStorage.setItem('taskFilter', filter);
  }, [filter]);

  // Memoized filtered and sorted tasks
  const processedTasks = useMemo(() => {
    // First filter
    const filtered = tasks.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true; // 'all' filter
    });

    // Then sort
    return filtered.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
  }, [tasks, filter, sortBy]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTaskText);
    setNewTaskText('');
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, percent };
  }, [tasks]);

  return (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header with stats */}
      <div className="border-b dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Task Manager</h2>
          <div className="text-sm font-medium">
            <span className="inline-block px-2 py-1 rounded bg-indigo-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {stats.percent}% Complete
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${stats.percent}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        {/* Task input form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              aria-label="New task text"
            />
            <Button type="submit" variant="primary" disabled={!newTaskText.trim()}>
              Add Task
            </Button>
          </div>
        </form>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Filter buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({stats.total})
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active ({stats.active})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </Button>
          </div>

          {/* Sort options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm bg-transparent dark:border-gray-600"
            aria-label="Sort tasks by"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="alphabetical">Sort by Name</option>
          </select>
        </div>

        {/* Task list */}
        <ul className="space-y-2" role="list" aria-label="Task list">
          {processedTasks.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400 text-center py-8">
              {filter === 'all' 
                ? 'No tasks yet. Add your first task!' 
                : `No ${filter} tasks found`}
            </li>
          ) : (
            processedTasks.map((task) => (
              <li
                key={task.id}
                className={
                  'flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 transition-colors duration-200'
                }
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-blue-500 dark:bg-gray-700"
                    aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  <span className={`truncate ${
                    task.completed 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : ''
                  }`}>
                    {task.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete task "${task.text}"`}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Clear completed button */}
        {stats.completed > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const confirmed = window.confirm('Delete all completed tasks?');
                if (confirmed) {
                  tasks
                    .filter(task => task.completed)
                    .forEach(task => deleteTask(task.id));
                }
              }}
            >
              Clear Completed ({stats.completed})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

TaskManager.propTypes = {
  className: PropTypes.string,
};

export default TaskManager; 