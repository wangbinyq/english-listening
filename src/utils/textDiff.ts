import { diffWords } from 'diff';

/**
 * Calculate the similarity score between two texts using a word-based algorithm
 * Ignores case and punctuation, only comparing words
 * @param originalText The original text
 * @param userText The text entered by the user
 * @returns A score between 0 and 100 representing the similarity
 */
export function calculateTextSimilarity(originalText: string, userText: string): number {
  // Extract words from both texts (ignore case and punctuation)
  const originalWords = extractWords(originalText);
  const userWords = extractWords(userText);

  // If both texts are empty, return 100
  if (originalWords.length === 0 && userWords.length === 0) {
    return 100;
  }

  // If one text is empty and the other is not, return 0
  if (originalWords.length === 0 || userWords.length === 0) {
    return 0;
  }

  // Use the diff library to calculate differences
  const diffResult = diffWords(originalWords.join(' '), userWords.join(' '));

  // Count the number of unchanged words
  let unchangedWords = 0;
  diffResult.forEach(part => {
    if (!part.added && !part.removed) {
      const words = part.value.trim().split(/\s+/).filter(word => word.length > 0);
      unchangedWords += words.length;
    }
  });

  // Calculate similarity as a percentage
  const maxLength = Math.max(originalWords.length, userWords.length);
  const similarity = (unchangedWords / maxLength) * 100;

  return Math.max(0, Math.min(100, similarity)); // Ensure result is between 0 and 100
}

/**
 * Extract words from text (ignore case and punctuation)
 * @param text The text to extract words from
 * @returns Array of words in lowercase
 */
export function extractWords(text: string): string[] {
  // Convert to lowercase and extract words (sequences of letters)
  return text.toLowerCase().match(/[0-9a-z]+/g) || [];
}

/**
 * Generate a diff view showing differences between original and submitted text
 * @param originalText The original text
 * @param userText The text entered by the user
 * @returns An object containing the original and user text with diff markup
 */
export function generateDiffView(originalText: string, userText: string): {
  originalDiff: string,
  userDiff: string
} {
  // Extract words from both texts
  const originalWords = extractWords(originalText).join(' ');
  const userWords = extractWords(userText).join(' ');

  // Use the diff library to calculate differences
  const diffResult = diffWords(originalWords, userWords);

  // Create arrays to hold the diff results
  const originalDiff: string[] = [];
  const userDiff: string[] = [];

  // Process the diff result
  diffResult.forEach(part => {
    if (part.added) {
      // Words added in user text
      userDiff.push(`<span class="diff-insert">${part.value}</span>`);
    } else if (part.removed) {
      // Words removed from original text
      originalDiff.push(`<span class="diff-delete">${part.value}</span>`);
    } else {
      // Unchanged words
      originalDiff.push(part.value);
      userDiff.push(part.value);
    }
  });

  // Join the words with spaces
  return {
    originalDiff: originalDiff.join(' '),
    userDiff: userDiff.join(' ')
  };
}