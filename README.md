# Better OS Dashboard

## 🚀 Modular AI Workspace

Better OS Dashboard is a **prototype** modular AI workspace designed for researchers, developers, and creators. This implementation provides a solid foundation with working UI components and state management, with API integrations planned for future development.

## ⚠️ Current Status

This is a **prototype** implementation. The following features are currently available:

### ✅ Working Features
- Core architecture and navigation
- State management with Zustand
- Basic chat interface with message history
- Physics equation verification (math.js)
- Notebook system with Markdown, Math, and Code cells
- Media generation interface (mock data)
- CAD design interface with 2D shapes
- AI agent management interface
- Financial tracking with transaction management
- Responsive design

### ⚠️ Planned Features (Not Yet Implemented)
- Real API integrations (OpenAI, Anthropic, Google)
- Local model support (Qwen, Ruflo)
- Termux integration
- GitHub integration
- Real media generation
- 3D CAD modeling
- Advanced financial tools

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/lokivelli316/LokivelliandEarlywinefoundationalresearchllc.git
cd LokivelliandEarlywinefoundationalresearchllc

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:3000
```

## 🏗️ Project Structure

```
LokivelliandEarlywinefoundationalresearchllc/
├── index.html                    # Entry point
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── README.md                    # This file
├── 
├── public/
│   └── favicon.svg              # App icon
│
└── src/
    ├── main.jsx                 # App entry
    ├── App.jsx                  # Main router
    ├── 
    ├── components/              # Page components
    │   ├── Sidebar.jsx          # Navigation
    │   ├── TopBar.jsx           # Top bar
    │   ├── MainHub.jsx          # Dashboard home
    │   ├── ChatPage.jsx         # Chat interface
    │   ├── PhysicsPage.jsx      # Physics lab
    │   ├── NotebookPage.jsx     # Notebook system
    │   ├── MediaPage.jsx        # Media studio
    │   ├── CADPage.jsx          # CAD design
    │   ├── AgentsPage.jsx       # AI agents
    │   ├── FinancePage.jsx      # Financial hub
    │   └── SettingsPage.jsx     # Settings
    │
    ├── store/
    │   └── index.js            # Zustand store
    │
    └── styles/
        └── index.css          # Global styles
```

## 🎯 Usage

### Navigation
- Use the sidebar to navigate between different modules
- Each module has its own interface and functionality

### Chat
- Create new chat sessions
- Select different AI models (mock)
- Send messages and view responses (simulated)

### Physics
- Verify equations using math.js
- View physics constants
- Use quick templates for common equations

### Notebook
- Create cells with different types (Markdown, Math, Code, Text)
- Edit and delete cells
- View live previews

### Media
- Select media type (Image, Video, Audio)
- Enter prompts
- Generate mock media (for demonstration)

### CAD
- Switch between 2D and 3D design
- Add shapes to the canvas
- Drag and delete shapes

### Agents
- Create AI agents with different types
- Assign tasks to agents
- View agent output (simulated)

### Finance
- Add transactions (income, expense, investment, transfer)
- View balance and stats
- Delete transactions

### Settings
- Configure user profile
- Set up API keys (stored locally)
- View about information

## 🔧 Configuration

### API Keys
Configure your AI provider API keys in the Settings page. Keys are stored in your browser's localStorage.

**Warning:** Do not enter production API keys on shared computers.

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

### Prototype Status
This is a **prototype** implementation. Many features display mock data or simulated responses. The focus has been on:

1. Creating a solid UI foundation
2. Implementing proper state management
3. Building reusable components
4. Establishing a clean architecture

### Known Limitations
- API integrations are not yet implemented
- Local model support is planned but not available
- Termux and GitHub integrations are planned
- Some features use mock data for demonstration

### Security Notes
- API keys are stored in localStorage (browser only)
- No server-side storage is implemented
- Do not use for sensitive data

## 🤝 Contributing

Contributions are welcome! Please note that this is a prototype, so focus on:
- Improving the UI/UX
- Adding proper API integrations
- Implementing missing features
- Fixing bugs

## 📄 License

MIT License
