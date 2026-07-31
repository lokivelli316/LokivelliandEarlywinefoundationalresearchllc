# Better OS Dashboard

## 🚀 Modular AI Workspace - Prototype v0.1.0

Better OS Dashboard is a **prototype** modular AI workspace. This implementation provides a solid foundation with working UI components and state management.

## ⚠️ Current Status: PROTOTYPE

This is a **prototype** implementation. Features are being developed incrementally.

### Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| **Core Architecture** | ✅ Working | Single entry point, proper routing |
| **Chat Interface** | ✅ Working | Message history, session management |
| **Physics Lab** | ✅ Working | Equation verification with math.js |
| **Notebook System** | ✅ Working | Cells with Markdown, Math, Code |
| **Media Studio** | ⚠️ Simulated | Mock data, interface only |
| **CAD & Design** | ⚠️ Simulated | 2D canvas, interface only |
| **AI Agent Harness** | ⚠️ Simulated | Agent management, simulated responses |
| **Financial Hub** | ✅ Working | Transaction tracking, balance calculation |
| **Settings** | ✅ Working | Profile, API configuration |

### API Integrations
- ❌ OpenAI - Not yet implemented
- ❌ Anthropic - Not yet implemented
- ❌ Google - Not yet implemented
- ❌ Local Models - Not yet implemented

**API keys are retained in memory for the current session only and are cleared on reload.**

## 📦 Installation

```bash
cd apps/better-os-dashboard
npm install
npm run dev
# Open http://localhost:3000
```

## 🏗️ Project Structure

```
apps/better-os-dashboard/
├── index.html                    # Entry point
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── .eslintrc.cjs                # ESLint configuration
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
├── 
├── public/
│   └── favicon.svg              # App icon
│
├── src/
│   ├── main.jsx                 # App entry
│   ├── App.jsx                  # Main router
│   ├── 
│   ├── components/              # Page components
│   │   ├── Sidebar.jsx          # Navigation
│   │   ├── TopBar.jsx           # Top bar
│   │   ├── MainHub.jsx          # Dashboard home
│   │   ├── ChatPage.jsx         # Chat interface
│   │   ├── PhysicsPage.jsx      # Physics lab
│   │   ├── NotebookPage.jsx     # Notebook system
│   │   ├── MediaPage.jsx        # Media studio
│   │   ├── CADPage.jsx          # CAD design
│   │   ├── AgentsPage.jsx       # AI agents
│   │   ├── FinancePage.jsx      # Financial hub
│   │   └── SettingsPage.jsx     # Settings
│   │
│   ├── store/
│   │   └── index.js            # Zustand store
│   │
│   ├── styles/
│   │   └── index.css          # Global styles
│   │
│   └── test/
│       ├── setup.js            # Test setup
│       ├── App.test.jsx        # App tests
│       └── store.test.js       # Store tests
```

## 🎯 Usage

All features are accessible through the sidebar navigation. Features marked as "Simulated" will show mock data or simulated responses.

## 🔧 Configuration

### API Keys
Configure your AI provider API keys in the Settings page. 

**Important:** API keys are stored in memory only for the current session. They are NOT persisted to localStorage or any backend. Keys will be cleared when you refresh the page.

For production use, this should be replaced with a proper secret management system.

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

## 📝 Notes

### Prototype Limitations
This is a prototype implementation. Many features display mock data or simulated responses. The focus has been on:

1. Creating a solid UI foundation
2. Implementing proper state management
3. Building reusable components
4. Establishing a clean architecture

### Known Issues
- API integrations are not yet implemented
- Local model support is planned but not available
- Some features use mock data for demonstration
- No server-side persistence

### Security
- API keys are NOT persisted (session only)
- No authentication implemented
- Not suitable for production use with real data

## 🤝 Contributing

Contributions are welcome! Please note that this is a prototype.

## 📄 License

MIT License
