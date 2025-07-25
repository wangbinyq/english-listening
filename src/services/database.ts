import { PGlite } from '@electric-sql/pglite';
import type { DictationRecord } from '../types';

interface DictationRecordRow {
  id: string;
  audio_url: string;
  original_text: string;
  user_text: string;
  score: number;
  created_at: string;
}

class DatabaseService {
  private db: PGlite | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize the database
      this.db = new PGlite();
      await this.db.waitReady;

      // Create the dictation_records table
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS dictation_records (
          id TEXT PRIMARY KEY,
          audio_url TEXT NOT NULL,
          original_text TEXT NOT NULL,
          user_text TEXT NOT NULL,
          score REAL NOT NULL,
          created_at TIMESTAMP NOT NULL
        )
      `);

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async addRecord(record: Omit<DictationRecord, 'id'>): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    const id = this.generateId();
    const createdAt = new Date().toISOString();

    await this.db!.query(
      `INSERT INTO dictation_records (id, audio_url, original_text, user_text, score, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, record.audioUrl, record.originalText, record.userText, record.score, createdAt]
    );

    return id;
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
      audioUrl: row.audio_url,
      originalText: row.original_text,
      userText: row.user_text,
      score: row.score,
      createdAt: new Date(row.created_at)
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
      audioUrl: row.audio_url,
      originalText: row.original_text,
      userText: row.user_text,
      score: row.score,
      createdAt: new Date(row.created_at)
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

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export a singleton instance
export const dbService = new DatabaseService();