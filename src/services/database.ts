import { PGlite } from '@electric-sql/pglite';
import type { DictationRecord } from '../types';

interface DictationRecordRow {
  id: string;
  kekenet_id: string;
  audio_url: string;
  original_text: string;
  user_text: string;
  score: number;
  time_spent: number;
  created_at: string;
  title: string;
  description: string;
}

class DatabaseService {
  private db: PGlite | null = null;
  private initialized = false;
  private initializingPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    // If already initialized, return immediately
    if (this.initialized) {
      return;
    }

    // If initialization is in progress, wait for it to complete
    if (this.initializingPromise) {
      return this.initializingPromise;
    }

    // Start initialization and store the promise
    this.initializingPromise = this.performInitialization();
    return this.initializingPromise;
  }

  private async performInitialization(): Promise<void> {
    // Double-check if already initialized (in case of race conditions)
    if (this.initialized) {
      return;
    }

    try {
      // Initialize the database with IndexedDB persistence
      this.db = new PGlite('idb://my-pgdata');
      await this.db.waitReady;

      // Create the dictation_records table
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS dictation_records (
          id TEXT PRIMARY KEY,
          kekenet_id TEXT NOT NULL,
          audio_url TEXT NOT NULL,
          original_text TEXT NOT NULL,
          user_text TEXT NOT NULL,
          score REAL NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL,
          title TEXT NOT NULL DEFAULT '',
          description TEXT NOT NULL DEFAULT ''
        )
      `);

      // Add time_spent column if it doesn't exist
      try {
        await this.db.query(`
          ALTER TABLE dictation_records
          ADD COLUMN time_spent REAL NOT NULL DEFAULT 0
        `);
      } catch (error) {
        // Column might already exist, which is fine
        console.debug('time_spent column might already exist:', error);
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Reset initializing promise on error so it can be retried
      this.initializingPromise = null;
      throw error;
    }
  }

  async addRecord(record: Omit<DictationRecord, 'id'>): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    const recordId = this.generateId();
    const createdAt = new Date().toISOString();

    await this.db!.query(
      `INSERT INTO dictation_records (id, kekenet_id, audio_url, original_text, user_text, score, time_spent, created_at, title, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [recordId, record.kekenetId, record.audioUrl, record.originalText, record.userText, record.score, record.timeSpent || 0, createdAt, record.title, record.description]
    );

    return recordId;
  }

  async getRecords(): Promise<DictationRecord[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const result = await this.db!.query(
      'SELECT * FROM dictation_records ORDER BY created_at DESC'
    );

    return (result.rows as DictationRecordRow[]).map(row => ({
      id: row.id,
      kekenetId: row.kekenet_id,
      audioUrl: row.audio_url,
      originalText: row.original_text,
      userText: row.user_text,
      score: row.score,
      timeSpent: row.time_spent,
      createdAt: new Date(row.created_at),
      title: row.title,
      description: row.description
    }));
  }

  async getRecordById(id: string): Promise<DictationRecord | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    const result = await this.db!.query(
      'SELECT * FROM dictation_records WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as DictationRecordRow;
    return {
      id: row.id,
      kekenetId: row.kekenet_id,
      audioUrl: row.audio_url,
      originalText: row.original_text,
      userText: row.user_text,
      score: row.score,
      timeSpent: row.time_spent,
      createdAt: new Date(row.created_at),
      title: row.title,
      description: row.description
    };
  }

  async deleteRecord(id: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    await this.db!.query(
      'DELETE FROM dictation_records WHERE id = $1',
      [id]
    );
  }

  async deleteRecordsByKekenetId(kekenetId: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    await this.db!.query(
      'DELETE FROM dictation_records WHERE kekenet_id = $1',
      [kekenetId]
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export a singleton instance
export const dbService = new DatabaseService();