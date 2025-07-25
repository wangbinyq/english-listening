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

  // Calculate the edit distance (Levenshtein distance) between word arrays
  const distance = levenshteinDistance(originalWords, userWords);

  // Calculate similarity as a percentage
  const maxLength = Math.max(originalWords.length, userWords.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Math.max(0, Math.min(100, similarity)); // Ensure result is between 0 and 100
}

/**
 * Extract words from text (ignore case and punctuation)
 * @param text The text to extract words from
 * @returns Array of words in lowercase
 */
export function extractWords(text: string): string[] {
  // Convert to lowercase and extract words (sequences of letters)
  return text.toLowerCase().match(/[a-z]+/g) || [];
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
  const originalWords = extractWords(originalText);
  const userWords = extractWords(userText);

  // Create arrays to hold the diff results
  const originalDiff: string[] = [];
  const userDiff: string[] = [];

  // Add markup to original text
  let originalIndex = 0;
  let userIndex = 0;

  // Simple diff algorithm - this is a basic implementation
  // For a more sophisticated diff, we could use a library like diff-match-patch
  while (originalIndex < originalWords.length || userIndex < userWords.length) {
    if (originalIndex >= originalWords.length) {
      // Extra words in user text
      userDiff.push(`<span class="diff-insert">${userWords[userIndex]}</span>`);
      userIndex++;
    } else if (userIndex >= userWords.length) {
      // Missing words in user text
      originalDiff.push(`<span class="diff-delete">${originalWords[originalIndex]}</span>`);
      originalIndex++;
    } else if (originalWords[originalIndex] === userWords[userIndex]) {
      // Words match
      originalDiff.push(originalWords[originalIndex]);
      userDiff.push(userWords[userIndex]);
      originalIndex++;
      userIndex++;
    } else {
      // Words don't match - check if it's a substitution or insertion/deletion
      // For simplicity, we'll mark both as changed
      originalDiff.push(`<span class="diff-delete">${originalWords[originalIndex]}</span>`);
      userDiff.push(`<span class="diff-insert">${userWords[userIndex]}</span>`);
      originalIndex++;
      userIndex++;
    }
  }

  // Join the words with spaces
  return {
    originalDiff: originalDiff.join(' '),
    userDiff: userDiff.join(' ')
  };
}

/**
 * Calculate the Levenshtein distance between two arrays
 * @param arr1 First array
 * @param arr2 Second array
 * @returns The edit distance
 */
function levenshteinDistance(arr1: string[], arr2: string[]): number {
  const matrix: number[][] = [];

  // Initialize the matrix
  for (let i = 0; i <= arr2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= arr1.length; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= arr2.length; i++) {
    for (let j = 1; j <= arr1.length; j++) {
      if (arr2[i - 1] === arr1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[arr2.length][arr1.length];
}