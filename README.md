# Todo List App

A beautiful, feature-rich todo list application built with HTML, CSS, and JavaScript.

## Features

- ✅ Add, complete, and delete tasks
- 📅 Due date picker with overdue highlighting
- 🔴🟡🟢 Priority levels (High, Medium, Low)
- 💾 Automatic localStorage persistence
- 🎨 Beautiful gradient UI design
- 📱 Responsive design for mobile and desktop
- 🔍 Filter tasks (All, Active, Completed)
- ↕️ Sort by Priority, Due Date, or Created date

## Development Environment

This project was developed using:

- **Code Editor:** Visual Studio Code
- **AI Assistant:** Cline (Claude Code)
- **Version Control:** Git + GitHub CLI
- **Browser:** Chrome/Safari/Firefox (for testing)

## Getting Started

1. Clone the repository:
   ```bash
   gh repo clone Jan85/todo-list
   ```

2. Open `index.html` in your browser, or:
   - Open the folder in VS Code
   - Use the "Live Server" extension to run locally

## Tech Stack

- HTML5
- CSS3 (modern features like flexbox, CSS variables)
- JavaScript (ES6+)
- localStorage for data persistence

## Commands Used in This Project

Below is a chronological list of all commands run during development:

### Initial Setup
```bash
gh auth status                              # Check if GitHub CLI is authenticated
git status                                 # Check if directory is a git repository
git init                                   # Initialize a new git repository
git add index.html                          # Stage index.html for commit
git commit -m "Initial commit..."          # Create first commit with todo list app
```

### GitHub Repository Creation
```bash
gh repo create todo-list --public --source=. --push    # Create GitHub repo and push code
gh repo edit Jan85/todo-list --visibility private      # Change repo to private
gh repo edit Jan85/todo-list --visibility public       # Change repo back to public
gh repo edit Jan85/todo-list --visibility private --accept-visibility-change-consequences    # Force private
gh repo edit Jan85/todo-list --visibility public --accept-visibility-change-consequences     # Force public
```

### GitHub Pages Deployment
```bash
curl -X POST "https://api.github.com/repos/Jan85/todo-list/pages" -H "Authorization: Bearer $(gh auth token)" -H "Accept: application/vnd.github+json" -d '{"source":{"branch":"main","path":"/"}}'    # Enable GitHub Pages
curl -s -o /dev/null -w "%{http_code}" https://jan85.github.io/todo-list/    # Test if Pages is accessible
```

### Pushing Updates
```bash
git add README.md                                   # Stage README for commit
git commit -m "Add README with development environment info"    # Commit README
git add index.html                                  # Stage index.html for commit
git commit -m "Add sort options..."                # Commit sort feature
git commit -m "Improve mobile responsiveness"      # Commit mobile improvements
git commit -m "Fix due date input styling"          # Commit CSS fix
git push                                            # Push all commits to GitHub
```

### GitHub CLI Commands
```bash
gh repo view Jan85/todo-list --json visibility     # Check repository visibility
gh repo edit Jan85/todo-list --enable-pages        # Enable GitHub Pages (didn't work via CLI)
```

## Project History

1. Created basic todo list HTML/CSS/JS
2. Added due date picker and priority levels
3. Added sorting options (Priority, Due Date, Created)
4. Enhanced mobile responsiveness
5. Deployed to GitHub Pages
6. Fixed due date input styling

## Live Demo

The app is hosted at: **https://jan85.github.io/todo-list/**

Note: Repository was made public to enable GitHub Pages access.

## License

MIT
