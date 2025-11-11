// frontend/src/components/CurriculumForm.jsx
import { useState } from 'react';
import { generateCurriculum } from '../services/geminiApi'; 

// --- Helper Components (MUST be defined first) ---
const FormGroup = ({ label, children, required = false }) => (
    <div className="form-group">
        <label>
            {label} {required && <span className="required">*</span>}
        </label>
        {children}
    </div>
);

const AgentItem = ({ icon, label, iconClass }) => (
    <div className="agent-item">
        <div className={`agent-icon ${iconClass}`}>
            {icon}
        </div>
        <span>{label}</span>
    </div>
);

// --- Main Component ---
function CurriculumForm({ onGenerate, onLoading, onError, isLoading }) {
    const [formData, setFormData] = useState({
        subject: '',
        level: 'Select level...',
        duration: '1 semester',
        focusAreas: '',
        learningOutcomes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.subject || formData.level === 'Select level...') {
            onError(new Error("Subject and Level are required fields."));
            return;
        }

        onLoading(true);
        try {
            const result = await generateCurriculum(formData);
            onGenerate(result); 
        } catch (err) {
            onError(err);
        }
    };
    
    return (
        <div className="card">
            <h2 className="card-title">
                <span className="sparkle">✨</span>
                Design Your Curriculum
            </h2>
            <form onSubmit={handleSubmit}>
                <FormGroup label="Subject" required><input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g., Python Programming" /></FormGroup>
                <FormGroup label="Level" required>
                    <select name="level" value={formData.level} onChange={handleChange}>
                        <option value="Select level...">Select level...</option>
                        <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
                    </select>
                </FormGroup>
                <FormGroup label="Duration">
                    <select name="duration" value={formData.duration} onChange={handleChange}>
                        <option>1 semester</option><option>2 semesters</option><option>3 semesters</option><option>1 year</option>
                    </select>
                </FormGroup>
                <FormGroup label="Focus Areas"><input type="text" name="focusAreas" value={formData.focusAreas} onChange={handleChange} placeholder="e.g., AI, Deep Learning" /></FormGroup>
                <FormGroup label="Learning Outcomes"><textarea name="learningOutcomes" value={formData.learningOutcomes} onChange={handleChange} placeholder="Describe desired outcomes..."></textarea></FormGroup>
                <button type="submit" className="generate-btn" disabled={isLoading}><span>⚡</span>{isLoading ? 'Generating...' : 'Generate Curriculum'}</button>
                <div className="agents-list">
                    <div className="agents-title">🤖 AI Agents Working For You</div>
                    <AgentItem icon="ℹ️" label="Research Specialist" iconClass="icon-info" />
                    <AgentItem icon="📋" label="Instructional Designer" iconClass="icon-instructional" />
                    <AgentItem icon="📄" label="Content Expert" iconClass="icon-content" />
                    <AgentItem icon="📊" label="Assessment Designer" iconClass="icon-assessment" />
                </div>
            </form>
        </div>
    );
}

export default CurriculumForm;