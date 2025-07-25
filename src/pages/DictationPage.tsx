import { useState, useRef } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useContentExtractor } from '../hooks/useContentExtractor';
import { calculateTextSimilarity } from '../utils/textDiff';
import { dbService } from '../services/database';
import type { DictationRecord } from '../types';

export const DictationPage = () => {
  const [url, setUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userText, setUserText] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const {
    isPlaying,
    currentTime,
    duration,
    isRepeat,
    repeatTime,
    loadAudio,
    play,
    pause,
    stop,
    seek,
    toggleRepeat,
    setRepeatTime
  } = useAudioPlayer();

  const { extractContent, isLoading, error, setError } = useContentExtractor();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLoadContent = async () => {
    const extracted = await extractContent(url);
    if (extracted) {
      setAudioUrl(extracted.audioUrl);
      setOriginalText(extracted.originalText);
      setTitle(extracted.title);
      setDescription(extracted.description);
      loadAudio(extracted.audioUrl);
      setShowOriginal(false); // Hide original text when loading new content
      setScore(null); // Reset score when loading new content
      setUserText(''); // Clear user text when loading new content
    }
  };

  const handleSubmit = async () => {
    if (!originalText.trim() || !userText.trim()) {
      setError('Please enter both original text and your transcription');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate score
      const calculatedScore = calculateTextSimilarity(originalText, userText);
      setScore(calculatedScore);

      // Save to database
      const record: Omit<DictationRecord, 'id'> = {
        audioUrl,
        originalText,
        userText,
        score: calculatedScore,
        createdAt: new Date(),
        title,
        description
      };

      await dbService.addRecord(record);

      // Show success message
      alert(`Your score: ${calculatedScore.toFixed(2)}%`);
    } catch (err) {
      console.error('Error submitting dictation:', err);
      setError('Failed to submit dictation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="dictation-page">
      <h1>English Dictation</h1>

      <div className="url-section">
        <div className="input-group url-input-group">
          <label htmlFor="url">Page URL:</label>
          <div className="url-input-row">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter page URL"
            />
            <button onClick={handleLoadContent} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load Content'}
            </button>
          </div>
        </div>
      </div>

      {title && (
        <div className="title-section">
          <h2>{title}</h2>
        </div>
      )}

      {description && (
        <div className="description-section">
          <p>{description}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {audioUrl && (
        <div className="audio-section">
          <div className="audio-controls">
            <button onClick={isPlaying ? pause : play}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={stop}>Stop</button>
            <button
              onClick={toggleRepeat}
              className={isRepeat ? 'repeat-active' : 'repeat-inactive'}
            >
              {isRepeat ? 'Repeat On' : 'Repeat Off'}
            </button>
            <div className="repeat-time-control">
              <label htmlFor="repeatTime">Repeat Time (s):</label>
              <input
                type="number"
                id="repeatTime"
                min="1"
                max="30"
                value={repeatTime}
                onChange={(e) => setRepeatTime(Number(e.target.value))}
              />
            </div>
            <button onClick={() => setShowHelp(true)}>Help</button>

            <div className="seek-container">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="seek-bar"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-section">
        {originalText && showOriginal && (
          <div className="input-group">
            <label htmlFor="originalText">Original Text:</label>
            <textarea
              id="originalText"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Original text will be extracted from the URL"
              rows={5}
              readOnly
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="userText">Your Transcription:</label>
          <textarea
            ref={textareaRef}
            id="userText"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Type what you hear here"
            rows={5}
          />
        </div>
      </div>

      {score !== null && (
        <div className="score-display">
          <h2>Score: {score.toFixed(2)}%</h2>
        </div>
      )}

      <div className="submit-section">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !audioUrl}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Dictation'}
        </button>

        {score !== null && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="show-original-button"
          >
            {showOriginal ? 'Hide Original' : 'Show Original'}
          </button>
        )}
      </div>

      {showHelp && (
        <div className="help-dialog">
          <div className="help-content">
            <h2>Keyboard Shortcuts</h2>
            <ul>
              <li><strong>Alt + J</strong>: Skip backward 3 seconds</li>
              <li><strong>Alt + K</strong>: Skip forward 3 seconds</li>
              <li><strong>Alt + H</strong>: Skip backward 5 seconds</li>
              <li><strong>Alt + L</strong>: Skip forward 5 seconds</li>
              <li><strong>Alt + N</strong>: Toggle repeat mode</li>
              <li><strong>Alt + P</strong>: Pause/Play</li>
            </ul>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};