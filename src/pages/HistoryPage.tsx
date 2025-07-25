import { useState, useEffect } from 'react';
import { dbService } from '../services/database';
import type { DictationRecord } from '../types';

export const HistoryPage = () => {
  const [records, setRecords] = useState<DictationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const fetchedRecords = await dbService.getRecords();
      setRecords(fetchedRecords);
    } catch (err) {
      console.error('Error loading records:', err);
      setError('Failed to load dictation history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await dbService.deleteRecord(id);
        setRecords(records.filter(record => record.id !== id));
      } catch (err) {
        console.error('Error deleting record:', err);
        setError('Failed to delete record');
      }
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="history-page">
        <h1>Dictation History</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <h1>Dictation History</h1>
        <div className="error-message">
          <p>{error}</p>
        </div>
        <button onClick={loadRecords}>Retry</button>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h1>Dictation History</h1>

      {records.length === 0 ? (
        <p>No dictation records found.</p>
      ) : (
        <div className="records-list">
          {records.map(record => (
            <div key={record.id} className="record-item">
              <div className="record-header">
                <div className="record-score">
                  Score: <strong>{record.score.toFixed(2)}%</strong>
                </div>
                <div className="record-date">
                  {formatDate(record.createdAt)}
                </div>
              </div>

              <div className="record-content">
                <div className="record-text">
                  <h3>Original Text:</h3>
                  <p>{record.originalText}</p>
                </div>

                <div className="record-text">
                  <h3>Your Transcription:</h3>
                  <p>{record.userText}</p>
                </div>
              </div>

              <div className="record-actions">
                <button
                  onClick={() => handleDelete(record.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};