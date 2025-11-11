// frontend/src/components/CurriculumResult.jsx
import jsPDF from 'jspdf'; 
import React from 'react';

// --- HELPER 1: ProjectItem Component (MOVED TO TOP-LEVEL) ---
// This definition MUST be outside of the main CurriculumResult function.
const ProjectItem = ({ project }) => (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '15px', background: '#f8f9fa' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>{project.title}</h4>
        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#475569' }}>{project.description}</p>
        <p style={{ fontSize: '12px', fontWeight: '500', color: '#6366f1' }}>Level: {project.level}</p>
        <a 
            href={project.github_link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
                color: '#059669', 
                textDecoration: 'underline', 
                fontSize: '12px',
            }}
        >
            View Project on GitHub →
        </a>
    </div>
);

// --- HELPER 2: PDF DOWNLOAD FUNCTION ---
const downloadPDF = (data) => {
    const doc = new jsPDF();
    let y = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxWidth = pageWidth - (2 * margin);
    
    const checkPageBreak = (height) => {
        if (y + height > 285) { doc.addPage(); y = 15; }
    };

    const writeSection = (title, contentArray, listType = 'text', indent = 0) => {
        checkPageBreak(20);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        const contentMargin = margin + indent;
        const contentMaxWidth = maxWidth - indent;

        contentArray.forEach((item) => {
            const prefix = listType === 'list' ? '• ' : '';
            const textLines = doc.splitTextToSize(prefix + item, contentMaxWidth);
            textLines.forEach(line => {
                checkPageBreak(5);
                doc.text(line, contentMargin, y);
                y += 5;
            });
        });
        y += 5; // Extra space after section
    };

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`Agentic Curriculum: ${data.subject}`, margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Level: ${data.target_audience} | Duration: ${data.duration}`, margin, y);
    y += 10;
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // 1. Vision
    writeSection("1. Vision of the Subject", [data.vision], 'text');

    // 2. Objectives
    writeSection("2. Key Learning Objectives", data.learning_objectives, 'list');

    // 3. Content Planning (Modules)
    writeSection("3. Content Planning (Modules)", [`Plan Title: ${data.content_plan.title}`], 'text');
    const moduleSummaries = data.content_plan.modules.map(m => 
        `${m.module_title} (${m.weeks}). Assessment: ${m.assessment}. Topics: ${m.topics.join(', ')}`
    );
    writeSection("Modules:", moduleSummaries, 'list', 5); // Indent modules
    
    // 4. Resources
    const toolsAndTips = [
        `Tips for Success: ${data.content_plan.level_tips}`,
        `Essential Tools: ${data.content_plan.tools}`
    ];
    writeSection("4. Resources & Guidance", toolsAndTips, 'text');
    
    // 5. Industry Projects
    const projectSummaries = data.projects_by_industry.map(p => 
        `Project: ${p.title} (${p.level}). Description: ${p.description}. GitHub: ${p.github_link}`
    );
    writeSection("5. Industry Projects", projectSummaries, 'list');

    // 6. References
    const refSummaries = data.references.map(r => 
        `${r.name} - Link: ${r.link}`
    );
    writeSection("6. Recommended References", refSummaries, 'list');

    doc.save(`${data.subject}_Curriculum.pdf`);
};

// --- MAIN COMPONENT ---
function CurriculumResult({ data, onTakeAssessment, onModuleSelect }) {
    if (!data || !data.content_plan || !data.projects_by_industry) {
        return <div className="card">Error rendering curriculum data.</div>;
    }
    
    return (
        <div className="card">
            <div className="header" style={{ marginBottom: '15px' }}>
                <div className="logo">✅</div>
                <div className="header-text">
                    <h1>Generated Curriculum</h1>
                    <p>Vision of the Subject</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={() => downloadPDF(data)} 
                    className="generate-btn" 
                    style={{ background: '#10b981' }}
                >
                    Download Curriculum (PDF) 📄
                </button>
                <button 
                    onClick={onTakeAssessment} 
                    className="generate-btn" 
                    style={{ background: '#f97316' }}
                >
                    Take Assessment 🎓
                </button>
            </div>
            
            {/* Vision and Objectives */}
            <h3 className="card-title">Vision of the Subject</h3>
            <p style={{ background: '#eef2ff', padding: '15px', borderRadius: '4px', fontStyle: 'italic', fontSize: '14px' }}>
                {data.vision}
            </p>

            <h3 className="card-title" style={{ marginTop: '20px' }}>Key Objectives</h3>
            <ul style={{ paddingLeft: '20px', listStyleType: 'disc', fontSize: '14px' }}>
                {data.learning_objectives.map((obj, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{obj}</li>
                ))}
            </ul>

            <h3 className="card-title" style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                Resources & Guidance
            </h3>
            
            {/* Tips and Tools */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <h4 style={{ color: '#4f46e5', marginBottom: '5px' }}>Tips for Success</h4>
                    <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{data.content_plan.level_tips}</p>
                </div>
                <div>
                    <h4 style={{ color: '#059669', marginBottom: '5px' }}>Essential Tools</h4>
                    <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{data.content_plan.tools}</p>
                </div>
            </div>
            
            {/* Modular Content Planning */}
            <h3 className="card-title" style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                Content Planning
            </h3>
            
            {data.content_plan.modules.map((module, index) => (
                <div 
                    key={index}
                    className="module-item" 
                    onClick={() => onModuleSelect(module)}
                    style={{ 
                        border: '1px solid #6366f1', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        marginBottom: '15px', 
                        cursor: 'pointer',
                        backgroundColor: '#f5f3ff'
                    }}
                >
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#4f46e5' }}>
                        {module.module_title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6366f1', marginTop: '5px' }}>
                        {module.weeks} | Assessment: {module.assessment}
                    </p>
                    <p style={{ fontSize: '12px', marginTop: '10px', color: '#475569' }}>
                        Key Topics: {module.topics.join(', ')}
                    </p>
                    <span style={{ float: 'right', fontSize: '12px', color: '#4f46e5' }}>View Details →</span>
                </div>
            ))}

            {/* Industry Projects */}
            <h3 className="card-title" style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                Industry Projects
            </h3>
            {data.projects_by_industry.map((project, index) => (
                <ProjectItem key={index} project={project} />
            ))}

            {/* References */}
            <h3 className="card-title" style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                Reference Links
            </h3>
            <ul style={{ paddingLeft: '20px', listStyleType: 'decimal', fontSize: '14px', color: '#475569' }}>
                {data.references.map((ref, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                        <a href={ref.link} target="_blank" rel="noopener noreferrer">{ref.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CurriculumResult;