import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Quiz from './features/quiz/Quiz';
import Results from './features/quiz/Results';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to quiz for now — easy to change later */}
        <Route path="/" element={<Navigate to="/quiz" replace />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}