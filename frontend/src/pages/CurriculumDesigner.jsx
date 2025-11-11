// frontend/src/pages/CurriculumDesigner.jsx
import { useState } from 'react';
import CurriculumForm from '../components/CurriculumForm';
import ReadyToDesign from '../components/ReadyToDesign';
import CurriculumResult from '../components/CurriculumResult';
import AssessmentPage from './AssessmentPage'; 
import DashboardPage from './DashboardPage'; 
import LessonEditorPage from './LessonEditorPage'; 

function CurriculumDesigner() {
    const [curriculumData, setCurriculumData] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('dashboard'); // Starts on Dashboard
    const [selectedModule, setSelectedModule] = useState(null); 

    const handleGenerate = (data) => {
        setCurriculumData(data); 
        setIsLoading(false);     
        setError(null);
        setView('result');
    };

    const handleLoading = (state) => {
        setIsLoading(state);
    }
    
    const handleError = (err) => {
        const userMessage = err.message || "An unknown error occurred during generation.";
        setError({ message: userMessage }); 
        setIsLoading(false);
    }

    const handleModuleSelect = (moduleData) => {
        setSelectedModule(moduleData);
        setView('editor');
    };
    
    const renderContent = () => {
        
        if (view === 'dashboard') {
            return (
                <DashboardPage onStartDesign={() => setView('design')} /> 
            );
        }

        if (view === 'assessment' && curriculumData) {
            return (
                <AssessmentPage 
                    assessmentData={curriculumData.assessment_questions}
                    subject={curriculumData.subject}
                    onBack={() => setView('result')}
                />
            );
        }

        if (view === 'editor' && selectedModule) {
            return (
                <LessonEditorPage 
                    module={selectedModule} 
                    onBack={() => setView('result')}
                />
            );
        }

        if (view === 'result' && curriculumData) {
            return (
                <CurriculumResult 
                    data={curriculumData} 
                    onTakeAssessment={() => setView('assessment')}
                    onModuleSelect={handleModuleSelect}
                />
            );
        }

        // 'design' view
        return ( 
            <>
                <CurriculumForm 
                    onGenerate={handleGenerate} 
                    onLoading={handleLoading}
                    onError={handleError}
                    isLoading={isLoading}
                />
                
                {isLoading && (
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h2>Generating Curriculum...</h2>
                        <p>The AI Agents are collaborating to create your plan. This may take a moment.</p>
                    </div>
                )}

                {error && (
                    <div className="card" style={{ backgroundColor: '#fef2f2', border: '1px solid #ef4444' }}>
                        <h2 style={{ color: '#ef4444' }}>Error</h2>
                        <p>{error.message}</p>
                    </div>
                )}
                
                {!isLoading && !error && <ReadyToDesign />}
            </>
        );
    }

    return (
        <>
            <div className="header">
                <div className="logo">📘</div>
                <div className="header-text">
                    <h1>Agentic Curriculum Designer</h1>
                    <p>AI Powered Curriculum Development with Multi-Agent Collaboration</p>
                </div>
            </div>
            
            {renderContent()}
        </>
    );
}

export default CurriculumDesigner;