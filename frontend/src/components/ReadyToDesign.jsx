// frontend/src/components/ReadyToDesign.jsx

const FeatureBox = ({ title, subtitle, colorClass }) => (
    <div className={`feature-box ${colorClass}`}> 
        <div className="feature-title">{title}</div>
        <div className="feature-subtitle">{subtitle}</div>
    </div>
);

function ReadyToDesign() {
    return (
        <div className="card ready-card">
            <div className="ready-icon">
                📘
            </div>
            
            <h2>Ready to Design?</h2>
            <p>Fill out the form to generate a comprehensive AI-powered curriculum.</p>

            <div className="features-grid">
                <FeatureBox 
                    title="Research-Based" 
                    subtitle="Latest trends" 
                    colorClass="blue"
                />
                <FeatureBox 
                    title="Pedagogical" 
                    subtitle="Sound design" 
                    colorClass="purple"
                />
                <FeatureBox 
                    title="Complete" 
                    subtitle="Full framework" 
                    colorClass="green"
                />
                <FeatureBox 
                    title="Export" 
                    subtitle="PDF ready" 
                    colorClass="red"
                />
            </div>
        </div>
    );
}

export default ReadyToDesign;