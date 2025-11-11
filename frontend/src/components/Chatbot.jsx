// frontend/src/components/Chatbot.jsx
import React, { useState, useEffect } from 'react';
import { generateAnalysis } from '../services/geminiApi';

function Chatbot({ isChatOpen, onClose }) {
    const [messages, setMessages] = useState([
        { sender: 'agent', text: 'Hello! I am your Research Agent. Ask me about current market demands or trending projects!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Auto-scroll to the bottom of the chat window
    useEffect(() => {
        const chatWindow = document.querySelector('.chat-messages');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        
        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // 1. Add user message
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        
        // 2. Generate agent response
        const prompt = `As a specialized Market Research Agent, respond to this user query: "${userMessage}". Provide concrete advice, trending data, or project ideas.`;
        const analysisResult = await generateAnalysis(prompt);
        
        // 3. Add agent response
        setMessages(prev => [...prev, { sender: 'agent', text: analysisResult }]);
        setLoading(false);
    };

    if (!isChatOpen) return null;

    return (
        <div className="chat-panel">
            <div className="chat-header">
                Agentic Assistant
                <button onClick={onClose} className="chat-close-btn">
                    &times;
                </button>
            </div>
            
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.sender}-message`}>
                        {msg.text}
                    </div>
                ))}
                {loading && (
                    <div className="message-bubble agent-message" style={{ opacity: 0.7 }}>
                        Agent is typing...
                    </div>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about projects or market trends..."
                    disabled={loading}
                    style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
            </form>
        </div>
    );
}

export default Chatbot;