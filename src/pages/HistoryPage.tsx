import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/database';
import type { DictationRecord } from '../types';
import { DiffResultDialog } from '../components/DiffResultDialog';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<DictationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DictationRecord | null>(null);

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

  // Group records by kekenet ID and sort groups by the most recent record's creation date
  const groupRecordsByKekenetId = (records: DictationRecord[]): { kekenetId: string, group: DictationRecord[] }[] => {
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

    // Convert to array and sort groups by the most recent record's creation date
    const groupedArray = Object.entries(grouped).map(([kekenetId, group]) => ({
      kekenetId,
      group
    }));

    // Sort groups by the creation date of the most recent record in each group (newest first)
    groupedArray.sort((a, b) => {
      const aLatest = a.group[0].createdAt.getTime();
      const bLatest = b.group[0].createdAt.getTime();
      return bLatest - aLatest;
    });

    return groupedArray;
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
        description: record.description,
        kekenetId: record.kekenetId
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
          {groupedRecords.map(({ kekenetId, group }) => (
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
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="show-diff-button"
                      >
                        Show Diff
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedRecord && (
        <DiffResultDialog
          isOpen={!!selectedRecord}
          originalText={selectedRecord.originalText}
          userText={selectedRecord.userText}
          score={selectedRecord.score}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
};