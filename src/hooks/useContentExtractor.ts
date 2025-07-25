import { useState } from 'react';

interface ExtractedContent {
  audioUrl: string;
  originalText: string;
}

interface ServerResponse {
  audioUrl: string;
  originalText: string;
}

export const useContentExtractor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractContent = async (url: string): Promise<ExtractedContent | null> => {
    if (!url) {
      setError('Please enter a URL');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use our backend proxy to fetch the content
      const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const data: ServerResponse = await response.json();

      if (!data.audioUrl || !data.originalText) {
        throw new Error('Failed to extract audio URL or text from the provided URL');
      }

      return {
        audioUrl: data.audioUrl,
        originalText: data.originalText
      };
    } catch (err) {
      const errorMessage = 'Failed to extract content from the provided URL. ' + (err as Error).message;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    extractContent,
    isLoading,
    error,
    setError
  };
};