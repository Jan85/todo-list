# Technical Documentation - My Todo List App

## Project Overview

This is a **Todo List** web application built with **React** and **TypeScript**. It allows users to create, manage, and organize tasks with priorities, due dates, and categories. The app supports English/Chinese languages and dark mode.

---

## 📁 Project Structure

```
todo-list-react/
├── public/                    # Static files (images, icons)
│   ├── icon.svg              # App icon for iOS home screen
│   └── vite.svg              # Default Vite favicon
├── src/                      # Source code
│   ├── assets/               # Static assets (images)
│   ├── App.css              # Main styling
│   ├── App.tsx              # Main React component (all app logic)
│   ├── index.css            # Global styles
│   ├── main.tsx             # React entry point
│   └── types.ts             # TypeScript type definitions
├── index.html               # HTML entry point
├── vite.config.ts           # Vite build configuration
├── package.json             # NPM dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── technote.md             # This file
```

---

## 📄 File Explanations

### 1. **package.json** 📦
**What it does:** Defines project dependencies and scripts.

**Why it's needed:**
- Lists React, TypeScript, Vite as dependencies
- Defines npm commands (scripts)

**Key scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Deploy to GitHub Pages

```json
{
  "dependencies": {
    "react": "^19.2.0",        // UI library
    "react-dom": "^19.2.0"     // React DOM renderer
  }
}
```

---

### 2. **vite.config.ts** ⚙️
**What it does:** Configures Vite (the build tool).

**Why it's needed:**
- Sets the base path for GitHub Pages deployment (`/todo-list/`)
- Enables React plugin

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/todo-list/',  // Important for GitHub Pages!
})
```

---

### 3. **index.html** 🌐
**What it does:** The HTML entry point for the browser.

**Why it's needed:**
- Loads the React app
- Contains meta tags for iOS (home screen icon, PWA support)

**Key features:**
- iOS home screen icon links
- Theme color for browser
- Mobile web app capable

```html
<link rel="apple-touch-icon" href="/todo-list/icon-192.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

---

### 4. **src/main.tsx** 🚀
**What it does:** The React entry point.

**Why it's needed:**
- Renders the App component into the HTML root

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### 5. **src/types.ts** 📝
**What it does:** Defines TypeScript interfaces/types.

**Why it's needed:**
- Ensures type safety throughout the app

```typescript
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
  priority: Priority;
  createdAt: string;
}

export type Priority = 'high' | 'medium' | 'low';
export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'priority' | 'dueDate' | 'created';
```

---

### 6. **src/App.tsx** 🎯
**What it does:** The **main application component** containing ALL the logic.

**Why it's needed:** This is where the entire app runs!

**Features:**
- **State Management:** Uses `useState` for todos, language, theme
- **localStorage:** Saves data to browser (persists between sessions)
- **i18n:** English/Chinese translations
- **Theme:** Light/dark mode toggle
- **CRUD Operations:** Add, toggle, delete, clear tasks
- **Filtering:** All/Active/Completed filters
- **Sorting:** Sort by priority, due date, or created date
- **Priority System:** High (red), Medium (orange), Low (green)

**Key Functions:**
```typescript
// Add new task
const addTodo = () => { ... }

// Toggle task completion
const toggleTodo = (id: string) => { ... }

// Delete task
const deleteTodo = (id: string) => { ... }

// Toggle dark/light mode
const toggleTheme = () => { ... }

// Toggle English/Chinese
const toggleLanguage = () => { ... }
```

---

### 7. **src/App.css** 🎨
**What it does:** All styling for the app.

**Why it's needed:** Makes the app look beautiful!

**Key styling:**
- CSS Variables for theming (light/dark mode)
- Purple gradient theme
- Card-based layout
- Priority badge colors (red/orange/green)
- Responsive design for mobile
- Animations (slideIn)

**Theme Colors:**
```css
:root {
  --bg-page: #ede9f6;      /* Light purple background */
  --bg-card: #ffffff;       /* White cards */
  --text-title: #1e1b4b;    /* Dark purple text */
}

[data-theme="dark"] {
  --bg-page: #111118;      /* Dark background */
  --bg-card: #1c1c28;      /* Dark cards */
}
```

---

### 8. **src/index.css** 🌍
**What it does:** Global reset and base styles.

**Why it's needed:**
- Resets browser default margins/padding
- Sets base font family

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

---

### 9. **tsconfig.json** 🔧
**What it does:** TypeScript compiler configuration.

**Why it's needed:**
- Enables TypeScript type checking
- Sets JavaScript version (ES2020)
- Includes React JSX support

---

### 10. **public/icon.svg** 🖼️
**What it does:** App icon for iOS home screen.

**Why it's needed:**
- Displays on iPhone home screen when added via Safari
- Purple gradient with todo checkmarks design

---

## 🔄 How Data Flows

```
User Action (e.g., Add Task)
         ↓
    App.tsx (handle action)
         ↓
    Update State (useState)
         ↓
    Save to localStorage (persist)
         ↓
    React re-renders UI
         ↓
    User sees updated list
```

---

## 💾 Data Storage

**Where:** Browser's `localStorage`

**Keys stored:**
- `todos` - Array of task objects
- `theme` - "light" or "dark"
- `language` - "en" or "zh"

**Data is stored locally on YOUR device, NOT on a server.**

---

## 🌐 Deployment (GitHub Pages)

1. **Build:** `npm run build` - Creates production files in `dist/`
2. **Deploy:** `npx gh-pages -d dist` - Uploads to GitHub Pages branch
3. **Access:** https://jan85.github.io/todo-list/

---

## 🛠️ How to Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📱 Mobile Features

- **Responsive Design:** Works on all screen sizes
- **PWA Support:** Can be added to iPhone home screen
- **Offline Capable:** Works without internet (data saved locally)
- **Touch Friendly:** Large buttons and inputs

---

## 🔢 Priority System

| Priority | Label | Color | Badge |
|----------|-------|-------|-------|
| High | 高 | 🔴 Red | `priority-high` |
| Medium | 中 | 🟠 Orange | `priority-medium` |
| Low | 低 | 🟢 Green | `priority-low` |

---

## 🌏 Language Support

| Key | English | Chinese |
|-----|---------|---------|
| title | My Todo List | 我的待辦事項 |
| totalTasks | Total Tasks | 總任務 |
| inProgress | In Progress | 進行中 |
| completed | Completed | 已完成 |
| addTaskPlaceholder | Add a new task... | 新增任務... |
| clearCompleted | Clear completed | 清除已完成 |
| today | Today | 今天 |
| tomorrow | Tomorrow | 明天 |

---

*Last Updated: Feb 2026*
