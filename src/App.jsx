import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store'

// Layout
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

// Pages
import MainHub from './components/MainHub'
import ChatPage from './components/ChatPage'
import PhysicsPage from './components/PhysicsPage'
import NotebookPage from './components/NotebookPage'
import MediaPage from './components/MediaPage'
import CADPage from './components/CADPage'
import AgentsPage from './components/AgentsPage'
import FinancePage from './components/FinancePage'
import SettingsPage from './components/SettingsPage'

const App = () => {
  const { setActiveChat, setActiveNotebook } = useStore()

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<MainHub />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/physics" element={<PhysicsPage />} />
                <Route path="/notebook" element={<NotebookPage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/cad" element={<CADPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default App
