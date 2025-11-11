// frontend/src/pages/AssessmentPage.jsx
import { useState } from 'react';

// Utility function to extract the option key (e.g., 'C' from 'C) Option Text')
const extractOptionKey = (optionText) => {
    if (typeof optionText === 'string' && optionText.length > 0) {
        // Assumes option key is the first character followed by ')'
        return optionText.charAt(0);
    }
    return '';
};

// Utility function to map the correct answer key ('C') to the full text ('C) Option Text')
const getOptionText = (question, optionKey) => {
    // Find the full option text that starts with the correct answer key followed by ')'
    const foundOption = question.options.find(option => option.startsWith(optionKey + ')'));
    // If found, return the full text; otherwise, return the key as a fallback
    return foundOption || optionKey; 
};


function AssessmentPage({ assessmentData, subject, onBack }) {
    // State to hold user answers (index -> selected_option_text)
    const [answers, setAnswers] = useState({});
    // State to hold the final score (null if not submitted)
    const [score, setScore] = useState(null);
    // State to toggle between showing the result summary and the detailed question review
    const [showReview, setShowReview] = useState(false);

    if (!assessmentData || assessmentData.length === 0) {
        return (
            <div className="card">
                <h2>No Assessment Available</h2>
                <p>The curriculum did not generate assessment questions for {subject}.</p>
                <button onClick={onBack} className="generate-btn" style={{ background: '#545b62', marginTop: '20px' }}>
                    ← Back to Curriculum
                </button>
            </div>
        );
    }

    const handleChange = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let currentScore = 0;
        
        assessmentData.forEach((q, index) => {
            // FIX: Compare the extracted key (e.g., 'C') with the stored correct_answer (e.g., 'C')
            const submittedKey = extractOptionKey(answers[index]);
            
            if (submittedKey === q.correct_answer) { 
                currentScore += 1;
            }
        });
        
        setScore(currentScore);
        // Automatically show the result summary, but hide the detailed questions initially
        setShowReview(false); 
    };

    const handleReviewToggle = () => {
        // When clicking 'Review Questions', switch to the detailed view
        setShowReview(true); 
    }
    
    const handleBackToCurriculum = () => {
        // Reset assessment state when going back
        setAnswers({});
        setScore(null);
        setShowReview(false);
        onBack();
    }

    const totalQuestions = assessmentData.length;
    const percentage = score !== null ? ((score / totalQuestions) * 100).toFixed(0) : 0;
    const isPassed = percentage >= 70;

    // --- RENDER LOGIC ---

    // 1. RENDER RESULT VIEW (score is not null)
    if (score !== null) {
        return (
            <div className="card">
                <div className="header" style={{ marginBottom: '15px' }}>
                    <div className="logo">🎓</div>
                    <div className="header-text">
                        <h1>Assessment for {subject}</h1>
                        <p>Total Questions: {totalQuestions}</p>
                    </div>
                </div>

                {/* Result Summary Card */}
                <div className="card ready-card" style={{ padding: '20px', marginBottom: '30px' }}>
                    <div className="ready-icon" style={{ background: isPassed ? '#d1fae5' : '#fef2f2', color: isPassed ? '#059669' : '#ef4444' }}>
                        {percentage}%
                    </div>
                    <h2>Assessment Result: {isPassed ? 'Passed' : 'Needs Review'}</h2>
                    <p>You scored {score} out of {totalQuestions}.</p>
                    
                    {/* The button to switch to the detailed question review mode */}
                    <button onClick={handleReviewToggle} className="generate-btn" style={{ background: '#6366f1' }}>
                        Review Questions
                    </button>
                </div>
                
                {/* Detailed Question Review (Only visible when showReview is true) */}
                {showReview && (
                    <div className="review-mode">
                        {assessmentData.map((q, qIndex) => {
                            const submittedOption = answers[qIndex];
                            const submittedKey = extractOptionKey(submittedOption);
                            const isCorrect = submittedKey === q.correct_answer;
                            const correctOptionText = getOptionText(q, q.correct_answer);
                            
                            return (
                                <div key={qIndex} className="form-group" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                                    <label style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                                        {qIndex + 1}. {q.question}
                                        
                                        {/* Display the result and the full correct answer text */}
                                        <span style={{ float: 'right', color: isCorrect ? '#059669' : '#ef4444' }}>
                                            {isCorrect ? 'Correct' : `Wrong (Correct: ${correctOptionText})`}
                                        </span>
                                    </label>
                                    
                                    {q.options.map((option, oIndex) => {
                                        const isSelected = submittedOption === option;
                                        const isTheCorrectAnswer = option === correctOptionText;
                                        
                                        return (
                                            <div 
                                                key={oIndex} 
                                                style={{ 
                                                    margin: '5px 0',
                                                    color: isTheCorrectAnswer ? '#059669' : 'inherit', 
                                                    fontWeight: isTheCorrectAnswer ? 'bold' : 'normal'
                                                }}
                                            >
                                                <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', fontSize: '14px' }}>
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIndex}`}
                                                        value={option}
                                                        checked={isSelected} 
                                                        disabled={true} 
                                                        style={{ width: 'auto', marginRight: '10px', height: '16px' }}
                                                    />
                                                    {option}
                                                    {/* Indicate the user's selected wrong answer */}
                                                    {isSelected && !isCorrect && (
                                                        <span style={{ color: '#ef4444', marginLeft: '10px' }}> (Your Answer)</span>
                                                    )}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                        
                        <button onClick={handleBackToCurriculum} className="generate-btn" style={{ background: '#545b62', marginTop: '20px' }}>
                            ← Back to Curriculum
                        </button>
                    </div>
                )}
                
                {/* If the score is shown but review is NOT active (i.e., immediately after submission), show the back button */}
                {!showReview && (
                     <button onClick={handleBackToCurriculum} className="generate-btn" style={{ background: '#545b62', marginTop: '20px' }}>
                        ← Back to Curriculum
                    </button>
                )}
            </div>
        );
    }

    // 2. RENDER ASSESSMENT FORM VIEW (score is null)
    return (
        <div className="card">
            <div className="header" style={{ marginBottom: '15px' }}>
                <div className="logo">🎓</div>
                <div className="header-text">
                    <h1>Assessment for {subject}</h1>
                    <p>Total Questions: {totalQuestions}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {assessmentData.map((q, qIndex) => (
                    <div key={qIndex} className="form-group" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                        <label style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                            {qIndex + 1}. {q.question}
                        </label>
                        {q.options.map((option, oIndex) => (
                            <div key={oIndex} style={{ margin: '5px 0' }}>
                                <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal', fontSize: '14px' }}>
                                    <input
                                        type="radio"
                                        name={`question-${qIndex}`}
                                        value={option}
                                        checked={answers[qIndex] === option}
                                        onChange={() => handleChange(qIndex, option)}
                                        disabled={score !== null}
                                        style={{ width: 'auto', marginRight: '10px', height: '16px' }}
                                    />
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                ))}

                <button type="submit" className="generate-btn" disabled={score !== null} style={{ marginTop: '20px' }}>
                    Submit Assessment
                </button>
            </form>
            
            <button onClick={onBack} className="generate-btn" style={{ background: '#545b62', marginTop: '20px' }}>
                ← Back to Curriculum
            </button>
        </div>
    );
}

export default AssessmentPage;