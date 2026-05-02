import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from './questions';
import { calculateResult } from './scoring';
import { saveResult, hasResult } from './storage';
import Question from './Question';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './Quiz.css';

const quizBannerImage = 'https://www.figma.com/api/mcp/asset/825fa458-8cd2-4d77-8a15-0aa4d5ab1944';

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
    <div className="quiz-page">
      <Header />

      <main className="quiz-main">
        <div className="quiz-shell">
          <img className="quiz-banner" src={quizBannerImage} alt="" aria-hidden="true" />

          <section className="quiz-intro" aria-labelledby="quiz-heading">
            <p className="quiz-kicker">What&rsquo;s your</p>
            <h1 className="quiz-heading" id="quiz-heading">
              Technology Type?
            </h1>

            <p className="quiz-intro-lead">
              This quiz is about your beliefs and feelings about social technology. Get a chance to look deeper past the typical ideas around social tech being bad for you or how you just need to stop using it, to find out what your relationship with technology really looks like.
            </p>

            <p className="quiz-intro-body">
              When considering the following statements, think about the way you currently use social tech: the platforms you&rsquo;re on (if any), what relationships you have with other people on them, and how you think about the way you shown up online. There are no right answers, and your instincts are just as valid, whether you&rsquo;re on social tech all day or barely using it at all.
            </p>

            <p className="quiz-intro-note">
              Social tech can be defined as your typical social media platforms (TikTok, Instagram), but also more broadly as any digital space you use to interact with others (Signal, WhatsApp, LinkedIn, Twitch, Lex, Grindr, Minecraft, VRChat, etc.)
            </p>
          </section>

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
            <p className="submit-progress">{answeredCount} of {shuffledQuestions.length} questions answered</p>
            <button className="submit-button" onClick={handleSubmit} disabled={!allAnswered}>
              Submit
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}