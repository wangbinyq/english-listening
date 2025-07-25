import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/database';
import type { DictationRecord } from '../types';

export const HistoryPage = () => {
  const navigate = useNavigate();
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

  // Group records by kekenet ID (extracted from the record ID)
  const groupRecordsByKekenetId = (records: DictationRecord[]): Record<string, DictationRecord[]> => {
    const grouped: Record<string, DictationRecord[]> = {};

    records.forEach(record => {
      const kekenetId = record.kekenetId;

      if (!grouped[kekenetId]) {
        grouped[kekenetId] = [];
      }

      grouped[kekenetId].push(record);
    });

    // Sort each group by creation date (newest first)
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });

    return grouped;
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

  const handleRedo = (record: DictationRecord) => {
    // Navigate to the dictation page with the record data
    navigate('/', {
      state: {
        audioUrl: record.audioUrl,
        originalText: record.originalText,
        title: record.title,
        description: record.description
      }
    });
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

  const groupedRecords = groupRecordsByKekenetId(records);

  return (
    <div className="history-page">
      <h1>Dictation History</h1>

      {records.length === 0 ? (
        <p>No dictation records found.</p>
      ) : (
        <div className="records-list">
          {Object.entries(groupedRecords).map(([kekenetId, group]) => (
            <div key={kekenetId} className="record-group">
              <h2 className="record-group-title">
                {group[0]?.title || `Content ${kekenetId}`}
              </h2>
              {group[0]?.description && (
                <div className="record-group-description">
                  <p>{group[0].description}</p>
                </div>
              )}
              <div className="record-group-items">
                {group.map(record => (
                  <div key={record.id} className="record-item">
                    <div className="record-header">
                      <div className="record-score">
                        Score: <strong>{record.score.toFixed(2)}%</strong>
                      </div>
                      <div className="record-date">
                        {formatDate(record.createdAt)}
                      </div>
                    </div>
                    <div className="record-actions">
                      <button
                        onClick={() => handleRedo(record)}
                        className="redo-button"
                      >
                        Redo
                      </button>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};