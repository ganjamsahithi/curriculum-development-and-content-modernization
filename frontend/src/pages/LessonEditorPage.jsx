// frontend/src/pages/LessonEditorPage.jsx
import React from 'react';

function LessonEditorPage({ module, onBack }) {
    if (!module) {
        return <div className="card">Loading module data...</div>;
    }

    return (
        <div className="card">
            <div className="header" style={{ marginBottom: '15px' }}>
                <div className="logo">📋</div>
                <div className="header-text">
                    <h1>Module Detail: {module.module_title}</h1>
                    <p>{module.weeks} - Focusing on Core Topics</p>
                </div>
            </div>

            <div className="form-group" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                <label>Key Topics Covered</label>
                <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                    {module.topics.map((topic, index) => (
                        <li key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>{topic}</li>
                    ))}
                </ul>
            </div>

            <div className="form-group">
                <label>Module Assessment Plan</label>
                <p style={{ padding: '10px', background: '#eef2ff', borderRadius: '4px', fontSize: '14px' }}>
                    **Method:** {module.assessment}
                </p>
            </div>
            
            <h3 className="card-title" style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                Instructional Design Notes (Agent Simulation)
            </h3>
            <p style={{ fontSize: '14px', color: '#475569' }}>
                The **Instructional Designer Agent** provides the following recommendations for teaching this module:
                <ul style={{ paddingLeft: '20px', listStyleType: 'circle', marginTop: '10px' }}>
                    <li>Allocate 60% of time to **hands-on labs** for foundational topics.</li>
                    <li>Use **flipped classroom** style for theoretical concepts (Topic 1).</li>
                    <li>The final week should be dedicated to a **review and peer-assessment**.</li>
                </ul>
            </p>

            <button onClick={onBack} className="generate-btn" style={{ background: '#545b62', marginTop: '30px' }}>
                ← Back to Curriculum Results
            </button>
        </div>
    );
}

export default LessonEditorPage;