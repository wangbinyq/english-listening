/**
 * Calculate the similarity score between two texts using a simple algorithm
 * @param originalText The original text
 * @param userText The text entered by the user
 * @returns A score between 0 and 100 representing the similarity
 */
export function calculateTextSimilarity(originalText: string, userText: string): number {
  // Convert both texts to lowercase and remove extra whitespace for comparison
  const cleanOriginal = originalText.toLowerCase().replace(/\s+/g, ' ').trim();
  const cleanUser = userText.toLowerCase().replace(/\s+/g, ' ').trim();

  // If both texts are empty, return 100
  if (cleanOriginal.length === 0 && cleanUser.length === 0) {
    return 100;
  }

  // If one text is empty and the other is not, return 0
  if (cleanOriginal.length === 0 || cleanUser.length === 0) {
    return 0;
  }

  // Calculate the edit distance (Levenshtein distance)
  const distance = levenshteinDistance(cleanOriginal, cleanUser);

  // Calculate similarity as a percentage
  const maxLength = Math.max(cleanOriginal.length, cleanUser.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Math.max(0, Math.min(100, similarity)); // Ensure result is between 0 and 100
}

/**
 * Calculate the Levenshtein distance between two strings
 * @param str1 First string
 * @param str2 Second string
 * @returns The edit distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  // Initialize the matrix
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
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

  return matrix[str2.length][str1.length];
}