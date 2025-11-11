// frontend/src/App.jsx
import React, { useState } from 'react';
import CurriculumDesigner from './pages/CurriculumDesigner';
import Chatbot from './components/Chatbot'; 
import './index.css'; 

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    // The main container and layout
    <div className="container"> 
      <CurriculumDesigner />
      
      {/* Floating Chatbot Button */}
      <div 
        className="floating-chat-icon" 
        onClick={() => setIsChatOpen(true)}
      >
        🤖
      </div>
      
      {/* Floating Chat Panel */}
      <Chatbot 
        isChatOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default App;