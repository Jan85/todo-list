import { useState, useEffect } from 'react';
import type { Todo, Priority, FilterType, SortType } from './types';
import './App.css';

const translations = {
  en: {
    title: 'My Todo List',
    subtitle: 'Organize your day effortlessly',
    totalTasks: 'Total Tasks',
    inProgress: 'In Progress',
    completed: 'Completed',
    addTaskPlaceholder: 'Add a new task...',
    noCategory: 'No category',
    work: 'Work',
    personal: 'Personal',
    other: 'Other',
    all: 'All',
    active: 'Active',
    done: 'Done',
    noTasks: 'No tasks here.',
    clearCompleted: 'Clear completed',
    today: 'Today',
    tomorrow: 'Tomorrow',
  },
  zh: {
    title: '我的待辦事項',
    subtitle: '輕鬆安排您的一天',
    totalTasks: '總任務',
    inProgress: '進行中',
    completed: '已完成',
    addTaskPlaceholder: '新增任務...',
    noCategory: '無分類',
    work: '工作',
    personal: '個人',
    other: '其他',
    all: '全部',
    active: '進行中',
    done: '已完成',
    noTasks: '這裡沒有任務。',
    clearCompleted: '清除已完成',
    today: '今天',
    tomorrow: '明天',
  }
};

type Language = 'en' | 'zh';
type TranslationKey = keyof typeof translations.en;

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const PRIORITY_TEXT: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const PRIORITY_TEXT_ZH: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const PRIORITY_CLASS: Record<Priority, string> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
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
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved ? saved === 'dark' : prefersDark;
  });
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

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

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
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
    
    if (date.getTime() === today.getTime()) return t('today');
    if (date.getTime() === tomorrow.getTime()) return t('tomorrow');
    
    return date.toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string): string => {
    const d = new Date(dateStr);
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${ampm} ${h}:${m}`;
  };

  const getPriorityText = (priority: Priority): string => {
    if (language === 'zh') {
      return PRIORITY_TEXT_ZH[priority];
    }
    return PRIORITY_TEXT[priority];
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container">
      {/* Top bar */}
      <div className="topbar">
        <button className="theme-btn" onClick={toggleLanguage} title="Toggle language">
          {language === 'en' ? '中' : 'EN'}
        </button>
        <button className="theme-btn" onClick={toggleTheme} title="Toggle dark mode">
          🌙
        </button>
      </div>

      <div className="todo-app">
        {/* App header */}
        <div className="app-header">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="header-text">
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num total">{todos.length}</div>
            <div className="stat-label">{t('totalTasks')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-num inprog">{activeCount}</div>
            <div className="stat-label">{t('inProgress')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-num done">{completedCount}</div>
            <div className="stat-label">{t('completed')}</div>
          </div>
        </div>

        {/* Add task card */}
        <div className="add-task-card">
          <input
            type="text"
            id="todo-input"
            placeholder={t('addTaskPlaceholder')}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="add-btn" onClick={addTodo} title="Add task">
            <svg viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Meta row */}
        <div className="meta-row">
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="none">{t('noCategory')}</option>
            <option value="high">{t('work')}</option>
            <option value="medium">{t('personal')}</option>
            <option value="low">{t('other')}</option>
          </select>
          <input
            type="date"
            id="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
          />
        </div>

        {/* Filter tabs */}
        <div className="filter-card">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('all')}
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            {t('active')}
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            {t('done')}
          </button>
        </div>

        {/* Task list */}
        <ul className="todo-list">
          {sortedTodos.length === 0 ? (
            <li className="empty-state">{t('noTasks')}</li>
          ) : (
            sortedTodos.map(todo => {
              const overdue = isOverdue(todo.dueDate, todo.completed);
              return (
                <li key={todo.id} className="todo-item">
                  <input 
                    type="checkbox" 
                    className="checkbox" 
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <div className="todo-content">
                    <span className={`todo-text ${todo.completed ? 'done' : ''}`}>
                      {todo.text}
                    </span>
                    <div className="todo-meta">
                      <span className={`priority-badge ${PRIORITY_CLASS[todo.priority]}`}>
                        {getPriorityText(todo.priority)}
                      </span>
                      {todo.dueDate && (
                        <span className={`task-time ${overdue ? 'overdue' : ''}`}>
                          {formatDate(todo.dueDate)} • {formatTime(todo.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => deleteTodo(todo.id)} title="Delete">
                    &#10005;
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer */}
        {completedCount > 0 && (
          <div className="footer">
            <button className="clear-btn" onClick={clearCompleted}>
              {t('clearCompleted')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
