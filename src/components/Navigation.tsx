import { Link, useNavigate } from 'react-router-dom';
import { useDictationContext } from '../hooks/useDictationContext';

export const Navigation = () => {
  const { isDictationInProgress } = useDictationContext();
  const navigate = useNavigate();

  const handleHistoryClick = (e: React.MouseEvent) => {
    if (isDictationInProgress) {
      e.preventDefault();
      const confirmSwitch = window.confirm(
        'You have an active dictation in progress. Are you sure you want to switch to the history page? Your progress will be lost.'
      );
      if (confirmSwitch) {
        navigate('/history');
      }
    }
  };

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">Dictation</Link>
        </li>
        <li>
          <Link to="/history" onClick={handleHistoryClick}>
            History
          </Link>
        </li>
      </ul>
    </nav>
  );
};