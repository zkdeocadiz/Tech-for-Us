import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from './questions';
import { calculateResult } from './scoring';
import { saveResult, hasResult } from './storage';
import Question from './Question';
import './Quiz.css';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Quiz() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [ready, setReady] = useState(false);

  // Shuffle once on mount
  const shuffledQuestions = useMemo(() => shuffleArray(questions), []);

  useEffect(() => {
    if (hasResult()) {
      navigate('/quiz/results');
    } else {
      setReady(true);
    }
  }, [navigate]);

  const handleResponse = (id, value) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const answeredCount = Object.keys(responses).length;
  const allAnswered = answeredCount === shuffledQuestions.length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    const result = calculateResult(responses);
    saveResult(result);
    navigate('/quiz/results');
  };

  if (!ready) return null;

  return (
    <div className="quiz">
      <h1>Find your Social Technology Personality</h1>
      <p className="quiz-intro">
        This quiz is about your beliefs and feelings about social technology — not how much you use it.
        There are no right answers, and your instincts are just as valid whether you're online all day or barely at all.
      </p>

      <div className="questions-list">
        {shuffledQuestions.map((question, index) => (
          <Question
            key={question.id}
            question={question}
            index={index + 1}
            total={shuffledQuestions.length}
            value={responses[question.id]}
            onChange={(value) => handleResponse(question.id, value)}
          />
        ))}
      </div>

      <div className="submit-area">
        <p>{answeredCount} of {shuffledQuestions.length} questions answered</p>
        <button onClick={handleSubmit} disabled={!allAnswered}>
          See My Results
        </button>
      </div>
    </div>
  );
}