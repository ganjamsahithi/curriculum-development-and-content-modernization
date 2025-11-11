// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { fetchMarketTrends } from '../services/geminiApi'; // Import new fetcher

// Mock data for project examples 
const MOCK_PROJECTS = [
    {
        title: "Real-time Fraud Detection System (Example)",
        level: "Advanced",
        description: "Design a real-time streaming pipeline using Kafka and Flink for pattern recognition and anomaly detection in transactions.",
        github_link: "#"
    },
    {
        title: "Cloud-Native Sentiment Analysis (Example)",
        level: "Intermediate",
        description: "Develop a serverless solution to scrape social media, perform sentiment analysis via NLP APIs, and deploy via Docker/Kubernetes.",
        github_link: "#"
    }
];

const ProjectItem = ({ project }) => (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '15px', background: '#f8f9fa' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>{project.title}</h4>
        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#475569' }}>{project.description}</p>
        <p style={{ fontSize: '12px', fontWeight: '500', color: '#6366f1' }}>Level: {project.level}</p>
        <a 
            href={project.github_link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#059669', textDecoration: 'underline', fontSize: '12px' }}
        >
            View Project on GitHub →
        </a>
    </div>
);


function DashboardPage({ onStartDesign }) {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrends = async () => {
            try {
                const data = await fetchMarketTrends();
                setTrends(data.trends || []);
            } catch (error) {
                setTrends(["Failed to load live trends."]);
            } finally {
                setLoading(false);
            }
        };
        loadTrends();
    }, []);

    return (
        <div className="card">
            <h2 className="card-title" style={{ textAlign: 'center' }}>
                Welcome to the Agentic Curriculum Designer
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                AI Agents are ready to develop your research-backed curriculum.
            </p>
            
            <button 
                onClick={onStartDesign} 
                className="generate-btn" 
                style={{ marginBottom: '30px', width: '100%', backgroundColor: '#f97316' }}
            >
                Start Curriculum Design 🚀
            </button>

            {/* LIVE MARKET TRENDS SECTION */}
            <h3 className="card-title" style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                Live Market Trends 📈
            </h3>
            <div style={{ background: '#eef2ff', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                {loading ? (
                    <p style={{ fontSize: '14px', color: '#4f46e5' }}>Loading trends from Research Agent...</p>
                ) : (
                    <ul style={{ paddingLeft: '20px', listStyleType: 'disc', fontSize: '14px', color: '#374151' }}>
                        {trends.length > 0 ? (
                            trends.map((trend, index) => <li key={index} style={{ marginBottom: '5px' }}>**{trend}**</li>)
                        ) : (
                            <li>No specific trends available right now.</li>
                        )}
                    </ul>
                )}
            </div>
            

        </div>
    );
}

export default DashboardPage;