import './Quiz.css';
import '../../App.css'; 

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export default function Question({ question, index, total, value, onChange }) {
  const questionId = `question-label-${question.id}`;

  return (
    <div className="question">
      <p id={questionId} className="question-text">
        {/* <span className="question-number">{index} / {total}</span> */}
        {question.text}
      </p>

      <div className="likert-wrapper">

        {/* Visible endpoint label — hidden from screen readers since
            the first radio button's sr-only label already says this */}
        <span className="likert-endpoint" aria-hidden="true">
            Disagree
        </span>

        <div
          className="likert-scale"
          role="radiogroup"
          aria-labelledby={questionId}
        >
          {LIKERT_OPTIONS.map(option => (
            <label
                key={option.value}
                className={`likert-option ${value === option.value ? 'selected' : ''}`}
            >
                <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                />
                {/* Custom visual — hidden from screen readers since the sr-only span covers it */}
                <span className="likert-visual" aria-hidden="true" />
                {/* Read by screen readers, invisible on screen */}
                <span className="sr-only">{option.label}</span>
            </label>
            ))}
        </div>

        <span className="likert-endpoint" aria-hidden="true">
            Agree
        </span>

      </div>
    </div>
  );
}