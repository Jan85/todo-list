import { useState, useEffect } from 'react';
import type { Todo, Priority, FilterType, SortType } from './types';
import './App.css';

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const PRIORITY_TEXT: Record<Priority, string> = {
  high: '🔴 High',
  medium: '🟡 Medium',
  low: '🟢 Low',
};

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputText, setInputText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('priority');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputText.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      dueDate: dueDate || null,
      priority,
      createdAt: new Date().toISOString(),
    };
    
    setTodos([...todos, newTodo]);
    setInputText('');
    setDueDate('');
    setPriority('medium');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const isOverdue = (dueDate: string | null, completed: boolean): boolean => {
    if (!dueDate || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return due < today;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sortTodos = (todoArray: Todo[]): Todo[] => {
    return [...todoArray].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      if (sortBy === 'priority') {
        if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        }
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
      } else if (sortBy === 'dueDate') {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        }
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const sortedTodos = sortTodos(filteredTodos);
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container">
      <div className="todo-app">
        <h1>📝 My Todo List</h1>
        
        <div className="input-group">
          <input
            type="text"
            id="todo-input"
            placeholder="Add a new task..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <input
            type="date"
            id="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
          />
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button id="add-btn" onClick={addTodo}>Add</button>
        </div>
        
        <div className="controls-row">
          <div className="filter-group">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          <div className="sort-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="created">Created</option>
            </select>
          </div>
        </div>
        
        <ul className="todo-list">
          {sortedTodos.length === 0 ? (
            <div className="empty-state">
              <span>📋</span>
              <p>
                {filter === 'all' 
                  ? 'No tasks yet! Add your first task above.' 
                  : `No ${filter} tasks.`}
              </p>
            </div>
          ) : (
            sortedTodos.map(todo => {
              const overdue = isOverdue(todo.dueDate, todo.completed);
              return (
                <li 
                  key={todo.id} 
                  className={`todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
                >
                  <div 
                    className="checkbox" 
                    onClick={() => toggleTodo(todo.id)}
                  ></div>
                  <div className="todo-content">
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-meta">
                      <span className={`priority-badge priority-${todo.priority}`}>
                        {PRIORITY_TEXT[todo.priority]}
                      </span>
                      {todo.dueDate && (
                        <span className={`due-date-badge ${overdue ? 'overdue' : ''}`}>
                          📅 {formatDate(todo.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="actions">
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
        
        <div className="stats">
          Completed: {completedCount} | Active: {activeCount} | Total: {todos.length}
        </div>
      </div>
    </div>
  );
}

export default App;
